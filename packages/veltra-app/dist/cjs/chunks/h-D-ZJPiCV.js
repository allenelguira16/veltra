'use strict';

const SVG_TAGS = /* @__PURE__ */ new Set([
  "a",
  "animate",
  "animateMotion",
  "animateTransform",
  "circle",
  "clipPath",
  "defs",
  "desc",
  "discard",
  "ellipse",
  "feBlend",
  "feColorMatrix",
  "feComponentTransfer",
  "feComposite",
  "feConvolveMatrix",
  "feDiffuseLighting",
  "feDisplacementMap",
  "feDistantLight",
  "feDropShadow",
  "feFlood",
  "feFuncA",
  "feFuncB",
  "feFuncG",
  "feFuncR",
  "feGaussianBlur",
  "feImage",
  "feMerge",
  "feMergeNode",
  "feMorphology",
  "feOffset",
  "fePointLight",
  "feSpecularLighting",
  "feSpotLight",
  "feTile",
  "feTurbulence",
  "filter",
  "foreignObject",
  "g",
  "hatch",
  "hatchpath",
  "image",
  "line",
  "linearGradient",
  "marker",
  "mask",
  "mesh",
  "meshgradient",
  "meshpatch",
  "meshrow",
  "metadata",
  "mpath",
  "path",
  "pattern",
  "polygon",
  "polyline",
  "radialGradient",
  "rect",
  "script",
  "set",
  "solidcolor",
  "stop",
  "style",
  "svg",
  "switch",
  "symbol",
  "text",
  "textPath",
  "title",
  "tref",
  "tspan",
  "unknown",
  "use",
  "view"
]);
const MATH_ML_TAGS = /* @__PURE__ */ new Set([
  "math",
  "maction",
  "maligngroup",
  "malignmark",
  "menclose",
  "merror",
  "mfenced",
  "mfrac",
  "mglyph",
  "mi",
  "mlabeledtr",
  "mmultiscripts",
  "mn",
  "mo",
  "mover",
  "mpadded",
  "mphantom",
  "mroot",
  "mrow",
  "ms",
  "mscarries",
  "mscarry",
  "msgroup",
  "mstack",
  "mstyle",
  "msub",
  "msubsup",
  "msup",
  "mtable",
  "mtd",
  "mtext",
  "mtr",
  "munder",
  "munderover",
  "semantics",
  "annotation",
  "annotation-xml"
]);

const UNIT_LESS_PROPS = [
  "animationIterationCount",
  "borderImageOutset",
  "borderImageSlice",
  "borderImageWidth",
  "boxFlex",
  "boxFlexGroup",
  "boxOrdinalGroup",
  "columnCount",
  "flex",
  "flexGrow",
  "flexPositive",
  "flexShrink",
  "flexNegative",
  "flexOrder",
  "gridRow",
  "gridColumn",
  "fontWeight",
  "lineClamp",
  "lineHeight",
  "opacity",
  "order",
  "orphans",
  "tabSize",
  "widows",
  "zIndex",
  "zoom",
  "fillOpacity",
  "floodOpacity",
  "stopOpacity",
  "strokeDasharray",
  "strokeDashoffset",
  "strokeMiterlimit",
  "strokeOpacity",
  "strokeWidth"
];

const IS_SSR = typeof document === "undefined";

function applyProps$1(props) {
  const transformedProps = [];
  for (const key in props) {
    if (key.startsWith("on") && typeof props[key] === "function") {
      continue;
    }
    const value = typeof props[key] === "function" ? props[key]() : props[key];
    if (key === "ref") {
      continue;
    }
    if (key === "style") {
      continue;
    }
    if (typeof value === "boolean") {
      if (value) transformedProps.push(key);
      continue;
    }
    transformedProps.push(`${key}="${value}"`);
  }
  return transformedProps.join(" ");
}

const isNil = (value) => {
  return value === void 0 || value === null || value === false;
};

function getNode$1(jsxElement) {
  if (jsxElement instanceof Node) {
    return jsxElement;
  }
  if (isNil(jsxElement)) {
    return void 0;
  }
  if (typeof jsxElement === "function") {
    return getNode$1(jsxElement());
  }
  if (Array.isArray(jsxElement)) {
    return jsxElement.map(getNode$1);
  }
  return document.createTextNode(String(jsxElement));
}

function memo(fn) {
  let cachedResult;
  let firstRun = true;
  return (...args) => {
    if (firstRun) {
      cachedResult = fn(...args);
      firstRun = false;
    }
    return cachedResult;
  };
}

const stateMap = /* @__PURE__ */ new Map();
const createStateContext = (key) => {
  let instance;
  if (key !== void 0) {
    if (!stateMap.has(key)) {
      stateMap.set(key, { states: [] });
    }
    instance = stateMap.get(key);
  } else {
    instance = { states: [] };
  }
  return { ...instance, index: 0 };
};

let runtimeContext = null;
function setRuntimeContext(ctx) {
  runtimeContext = ctx;
}
function getRuntimeContext() {
  return runtimeContext;
}
const componentContext = /* @__PURE__ */ new Map();
function setComponentContext(targetNode, context) {
  componentContext.set(targetNode, context);
}
function getComponentContext(targetNode) {
  return componentContext.get(targetNode);
}

let activeEffect = null;
function setActiveEffect(newActiveEffect) {
  activeEffect = newActiveEffect;
}
let lastDisposer = null;
let currentOwner = null;
function getCurrentOwner() {
  if (!currentOwner) {
    throw new Error("Must be inside an effect");
  }
  return currentOwner;
}
const effectQueue = /* @__PURE__ */ new Set();
let isFlushing = false;
function scheduleEffect(effect2) {
  effectQueue.add(effect2);
  if (!isFlushing) {
    isFlushing = true;
    queueMicrotask(() => {
      for (const effect3 of effectQueue) {
        effect3();
      }
      effectQueue.clear();
      isFlushing = false;
    });
  }
}
function effect(fn) {
  const context = getRuntimeContext();
  const wrappedEffect = async () => {
    removeEffect(wrappedEffect);
    if (wrappedEffect.cleanup) {
      wrappedEffect.cleanup();
      wrappedEffect.cleanup = void 0;
    }
    const previousEffect = activeEffect;
    const previousOwner = currentOwner;
    activeEffect = wrappedEffect;
    currentOwner = wrappedEffect.owner;
    if (context) context.effect.push(wrappedEffect);
    try {
      const result = fn();
      if (typeof result === "function") {
        wrappedEffect.cleanup = result;
      } else if (result instanceof Promise) {
        const cleanup = await result;
        if (typeof cleanup === "function") {
          wrappedEffect.cleanup = cleanup;
        }
      }
    } finally {
      activeEffect = previousEffect;
      currentOwner = previousOwner;
    }
  };
  const disposer = () => removeEffect(wrappedEffect);
  lastDisposer = disposer;
  wrappedEffect.deps = [];
  wrappedEffect.owner = crypto.randomUUID();
  wrappedEffect();
  return disposer;
}
function stopEffect() {
  if (lastDisposer) {
    lastDisposer();
    lastDisposer = null;
  }
}
function removeEffect(effect2) {
  if (effect2.deps) {
    for (const depSet of effect2.deps) {
      depSet.delete(effect2);
    }
    effect2.deps.length = 0;
  }
  if (effect2.cleanup) {
    effect2.cleanup();
    effect2.cleanup = void 0;
  }
}

const targetToPropertyEffectsMap = /* @__PURE__ */ new WeakMap();
function track(target, key) {
  if (!activeEffect) return;
  let propertyEffectsMap = targetToPropertyEffectsMap.get(target);
  if (!propertyEffectsMap) {
    propertyEffectsMap = /* @__PURE__ */ new Map();
    targetToPropertyEffectsMap.set(target, propertyEffectsMap);
  }
  let effects = propertyEffectsMap.get(key);
  if (!effects) {
    effects = /* @__PURE__ */ new Set();
    propertyEffectsMap.set(key, effects);
  }
  if (!effects.has(activeEffect)) {
    effects.add(activeEffect);
    if (activeEffect.deps) {
      activeEffect.deps.push(effects);
    } else {
      activeEffect.deps = [effects];
    }
  }
}
function trigger(target, key) {
  const propertyEffectsMap = targetToPropertyEffectsMap.get(target);
  if (!propertyEffectsMap) return;
  const effects = propertyEffectsMap.get(key);
  if (!effects) return;
  for (const effect of effects) {
    scheduleEffect(effect);
  }
}

function state(initialValue) {
  const context = getRuntimeContext();
  if (context && context.state) {
    const { states, index } = context.state;
    if (states.length <= index) {
      const s = createState(initialValue);
      states.push(s);
    }
    return states[context.state.index++];
  }
  return createState(initialValue);
}
function createState(initialValue) {
  const state2 = { value: initialValue };
  return new Proxy(state2, {
    get(target, key, receiver) {
      track(target, key);
      return Reflect.get(target, key, receiver);
    },
    set(target, key, newValue, receiver) {
      const oldValue = target[key];
      const result = Reflect.set(target, key, newValue, receiver);
      if (oldValue !== newValue) {
        trigger(target, key);
      }
      return result;
    }
  });
}

function untrack(fn) {
  const prevEffect = activeEffect;
  setActiveEffect(null);
  try {
    return fn();
  } finally {
    setActiveEffect(prevEffect);
  }
}

function createTargetNode(name) {
  let targetNode;
  if (process.env.NODE_ENV === "development") {
    targetNode = document.createComment(name);
  } else {
    targetNode = document.createTextNode("");
  }
  componentRootNodes.add(targetNode);
  return targetNode;
}

const toArray = (item) => {
  return (Array.isArray(item) ? item : [item]).flat(Infinity);
};

function renderChildren$1(children) {
  const transformedChildren = [];
  for (const child of toArray(getNode(children)).flat()) {
    if (child) transformedChildren.push(child);
  }
  return transformedChildren.join("");
}
function getNode(jsxElement) {
  if (typeof jsxElement === "string") {
    return jsxElement;
  }
  if (isNil(jsxElement)) {
    return void 0;
  }
  if (jsxElement instanceof Function) {
    return getNode(jsxElement());
  }
  if (Array.isArray(jsxElement)) {
    return jsxElement.map(getNode).flat();
  }
  return String(jsxElement);
}

function h$1(type, props, children) {
  if (typeof type === "function") {
    for (const key in props) {
      props[key] = props[key] instanceof Function ? props[key]() : props[key];
    }
    return type({ ...props, children });
  }
  return `<${type} ${applyProps$1(props)}>${renderChildren$1(children)}</${type}>`;
}

const jsx = (type, { children = [], ...props }, key) => {
  if (IS_SSR) {
    return h$1(type, props, toArray(children));
  }
  return h(type, props, children, key);
};

const cleanupMap = /* @__PURE__ */ new Map();
function setComponentCleanup(node, cleanups) {
  cleanupMap.set(node, cleanups);
}
function runComponentCleanup(node) {
  const cleanups = cleanupMap.get(node);
  if (cleanups) {
    for (const cleanup of cleanups) {
      cleanup();
    }
    cleanupMap.delete(node);
  }
  for (const child of node.childNodes) {
    runComponentCleanup(child);
  }
}

function onDestroy(fn) {
  const context = getRuntimeContext();
  if (context && context.destroy) {
    context.destroy.push(fn);
  } else {
    throw new Error("onDestroy called outside of component");
  }
}

function onMount(fn) {
  const context = getRuntimeContext();
  if (context && context.mount) {
    context.mount.push(fn);
  } else {
    throw new Error("onMount called outside of component");
  }
}

function runLifecycle(targetNode) {
  const context = getComponentContext(targetNode);
  if (!context) return;
  const cleanups = [];
  setComponentCleanup(targetNode, cleanups);
  queueMicrotask(async () => {
    for (const mountFn of context.mount) {
      const mountCleanup = await mountFn();
      if (mountCleanup) cleanups.push(mountCleanup);
    }
    for (const destroyFn of context.destroy) {
      cleanups.push(destroyFn);
    }
    for (const effectFn of context.effect) {
      cleanups.push(() => Promise.resolve(removeEffect(effectFn)));
    }
  });
}

const eventRegistry = /* @__PURE__ */ new WeakMap();
function addEventListener(element, type, listener) {
  let handlers = eventRegistry.get(element);
  if (!handlers) {
    handlers = /* @__PURE__ */ new Map();
    eventRegistry.set(element, handlers);
  }
  if (handlers.has(type)) {
    element.removeEventListener(type, handlers.get(type));
  }
  element.addEventListener(type, listener);
  handlers.set(type, listener);
}
function removeEventListener(element, type) {
  const handlers = eventRegistry.get(element);
  if (!handlers) return;
  const listener = handlers.get(type);
  if (listener) {
    element.removeEventListener(type, listener);
    handlers.delete(type);
  }
  if (handlers.size === 0) {
    eventRegistry.delete(element);
  }
}

function applyProps(element, props) {
  for (const key in props) {
    effect(() => {
      const raw = props[key];
      const value = typeof raw === "function" && key !== "ref" ? raw() : raw;
      if (key.startsWith("on") && typeof value === "function") {
        const type = key.slice(2).toLowerCase();
        addEventListener(element, type, value);
        return () => removeEventListener(element, type);
      }
      const isFormControl = element instanceof HTMLInputElement || element instanceof HTMLTextAreaElement || element instanceof HTMLSelectElement;
      if (key === "value" && isFormControl && typeof props["onInput"] !== "function" && typeof props["onChange"] !== "function") {
        element.value = value;
        const revert = () => {
          if (element.value !== value) {
            element.value = value;
          }
        };
        element.setAttribute(key, value);
        element.addEventListener("input", revert);
        return () => element.removeEventListener("input", revert);
      }
      if (key === "ref" && typeof value === "function") {
        value(element);
        return;
      }
      if (key === "style") {
        applyStyle(element, value);
        return;
      }
      if (typeof value === "boolean") {
        element.toggleAttribute(key, value);
        return;
      }
      if (key === "html" && typeof value === "string") {
        element.innerHTML = value;
        return;
      }
      element.setAttribute(key, value);
    });
  }
}
function applyStyle(element, style) {
  if (!(element instanceof HTMLElement)) return;
  for (const [key, value] of Object.entries(style)) {
    const cssKey = key;
    if (cssKey === "length" || cssKey === "parentRule") continue;
    const isNumber = typeof value === "number";
    const needsUnit = isNumber && !isUnitLessCSSProperty(key);
    const finalValue = needsUnit ? `${value}px` : String(value);
    element.style.setProperty(String(cssKey), finalValue);
  }
}
function isUnitLessCSSProperty(prop) {
  const unitLessProps = new Set(UNIT_LESS_PROPS);
  return unitLessProps.has(prop);
}

function Fragment({ children }) {
  return children;
}

function patch(parentNode, oldNodes, newNodes, insertBeforeNode) {
  const maxLength = Math.max(oldNodes.length, newNodes.length);
  for (let i = 0; i < maxLength; i++) {
    const oldNode = oldNodes[i];
    const newNode = newNodes[i];
    if (isNil(oldNode) && !isNil(newNode)) {
      parentNode.insertBefore(newNode, null);
      runLifecycle(newNode);
      oldNodes[i] = newNode;
      continue;
    }
    if (!isNil(oldNode) && isNil(newNode)) {
      runComponentCleanup(oldNode);
      parentNode.removeChild(oldNode);
      oldNodes[i] = newNode;
      continue;
    }
    if (isNil(oldNode) && isNil(newNode)) {
      oldNodes[i] = newNode;
      continue;
    }
    if (oldNode && newNode) {
      runComponentCleanup(oldNode);
      runLifecycle(newNode);
      oldNode.replaceWith(newNode);
      oldNodes[i] = newNode;
      continue;
    }
    console.warn(`[veltra]: warning - unknown dom detected: `, {
      old: oldNode,
      new: newNode
    });
  }
  return [...oldNodes];
}

function renderChildren(parentNode, rawChildren, baseAnchor) {
  const cleanups = {
    disposer: [],
    oldNodes: []
  };
  const children = toArray(rawChildren instanceof Function ? rawChildren() : rawChildren);
  for (let i = 0; i < children.length; i++) {
    const child = children[i];
    const handler = getSuspenseHandler();
    const run = () => {
      let oldNodes = [];
      let newNodes = [];
      const disposer = effect(() => {
        try {
          newNodes = toArray(getNode$1(child));
        } catch (error) {
          if (error instanceof Promise) {
            if (handler) {
              handler(error);
            } else {
              queueMicrotask(() => disposer());
              error.then(() => run());
            }
          } else {
            throw error;
          }
        }
        oldNodes = patch(parentNode, oldNodes, newNodes);
        cleanups.oldNodes.push(() => {
          patch(parentNode, oldNodes, []);
        });
      });
      cleanups.disposer.push(() => {
        disposer();
      });
    };
    run();
  }
  return () => {
    cleanups.disposer.forEach((cleanup) => cleanup());
    cleanups.oldNodes.forEach((cleanup) => cleanup());
  };
}

function removeEntryNodes(parentNode, entry) {
  for (const node of entry.nodes) {
    if (parentNode.contains(node)) {
      runComponentCleanup(node);
      parentNode.removeChild(node);
    }
  }
}
function insertNodes(parentNode, nodes, referenceNode) {
  for (const node of nodes) {
    parentNode.insertBefore(node, referenceNode);
  }
}
function reorderEntries(rootNode, parentNode, entries, items) {
  const placeCounts = /* @__PURE__ */ new Map();
  let ref = rootNode.nextSibling;
  for (let i = 0; i < items.length; i++) {
    const item = items[i];
    placeCounts.set(item, (placeCounts.get(item) || 0) + 1);
    let count = 0;
    const entry = entries.find((e) => e.item === item && ++count === placeCounts.get(item));
    if (!entry) continue;
    untrack(() => entry.index.value = i);
    insertNodes(parentNode, entry.nodes, ref);
    ref = entry.nodes[entry.nodes.length - 1].nextSibling;
  }
}
function countOccurrences(list) {
  const counts = /* @__PURE__ */ new Map();
  for (const item of list) counts.set(item, (counts.get(item) || 0) + 1);
  return counts;
}
function removeOldNodes(parentNode, items, entries) {
  const newCounts = countOccurrences(items);
  const oldCounts = countOccurrences(entries.map((e) => e.item));
  return entries.filter((entry) => {
    if ((oldCounts.get(entry.item) ?? 0) > (newCounts.get(entry.item) ?? 0)) {
      removeEntryNodes(parentNode, entry);
      oldCounts.set(entry.item, (oldCounts.get(entry.item) ?? 0) - 1);
      return false;
    }
    return true;
  });
}
function newEntries(items, entries, children) {
  const addedEntries = [];
  const seenCounts = /* @__PURE__ */ new Map();
  for (const item of items) {
    seenCounts.set(item, (seenCounts.get(item) || 0) + 1);
    const exists = entries.filter((e) => e.item === item).length + addedEntries.filter((e) => e.item === item).length;
    if (exists < (seenCounts.get(item) || 0)) {
      const indexState = state(-1);
      const nodes = toArray(children(item, indexState));
      addedEntries.push({
        item,
        nodes,
        index: indexState
      });
    }
  }
  return addedEntries;
}

function loop(items) {
  const handler = getSuspenseHandler();
  return {
    each: (children) => {
      const each = items;
      children = children;
      const component = jsx(Loop, { each, children, handler });
      return component;
    }
  };
}
function Loop({
  children,
  each,
  handler
}) {
  const rootNode = createTargetNode("Loop");
  componentRootNodes.add(rootNode);
  let entries = [];
  function reconcile(parentNode, items) {
    entries = removeOldNodes(parentNode, items, entries);
    entries.push(...newEntries(items, entries, children));
    reorderEntries(rootNode, parentNode, entries, items);
  }
  const render = () => {
    effect(() => {
      try {
        const parentNode = rootNode.parentNode;
        if (!parentNode) return;
        const list = each();
        if (!list) return;
        reconcile(parentNode, [...list]);
      } catch (error) {
        if (error instanceof Promise) {
          if (handler) {
            handler(error);
          }
        } else {
          throw error;
        }
      }
    });
  };
  onMount(() => {
    render();
  });
  onDestroy(() => {
    for (const entry of entries) {
      removeEntryNodes(rootNode.parentNode, entry);
    }
  });
  return rootNode;
}

const IGNORE_COMPONENT = [Suspense, Loop];
function resolveComponentProps(type, props) {
  if (IGNORE_COMPONENT.includes(type)) return;
  for (const key in props) {
    props[key] = props[key] instanceof Function ? props[key]() : props[key];
  }
}

const componentRootNodes = /* @__PURE__ */ new Set();
const COMPONENTS = [Suspense, Loop];
function mountComponent(type, { key: _key, ...props }, children) {
  resolveComponentProps(type, props);
  const key = _key ? _key() + getCurrentOwner() : void 0;
  const context = {
    mount: [],
    state: createStateContext(key),
    effect: [],
    destroy: []
  };
  setRuntimeContext(context);
  const node = toArray(untrack(() => type({ ...props, children })));
  if (componentRootNodes.has(node[0]) && COMPONENTS.includes(type)) {
    setRuntimeContext(null);
    setComponentContext(node[0], context);
    return node;
  }
  const targetNode = createTargetNode(type.name);
  setRuntimeContext(null);
  setComponentContext(targetNode, context);
  return [targetNode, ...node];
}

const suspenseHandlerStack = [];
function Suspense(props) {
  const { fallback: _fallback, children: _children } = props;
  let parentNode;
  const rootNode = createTargetNode("Suspense");
  componentRootNodes.add(rootNode);
  const children = memo(() => _children());
  const fallback = () => _fallback?.();
  const cleanups = [];
  const handler = (promise) => {
    queueMicrotask(() => {
      cleanups.forEach((cleanup) => cleanup());
      if (fallback) withSuspenseRender(fallback);
    });
    promise.then(() => {
      cleanups.forEach((cleanup) => cleanup());
      withSuspenseRender(children);
    });
  };
  const withSuspenseRender = (items) => {
    if (!parentNode) return;
    suspenseHandlerStack.push(handler);
    cleanups.push(renderChildren(parentNode, toArray(items)));
    suspenseHandlerStack.pop();
  };
  onMount(() => {
    if (!rootNode.parentNode) return;
    parentNode = rootNode.parentNode;
    withSuspenseRender(children);
  });
  return rootNode;
}
function getSuspenseHandler() {
  return suspenseHandlerStack[suspenseHandlerStack.length - 1];
}

function h(type, props, children, key) {
  if (type === Fragment) {
    return children;
  }
  if (typeof type === "function") {
    return mountComponent(type, { key, ...props }, children);
  }
  const currentXmlns = xmlnsStack[xmlnsStack.length - 1];
  const xmlns = props.xmlns?.() ?? currentXmlns;
  xmlnsStack.push(xmlns);
  const element = createElement(type, xmlns);
  applyProps(element, props);
  renderChildren(element, children);
  xmlnsStack.pop();
  return element;
}
const xmlnsStack = [];
function createElement(tag, namespace) {
  if ((SVG_TAGS.has(tag) || MATH_ML_TAGS.has(tag)) && namespace) {
    return document.createElementNS(namespace, tag);
  }
  return document.createElement(tag);
}

exports.Fragment = Fragment;
exports.Suspense = Suspense;
exports.componentRootNodes = componentRootNodes;
exports.effect = effect;
exports.getNode = getNode$1;
exports.jsx = jsx;
exports.loop = loop;
exports.memo = memo;
exports.mountComponent = mountComponent;
exports.onDestroy = onDestroy;
exports.onMount = onMount;
exports.renderChildren = renderChildren;
exports.state = state;
exports.stopEffect = stopEffect;
exports.track = track;
exports.trigger = trigger;
exports.untrack = untrack;
//# sourceMappingURL=h-D-ZJPiCV.js.map
