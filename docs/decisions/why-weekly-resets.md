---
title: Why Persistent Writes + Resets
description: Letting anyone mutate real data, then healing it on a schedule
audience: architect
---

[Wiki Home](../README.md) › [Decisions](./README.md)

# Why Persistent Writes + Resets

Anyone can `POST`/`PUT`/`PATCH`/`DELETE` against the public API, the change **actually persists**, and then it gets wiped on a regular cadence. That combination is deliberate.

## Why writes persist

A learner's `POST` followed by a `GET` must show their record — otherwise the API feels fake and teaches nothing about real CRUD. Faking writes in memory (or rejecting them) was the alternative, and it would undermine the product's whole premise: a no-auth API that behaves like a real one.

## Why resets, then

Public + unauthenticated + persistent means the data *will* accumulate junk, vandalism, and broken shapes. Instead of moderation or auth, the design accepts drift and heals it:

- Every file has a pristine `.json.backup` twin; [reset routes](../data/data-reset.md) copy it back over the live file
- Production resets weekly and whenever new endpoints ship
- [Shape validation](../api/crud-and-validation.md) and [rate limits](../api/rate-limiting.md) keep the drift bounded in between

## The escape hatch

Want data to survive resets? Contribute it via [pull request](../contributing/pull-request-flow.md) so it lands in the backup itself. The reset cycle quietly funnels engaged users into becoming contributors.

## Related

- [Data Reset](../data/data-reset.md)
- [Why Flat JSON Files](./why-flat-json-files.md)
