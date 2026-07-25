import type { ShapeNode } from "./deriveShape";

/**
 * Emit copyable TypeScript interfaces from a derived shape. Deliberately
 * simple — a teaching aid, not codegen: one interface per object node,
 * optional members where coverage is partial, unions for mixed types.
 */

/** `characters` → `Character`. Naive on purpose; the output is editable text. */
export const interfaceName = (resource: string): string => {
  const singular = singularize(resource);
  return singular
    .split(/[^a-zA-Z0-9]+/)
    .filter(Boolean)
    .map((word) => word[0].toUpperCase() + word.slice(1))
    .join("") || "Item";
};

const singularize = (word: string): string => {
  if (word.endsWith("ies")) return `${word.slice(0, -3)}y`;
  if (word.endsWith("s") && !word.endsWith("ss")) return word.slice(0, -1);
  return word;
};

const IDENTIFIER = /^[a-zA-Z_$][a-zA-Z0-9_$]*$/;

const memberKey = (node: ShapeNode): string => {
  const name = IDENTIFIER.test(node.key) ? node.key : JSON.stringify(node.key);
  return node.count < node.total ? `${name}?` : name;
};

const hasRecursedChildren = (node: ShapeNode): boolean => node.children.length > 0;

interface NamedInterface {
  name: string;
  fields: ShapeNode[];
}

/** Reserve a unique interface name, suffixing on collision (`Name`, `Name2`, …). */
const claimName = (taken: Set<string>, base: string): string => {
  let name = base;
  for (let n = 2; taken.has(name); n++) name = `${base}${n}`;
  taken.add(name);
  return name;
};

const memberType = (node: ShapeNode, childName: string | null): string => {
  const mapLabel = (label: string): string => {
    if (childName && label === "object") return childName;
    if (childName && label === "object[]") return `${childName}[]`;
    return label;
  };
  return node.types.map(mapLabel).join(" | ") || "unknown";
};

/**
 * Emit `export interface` declarations for a shape, root first, nested
 * object interfaces following in discovery order.
 */
export const toTypeScript = (shape: ShapeNode[], resource: string): string => {
  const taken = new Set<string>();
  const queue: NamedInterface[] = [{ name: claimName(taken, interfaceName(resource)), fields: shape }];
  const emitted: string[] = [];

  for (const current of queue) {
    const lines = current.fields.map((node) => {
      const childName = hasRecursedChildren(node)
        ? claimName(taken, interfaceName(node.key))
        : null;
      if (childName) queue.push({ name: childName, fields: node.children });
      return `  ${memberKey(node)}: ${memberType(node, childName)};`;
    });
    emitted.push(`export interface ${current.name} {\n${lines.join("\n")}\n}`);
  }

  return emitted.join("\n\n");
};
