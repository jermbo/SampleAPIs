/** Sandbox bootstrap injected as iframe srcdoc — runs user code in an opaque origin. */
export const buildSandboxBootstrap = (token: string): string => `
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

export const RUN_TIMEOUT_MS = 5000;
