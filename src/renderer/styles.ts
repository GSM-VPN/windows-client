const styles = `
:root {
  color-scheme: dark;
  --bg: #0b1020;
  --panel: rgba(12, 18, 38, .78);
  --panel-2: rgba(17, 26, 54, .92);
  --text: #ebefff;
  --muted: #92a0cb;
  --accent: #75e6ff;
  --accent-2: #8998ff;
  --border: rgba(255,255,255,.08);
}
* { box-sizing: border-box; }
body {
  margin: 0;
  font-family: Inter, system-ui, sans-serif;
  background:
    radial-gradient(circle at top left, rgba(122, 140, 255, .25), transparent 35%),
    radial-gradient(circle at bottom right, rgba(106, 228, 255, .18), transparent 28%),
    var(--bg);
  color: var(--text);
}
.wrap {
  min-height: 100vh;
  display: grid;
  place-items: center;
  padding: 32px;
}
.card {
  width: min(1040px, 100%);
  border-radius: 28px;
  overflow: hidden;
  box-shadow: 0 28px 90px rgba(0,0,0,.4);
  display: grid;
  grid-template-columns: 1.15fr .85fr;
  border: 1px solid var(--border);
  background: linear-gradient(180deg, rgba(255,255,255,.07), rgba(255,255,255,.03));
  backdrop-filter: blur(22px);
}
.hero, .sidebar {
  padding: 32px;
}
.hero {
  background: linear-gradient(145deg, rgba(16, 24, 48, .72), rgba(21, 30, 63, .45));
  border-right: 1px solid var(--border);
}
.eyebrow {
  margin: 0 0 12px;
  color: var(--accent);
  letter-spacing: .18em;
  text-transform: uppercase;
  font-size: 12px;
  font-weight: 700;
}
h1 {
  margin: 0 0 14px;
  font-size: 44px;
  line-height: 1;
}
p { color: var(--muted); line-height: 1.7; margin: 0; }
.status {
  margin-top: 24px;
  display: inline-flex;
  gap: 10px;
  align-items: center;
  padding: 10px 14px;
  background: rgba(117, 230, 255, .08);
  border: 1px solid rgba(117, 230, 255, .18);
  border-radius: 999px;
}
.dot {
  width: 10px;
  height: 10px;
  border-radius: 50%;
  background: var(--accent);
  box-shadow: 0 0 14px rgba(117,230,255,.75);
}
.section {
  margin-top: 28px;
}
.list {
  display: grid;
  gap: 12px;
  margin-top: 16px;
}
.server {
  border: 1px solid var(--border);
  background: rgba(255,255,255,.03);
  border-radius: 18px;
  padding: 16px;
  color: var(--text);
  cursor: pointer;
  width: 100%;
  text-align: left;
}
.server--selected {
  border-color: rgba(117, 230, 255, .4);
  background: rgba(117, 230, 255, .08);
}
.server:hover {
  background: rgba(255,255,255,.06);
  border-color: rgba(117, 230, 255, .18);
}
.server strong {
  display: block;
  margin-bottom: 4px;
}
.meta {
  display: flex;
  justify-content: space-between;
  color: var(--muted);
  font-size: 14px;
  gap: 12px;
}
.cta {
  display: grid;
  gap: 12px;
  margin-top: 18px;
}
.small {
  margin-top: 14px;
  font-size: 13px;
  color: var(--muted);
}
.inputRow {
  display: grid;
  gap: 10px;
  margin-top: 16px;
}
.inputRow input {
  width: 100%;
  margin-top: 6px;
  padding: 12px 14px;
  border-radius: 14px;
  border: 1px solid var(--border);
  background: rgba(7, 13, 30, .72);
  color: var(--text);
  outline: none;
}
.inputRow input:focus {
  border-color: rgba(117, 230, 255, .45);
  box-shadow: 0 0 0 3px rgba(117, 230, 255, .1);
}
.pillRow {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-top: 14px;
}
.stats {
  display: grid;
  gap: 12px;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  margin-top: 18px;
}
.stat {
  border: 1px solid var(--border);
  background: rgba(255,255,255,.04);
  border-radius: 18px;
  padding: 14px;
}
.stat__label {
  display: block;
  font-size: 12px;
  letter-spacing: .08em;
  text-transform: uppercase;
  color: var(--muted);
  margin-bottom: 6px;
}
.stat__value {
  display: block;
  font-size: 15px;
  color: var(--text);
  overflow: hidden;
  text-overflow: ellipsis;
}
@media (max-width: 860px) {
  .card { grid-template-columns: 1fr; }
  .hero { border-right: 0; border-bottom: 1px solid var(--border); }
  .stats { grid-template-columns: 1fr; }
}
`;

export function injectStyles(): void {
  if (document.getElementById("gsm-vpn-styles")) {
    return;
  }

  const style = document.createElement("style");
  style.id = "gsm-vpn-styles";
  style.textContent = styles;
  document.head.append(style);
}
