# React + Vite

## API configuration and local development

The frontend uses `/api` by default. During local Vite development, requests to
`/api` and `/storage` are proxied to `http://127.0.0.1:8000`, so the browser
does not make cross-origin requests to Laravel. Start Laravel on port 8000 and
run `npm run dev` (Vite listens on port 3000 by default). The same proxy is
available when checking a production build with `npm run preview` (port 4173).

Set `API_PROXY_TARGET` in the frontend environment if the local backend uses a
different origin. For a deployment where the frontend and API share an origin,
route `/api` and `/storage` to Laravel at the web-server/reverse-proxy layer.
For a separate API origin, set `VITE_API_URL` to its full API base URL at build
time and configure `CORS_ALLOWED_ORIGINS` in Laravel with the exact frontend
origins (scheme and port included). Do not use `*` when credentials are enabled.

This template provides a minimal setup to get React working in Vite with HMR and some Oxlint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Oxc](https://oxc.rs)
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/)

## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the Oxlint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and Oxlint's TypeScript related rules in your project.
