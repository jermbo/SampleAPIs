---
title: Decisions
description: Why the system is built the way it is
audience: architect
---

[Wiki Home](../README.md)

# Decisions

The "why" pages — trade-offs behind the architecture, written for architects (and anyone about to propose changing one of these). Each page states the forces, the costs accepted, and when to revisit.

| Page | Decision |
| --- | --- |
| [Why Flat JSON Files](./why-flat-json-files.md) | The filesystem is the datastore |
| [Why a Custom JSON Router](./why-custom-json-router.md) | ~240 owned lines instead of json-server (+ GraphQL's removal) |
| [Why Persistent Writes + Resets](./why-weekly-resets.md) | Real CRUD for anyone, healed on a schedule |
| [Why a Sandboxed Playground](./why-sandboxed-playground.md) | Untrusted code in a null-origin iframe |
