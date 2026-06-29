export function createElement<K extends keyof HTMLElementTagNameMap>(
  tagName: K,
  options: {
    className?: string;
    textContent?: string;
    attributes?: Record<string, string>;
  } = {},
): HTMLElementTagNameMap[K] {
  const element = document.createElement(tagName);
  if (options.className) element.className = options.className;
  if (options.textContent !== undefined) element.textContent = options.textContent;
  for (const [key, value] of Object.entries(options.attributes ?? {})) {
    element.setAttribute(key, value);
  }
  return element;
}
