---
title: Endpoint Data
description: The JSON datasets — their format, lifecycle, and registry
audience: [developer, architect]
---

[Wiki Home](../README.md)

# Endpoint Data

The datasets are the product. This section covers their file format, how they become live endpoints, and how they heal.

| Page | One-liner |
| --- | --- |
| [Endpoint JSON Format](./endpoint-json-format.md) | `metaData` + collections + unique ids, and the backup twin |
| [Adding an Endpoint](./adding-an-endpoint.md) | The three files + registry rebuild that make an API live |
| [API Registry](./api-registry.md) | `GeneratedAPIList.js` — the generated catalog behind routing and the site |
| [Data Reset](./data-reset.md) | Restoring mutated data from the `.json.backup` twins |
| [Custom Endpoints](./custom-endpoints.md) | The `/create` scaffolding route and its limits |

How these datasets are served is covered in [API Surface](../api/README.md).
