export function createRoot($root: HTMLElement, app: JSX.Element) {
  if (typeof app === "function") {
    const result = app(); // run component now — ensures placeholder gets created
    createRoot($root, result);
  } else if (app instanceof HTMLElement || app instanceof Text) {
    $root.appendChild(app);
  } else if (Array.isArray(app)) {
    app.forEach((child) => createRoot($root, child));
  }
}
