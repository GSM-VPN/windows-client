import { createActionButton, createElement, createInputField, createListHeader } from "./components.js";

export type SidebarRefs = {
  serversEl: HTMLDivElement;
  gatewayUrlEl: HTMLInputElement;
  emailEl: HTMLInputElement;
  inviteCodeEl: HTMLInputElement;
  signInEl: HTMLElement;
  refreshEl: HTMLElement;
  toggleEl: HTMLElement;
  errorEl: HTMLDivElement;
};

export function createSidebarSection(): { sidebar: HTMLElement; refs: SidebarRefs } {
  const sidebar = createElement("aside", { className: "sidebar" });
  const card = document.createElement("zm-card");
  const serverSection = createElement("div", { className: "section" });
  const serversEl = createElement("div", { className: "list" }) as HTMLDivElement;

  serverSection.append(createListHeader("Server selection", "Pick the lightest available VPN server."), serversEl);
  card.append(serverSection);
  sidebar.append(card);

  const gatewayUrlEl = createElement("input", {
    attributes: { id: "gatewayUrl", type: "text", value: "http://127.0.0.1:8080" },
  }) as HTMLInputElement;
  const emailEl = createElement("input", {
    attributes: { id: "email", type: "email", placeholder: "your@email.com" },
  }) as HTMLInputElement;
  const inviteCodeEl = createElement("input", {
    attributes: { id: "inviteCode", type: "password", placeholder: "shared invite code" },
  }) as HTMLInputElement;

  const inputRow = createElement("div", { className: "inputRow" });
  inputRow.append(
    createInputField("Gateway URL", gatewayUrlEl),
    createInputField("Email", emailEl),
    createInputField("Invite code", inviteCodeEl),
  );

  const cta = createElement("div", { className: "cta" });
  const signInEl = createActionButton("signIn", "Sign in");
  const refreshEl = createActionButton("refresh", "Refresh servers");
  const toggleEl = createActionButton("toggle", "Connect");
  cta.append(signInEl, refreshEl, toggleEl);

  const errorEl = createElement("div", { className: "small" }) as HTMLDivElement;
  errorEl.style.color = "#ff9ea1";

  sidebar.append(
    inputRow,
    cta,
    errorEl,
    createElement("div", {
      className: "small",
      textContent: "This is the Windows client skeleton. The gateway and tunnel logic will attach next.",
    }),
  );

  return {
    sidebar,
    refs: {
      serversEl,
      gatewayUrlEl,
      emailEl,
      inviteCodeEl,
      signInEl,
      refreshEl,
      toggleEl,
      errorEl,
    },
  };
}

