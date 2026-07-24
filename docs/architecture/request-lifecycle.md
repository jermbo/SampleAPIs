---
title: Request Lifecycle
description: The middleware chain every request passes through on the server
audience: [developer, architect]
---

[Wiki Home](../README.md) › [Architecture](./README.md)

# Request Lifecycle

Every request to the server passes through the middleware stack defined in [server/sampleapis.js](../../server/sampleapis.js):

```mermaid
flowchart TD
    A[Request] --> B["morgan — request logging"]
    B --> C["Global rate limiter (safety net)"]
    C --> D["Body parsers — JSON/urlencoded, 100kb cap"]
    D --> E["Static files — server/public/"]
    E --> F["helmet — security headers"]
    F --> G["CORS — origin: *"]
    G --> H{Route match?}
    H -- "/health, /frontend, /resetit,<br/>/create, /generate, /test" --> I[Service route]
    H -- "/:api/..." --> J["Data API router"]
    H -- none --> K["404 JSON handler"]
    J --> L["verifyData — shape validation"]
    L --> M["Per-API rate limiter"]
    M --> N["JSON router — read file, respond"]
    I & N --> O[Response]
    K --> O
    J -. "thrown / rejected" .-> P["Central error handler — JSON 500"]
    P --> O
```

Notes worth knowing:

- `trust proxy` is set to `1` so rate limiting keys on the real client IP behind Docker/nginx rather than the proxy address.
- Body parsers cap payloads at `100kb` so oversized requests can't exhaust memory.
- The data router reads its JSON file **fresh from disk on every request**, which is what lets a [data reset](../data/data-reset.md) take effect without a restart.

## Related

- [REST Conventions](../api/rest-conventions.md)
- [Error Responses](../api/error-responses.md)
- [Service Routes](../api/service-routes.md)
- [Rate Limiting](../api/rate-limiting.md)
