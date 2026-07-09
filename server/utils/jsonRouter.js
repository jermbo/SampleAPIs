const express = require("express");
const fs = require("fs");

/**
 * A small json-server-compatible router factory.
 *
 * Serves every top-level key of a JSON file as a REST resource with full CRUD.
 * Array values are collections (`/:resource`, `/:resource/:id`); object values
 * are singular resources (`/:resource`). Mutations are persisted back to disk so
 * students can manipulate the data, and the reset routes restore from the
 * `.json.backup` twins.
 *
 * Response shapes mirror json-server 0.17 so existing tutorials keep working.
 */
function createJsonRouter(dataPath) {
  const router = express.Router();

  // Read fresh from disk on every request so external changes — notably the
  // /resetit routes restoring from the .json.backup twins — are picked up
  // without restarting the process. Writes persist straight back to the file.
  const read = () => JSON.parse(fs.readFileSync(dataPath, "utf-8"));
  const write = (db) => fs.writeFileSync(dataPath, JSON.stringify(db, null, 2));

  const isCollection = (db, name) => Array.isArray(db[name]);
  const exists = (db, name) => Object.prototype.hasOwnProperty.call(db, name);

  // GET /:resource  — collection query or singular object
  router.get("/:resource", (req, res) => {
    const db = read();
    const { resource } = req.params;
    if (!exists(db, resource)) return res.status(404).json({});
    if (!isCollection(db, resource)) return res.json(db[resource]);

    let items = [...db[resource]];
    items = applyFilters(items, req.query);
    items = applySort(items, req.query);

    const total = items.length;
    items = applySlice(items, req.query, res, total, req);

    res.setHeader("X-Total-Count", total);
    res.json(items);
  });

  // GET /:resource/:id
  router.get("/:resource/:id", (req, res) => {
    const db = read();
    const { resource, id } = req.params;
    if (!isCollection(db, resource)) return res.status(404).json({});
    const item = db[resource].find((r) => String(r.id) === String(id));
    if (!item) return res.status(404).json({});
    res.json(item);
  });

  // POST /:resource
  router.post("/:resource", (req, res) => {
    const db = read();
    const { resource } = req.params;
    if (!isCollection(db, resource)) return res.status(404).json({});
    const item = { ...req.body, id: req.body.id ?? nextId(db[resource]) };
    db[resource].push(item);
    write(db);
    res.status(201).location(`${req.originalUrl}/${item.id}`).json(item);
  });

  // PUT /:resource/:id  — full replace
  router.put("/:resource/:id", (req, res) => {
    const db = read();
    const { resource, id } = req.params;
    if (!isCollection(db, resource)) return res.status(404).json({});
    const idx = db[resource].findIndex((r) => String(r.id) === String(id));
    if (idx === -1) return res.status(404).json({});
    const item = { ...req.body, id: db[resource][idx].id };
    db[resource][idx] = item;
    write(db);
    res.json(item);
  });

  // PATCH /:resource/:id  — partial update
  router.patch("/:resource/:id", (req, res) => {
    const db = read();
    const { resource, id } = req.params;
    if (!isCollection(db, resource)) return res.status(404).json({});
    const idx = db[resource].findIndex((r) => String(r.id) === String(id));
    if (idx === -1) return res.status(404).json({});
    const item = { ...db[resource][idx], ...req.body, id: db[resource][idx].id };
    db[resource][idx] = item;
    write(db);
    res.json(item);
  });

  // DELETE /:resource/:id
  router.delete("/:resource/:id", (req, res) => {
    const db = read();
    const { resource, id } = req.params;
    if (!isCollection(db, resource)) return res.status(404).json({});
    const idx = db[resource].findIndex((r) => String(r.id) === String(id));
    if (idx === -1) return res.status(404).json({});
    db[resource].splice(idx, 1);
    write(db);
    res.json({});
  });

  return router;
}

// --- query helpers (json-server 0.17 subset) ---

const CONTROL_KEYS = new Set(["_sort", "_order", "_page", "_limit", "_start", "_end", "q"]);

function getPath(obj, path) {
  return path.split(".").reduce((acc, key) => (acc == null ? acc : acc[key]), obj);
}

function applyFilters(items, query) {
  // Full-text search across the whole record
  if (query.q) {
    const needle = String(query.q).toLowerCase();
    items = items.filter((r) => JSON.stringify(r).toLowerCase().includes(needle));
  }

  for (const [key, value] of Object.entries(query)) {
    if (CONTROL_KEYS.has(key)) continue;

    // operator suffixes: field_gte, field_lte, field_ne, field_like
    const opMatch = key.match(/^(.*)_(gte|lte|ne|like)$/);
    if (opMatch) {
      const [, field, op] = opMatch;
      items = items.filter((r) => {
        const v = getPath(r, field);
        if (op === "gte") return v >= value;
        if (op === "lte") return v <= value;
        if (op === "ne") return String(v) !== String(value);
        if (op === "like") return new RegExp(value, "i").test(String(v));
      });
      continue;
    }

    // equality (supports repeated params → OR match)
    const wanted = [].concat(value).map(String);
    items = items.filter((r) => wanted.includes(String(getPath(r, key))));
  }

  return items;
}

function applySort(items, query) {
  if (!query._sort) return items;
  const fields = String(query._sort).split(",");
  const orders = String(query._order || "").split(",");
  return [...items].sort((a, b) => {
    for (let i = 0; i < fields.length; i++) {
      const dir = (orders[i] || "asc").toLowerCase() === "desc" ? -1 : 1;
      const av = getPath(a, fields[i]);
      const bv = getPath(b, fields[i]);
      if (av < bv) return -1 * dir;
      if (av > bv) return 1 * dir;
    }
    return 0;
  });
}

function applySlice(items, query, res, total, req) {
  // Pagination: _page (+ _limit, default 10)
  if (query._page) {
    const page = Math.max(1, parseInt(query._page, 10) || 1);
    const limit = parseInt(query._limit, 10) || 10;
    const start = (page - 1) * limit;
    setLinkHeader(res, req, page, limit, total);
    return items.slice(start, start + limit);
  }
  // Range: _start / _end / _limit
  if (query._start !== undefined) {
    const start = parseInt(query._start, 10) || 0;
    const end =
      query._end !== undefined
        ? parseInt(query._end, 10)
        : start + (parseInt(query._limit, 10) || items.length);
    return items.slice(start, end);
  }
  if (query._limit !== undefined) {
    return items.slice(0, parseInt(query._limit, 10) || items.length);
  }
  return items;
}

function setLinkHeader(res, req, page, limit, total) {
  const last = Math.max(1, Math.ceil(total / limit));
  const base = `${req.protocol}://${req.get("host")}${req.baseUrl}${req.path}`;
  const link = (p) => {
    const params = new URLSearchParams({ ...req.query, _page: p, _limit: limit });
    return `<${base}?${params}>`;
  };
  const parts = [];
  if (page > 1) parts.push(`${link(1)}; rel="first"`, `${link(page - 1)}; rel="prev"`);
  if (page < last) parts.push(`${link(page + 1)}; rel="next"`, `${link(last)}; rel="last"`);
  if (parts.length) res.setHeader("Link", parts.join(", "));
}

function nextId(collection) {
  const numericIds = collection
    .map((r) => Number(r.id))
    .filter((n) => Number.isFinite(n));
  return numericIds.length ? Math.max(...numericIds) + 1 : 1;
}

module.exports = { createJsonRouter };
