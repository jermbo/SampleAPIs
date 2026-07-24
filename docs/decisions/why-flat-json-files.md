---
title: Why Flat JSON Files
description: The case for the filesystem as the datastore
audience: architect
---

[Wiki Home](../README.md) › [Decisions](./README.md)

# Why Flat JSON Files

The datastore is a folder of JSON files, not a database. For this project that is a feature, not a shortcut.

## The forces

- The product is **sample data for learners** — datasets are small, read-heavy, and valuable precisely because they're inspectable
- Contributions arrive as **pull requests** — a JSON file is diffable, reviewable, and mergeable; database rows are none of those
- Data must be **resettable to a known baseline** — a `.json.backup` twin and a file copy beat migrations and seed scripts (see [Data Reset](../data/data-reset.md))
- Operations should stay near zero — no database service, no connection management, no backups to run

## The costs, and how they're paid

- **Concurrent writes** could lose updates → serialized by a per-file promise queue in the [JSON router](../api/crud-and-validation.md)
- **Every request hits the disk** → acceptable at this scale, and it's exactly what makes resets take effect without a restart
- **No relations, no transactions** → out of scope for the product; each collection stands alone

## Revisit when

Datasets grow past what a per-request full-file read can serve, or collections need cross-references.

## Related

- [System Overview](../architecture/system-overview.md)
- [Why Persistent Writes + Resets](./why-weekly-resets.md)
- [Endpoint JSON Format](../data/endpoint-json-format.md)
