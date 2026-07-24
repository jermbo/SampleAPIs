# Sample APIs — React Client

The front end for [SampleAPIs](https://sampleapis.com): a Vite + React 19 + TypeScript app. How it all works is documented in the project wiki — start with [Client Features](../docs/features/README.md).

## Commands

```bash
npm run dev      # dev server with HMR at http://localhost:4444
npm run build    # type-check (tsc) + production build
npm run preview  # serve the production build
npm run lint     # oxlint
```

The dev server expects the API server running at `http://localhost:5555` — see [Local Development](../docs/operations/local-development.md).

## Conventions

New components follow the existing patterns: one folder per component under `src/components/` (pages under `src/pages/`, with a matching route file in `src/routes/`), typed as `React.FC<Props>`, styled with plain CSS. Details in [Code Style](../docs/contributing/code-style.md) and [Styling](../docs/features/styling.md).
