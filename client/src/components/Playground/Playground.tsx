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

/** One network event posted by the sandbox's fetch wrapper. A request emits a
 *  `request` phase immediately, then either a `response` or an `error` phase. */
export interface NetEvent {
  id: number;
  phase: "request" | "response" | "error";
  method: string;
  url: string;
  status?: number;
  statusText?: string;
  ms?: number;
  size?: number | null;
  headers?: Record<string, string>;
  message?: string;
}

/** Run lifecycle stream for hosts that need to observe a run (challenge checks). */
export type PlaygroundRunEvent =
  | { type: "start" }
  | { type: "console"; level: string; values: unknown[] }
  | { type: "net"; event: NetEvent }
  | { type: "uncaught" }
  | { type: "done" }
  | { type: "end" };

interface Props {
  /** Endpoint URL the starter snippets fetch from. In dev this is the LOCAL server. */
  url: string;
  /** Starter code used when nothing is saved under the storage key yet. */
  defaultCode?: string;
  /** Persist the buffer under this key instead of the per-URL default. */
  storageKey?: string;
  /** Hide the generic snippet tabs (challenge mode brings its own starter). */
  hideSnippets?: boolean;
  /** Observe the run: console lines, network events, done/end signals. */
  onRunEvent?: (ev: PlaygroundRunEvent) => void;
}

interface OutputEntry {
  level: string;
  values: unknown[];
}

/** A network panel row: the `request` event creates it, `response`/`error` fill it in. */
interface NetRow {
  id: number;
  method: string;
  url: string;
  pending: boolean;
  failed: boolean;
  status?: number;
  statusText?: string;
  ms?: number;
  size?: number | null;
  headers?: Record<string, string>;
  message?: string;
}

const RUN_TIMEOUT_MS = 5000;
const defaultStorageKey = (url: string) => `sampleapis:playground:${url}`;

/** Headers worth surfacing first — mirrors the server's CORS exposedHeaders list. */
const CURATED_HEADERS = [
  "content-type",
  "x-total-count",
  "link",
  "location",
  "ratelimit-limit",
  "ratelimit-remaining",
  "ratelimit-reset",
  "retry-after",
];

/** Plain-language explainer for the failure cases beginners actually hit. */
const explainFailure = (row: NetRow): string | null => {
  if (row.failed)
    return "The request never got an HTTP response. This usually means the host doesn't exist, the server is unreachable, or the browser blocked the request (CORS). Check the URL first.";
  if (row.status === 404)
    return "Not found — the API answered, but nothing lives at this path or id. Check the endpoint spelling and the id.";
  if (row.status === 429)
    return "Too many requests — you hit the rate limit. Wait for it to reset (see the RateLimit-* headers below) and try again.";
  if (row.status !== undefined && row.status >= 500)
    return "Server error — the problem is on the API's side, not in your code. Try again in a moment.";
  return null;
};

const formatSize = (size: number | null | undefined): string => {
  if (size === null || size === undefined) return "—";
  if (size < 1024) return `${size} B`;
  return `${(size / 1024).toFixed(1)} KB`;
};

const statusClass = (row: NetRow): string => {
  if (row.failed) return "-err";
  if (row.pending || row.status === undefined) return "-pending";
  return `-s${Math.floor(row.status / 100)}xx`;
};

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
const Playground: React.FC<Props> = ({
  url,
  defaultCode,
  storageKey,
  hideSnippets,
  onRunEvent,
}) => {
  const editorHost = useRef<HTMLDivElement>(null);
  const viewRef = useRef<EditorView | null>(null);
  const iframeRef = useRef<HTMLIFrameElement | null>(null);
  const timeoutRef = useRef<number | null>(null);
  const msgHandlerRef = useRef<((e: MessageEvent) => void) | null>(null);

  // Refs so the editor's static keymap / change listener always see the latest values.
  const urlRef = useRef(url);
  const storageKeyRef = useRef(storageKey);
  const defaultCodeRef = useRef(defaultCode);
  const onRunEventRef = useRef(onRunEvent);
  const runRef = useRef<() => void>(() => {});
  urlRef.current = url;
  storageKeyRef.current = storageKey;
  defaultCodeRef.current = defaultCode;
  onRunEventRef.current = onRunEvent;

  const effectiveKey = () => storageKeyRef.current ?? defaultStorageKey(urlRef.current);
  const prevKeyRef = useRef(storageKey ?? defaultStorageKey(url));
  const runActiveRef = useRef(false);

  const [output, setOutput] = useState<OutputEntry[]>([]);
  const [netRows, setNetRows] = useState<NetRow[]>([]);
  const [expandedNet, setExpandedNet] = useState<Set<number>>(new Set());
  const [showAllHeaders, setShowAllHeaders] = useState<Set<number>>(new Set());
  const [running, setRunning] = useState(false);
  const [activeSnippet, setActiveSnippet] = useState(DEFAULT_SNIPPET.id);

  // Which pane of the output area is showing, plus an unread badge for the hidden one.
  const [activeTab, setActiveTab] = useState<"output" | "network">("output");
  const [unseenNet, setUnseenNet] = useState(0);
  const activeTabRef = useRef(activeTab);
  activeTabRef.current = activeTab;

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
    localStorage.getItem(storageKeyRef.current ?? defaultStorageKey(u)) ??
    defaultCodeRef.current ??
    DEFAULT_SNIPPET.build(u);

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
              localStorage.setItem(effectiveKey(), u.state.doc.toString());
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

  // When a different endpoint (or challenge) is selected, persist the current buffer
  // under the OLD key and load the new key's saved code (or its starter). Never
  // clobbers unsaved edits.
  useEffect(() => {
    const view = viewRef.current;
    if (!view) return;
    const key = storageKey ?? defaultStorageKey(url);
    const prev = prevKeyRef.current;
    if (prev === key) return;
    if (prev) localStorage.setItem(prev, view.state.doc.toString());
    view.dispatch({ changes: { from: 0, to: view.state.doc.length, insert: loadCode(url) } });
    prevKeyRef.current = key;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [url, storageKey]);

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
    if (runActiveRef.current) {
      runActiveRef.current = false;
      onRunEventRef.current?.({ type: "end" });
    }
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

  const applyNetEvent = (rows: NetRow[], ev: NetEvent): NetRow[] => {
    if (ev.phase === "request") {
      return [
        ...rows,
        { id: ev.id, method: ev.method, url: ev.url, pending: true, failed: false },
      ];
    }
    return rows.map((r) =>
      r.id !== ev.id
        ? r
        : ev.phase === "response"
          ? {
              ...r,
              pending: false,
              url: ev.url || r.url,
              status: ev.status,
              statusText: ev.statusText,
              ms: ev.ms,
              size: ev.size,
              headers: ev.headers,
            }
          : { ...r, pending: false, failed: true, ms: ev.ms, message: ev.message }
    );
  };

  const run = () => {
    const code = viewRef.current?.state.doc.toString() ?? "";
    teardown();
    setOutput([]);
    setNetRows([]);
    setExpandedNet(new Set());
    setShowAllHeaders(new Set());
    setUnseenNet(0);
    setRunning(true);
    runActiveRef.current = true;
    onRunEventRef.current?.({ type: "start" });

    const token = Math.random().toString(36).slice(2);
    // The top-level code returning ("__done") doesn't mean async work (e.g. an
    // un-awaited .then chain) has settled. Keep the sandbox alive until the timeout
    // so late output still streams in; only flag a timeout if code never signalled done.
    let signalledDone = false;

    // Runs INSIDE the sandboxed iframe: sanitize console args to a JSON-safe shape
    // (postMessage can't clone functions/circular refs) and stream them back. fetch is
    // wrapped so every request/response/error is reported as a "__net" event; the
    // Response object user code receives is untouched (size reads a clone).
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
        const NATIVE_FETCH = window.fetch.bind(window);
        let NET_ID = 0;
        window.fetch = function (input, init) {
          const id = ++NET_ID;
          let method = "GET";
          let url = "";
          try {
            if (input && typeof input === "object" && "url" in input) {
              url = input.url;
              if (input.method) method = input.method;
            } else {
              url = String(input);
            }
            if (init && init.method) method = init.method;
            method = String(method).toUpperCase();
          } catch (e) {}
          const start = performance.now();
          send("__net", [{ id, phase: "request", method, url }]);
          return NATIVE_FETCH(input, init).then(
            (resp) => {
              const ms = Math.round(performance.now() - start);
              const headers = {};
              try { resp.headers.forEach((v, k) => { headers[k] = v; }); } catch (e) {}
              const finish = (size) =>
                send("__net", [{
                  id, phase: "response", method,
                  url: resp.url || url,
                  status: resp.status, statusText: resp.statusText,
                  ms, size, headers,
                }]);
              const len = resp.headers.get("content-length");
              if (len !== null) {
                finish(Number(len));
              } else {
                try {
                  resp.clone().arrayBuffer().then((b) => finish(b.byteLength), () => finish(null));
                } catch (e) { finish(null); }
              }
              return resp;
            },
            (err) => {
              const ms = Math.round(performance.now() - start);
              send("__net", [{
                id, phase: "error", method, url, ms,
                message: err && err.message ? err.message : String(err),
              }]);
              throw err;
            }
          );
        };
        window.onerror = (m) => { send("error", [String(m)]); send("__uncaught", []); return true; };
        window.addEventListener("unhandledrejection", (e) => {
          const r = e.reason;
          send("error", [r && r.message ? r.message : String(r)]);
          send("__uncaught", []);
        });
        window.addEventListener("message", async (e) => {
          if (!e.data || e.data.token !== TOKEN || e.data.type !== "run") return;
          try {
            const AsyncFunction = Object.getPrototypeOf(async function () {}).constructor;
            await new AsyncFunction(e.data.code)();
          } catch (err) {
            send("error", [err && err.message ? err.message : String(err)]);
            send("__uncaught", []);
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
        onRunEventRef.current?.({ type: "done" });
        return;
      }
      if (d.level === "__net") {
        const ev = d.values?.[0] as NetEvent | undefined;
        if (!ev) return;
        setNetRows((prev) => applyNetEvent(prev, ev));
        if (activeTabRef.current !== "network" && ev.phase === "request") {
          setUnseenNet((n) => n + 1);
        }
        onRunEventRef.current?.({ type: "net", event: ev });
        return;
      }
      if (d.level === "__uncaught") {
        onRunEventRef.current?.({ type: "uncaught" });
        return;
      }
      setOutput((prev) => [...prev, { level: d.level, values: d.values || [] }]);
      onRunEventRef.current?.({ type: "console", level: d.level, values: d.values || [] });
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

  // Elide the origin on rows that hit the active endpoint's host — the path is the
  // interesting part. Foreign origins stay fully visible.
  const displayUrl = (rowUrl: string): string => {
    try {
      const u = new URL(rowUrl);
      if (u.origin === new URL(urlRef.current).origin) return u.pathname + u.search;
    } catch {
      /* relative or malformed — show as-is */
    }
    return rowUrl;
  };

  const toggleInSet = (set: Set<number>, id: number): Set<number> => {
    const next = new Set(set);
    if (next.has(id)) next.delete(id);
    else next.add(id);
    return next;
  };

  const selectTab = (tab: "output" | "network") => {
    setActiveTab(tab);
    setCollapsed(false);
    if (tab === "network") setUnseenNet(0);
  };

  const editorPaneStyle: React.CSSProperties = collapsed
    ? { flex: "1 1 auto" }
    : { flex: `0 0 ${splitPct}%` };
  const outputPaneStyle: React.CSSProperties = collapsed
    ? { flex: "0 0 auto" }
    : { flex: "1 1 0" };

  const renderHeaders = (row: NetRow) => {
    const headers = row.headers ?? {};
    const keys = Object.keys(headers);
    if (keys.length === 0) return null;
    const curated = keys.filter((k) => CURATED_HEADERS.includes(k.toLowerCase()));
    const showAll = showAllHeaders.has(row.id);
    const shown = showAll || curated.length === 0 ? keys : curated;
    return (
      <table className="playground__net-headers">
        <tbody>
          {shown.map((k) => (
            <tr key={k}>
              <td className="playground__net-header-key">{k}</td>
              <td>{headers[k]}</td>
            </tr>
          ))}
          {!showAll && curated.length > 0 && keys.length > curated.length && (
            <tr>
              <td colSpan={2}>
                <button
                  className="playground__net-more"
                  onClick={() => setShowAllHeaders((s) => toggleInSet(s, row.id))}
                >
                  Show all {keys.length} headers
                </button>
              </td>
            </tr>
          )}
        </tbody>
      </table>
    );
  };

  return (
    <div className="playground">
      <div className="playground__toolbar">
        <div className="playground__tabs">
          {!hideSnippets &&
            SNIPPETS.map((s) => (
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
          <div className="playground__output-header">
            <button
              className="playground__collapse"
              onClick={() => setCollapsed((c) => !c)}
              title={collapsed ? "Expand console" : "Collapse console"}
            >
              <span className="playground__caret">{collapsed ? "▸" : "▾"}</span>
            </button>
            <button
              className={`playground__pane-tab ${activeTab === "output" ? "-active" : ""}`}
              onClick={() => selectTab("output")}
            >
              Output
            </button>
            <button
              className={`playground__pane-tab ${activeTab === "network" ? "-active" : ""}`}
              onClick={() => selectTab("network")}
            >
              Network
              {unseenNet > 0 && <span className="playground__badge">{unseenNet}</span>}
            </button>
          </div>

          {!collapsed && activeTab === "output" && (
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

          {!collapsed && activeTab === "network" && (
            <div className="playground__output-body">
              {netRows.length === 0 ? (
                <div className="playground__empty">
                  Requests your code makes with fetch() show up here.
                </div>
              ) : (
                netRows.map((row) => {
                  const expanded = expandedNet.has(row.id);
                  const explainer = explainFailure(row);
                  return (
                    <div key={row.id} className="playground__net-row-wrap">
                      <button
                        className="playground__net-row"
                        onClick={() => setExpandedNet((s) => toggleInSet(s, row.id))}
                      >
                        <span className="playground__net-method">{row.method}</span>
                        <span className="playground__net-url">{displayUrl(row.url)}</span>
                        <span className={`playground__net-status ${statusClass(row)}`}>
                          {row.failed ? "failed" : row.pending ? "…" : row.status}
                        </span>
                        <span className="playground__net-meta">
                          {row.ms !== undefined ? `${row.ms} ms` : ""}
                        </span>
                        <span className="playground__net-meta">{formatSize(row.size)}</span>
                      </button>
                      {expanded && (
                        <div className="playground__net-detail">
                          <div className="playground__net-full-url">{row.url}</div>
                          {row.message && (
                            <div className="playground__net-error">{row.message}</div>
                          )}
                          {explainer && (
                            <div className="playground__net-explainer">{explainer}</div>
                          )}
                          {renderHeaders(row)}
                        </div>
                      )}
                    </div>
                  );
                })
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Playground;
