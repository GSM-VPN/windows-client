const styles = `
:root {
  color-scheme: light;
  --zm-color-grey-50: #f9fafb;
  --zm-color-grey-100: #f2f4f6;
  --zm-color-grey-200: #e5e8eb;
  --zm-color-grey-300: #d1d6db;
  --zm-color-grey-400: #b0b8c1;
  --zm-color-grey-500: #8b95a1;
  --zm-color-grey-600: #6b7684;
  --zm-color-grey-700: #4e5968;
  --zm-color-grey-800: #333d4b;
  --zm-color-grey-900: #191f28;
  --zm-color-blue-50: #e8f1fe;
  --zm-color-blue-100: #cfe3ff;
  --zm-color-blue-200: #9ec8ff;
  --zm-color-blue-300: #6dacff;
  --zm-color-blue-400: #4f97fa;
  --zm-color-blue-500: #3182f6;
  --zm-color-blue-600: #2272eb;
  --zm-color-blue-700: #1b64da;
  --zm-color-blue-800: #1957c2;
  --zm-color-blue-900: #194aa6;
  --zm-color-red-50: #fff1f2;
  --zm-color-red-100: #ffe1e4;
  --zm-color-red-200: #ffc4ca;
  --zm-color-red-300: #fb8890;
  --zm-color-red-400: #f66570;
  --zm-color-red-500: #f04452;
  --zm-color-red-600: #e42939;
  --zm-color-red-700: #d22030;
  --zm-color-red-800: #bc1b2a;
  --zm-color-red-900: #a51926;
  --zm-color-orange-50: #fff4e5;
  --zm-color-orange-100: #ffe4bd;
  --zm-color-orange-200: #ffd091;
  --zm-color-orange-300: #ffbd64;
  --zm-color-orange-400: #ffac3d;
  --zm-color-orange-500: #ff9800;
  --zm-color-orange-600: #f08a00;
  --zm-color-orange-700: #df7800;
  --zm-color-orange-800: #c96500;
  --zm-color-orange-900: #ad5200;
  --zm-color-yellow-50: #fff9e7;
  --zm-color-yellow-100: #ffefbf;
  --zm-color-yellow-200: #ffe69b;
  --zm-color-yellow-300: #ffdd78;
  --zm-color-yellow-400: #ffd158;
  --zm-color-yellow-500: #ffc342;
  --zm-color-yellow-600: #ffb331;
  --zm-color-yellow-700: #faa131;
  --zm-color-yellow-800: #ee8f11;
  --zm-color-yellow-900: #dd7d02;
  --zm-color-green-50: #ecfbf4;
  --zm-color-green-100: #c8f5df;
  --zm-color-green-200: #94eac2;
  --zm-color-green-300: #5cdda2;
  --zm-color-green-400: #2dcc85;
  --zm-color-green-500: #00c471;
  --zm-color-green-600: #00a967;
  --zm-color-green-700: #008f5a;
  --zm-color-green-800: #00764d;
  --zm-color-green-900: #005f40;
  --zm-color-teal-50: #edfafa;
  --zm-color-teal-100: #c7eeee;
  --zm-color-teal-200: #93dede;
  --zm-color-teal-300: #62cdcd;
  --zm-color-teal-400: #36baba;
  --zm-color-teal-500: #18a5a5;
  --zm-color-teal-600: #109595;
  --zm-color-teal-700: #0c8585;
  --zm-color-teal-800: #097575;
  --zm-color-teal-900: #076565;
  --zm-color-purple-50: #faf0ff;
  --zm-color-purple-100: #efd3ff;
  --zm-color-purple-200: #dda6f7;
  --zm-color-purple-300: #c979ed;
  --zm-color-purple-400: #b755df;
  --zm-color-purple-500: #a234c7;
  --zm-color-purple-600: #9128b4;
  --zm-color-purple-700: #8222a2;
  --zm-color-purple-800: #73228e;
  --zm-color-purple-900: #65237b;
  --zm-color-primary: #3182f6;
  --zm-color-primary-hover: #1b64da;
  --zm-color-primary-pressed: #1957c2;
  --zm-color-primary-subtle: #e8f1fe;
  --zm-color-on-primary: #ffffff;
  --zm-color-success: #00c471;
  --zm-color-warning: #f5a623;
  --zm-color-danger: #f04452;
  --zm-color-danger-hover: #d8323f;
  --zm-color-info: #3182f6;
  --zm-color-background: #ffffff;
  --zm-color-grey-background: #f2f4f6;
  --zm-color-layered-background: #ffffff;
  --zm-color-floated-background: #ffffff;
  --zm-color-background-subtle: #f2f4f6;
  --zm-color-background-muted: #e5e8eb;
  --zm-color-surface: #ffffff;
  --zm-color-surface-raised: #ffffff;
  --zm-color-text: #191f28;
  --zm-color-text-strong: #0d1117;
  --zm-color-text-subtle: #4e5968;
  --zm-color-text-muted: #8b95a1;
  --zm-color-text-disabled: #b0b8c1;
  --zm-color-text-on-primary: #ffffff;
  --zm-color-text-danger: #f04452;
  --zm-color-border: #e5e8eb;
  --zm-color-border-strong: #d1d6db;
  --zm-color-border-subtle: #eef0f2;
  --zm-color-border-focus: #3182f6;
  --zm-color-border-danger: #f04452;
  --zm-font-family-base: "Pretendard", -apple-system, BlinkMacSystemFont, "Apple SD Gothic Neo", "Helvetica Neue", "Segoe UI", "Roboto", "Noto Sans", sans-serif;
  --zm-font-family-mono: ui-monospace, "SF Mono", Menlo, Consolas, "Liberation Mono", monospace;
  --zm-font-size-xs: 12px;
  --zm-font-size-sm: 14px;
  --zm-font-size-md: 16px;
  --zm-font-size-lg: 18px;
  --zm-font-size-xl: 20px;
  --zm-font-size-2xl: 24px;
  --zm-font-size-3xl: 30px;
  --zm-font-size-4xl: 36px;
  --zm-font-weight-regular: 400;
  --zm-font-weight-medium: 500;
  --zm-font-weight-semibold: 600;
  --zm-font-weight-bold: 700;
  --zm-line-height-tight: 1.2;
  --zm-line-height-snug: 1.35;
  --zm-line-height-normal: 1.5;
  --zm-line-height-relaxed: 1.7;
  --zm-letter-spacing-tight: -0.02em;
  --zm-letter-spacing-normal: -0.01em;
  --zm-letter-spacing-wide: 0;
  --zm-spacing-0: 0;
  --zm-spacing-1: 4px;
  --zm-spacing-2: 8px;
  --zm-spacing-3: 12px;
  --zm-spacing-4: 16px;
  --zm-spacing-5: 20px;
  --zm-spacing-6: 24px;
  --zm-spacing-7: 32px;
  --zm-spacing-8: 40px;
  --zm-spacing-9: 48px;
  --zm-spacing-10: 64px;
  --zm-radius-none: 0;
  --zm-radius-sm: 6px;
  --zm-radius-md: 10px;
  --zm-radius-lg: 14px;
  --zm-radius-xl: 20px;
  --zm-radius-pill: 999px;
  --zm-shadow-xs: 0 1px 2px rgba(20, 27, 38, 0.04);
  --zm-shadow-sm: 0 1px 3px rgba(20, 27, 38, 0.06), 0 1px 2px rgba(20, 27, 38, 0.04);
  --zm-shadow-md: 0 4px 12px rgba(20, 27, 38, 0.08);
  --zm-shadow-lg: 0 10px 24px rgba(20, 27, 38, 0.1);
  --zm-shadow-xl: 0 20px 40px rgba(20, 27, 38, 0.14);
  --zm-shadow-focus-ring: 0 0 0 3px rgba(49, 130, 246, 0.32);
  --zm-shadow-focus-ring-danger: 0 0 0 3px rgba(240, 68, 82, 0.28);
  --zm-z-base: 0;
  --zm-z-raised: 10;
  --zm-z-dropdown: 1000;
  --zm-z-sticky: 1100;
  --zm-z-overlay: 1200;
  --zm-z-modal: 1300;
  --zm-z-popover: 1400;
  --zm-z-toast: 1500;
  --zm-z-tooltip: 1600;
  --zm-duration-instant: 0ms;
  --zm-duration-fast: 120ms;
  --zm-duration-base: 180ms;
  --zm-duration-slow: 260ms;
  --zm-duration-slower: 400ms;
  --zm-easing-standard: cubic-bezier(0.2, 0, 0, 1);
  --zm-easing-emphasized: cubic-bezier(0.2, 0, 0, 1.2);
  --zm-easing-decelerated: cubic-bezier(0, 0, 0, 1);
  --zm-easing-accelerated: cubic-bezier(0.3, 0, 1, 1);
  --zm-control-height-sm: 36px;
  --zm-control-height-md: 44px;
  --zm-control-height-lg: 56px;
  --zm-focus-ring: var(--zm-shadow-focus-ring);
}
@media(prefers-reduced-motion:reduce){:root{
  --zm-duration-fast:0ms;--zm-duration-base:0ms;
  --zm-duration-slow:0ms;--zm-duration-slower:0ms;
}}

*,*::before,*::after{box-sizing:border-box;margin:0;padding:0;}
body{
  font-family:var(--zm-font-family-base);
  background:var(--zm-color-background-subtle);
  color:var(--zm-color-text);
  -webkit-font-smoothing:antialiased;
  height:100vh;overflow:hidden;
}
.app-layout{display:flex;height:100vh;}
.panel-left{
  width:260px;flex-shrink:0;
  background:var(--zm-color-background);
  border-right:1px solid var(--zm-color-border);
  display:flex;flex-direction:column;gap:20px;
  padding:28px 20px;overflow-y:auto;
}
.panel-right{
  flex:1;overflow-y:auto;padding:32px 28px;
  display:flex;flex-direction:column;align-items:flex-start;
}
.panel-inner{width:100%;max-width:500px;display:flex;flex-direction:column;gap:28px;}
.app-logo{display:flex;align-items:center;gap:10px;}
.app-logo-icon{
  width:34px;height:34px;background:var(--zm-color-primary);
  border-radius:var(--zm-radius-md);
  display:flex;align-items:center;justify-content:center;
  color:#fff;font-size:13px;font-weight:var(--zm-font-weight-bold);
  letter-spacing:-.03em;flex-shrink:0;
}
.app-logo-name{
  font-size:var(--zm-font-size-lg);font-weight:var(--zm-font-weight-bold);
  color:var(--zm-color-text);letter-spacing:var(--zm-letter-spacing-tight);
}
.status-pill{
  display:inline-flex;align-items:center;gap:6px;
  padding:5px 11px;border-radius:var(--zm-radius-pill);
  font-size:12px;font-weight:var(--zm-font-weight-semibold);width:fit-content;
  background:var(--zm-color-background-subtle);color:var(--zm-color-text-muted);
  transition:background 120ms,color 120ms;
}
.status-pill[data-connected="true"]{background:var(--zm-color-green-50);color:var(--zm-color-green-700);}
.status-pill-dot{
  width:6px;height:6px;border-radius:50%;
  background:var(--zm-color-text-disabled);transition:background 120ms;
}
.status-pill[data-connected="true"] .status-pill-dot{background:var(--zm-color-success);}
.panel-divider{height:1px;background:var(--zm-color-border);flex-shrink:0;}
.section-label{
  font-size:11px;font-weight:var(--zm-font-weight-semibold);
  color:var(--zm-color-text-muted);text-transform:uppercase;letter-spacing:.08em;
}
.stat-list{
  display:flex;flex-direction:column;
  border:1px solid var(--zm-color-border);border-radius:var(--zm-radius-lg);overflow:hidden;
}
.stat-row{padding:10px 14px;border-bottom:1px solid var(--zm-color-border);}
.stat-row:last-child{border-bottom:none;}
.stat-label{
  font-size:11px;color:var(--zm-color-text-muted);font-weight:var(--zm-font-weight-medium);
  text-transform:uppercase;letter-spacing:.06em;margin-bottom:3px;
}
.stat-value{
  font-size:var(--zm-font-size-sm);font-weight:var(--zm-font-weight-semibold);
  color:var(--zm-color-text);overflow:hidden;text-overflow:ellipsis;white-space:nowrap;
}
.right-section{display:flex;flex-direction:column;gap:10px;}
.server-list{
  border:1px solid var(--zm-color-border);border-radius:var(--zm-radius-lg);
  overflow:hidden;background:var(--zm-color-background);
}
.server-item{
  display:flex;align-items:center;justify-content:space-between;
  padding:14px 16px;cursor:pointer;border:none;background:transparent;
  width:100%;text-align:left;border-bottom:1px solid var(--zm-color-border);
  font-family:var(--zm-font-family-base);transition:background 120ms;
}
.server-item:last-child{border-bottom:none;}
.server-item:hover:not(.server-item--selected){background:var(--zm-color-background-subtle);}
.server-item--selected{background:var(--zm-color-blue-50);}
.server-item--selected:hover{background:var(--zm-color-blue-100);}
.server-name{
  display:block;font-size:var(--zm-font-size-sm);font-weight:var(--zm-font-weight-semibold);
  color:var(--zm-color-text);margin-bottom:2px;
}
.server-endpoint{display:block;font-size:12px;color:var(--zm-color-text-muted);}
.server-load{
  font-size:12px;font-weight:var(--zm-font-weight-medium);
  color:var(--zm-color-text-subtle);white-space:nowrap;flex-shrink:0;margin-left:12px;
}
.server-empty{
  padding:24px 16px;text-align:center;
  font-size:var(--zm-font-size-sm);color:var(--zm-color-text-muted);
}
.input-stack{display:flex;flex-direction:column;gap:12px;}
.input-group{display:flex;flex-direction:column;gap:5px;}
.input-label{font-size:12px;font-weight:var(--zm-font-weight-semibold);color:var(--zm-color-text-subtle);}
.input-field{
  width:100%;height:var(--zm-control-height-md);padding:0 14px;
  border:1px solid var(--zm-color-border);border-radius:var(--zm-radius-md);
  background:var(--zm-color-background);color:var(--zm-color-text);
  font-family:var(--zm-font-family-base);font-size:var(--zm-font-size-sm);outline:none;
  transition:border-color 120ms,box-shadow 120ms;
}
.input-field:focus{border-color:var(--zm-color-border-focus);box-shadow:var(--zm-shadow-focus-ring);}
.input-field::placeholder{color:var(--zm-color-text-disabled);}
.action-stack{display:grid;gap:8px;}
.btn{
  display:block;width:100%;height:var(--zm-control-height-lg);
  padding:0 var(--zm-spacing-5);border:none;border-radius:var(--zm-radius-md);
  font-family:var(--zm-font-family-base);font-size:var(--zm-font-size-md);
  font-weight:var(--zm-font-weight-semibold);cursor:pointer;letter-spacing:-.01em;
  transition:background 120ms;
}
.btn:disabled{opacity:.45;cursor:default;}
.btn--primary{background:var(--zm-color-primary);color:#fff;}
.btn--primary:hover:not(:disabled){background:var(--zm-color-primary-hover);}
.btn--secondary{background:var(--zm-color-background-subtle);color:var(--zm-color-text);}
.btn--secondary:hover:not(:disabled){background:var(--zm-color-background-muted);}
.btn--danger{background:var(--zm-color-danger);color:#fff;}
.btn--danger:hover:not(:disabled){background:var(--zm-color-danger-hover);}
.error-text{
  font-size:var(--zm-font-size-sm);color:var(--zm-color-danger);
  min-height:20px;line-height:var(--zm-line-height-normal);
}
`;

export function injectStyles(): void {
  if (document.getElementById("gsm-vpn-styles")) return;
  const style = document.createElement("style");
  style.id = "gsm-vpn-styles";
  style.textContent = styles;
  document.head.append(style);
}
