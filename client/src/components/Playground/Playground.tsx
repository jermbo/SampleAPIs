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
import PlaygroundNetworkRow from "./PlaygroundNetworkRow";
import {
  applyNetEvent,
  toggleInSet,
  type NetRow,
} from "./netUtils";
import {
  collapseCaret,
  collapseTitle,
  orientationLabel,
  paneTabClassName,
  runButtonLabel,
  snippetTabClassName,
} from "./labels";
import { buildSandboxBootstrap, RUN_TIMEOUT_MS } from "./sandboxBootstrap";
import type { InjectedCode, NetEvent, OutputEntry, PlaygroundRunEvent } from "./types";
import "./Playground.css";

export type { NetEvent, PlaygroundRunEvent };

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
  /** Replace the editor buffer whenever the nonce changes (Explore's "Send to Playground"). */
  injectedCode?: InjectedCode | null;
}

const defaultStorageKey = (url: string) => `sampleapis:playground:${url}`;

/**
 * Playground: CodeMirror 6 editor + a null-origin sandboxed <iframe> runner.
 *
 * Security model: the iframe uses sandbox="allow-scripts" WITHOUT allow-same-origin,
 * so user code runs in an opaque origin — it cannot read our cookies, storage, DOM, or
 * make same-origin authenticated requests. We talk to it only via postMessage, gated by
 * a per-run random token, and a timeout tears it down to kill infinite loops.
 */
const Playground: React.FC<Props> = ({
  url,
  defaultCode,
  storageKey,
  hideSnippets,
  onRunEvent,
  injectedCode,
}) => {
  const editorHost = useRef<HTMLDivElement>(null);
  const viewRef = useRef<EditorView | null>(null);
  const iframeRef = useRef<HTMLIFrameElement | null>(null);
  const timeoutRef = useRef<number | null>(null);
  const msgHandlerRef = useRef<((e: MessageEvent) => void) | null>(null);

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
  const [activeTab, setActiveTab] = useState<"output" | "network">("output");
  const [unseenNet, setUnseenNet] = useState(0);
  const activeTabRef = useRef(activeTab);
  activeTabRef.current = activeTab;

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

  useEffect(() => {
    if (!editorHost.current) return;
    const view = new EditorView({
      state: EditorState.create({
        doc: loadCode(urlRef.current),
        extensions: [
          basicSetup,
          javascript(),
          oneDark,
          jsLinter,
          lintGutter(),
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

  // Host-injected code replaces the buffer like loadSnippet does; the editor's
  // update listener persists it under the current storage key as usual.
  useEffect(() => {
    const view = viewRef.current;
    if (!view || !injectedCode) return;
    view.dispatch({
      changes: { from: 0, to: view.state.doc.length, insert: injectedCode.code },
    });
    view.focus();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [injectedCode?.nonce]);

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
    let signalledDone = false;

    const iframe = document.createElement("iframe");
    iframe.setAttribute("sandbox", "allow-scripts");
    iframe.style.display = "none";
    iframe.srcdoc = buildSandboxBootstrap(token);
    iframeRef.current = iframe;

    const onMessage = (e: MessageEvent) => {
      const d = e.data;
      if (!d || d.token !== token) return;
      if (d.level === "__ready") {
        iframe.contentWindow?.postMessage({ token, type: "run", code }, "*");
        return;
      }
      if (d.level === "__done") {
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

  const selectTab = (tab: "output" | "network") => {
    setActiveTab(tab);
    setCollapsed(false);
    if (tab === "network") setUnseenNet(0);
  };

  const toggleOrientation = () => {
    setOrientation((o) => (o === "horizontal" ? "vertical" : "horizontal"));
  };

  const editorPaneStyle: React.CSSProperties = collapsed
    ? { flex: "1 1 auto" }
    : { flex: `0 0 ${splitPct}%` };
  const outputPaneStyle: React.CSSProperties = collapsed
    ? { flex: "0 0 auto" }
    : { flex: "1 1 0" };

  const panesClassName = [
    "playground__panes",
    `-${orientation}`,
    collapsed ? "-collapsed" : "",
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <div className="playground">
      <div className="playground__toolbar">
        <div className="playground__tabs">
          {!hideSnippets &&
            SNIPPETS.map((s) => (
              <button
                key={s.id}
                className={snippetTabClassName(activeSnippet === s.id)}
                onClick={() => loadSnippet(s.id)}
              >
                {s.label}
              </button>
            ))}
        </div>
        <div className="playground__actions">
          <button
            className="playground__icon-btn"
            onClick={toggleOrientation}
            title="Toggle split direction"
          >
            {orientationLabel(orientation)}
          </button>
          <button className="playground__run" onClick={run} disabled={running}>
            {runButtonLabel(running)}
          </button>
        </div>
      </div>

      <div className={panesClassName} ref={panesRef}>
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
              title={collapseTitle(collapsed)}
            >
              <span className="playground__caret">{collapseCaret(collapsed)}</span>
            </button>
            <button
              className={paneTabClassName(activeTab === "output")}
              onClick={() => selectTab("output")}
            >
              Output
            </button>
            <button
              className={paneTabClassName(activeTab === "network")}
              onClick={() => selectTab("network")}
            >
              Network
              {unseenNet > 0 && <span className="playground__badge">{unseenNet}</span>}
            </button>
          </div>

          {!collapsed && activeTab === "output" && (
            <div className="playground__output-body">
              {output.length === 0 && (
                <div className="playground__empty">Run the code to see output here.</div>
              )}
              {output.length > 0 &&
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
                ))}
            </div>
          )}

          {!collapsed && activeTab === "network" && (
            <div className="playground__output-body">
              {netRows.length === 0 && (
                <div className="playground__empty">
                  Requests your code makes with fetch() show up here.
                </div>
              )}
              {netRows.map((row) => (
                <PlaygroundNetworkRow
                  key={row.id}
                  row={row}
                  activeUrl={urlRef.current}
                  expanded={expandedNet.has(row.id)}
                  showAllHeaders={showAllHeaders.has(row.id)}
                  onToggleExpanded={() => setExpandedNet((s) => toggleInSet(s, row.id))}
                  onToggleShowAllHeaders={() =>
                    setShowAllHeaders((s) => toggleInSet(s, row.id))
                  }
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Playground;
