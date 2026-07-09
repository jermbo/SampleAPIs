import React, { useEffect, useRef, useState } from "react";
import { EditorView, basicSetup } from "codemirror";
import { EditorState } from "@codemirror/state";
import { javascript } from "@codemirror/lang-javascript";
import { oneDark } from "@codemirror/theme-one-dark";
import "./Playground.css";

interface Props {
  /** Endpoint URL the starter snippet fetches from. In dev this is the LOCAL server. */
  url: string;
}

interface LogLine {
  level: string;
  text: string;
}

const RUN_TIMEOUT_MS = 5000;

/**
 * POC playground: CodeMirror 6 editor + a null-origin sandboxed <iframe> runner.
 *
 * Security model: the iframe uses sandbox="allow-scripts" WITHOUT allow-same-origin,
 * so user code runs in an opaque origin. It cannot read our cookies, localStorage,
 * DOM, or make same-origin authenticated requests. We talk to it only via postMessage,
 * gated by a per-run random token. A timeout tears the iframe down to kill infinite loops.
 *
 * Bonus: because the iframe is hosted by THIS page (loopback in dev), its fetch to
 * localhost is local->local and is NOT blocked by Private Network Access — unlike the
 * Sandpack example, which runs on codesandbox.io (a public origin).
 */
const Playground: React.FC<Props> = ({ url }) => {
  const editorHost = useRef<HTMLDivElement>(null);
  const viewRef = useRef<EditorView | null>(null);
  const iframeRef = useRef<HTMLIFrameElement | null>(null);
  const timeoutRef = useRef<number | null>(null);
  const msgHandlerRef = useRef<((e: MessageEvent) => void) | null>(null);

  const [logs, setLogs] = useState<LogLine[]>([]);
  const [running, setRunning] = useState(false);

  const starter = (endpoint: string) => `// Edit me, then hit Run. Top-level await works.
const resp = await fetch("${endpoint}");
const data = await resp.json();

console.log(Array.isArray(data) ? \`Got \${data.length} items\` : "Got response");
console.log(data);`;

  // Create the editor once.
  useEffect(() => {
    if (!editorHost.current) return;
    const view = new EditorView({
      state: EditorState.create({
        doc: starter(url),
        extensions: [basicSetup, javascript(), oneDark],
      }),
      parent: editorHost.current,
    });
    viewRef.current = view;
    return () => view.destroy();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // When a different endpoint is selected, reset the starter snippet.
  useEffect(() => {
    const view = viewRef.current;
    if (!view) return;
    view.dispatch({
      changes: { from: 0, to: view.state.doc.length, insert: starter(url) },
    });
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

  // Clean up any live sandbox on unmount.
  useEffect(() => teardown, []);

  const run = () => {
    const code = viewRef.current?.state.doc.toString() ?? "";
    teardown();
    setLogs([]);
    setRunning(true);

    const token = Math.random().toString(36).slice(2);

    // Bootstrap runs INSIDE the sandboxed iframe: capture console + errors, wait for code.
    const bootstrap = `
      <script>
        const TOKEN = ${JSON.stringify(token)};
        const send = (level, parts) => parent.postMessage({ token: TOKEN, level, parts }, "*");
        const fmt = (v) => {
          if (typeof v === "string") return v;
          try { return JSON.stringify(v, null, 2); } catch (e) { return String(v); }
        };
        ["log", "info", "warn", "error", "debug"].forEach((k) => {
          console[k] = (...a) => send(k, a.map(fmt));
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
      <\/script>
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
        teardown();
        return;
      }
      setLogs((prev) => [...prev, { level: d.level, text: (d.parts || []).join(" ") }]);
    };
    msgHandlerRef.current = onMessage;
    window.addEventListener("message", onMessage);

    timeoutRef.current = window.setTimeout(() => {
      setLogs((prev) => [
        ...prev,
        {
          level: "error",
          text: `Execution timed out after ${RUN_TIMEOUT_MS / 1000}s (possible infinite loop). Sandbox terminated.`,
        },
      ]);
      teardown();
    }, RUN_TIMEOUT_MS);

    document.body.appendChild(iframe);
  };

  return (
    <div className="playground">
      <div className="playground__toolbar">
        <span className="playground__badge">CodeMirror + sandboxed iframe</span>
        <button className="playground__run" onClick={run} disabled={running}>
          {running ? "Running…" : "▶ Run"}
        </button>
      </div>
      <div className="playground__editor" ref={editorHost} />
      <div className="playground__output">
        <div className="playground__output-header">Output</div>
        {logs.length === 0 ? (
          <div className="playground__empty">Run the code to see output here.</div>
        ) : (
          logs.map((line, i) => (
            <pre key={i} className={`playground__line -${line.level}`}>
              {line.text}
            </pre>
          ))
        )}
      </div>
    </div>
  );
};

export default Playground;
