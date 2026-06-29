import { createElement } from "./components.js";

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

export function createSidebarSection(opts: { fixedGateway?: string } = {}): { sidebar: HTMLElement; refs: SidebarRefs } {
  const { fixedGateway = "" } = opts;

  const panel = createElement("div", { className: "panel-right" });
  const inner = createElement("div", { className: "panel-inner" });

  const serverSection = createElement("div", { className: "right-section" });
  serverSection.append(createElement("div", { className: "section-label", textContent: "Servers" }));
  const serversEl = createElement("div", { className: "server-list" }) as HTMLDivElement;
  serverSection.append(serversEl);

  const settingsSection = createElement("div", { className: "right-section" });
  settingsSection.append(createElement("div", { className: "section-label", textContent: "Settings" }));

  const gatewayUrlEl = makeInput("gatewayUrl", "text");
  if (fixedGateway) gatewayUrlEl.value = fixedGateway;
  const emailEl      = makeInput("email", "email", "your@email.com");
  const inviteCodeEl = makeInput("inviteCode", "password", "shared invite code");

  const inputStack = createElement("div", { className: "input-stack" });
  if (!fixedGateway) {
    inputStack.append(makeField("Gateway URL", gatewayUrlEl));
  }
  inputStack.append(
    makeField("Email", emailEl),
    makeField("Invite Code", inviteCodeEl),
  );
  settingsSection.append(inputStack);

  const toggleEl  = makeBtn("toggle",  "Connect",         "btn--primary");
  const signInEl  = makeBtn("signIn",  "Sign in",         "btn--secondary");
  const refreshEl = makeBtn("refresh", "Refresh servers", "btn--secondary");

  const actionStack = createElement("div", { className: "action-stack" });
  actionStack.append(toggleEl, signInEl, refreshEl);

  const errorEl = createElement("div", { className: "error-text" }) as HTMLDivElement;

  inner.append(serverSection, settingsSection, actionStack, errorEl);
  panel.append(inner);

  return {
    sidebar: panel,
    refs: { serversEl, gatewayUrlEl, emailEl, inviteCodeEl, signInEl, refreshEl, toggleEl, errorEl },
  };
}

function makeInput(id: string, type: string, placeholder = ""): HTMLInputElement {
  const el = document.createElement("input");
  el.id = id;
  el.type = type;
  el.className = "input-field";
  if (placeholder) el.placeholder = placeholder;
  return el;
}

function makeField(labelText: string, input: HTMLInputElement): HTMLElement {
  const wrap = createElement("div", { className: "input-group" });
  const label = createElement("label", { className: "input-label", textContent: labelText });
  label.setAttribute("for", input.id);
  wrap.append(label, input);
  return wrap;
}

function makeBtn(id: string, text: string, variant: string): HTMLButtonElement {
  const btn = document.createElement("button");
  btn.type = "button";
  btn.id = id;
  btn.className = `btn ${variant}`;
  btn.textContent = text;
  return btn;
}
