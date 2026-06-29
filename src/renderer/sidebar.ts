import { createElement } from "./components.js";

export type SidebarRefs = {
  serversEl: HTMLDivElement;
  refreshEl: HTMLElement;
  toggleEl: HTMLElement;
  errorEl: HTMLDivElement;
};

export function createSidebarSection(): { sidebar: HTMLElement; refs: SidebarRefs } {
  const panel = createElement("div", { className: "panel-right" });
  const inner = createElement("div", { className: "panel-inner" });

  const serverSection = createElement("div", { className: "right-section" });
  serverSection.append(createElement("div", { className: "section-label", textContent: "Servers" }));
  const serversEl = createElement("div", { className: "server-list" }) as HTMLDivElement;
  serverSection.append(serversEl);

  const toggleEl  = makeBtn("toggle",  "Connect",         "btn--primary");
  const refreshEl = makeBtn("refresh", "Refresh servers", "btn--secondary");

  const actionStack = createElement("div", { className: "action-stack" });
  actionStack.append(toggleEl, refreshEl);

  const errorEl = createElement("div", { className: "error-text" }) as HTMLDivElement;

  inner.append(serverSection, actionStack, errorEl);
  panel.append(inner);

  return { sidebar: panel, refs: { serversEl, refreshEl, toggleEl, errorEl } };
}

function makeBtn(id: string, text: string, variant: string): HTMLButtonElement {
  const btn = document.createElement("button");
  btn.type = "button";
  btn.id = id;
  btn.className = `btn ${variant}`;
  btn.textContent = text;
  return btn;
}
