import { createBadge, createElement, createHeading, createStat } from "./components.js";

export function createHeroSection(): {
  hero: HTMLElement;
  statusLabel: HTMLElement;
  sessionValue: HTMLElement;
  serverValue: HTMLElement;
  addressValue: HTMLElement;
} {
  const hero = createElement("section", { className: "hero" });
  hero.append(
    createElement("p", { className: "eyebrow", textContent: "Private access control" }),
    createElement("h1", { textContent: "GSM-VPN" }),
    createElement("p", {
      textContent:
        "Private VPN client for a small trusted group. Sign in, pick the lightest server, and connect with a calm, clear interface built on zaemoru.",
    }),
  );

  const status = createElement("div", { className: "status" });
  const dot = createElement("span", { className: "dot" });
  const statusLabel = createElement("span", { textContent: "Loading state..." });
  status.append(dot, statusLabel);
  hero.append(status);

  const section = createElement("div", { className: "section" });
  section.append(createHeading("Why this layout", "large"));

  const pillRow = createElement("div", { className: "pillRow" });
  pillRow.append(
    createBadge("Clear state", "blue", "fill"),
    createBadge("Low noise", "teal", "weak"),
    createBadge("Few clicks", "green", "fill"),
  );
  section.append(pillRow);

  const stats = createElement("div", { className: "stats" });
  const sessionStat = createStat("Session", "Not signed in");
  const serverStat = createStat("Server", "No server selected");
  const addressStat = createStat("Address", "Unassigned");
  stats.append(sessionStat, serverStat, addressStat);
  section.append(stats);
  hero.append(section);

  return {
    hero,
    statusLabel,
    sessionValue: sessionStat.querySelector("strong") as HTMLElement,
    serverValue: serverStat.querySelector("strong") as HTMLElement,
    addressValue: addressStat.querySelector("strong") as HTMLElement,
  };
}
