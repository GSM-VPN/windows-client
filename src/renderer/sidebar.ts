import { createElement } from "./components.js";

export type SidebarRefs = {
  toggleEl: HTMLButtonElement;
  wrapEl: HTMLElement;
  labelEl: HTMLElement;
  errorEl: HTMLDivElement;
};

export function createSidebarSection(): { sidebar: HTMLElement; refs: SidebarRefs } {
  const panel = createElement("div", { className: "panel-right" });

  const wrapEl = createElement("div", { className: "power-btn-wrap" }) as HTMLElement;
  wrapEl.dataset.state = "disconnected";
  wrapEl.append(
    createElement("span", { className: "power-ripple" }),
    createElement("span", { className: "power-ripple" }),
  );

  const toggleEl = document.createElement("button");
  toggleEl.type = "button";
  toggleEl.id = "toggle";
  toggleEl.className = "power-btn";
  toggleEl.innerHTML = `
    <svg class="icon-unlock" width="46" height="46" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round">
      <rect x="3" y="11" width="18" height="11" rx="2"/>
      <path d="M7 11V7a5 5 0 0 1 9.9-1"/>
    </svg>
    <svg class="icon-lock" width="46" height="46" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round">
      <rect x="3" y="11" width="18" height="11" rx="2"/>
      <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
    </svg>
  `;
  wrapEl.append(toggleEl);

  const labelEl = createElement("div", { className: "power-label", textContent: "Not connected" }) as HTMLElement;
  const errorEl = createElement("div", { className: "error-text" }) as HTMLDivElement;

  const powerSection = createElement("div", { className: "power-section" });
  powerSection.append(wrapEl, labelEl);
  panel.append(powerSection, errorEl);

  return { sidebar: panel, refs: { toggleEl, wrapEl, labelEl, errorEl } };
}
