---
title: Architecture
description: How the system is shaped and why
audience: [developer, architect]
---

[Wiki Home](../README.md)

# Architecture

The big picture: what the system is made of and how a request moves through it.

| Page                                        | One-liner                                                       |
| ------------------------------------------- | --------------------------------------------------------------- |
| [System Overview](./system-overview.md)     | The two apps, the filesystem datastore, and the defining traits |
| [Project Structure](./project-structure.md) | Monorepo layout — where each kind of code lives                 |
| [Tech Stack](./tech-stack.md)               | Runtime, frameworks, and libraries on both sides                |
| [Request Lifecycle](./request-lifecycle.md) | The middleware chain every server request passes through        |

For the reasoning behind the architecture, see [Decisions](../decisions/README.md).
