import React, { useEffect, useRef, useState } from "react";
import { EditorView, basicSetup } from "codemirror";
import { EditorState, Prec } from "@codemirror/state";
import { keymap } from "@codemirror/view";
import { javascript } from "@codemirror/lang-javascript";
import { oneDark } from "@codemirror/theme-one-dark";
import { linter, lintGutter, Diagnostic } from "@codemirror/lint";
import { syntaxTree } from "@codemirror/language";
import JsonTree from "./JsonTree";
import { SNIPPETS, DEFAULT_SNIPPET } from "./snippets";
import "./Playground.css";

interface Props {
  /** Endpoint URL the starter snippets fetch from. In dev this is the LOCAL server. */
  url: string;
}

interface OutputEntry {
  level: string;
  values: unknown[];
}

const RUN_TIMEOUT_MS = 5000;
const storageKey = (url: string) => `sampleapis:playground:${url}`;

/**
 * Playground: CodeMirror 6 editor + a null-origin sandboxed <iframe> runner.
 *
 * Security model: the iframe uses sandbox="allow-scripts" WITHOUT allow-same-origin,
 * so user code runs in an opaque origin — it cannot read our cookies, storage, DOM, or
 * make same-origin authenticated requests. We talk to it only via postMessage, gated by
 * a per-run random token, and a timeout tears it down to kill infinite loops.
 *
 * Because the iframe is hosted by THIS page (loopback in dev), its fetch to localhost is
 * local->local and is not blocked by Private Network Access.
 */
const Playground: React.FC<Props> = ({ url }) => {
  const editorHost = useRef<HTMLDivElement>(null);
  const viewRef = useRef<EditorView | null>(null);
  const iframeRef = useRef<HTMLIFrameElement | null>(null);
  const timeoutRef = useRef<number | null>(null);
  const msgHandlerRef = useRef<((e: MessageEvent) => void) | null>(null);

  // Refs so the editor's static keymap / change listener always see the latest values.
  const urlRef = useRef(url);
  const prevUrlRef = useRef(url);
  const runRef = useRef<() => void>(() => {});
  urlRef.current = url;

  const [output, setOutput] = useState<OutputEntry[]>([]);
  const [running, setRunning] = useState(false);
  const [activeSnippet, setActiveSnippet] = useState(DEFAULT_SNIPPET.id);

  // Layout: orientation, console collapse, and the editor's share of the split.
  const panesRef = useRef<HTMLDivElement>(null);
  const [orientation, setOrientation] = useState<"horizontal" | "vertical">("horizontal");
  const [collapsed, setCollapsed] = useState(false);
  const [splitPct, setSplitPct] = useState(50);

  const startDrag = (e: React.PointerEvent) => {
    e.preventDefault();
    const move = (ev: PointerEvent) => {
      const rect = panesRef.current?.getBoundingClientRect();
      if (!rect) return;
      const pct =
        orientation === "horizontal"
          ? ((ev.clientX - rect.left) / rect.width) * 100
          : ((ev.clientY - rect.top) / rect.height) * 100;
      setSplitPct(Math.min(85, Math.max(15, pct)));
    };
    const up = () => {
      window.removeEventListener("pointermove", move);
      window.removeEventListener("pointerup", up);
    };
    window.addEventListener("pointermove", move);
    window.addEventListener("pointerup", up);
  };

  const loadCode = (u: string) =>
    localStorage.getItem(storageKey(u)) ?? DEFAULT_SNIPPET.build(u);

  // Flags syntax errors inline using the Lezer parse tree — no heavy ESLint dependency.
  const jsLinter = linter((view) => {
    const diagnostics: Diagnostic[] = [];
    const len = view.state.doc.length;
    syntaxTree(view.state)
      .cursor()
      .iterate((node) => {
        if (!node.type.isError) return;
        const from = node.from;
        const to = node.to > from ? node.to : Math.min(from + 1, len);
        if (to <= from) return;
        diagnostics.push({ from, to, severity: "error", message: "Syntax error" });
      });
    return diagnostics;
  });

  // Create the editor once.
  useEffect(() => {
    if (!editorHost.current) return;
    const view = new EditorView({
      state: EditorState.create({
        doc: loadCode(urlRef.current),
        extensions: [
          basicSetup, // includes line numbers, autocomplete, bracket matching
          javascript(),
          oneDark,
          jsLinter,
          lintGutter(),
          // Prec.highest so this wins over basicSetup's default Mod-Enter binding.
          Prec.highest(
            keymap.of([{ key: "Mod-Enter", run: () => (runRef.current(), true) }])
          ),
          EditorView.updateListener.of((u) => {
            if (u.docChanged) {
              localStorage.setItem(storageKey(urlRef.current), u.state.doc.toString());
            }
          }),
        ],
      }),
      parent: editorHost.current,
    });
    viewRef.current = view;
    return () => view.destroy();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // When a different endpoint is selected, persist the current buffer and load that
  // endpoint's saved code (or its starter). Never clobbers unsaved edits.
  useEffect(() => {
    const view = viewRef.current;
    if (!view) return;
    const prev = prevUrlRef.current;
    if (prev === url) return;
    if (prev) localStorage.setItem(storageKey(prev), view.state.doc.toString());
    view.dispatch({ changes: { from: 0, to: view.state.doc.length, insert: loadCode(url) } });
    prevUrlRef.current = url;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [url]);

  const teardown = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
    if (msgHandlerRef.current) {
      window.removeEventListener("message", msgHandlerRef.current);
      msgHandlerRef.current = null;
    }
    if (iframeRef.current) {
      iframeRef.current.remove();
      iframeRef.current = null;
    }
    setRunning(false);
  };

  useEffect(() => teardown, []);

  const loadSnippet = (id: string) => {
    const snippet = SNIPPETS.find((s) => s.id === id) ?? DEFAULT_SNIPPET;
    const view = viewRef.current;
    if (!view) return;
    setActiveSnippet(id);
    view.dispatch({
      changes: { from: 0, to: view.state.doc.length, insert: snippet.build(urlRef.current) },
    });
    view.focus();
  };

  const run = () => {
    const code = viewRef.current?.state.doc.toString() ?? "";
    teardown();
    setOutput([]);
    setRunning(true);

    const token = Math.random().toString(36).slice(2);
    // The top-level code returning ("__done") doesn't mean async work (e.g. an
    // un-awaited .then chain) has settled. Keep the sandbox alive until the timeout
    // so late output still streams in; only flag a timeout if code never signalled done.
    let signalledDone = false;

    // Runs INSIDE the sandboxed iframe: sanitize console args to a JSON-safe shape
    // (postMessage can't clone functions/circular refs) and stream them back.
    const bootstrap = `
      <script>
        const TOKEN = ${JSON.stringify(token)};
        const send = (level, values) => parent.postMessage({ token: TOKEN, level, values }, "*");
        const sanitize = (v, seen) => {
          if (v === undefined) return "undefined";
          if (v === null) return null;
          const t = typeof v;
          if (t === "function") return "\\u0192 " + (v.name || "anonymous") + "()";
          if (t === "bigint") return v.toString() + "n";
          if (t === "symbol") return v.toString();
          if (t !== "object") return v;
          if (v instanceof Error) return v.name + ": " + v.message;
          if (seen.has(v)) return "[Circular]";
          seen.add(v);
          if (Array.isArray(v)) return v.map((x) => sanitize(x, seen));
          const out = {};
          for (const k in v) {
            try { out[k] = sanitize(v[k], seen); } catch (e) { out[k] = "[unreadable]"; }
          }
          return out;
        };
        ["log", "info", "warn", "error", "debug"].forEach((k) => {
          console[k] = (...a) => send(k, a.map((x) => sanitize(x, new WeakSet())));
        });
        window.onerror = (m) => { send("error", [String(m)]); return true; };
        window.addEventListener("unhandledrejection", (e) => {
          const r = e.reason;
          send("error", [r && r.message ? r.message : String(r)]);
        });
        window.addEventListener("message", async (e) => {
          if (!e.data || e.data.token !== TOKEN || e.data.type !== "run") return;
          try {
            const AsyncFunction = Object.getPrototypeOf(async function () {}).constructor;
            await new AsyncFunction(e.data.code)();
          } catch (err) {
            send("error", [err && err.message ? err.message : String(err)]);
          }
          send("__done", []);
        });
        send("__ready", []);
      </script>
    `;

    const iframe = document.createElement("iframe");
    // The whole security story: allow-scripts, but NOT allow-same-origin.
    iframe.setAttribute("sandbox", "allow-scripts");
    iframe.style.display = "none";
    iframe.srcdoc = bootstrap;
    iframeRef.current = iframe;

    const onMessage = (e: MessageEvent) => {
      const d = e.data;
      if (!d || d.token !== token) return;
      if (d.level === "__ready") {
        iframe.contentWindow?.postMessage({ token, type: "run", code }, "*");
        return;
      }
      if (d.level === "__done") {
        // Top-level code returned. Stop the spinner but keep the sandbox alive so
        // any still-pending async output (un-awaited promises) can arrive.
        signalledDone = true;
        setRunning(false);
        return;
      }
      setOutput((prev) => [...prev, { level: d.level, values: d.values || [] }]);
    };
    msgHandlerRef.current = onMessage;
    window.addEventListener("message", onMessage);

    timeoutRef.current = window.setTimeout(() => {
      // Only a genuine hang (code never returned) is a timeout worth reporting.
      if (!signalledDone) {
        setOutput((prev) => [
          ...prev,
          {
            level: "error",
            values: [
              `Execution timed out after ${RUN_TIMEOUT_MS / 1000}s (possible infinite loop). Sandbox terminated.`,
            ],
          },
        ]);
      }
      teardown();
    }, RUN_TIMEOUT_MS);

    document.body.appendChild(iframe);
  };
  runRef.current = run;

  const isPrimitive = (v: unknown) => v === null || typeof v !== "object";

  const editorPaneStyle: React.CSSProperties = collapsed
    ? { flex: "1 1 auto" }
    : { flex: `0 0 ${splitPct}%` };
  const outputPaneStyle: React.CSSProperties = collapsed
    ? { flex: "0 0 auto" }
    : { flex: "1 1 0" };

  return (
    <div className="playground">
      <div className="playground__toolbar">
        <div className="playground__tabs">
          {SNIPPETS.map((s) => (
            <button
              key={s.id}
              className={`playground__tab ${activeSnippet === s.id ? "-active" : ""}`}
              onClick={() => loadSnippet(s.id)}
            >
              {s.label}
            </button>
          ))}
        </div>
        <div className="playground__actions">
          <button
            className="playground__icon-btn"
            onClick={() =>
              setOrientation((o) => (o === "horizontal" ? "vertical" : "horizontal"))
            }
            title="Toggle split direction"
          >
            {orientation === "horizontal" ? "⬍ Stack" : "⬌ Side by side"}
          </button>
          <button className="playground__run" onClick={run} disabled={running}>
            {running ? "Running…" : "▶ Run  (⌘/Ctrl+↵)"}
          </button>
        </div>
      </div>

      <div
        className={`playground__panes -${orientation} ${collapsed ? "-collapsed" : ""}`}
        ref={panesRef}
      >
        <div className="playground__editor" ref={editorHost} style={editorPaneStyle} />

        {!collapsed && (
          <div
            className={`playground__divider -${orientation}`}
            onPointerDown={startDrag}
            title="Drag to resize"
          />
        )}

        <div className="playground__output" style={outputPaneStyle}>
          <button
            className="playground__output-header"
            onClick={() => setCollapsed((c) => !c)}
            title={collapsed ? "Expand console" : "Collapse console"}
          >
            <span className="playground__caret">{collapsed ? "▸" : "▾"}</span>
            Output
          </button>
          {!collapsed && (
            <div className="playground__output-body">
              {output.length === 0 ? (
                <div className="playground__empty">Run the code to see output here.</div>
              ) : (
                output.map((entry, i) => (
                  <div key={i} className={`playground__line -${entry.level}`}>
                    {entry.values.map((v, j) =>
                      isPrimitive(v) ? (
                        <span key={j} className="playground__text">
                          {String(v)}
                        </span>
                      ) : (
                        <JsonTree key={j} value={v} />
                      )
                    )}
                  </div>
                ))
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Playground;
