import type { ClientState } from "../shared/types.js";
import { createElement } from "./components.js";
import { createHeroSection } from "./hero.js";
import { createLoginView } from "./login.js";
import { createSidebarSection, type SidebarRefs } from "./sidebar.js";

type AppBridge = {
  getState: () => ClientState;
  setCredentials: (email: string, inviteCode: string) => void;
  signIn: (payload: { email: string; inviteCode: string }) => Promise<unknown>;
  refreshServers: () => Promise<unknown>;
  connect: (serverId: string) => Promise<unknown>;
  disconnect: () => Promise<{ ok: true }>;
};

type MainRefs = SidebarRefs & {
  statusEl: HTMLElement;
  statusLabel: HTMLElement;
  sessionValue: HTMLElement;
  serverValue: HTMLElement;
};

function renderMainState(bridge: AppBridge, refs: MainRefs): void {
  const s = bridge.getState();
  const connected = s.connected;

  refs.statusEl.dataset.connected = String(connected);
  refs.statusLabel.textContent = connected ? "Connected" : "Not connected";
  refs.wrapEl.dataset.state = connected ? "connected" : "disconnected";
  refs.labelEl.textContent = connected ? "Connected" : "Not connected";
  refs.toggleEl.disabled = false;
  refs.errorEl.textContent = s.lastError ?? "";

  refs.sessionValue.textContent = s.signedIn ? s.email : "Not signed in";
  refs.serverValue.textContent  = s.connection?.serverId ?? "—";
}

export function mountApp(root: HTMLElement, bridge: AppBridge): void {
  root.replaceChildren();

  const flipContainer = createElement("div", { className: "flip-container" });
  const flipCard      = createElement("div", { className: "flip-card" });

  const flipFront = createElement("div", { className: "flip-front" });
  const { loginEl, refs: loginRefs } = createLoginView();
  flipFront.append(loginEl);

  const flipBack = createElement("div", { className: "flip-back" });
  const { hero, statusEl, statusLabel, sessionValue, serverValue } = createHeroSection();
  const { sidebar, refs: mainRefs } = createSidebarSection();
  const appLayout = createElement("div", { className: "app-layout" });
  appLayout.append(hero, sidebar);
  flipBack.append(appLayout);

  const allMainRefs: MainRefs = {
    statusEl, statusLabel, sessionValue, serverValue,
    ...mainRefs,
  };

  flipCard.append(flipFront, flipBack);
  flipContainer.append(flipCard);

  if (bridge.getState().signedIn) {
    renderMainState(bridge, allMainRefs);
    flipCard.classList.add("flipped");
  }

  root.append(flipContainer);

  loginRefs.emailEl.addEventListener("input", () =>
    bridge.setCredentials(loginRefs.emailEl.value, loginRefs.inviteCodeEl.value),
  );
  loginRefs.inviteCodeEl.addEventListener("input", () =>
    bridge.setCredentials(loginRefs.emailEl.value, loginRefs.inviteCodeEl.value),
  );

  loginRefs.signInEl.addEventListener("click", async () => {
    loginRefs.signInEl.textContent = "Signing in";
    loginRefs.signInEl.classList.add("btn--loading");
    loginRefs.errorEl.textContent = "";

    try {
      bridge.setCredentials(loginRefs.emailEl.value, loginRefs.inviteCodeEl.value);
      await bridge.signIn({ email: loginRefs.emailEl.value, inviteCode: loginRefs.inviteCodeEl.value });
      await bridge.refreshServers();

      renderMainState(bridge, allMainRefs);
      requestAnimationFrame(() => flipCard.classList.add("flipped"));
    } catch (err) {
      loginRefs.errorEl.textContent = err instanceof Error ? err.message : String(err);
      loginRefs.signInEl.textContent = "Sign in";
      loginRefs.signInEl.classList.remove("btn--loading");
    }
  });

  mainRefs.toggleEl.addEventListener("click", async () => {
    const s = bridge.getState();
    mainRefs.toggleEl.disabled = true;
    mainRefs.wrapEl.dataset.state = "connecting";

    try {
      if (s.connected) {
        mainRefs.labelEl.textContent = "Disconnecting...";
        await bridge.disconnect();
      } else {
        mainRefs.labelEl.textContent = "Connecting...";
        await bridge.connect("");
      }
    } catch (err) {
      mainRefs.errorEl.textContent = err instanceof Error ? err.message : String(err);
    }

    renderMainState(bridge, allMainRefs);
  });
}
