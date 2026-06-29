import { createElement } from "./components.js";

export type LoginRefs = {
  emailEl: HTMLInputElement;
  inviteCodeEl: HTMLInputElement;
  signInEl: HTMLButtonElement;
  errorEl: HTMLDivElement;
};

export function createLoginView(): { loginEl: HTMLElement; refs: LoginRefs } {
  const screen = createElement("div", { className: "login-screen" });
  const card   = createElement("div", { className: "login-card" });

  card.append(
    createElement("div", { className: "login-title",    textContent: "GSM VPN" }),
    createElement("div", { className: "login-subtitle", textContent: "Sign in to continue" }),
  );

  const emailEl      = makeInput("email",      "email",    "your@email.com");
  const inviteCodeEl = makeInput("inviteCode", "password", "shared invite code");

  const inputStack = createElement("div", { className: "input-stack" });
  inputStack.append(makeField("Email", emailEl), makeField("Invite Code", inviteCodeEl));

  const signInEl = document.createElement("button");
  signInEl.type = "button";
  signInEl.className = "btn btn--primary";
  signInEl.textContent = "Sign in";

  const errorEl = createElement("div", { className: "error-text" }) as HTMLDivElement;

  card.append(inputStack, signInEl, errorEl);
  screen.append(card);

  for (const input of [emailEl, inviteCodeEl]) {
    input.addEventListener("keydown", (e) => {
      if (e.key === "Enter") signInEl.click();
    });
  }

  return { loginEl: screen, refs: { emailEl, inviteCodeEl, signInEl, errorEl } };
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
  const wrap  = createElement("div",   { className: "input-group" });
  const label = createElement("label", { className: "input-label", textContent: labelText });
  label.setAttribute("for", input.id);
  wrap.append(label, input);
  return wrap;
}
