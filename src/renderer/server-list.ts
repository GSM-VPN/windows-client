import type { ServerChoice } from "../shared/types.js";

export function renderServerList(
  container: HTMLDivElement,
  servers: ServerChoice[],
  selectedServerId: string | null,
): void {
  if (servers.length === 0) {
    const empty = document.createElement("div");
    empty.className = "server-empty";
    empty.textContent = "No servers — sign in and refresh.";
    container.replaceChildren(empty);
    return;
  }
  container.replaceChildren(...servers.map((s) => makeServerItem(s, s.id === selectedServerId)));
}

function makeServerItem(server: ServerChoice, selected: boolean): HTMLButtonElement {
  const btn = document.createElement("button");
  btn.type = "button";
  btn.className = selected ? "server-item server-item--selected" : "server-item";
  btn.dataset.serverId = server.id;

  const info = document.createElement("div");
  const name = document.createElement("span");
  name.className = "server-name";
  name.textContent = server.name;
  const ep = document.createElement("span");
  ep.className = "server-endpoint";
  ep.textContent = server.endpoint;
  info.append(name, ep);

  const load = document.createElement("span");
  load.className = "server-load";
  load.textContent = `${server.loadPercent}%`;

  btn.append(info, load);
  return btn;
}
