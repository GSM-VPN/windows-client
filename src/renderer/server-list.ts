import type { ServerChoice } from "../shared/types.js";
import { createElement } from "./components.js";

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

export function renderServerList(
  container: HTMLDivElement,
  servers: ServerChoice[],
  selectedServerId: string | null,
): void {
  container.replaceChildren(...servers.map((server) => createServerCard(server, server.id === selectedServerId)));
}

