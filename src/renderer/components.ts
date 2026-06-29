import type { ServerChoice } from "../shared/types.js";

export function createElement<K extends keyof HTMLElementTagNameMap>(
  tagName: K,
  options: {
    className?: string;
    textContent?: string;
    attributes?: Record<string, string>;
  } = {},
): HTMLElementTagNameMap[K] {
  const element = document.createElement(tagName);
  if (options.className) {
    element.className = options.className;
  }
  if (options.textContent !== undefined) {
    element.textContent = options.textContent;
  }
  for (const [key, value] of Object.entries(options.attributes ?? {})) {
    element.setAttribute(key, value);
  }
  return element;
}

export function createBadge(text: string, color: string, variant: string): HTMLElement {
  const badge = document.createElement("zm-badge");
  badge.setAttribute("size", "small");
  badge.setAttribute("color", color);
  badge.setAttribute("variant", variant);
  badge.textContent = text;
  return badge;
}

export function createHeading(text: string, size: string): HTMLElement {
  const heading = document.createElement("zm-heading");
  heading.setAttribute("size", size);
  heading.textContent = text;
  return heading;
}

export function createListHeader(title: string, description: string): HTMLElement {
  const header = document.createElement("zm-list-header");
  header.setAttribute("title", title);
  header.setAttribute("description", description);
  return header;
}

export function createActionButton(id: string, label: string): HTMLElement {
  const button = document.createElement("zm-button");
  button.id = id;
  button.setAttribute("size", "large");
  button.textContent = label;
  return button;
}

export function createInputField(labelText: string, input: HTMLInputElement): HTMLLabelElement {
  const label = createElement("label");
  const labelTextEl = createElement("div", {
    className: "small",
    textContent: labelText,
  });
  label.append(labelTextEl, input);
  return label;
}

export function createServerCard(server: ServerChoice, selected: boolean): HTMLButtonElement {
  const button = document.createElement("button");
  button.type = "button";
  button.className = selected ? "server server--selected" : "server";
  button.dataset.serverId = server.id;

  const title = createElement("strong", { textContent: server.name });
  const meta = createElement("div", { className: "meta" });
  const endpoint = createElement("span", { textContent: server.endpoint });
  const load = createElement("span", { textContent: `${server.loadPercent}% load` });

  meta.append(endpoint, load);
  button.append(title, meta);
  return button;
}

export function createStat(label: string, value: string): HTMLElement {
  const stat = createElement("div", { className: "stat" });
  stat.append(
    createElement("span", { className: "stat__label", textContent: label }),
    createElement("strong", { className: "stat__value", textContent: value }),
  );
  return stat;
}
