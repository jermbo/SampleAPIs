export const orientationLabel = (orientation: "horizontal" | "vertical"): string => {
  if (orientation === "horizontal") return "⬍ Stack";
  return "⬌ Side by side";
};

export const runButtonLabel = (running: boolean): string => {
  if (running) return "Running…";
  return "▶ Run  (⌘/Ctrl+↵)";
};

export const collapseTitle = (collapsed: boolean): string => {
  if (collapsed) return "Expand console";
  return "Collapse console";
};

export const collapseCaret = (collapsed: boolean): string => {
  if (collapsed) return "▸";
  return "▾";
};

export const paneTabClassName = (active: boolean): string => {
  if (active) return "playground__pane-tab -active";
  return "playground__pane-tab";
};

export const snippetTabClassName = (active: boolean): string => {
  if (active) return "playground__tab -active";
  return "playground__tab";
};
