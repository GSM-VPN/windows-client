import { createElement } from "./components.js";

export function createHeroSection(): {
  hero: HTMLElement;
  statusEl: HTMLElement;
  statusLabel: HTMLElement;
  sessionValue: HTMLElement;
  serverValue: HTMLElement;
  addressValue: HTMLElement;
} {
  const panel = createElement("div", { className: "panel-left" });

  const logoWrap = createElement("div", { className: "app-logo" });
  const logoName = createElement("span", { className: "app-logo-name", textContent: "GSM VPN" });
  logoWrap.append(logoName);

  const statusEl = createElement("div", { className: "status-pill" });
  statusEl.dataset.connected = "false";
  const dot = createElement("span", { className: "status-pill-dot" });
  const statusLabel = createElement("span", { textContent: "Not connected" });
  statusEl.append(dot, statusLabel);

  const divider = createElement("div", { className: "panel-divider" });
  const sectionLabel = createElement("div", { className: "section-label", textContent: "Connection" });

  const statList = createElement("div", { className: "stat-list" });
  const sessionRow = makeStatRow("Session", "Not signed in");
  const serverRow  = makeStatRow("Server",  "No server selected");
  const addressRow = makeStatRow("Address", "Unassigned");
  statList.append(sessionRow, serverRow, addressRow);

  panel.append(logoWrap, statusEl, divider, sectionLabel, statList);

  return {
    hero: panel,
    statusEl,
    statusLabel,
    sessionValue: sessionRow.querySelector(".stat-value") as HTMLElement,
    serverValue:  serverRow.querySelector(".stat-value")  as HTMLElement,
    addressValue: addressRow.querySelector(".stat-value") as HTMLElement,
  };
}

function makeStatRow(label: string, value: string): HTMLElement {
  const row = createElement("div", { className: "stat-row" });
  row.append(
    createElement("div", { className: "stat-label", textContent: label }),
    createElement("div", { className: "stat-value", textContent: value }),
  );
  return row;
}
