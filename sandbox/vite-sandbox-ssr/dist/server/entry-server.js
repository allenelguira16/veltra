const stateMap = /* @__PURE__ */ new Map();
const createStateContext = (key) => {
  let instance;
  if (key !== void 0) {
    if (!stateMap.has(key)) {
      stateMap.set(key, {
        states: []
      });
    }
    instance = stateMap.get(key);
  } else {
    instance = {
      states: []
    };
  }
  return {
    ...instance,
    index: 0
  };
};
let runtimeContext = null;
function setRuntimeContext(ctx) {
  runtimeContext = ctx;
}
function getRuntimeContext() {
  return runtimeContext;
}
let activeEffect = null;
function setActiveEffect(newActiveEffect) {
  activeEffect = newActiveEffect;
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
    activeEffect = wrappedEffect;
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
    }
  };
  const disposer = () => removeEffect(wrappedEffect);
  wrappedEffect.deps = [];
  wrappedEffect();
  return disposer;
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
  for (const effect2 of effects) {
    scheduleEffect(effect2);
  }
}
function state(initialValue) {
  const context = getRuntimeContext();
  if (context && context.state) {
    const {
      states,
      index
    } = context.state;
    if (states.length <= index) {
      const s = createState(initialValue);
      states.push(s);
    }
    return states[context.state.index++];
  }
  return createState(initialValue);
}
function createState(initialValue) {
  const state2 = {
    value: initialValue
  };
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
function applyProps$1(element, props) {
  for (const key in props) {
    effect(() => {
      const raw = props[key];
      const value = typeof raw === "function" && key !== "ref" ? raw() : raw;
      if (key.startsWith("on") && element instanceof HTMLElement) {
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
      if (key === "style" && typeof value === "object" && element instanceof HTMLElement) {
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
function isUnitlessProp(prop) {
  return CSS.supports(prop, "0") && !CSS.supports(prop, "0px");
}
function applyStyle(element, style) {
  if (!(element instanceof HTMLElement)) return;
  for (const key in style) {
    if (!Object.hasOwn(style, key)) continue;
    const value = style[key];
    if (value == null) continue;
    if (key === "length" || key === "parentRule") continue;
    const isNumeric = typeof value === "number";
    const needsUnit = isNumeric && !isUnitlessProp(key);
    element.style[key] = isNumeric ? needsUnit ? `${value}px` : `${value}` : String(value);
  }
}
function createTargetNode(_name) {
  let targetNode;
  if (process.env.NODE_ENV === "development") {
    targetNode = document.createTextNode("");
  } else {
    targetNode = document.createTextNode("");
  }
  rootNodes.add(targetNode);
  return targetNode;
}
const isNil = (value) => {
  return value === void 0 || value === null || value === false;
};
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
const toArray = (item) => {
  return (Array.isArray(item) ? item : [item]).flat(Infinity);
};
const isServer = typeof window === "undefined";
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
function createLifeCycleContext(key) {
  const context = {
    id: crypto.randomUUID(),
    mount: [],
    state: createStateContext(key),
    effect: [],
    destroy: []
  };
  return context;
}
function onDestroy(fn) {
  if (isServer) return;
  const context = getRuntimeContext();
  if (!context) {
    throw new Error("onDestroy called outside of component");
  }
  context.destroy.push(fn);
}
function onMount(fn) {
  if (isServer) return;
  const context = getRuntimeContext();
  if (!context) {
    throw new Error("onMount called outside of component");
  }
  context.mount.push(fn);
}
function runLifecycle(rootNode, context) {
  if (!context) return;
  const cleanups = [];
  setComponentCleanup(rootNode, cleanups);
  const runMounts = async () => {
    for (const mountFn of context.mount) {
      const cleanup = await mountFn();
      if (cleanup) cleanups.push(cleanup);
    }
    for (const destroyFn of context.destroy) {
      cleanups.push(destroyFn);
    }
    for (const effectFn of context.effect) {
      cleanups.push(() => Promise.resolve(removeEffect(effectFn)));
    }
  };
  queueMicrotask(() => Promise.resolve().then(runMounts));
}
const suspenseHandlerStack = [];
const suspenseSSRHandlerStack = [];
function getSuspenseHandler() {
  return suspenseHandlerStack[suspenseHandlerStack.length - 1];
}
function getSuspenseSSRHandler() {
  return suspenseSSRHandlerStack[suspenseSSRHandlerStack.length - 1];
}
function Suspense(props) {
  const {
    fallback: _fallback,
    children: _children
  } = props;
  const children = memo(() => _children());
  const fallback = _fallback ? memo(() => _fallback()) : void 0;
  if (isServer) return fallback == null ? void 0 : fallback();
  const view = state(() => fallback == null ? void 0 : fallback());
  const ssrHandler = () => {
    suspenseSSRHandlerStack.pop();
    return fallback == null ? void 0 : fallback();
  };
  const handler = (promise) => {
    suspenseHandlerStack.pop();
    queueMicrotask(() => {
      if (fallback) view.value = fallback;
    });
    promise.then(() => {
      withSuspenseRender(children);
    });
  };
  const withSuspenseRender = (newView) => {
    if (isServer) suspenseSSRHandlerStack.push(ssrHandler);
    else suspenseHandlerStack.push(handler);
    try {
      view.value = newView;
    } catch (error) {
      if (error instanceof Promise) {
        if (!isServer) handler(error);
        else view.value = () => {
          throw error;
        };
      } else {
        throw error;
      }
    }
  };
  function onDoneHydration(fn) {
    if (!ssrDom().isHydrating) {
      fn();
      return;
    }
    requestAnimationFrame(() => onDoneHydration(fn));
  }
  try {
    return () => {
      return view.value();
    };
  } finally {
    onDoneHydration(() => {
      withSuspenseRender(children);
    });
  }
}
function Fragment({
  children
}) {
  return children;
}
const jsx$1 = (type, {
  children,
  ...props
} = {}, key) => {
  return h$1(type, props, children, key);
};
function loop(items) {
  return {
    each(children) {
      const each = items;
      children = children;
      if (isServer) {
        const renderedItems = each().map((item, i2) => children(item, {
          value: i2
        }));
        return renderedItems;
      }
      return jsx$1(Loop, {
        each,
        children
      });
    }
  };
}
function Loop({
  each,
  children
}) {
  const handler = getSuspenseHandler();
  const result = state([]);
  const listFn = mapArray(each, children);
  effect(() => {
    try {
      result.value = listFn();
    } catch (err) {
      if (err instanceof Promise && handler) {
        handler(err);
      } else {
        throw err;
      }
    }
  });
  return () => result.value;
}
function mapArray(list, mapFn) {
  let items = [];
  return () => {
    var _a, _b;
    const arr = list() || [];
    const len = arr.length;
    const newItems = new Array(len);
    const oldIndexMap = /* @__PURE__ */ new Map();
    for (let i2 = 0; i2 < items.length; i2++) {
      const key = items[i2].value;
      if (!oldIndexMap.has(key)) oldIndexMap.set(key, []);
      oldIndexMap.get(key).push(i2);
    }
    const newToOld = new Array(len).fill(-1);
    for (let i2 = 0; i2 < len; i2++) {
      const value = arr[i2];
      const oldIndices = oldIndexMap.get(value);
      if (oldIndices && oldIndices.length) {
        const oldIndex = oldIndices.shift();
        newToOld[i2] = oldIndex;
        newItems[i2] = items[oldIndex];
      } else {
        const idxState = state(i2);
        const element = mapFn(value, idxState);
        newItems[i2] = {
          value,
          index: idxState,
          element
        };
      }
    }
    for (let i2 = 0; i2 < items.length; i2++) {
      if (!newToOld.includes(i2)) {
        const el = items[i2].element;
        (_a = el.parentNode) == null ? void 0 : _a.removeChild(el);
      }
    }
    const seq = longestIncreasingSubsequence(newToOld);
    let seqIdx = seq.length - 1;
    for (let i2 = len - 1; i2 >= 0; i2--) {
      const item = newItems[i2];
      if (newToOld[i2] === -1 || i2 !== seq[seqIdx]) {
        const anchor = i2 + 1 < len ? newItems[i2 + 1].element : null;
        (_b = item.element.parentNode) == null ? void 0 : _b.insertBefore(item.element, anchor);
      } else {
        seqIdx--;
      }
      item.index.value = i2;
    }
    items = newItems;
    return items.map((it) => it.element);
  };
}
function longestIncreasingSubsequence(arr) {
  const p2 = arr.slice();
  const result = [];
  let u, v;
  for (let i2 = 0; i2 < arr.length; i2++) {
    const n = arr[i2];
    if (n < 0) continue;
    if (result.length === 0 || arr[result[result.length - 1]] < n) {
      p2[i2] = result.length > 0 ? result[result.length - 1] : -1;
      result.push(i2);
      continue;
    }
    u = 0;
    v = result.length - 1;
    while (u < v) {
      const c2 = (u + v) / 2 | 0;
      if (arr[result[c2]] < n) u = c2 + 1;
      else v = c2;
    }
    if (n < arr[result[u]]) {
      if (u > 0) p2[i2] = result[u - 1];
      result[u] = i2;
    }
  }
  u = result.length;
  v = result[u - 1];
  while (u-- > 0) {
    result[u] = v;
    v = p2[v];
  }
  return result;
}
function Portal({
  children,
  target
}) {
  let cleanup;
  onMount(() => {
    const mount = (target instanceof Function ? target() : target) ?? document.body;
    cleanup = renderChildren(mount, children);
  });
  onDestroy(() => {
    cleanup();
  });
  return null;
}
function getNode$1(jsxElement) {
  if (jsxElement instanceof Node) {
    return jsxElement;
  }
  if (typeof jsxElement === "string" || typeof jsxElement === "number") {
    const {
      currentNode,
      next
    } = ssrDom();
    if (currentNode) {
      next();
      return currentNode;
    }
    return document.createTextNode(String(jsxElement));
  }
  throw new Error(`Unknown value: ${jsxElement}`);
}
function renderChildren(parentNode, children) {
  const cleanups = [];
  function renderRecursive(value, parentAnchor) {
    let nodes = [];
    let disposers = [];
    const cleanup = () => {
      for (const node of nodes) {
        runComponentCleanup(node);
        if (node.parentNode === parentNode) {
          parentNode.removeChild(node);
        }
      }
      for (const dispose2 of disposers) dispose2();
      nodes = [];
      disposers = [];
    };
    const handler = getSuspenseHandler();
    const disposer = effect(() => {
      try {
        cleanup();
        const resolvedChildren = value instanceof Function ? value() : value;
        const children2 = toArray(resolvedChildren);
        for (const child of children2) {
          if (isNil(child)) continue;
          if (typeof child === "function") {
            const anchor = document.createTextNode("");
            parentNode.insertBefore(anchor, parentAnchor);
            const childDisposer = renderRecursive(child, anchor);
            disposers.push(childDisposer);
            nodes.push(anchor);
          } else {
            const node = getNode$1(child);
            parentNode.insertBefore(node, parentAnchor);
            nodes.push(node);
          }
        }
      } catch (error) {
        if (error instanceof Promise) {
          handler == null ? void 0 : handler(error);
        } else {
          throw error;
        }
      }
    });
    return () => {
      disposer();
      cleanup();
    };
  }
  const dispose = renderRecursive(children, null);
  cleanups.push(dispose);
  return () => {
    console.log("run");
    for (const c2 of cleanups) c2();
  };
}
const IGNORE_COMPONENT = [Suspense, Loop, Portal];
function resolveComponentProps(type, props) {
  if (IGNORE_COMPONENT.includes(type)) return;
  for (const key in props) {
    props[key] = props[key] instanceof Function ? props[key]() : props[key];
  }
}
const rootNodes = /* @__PURE__ */ new WeakSet();
function mountComponent(type, props = {}, children, _key) {
  resolveComponentProps(type, props);
  const key = _key ? _key().toString() + type.toString() : void 0;
  const context = createLifeCycleContext(key);
  setRuntimeContext(context);
  const rootNode = createTargetNode(type.name);
  const jsxElements = toArray([rootNode, untrack(() => type({
    ...props,
    children
  }))]).flat();
  setRuntimeContext(null);
  runLifecycle(rootNode, context);
  return jsxElements;
}
queueMicrotask(() => {
  if (!isServer) {
    const observer = new MutationObserver((mutations) => {
      for (const mutation of mutations) {
        for (const removedNodes of mutation.removedNodes) {
          runComponentCleanup(removedNodes);
        }
      }
    });
    observer.observe(document.body, {
      childList: true,
      subtree: true
    });
  }
});
let renderedNodes = [];
let currentIndex = 0;
function ssrDom() {
  return {
    renderedNodes,
    get currentNode() {
      if (isServer) return void 0;
      return renderedNodes[currentIndex];
    },
    get isHydrating() {
      return !!renderedNodes[currentIndex];
    },
    next: () => currentIndex++
  };
}
function h$1(type, props, children, key) {
  var _a;
  if (typeof type === "function") {
    return mountComponent(type, props, children, key);
  }
  if (type === "html") {
    return children;
  }
  xmlnsStack.push(((_a = props.xmlns) == null ? void 0 : _a.call(props)) ?? xmlnsStack[xmlnsStack.length - 1]);
  const element = createElement(type);
  applyProps$1(element, props);
  renderChildren(element, children);
  xmlnsStack.pop();
  return element;
}
const xmlnsStack = [];
function createElement(tag) {
  const {
    currentNode,
    next
  } = ssrDom();
  if (currentNode instanceof Element) {
    try {
      if (currentNode.tagName.toLocaleLowerCase() !== tag) {
        throw new Error("Hydration mismatch because the initial UI does not match what was rendered on the server");
      }
      return currentNode;
    } finally {
      next();
    }
  }
  const currentXmlns = xmlnsStack[xmlnsStack.length - 1];
  return currentXmlns ? document.createElementNS(currentXmlns, tag) : document.createElement(tag);
}
function applyProps(props) {
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
    if (key === "html") {
      continue;
    }
    if (typeof value === "boolean") {
      if (value) transformedProps.push(key);
      continue;
    }
    transformedProps.push(`${key}="${value}"`);
  }
  if (transformedProps.length > 0) transformedProps.unshift("");
  return transformedProps.join(" ");
}
function hasNoHTMLTags(str) {
  const htmlTagRegex = /<[^>]+>/g;
  return !htmlTagRegex.test(str);
}
function getNode(jsxElement, skipWrappingTags2 = false) {
  if (typeof jsxElement === "string" || typeof jsxElement === "number") {
    let str = String(jsxElement);
    if (hasNoHTMLTags(str) && !skipWrappingTags2) {
      str = `<!--!-->${str}<!--/-->`;
    }
    return str;
  }
  throw new Error(`Unknown value: ${jsxElement}`);
}
const skipWrappingTags = /* @__PURE__ */ new Set(["title", "meta", "script", "style"]);
function renderChildrenToString(parent, children) {
  function renderRecursive(value) {
    const transformedChildren = [];
    const resolvedChildren = value instanceof Function ? value() : value;
    const children2 = toArray(resolvedChildren);
    for (const child of children2) {
      if (isNil(child)) continue;
      if (typeof child === "function") {
        transformedChildren.push(renderRecursive(child));
      } else {
        const resolved = getNode(child, skipWrappingTags.has(parent));
        transformedChildren.push(resolved);
      }
    }
    return transformedChildren.join("");
  }
  return renderRecursive(children);
}
const voidElements = /* @__PURE__ */ new Set(["area", "base", "br", "col", "embed", "hr", "img", "input", "link", "meta", "param", "source", "track", "wbr"]);
function h(type, props, children) {
  if (typeof type === "function") {
    resolveComponentProps(type, props);
    const resolved = type({
      ...props,
      children
    });
    const handler = getSuspenseSSRHandler();
    try {
      return normalizeToString(resolved);
    } catch (error) {
      if (error instanceof Promise) {
        return (handler == null ? void 0 : handler()) || null;
      }
      throw error;
    }
  }
  if (voidElements.has(type)) {
    return `<${type}${applyProps(props)}>`;
  }
  return `<${type}${applyProps(props)}>${renderChildrenToString(type, "html" in props ? props["html"] : children)}</${type}>`;
}
function normalizeToString(value) {
  if (value == null) return "";
  if (typeof value === "function") {
    return normalizeToString(value());
  }
  if (Array.isArray(value)) {
    return value.map(normalizeToString).join("");
  }
  return getNode(value);
}
function renderToString(App) {
  return App();
}
const map = /* @__PURE__ */ new WeakMap();
function createContext() {
  const id = Symbol("context");
  function Provider(props) {
    map.set(id, props.value);
    return props.children();
  }
  function getContext() {
    const value = map.get(id);
    if (!value) {
      throw new Error("No provider found for context.");
    }
    return value;
  }
  return [Provider, getContext];
}
function computed(getter) {
  const result = state();
  effect(() => {
    result.value = getter();
  });
  return {
    get value() {
      return result.value;
    }
  };
}
const proxyMap = /* @__PURE__ */ new WeakMap();
function store(initialObject) {
  function createReactiveObject(obj) {
    if (proxyMap.has(obj)) return proxyMap.get(obj);
    const proxy = new Proxy(obj, {
      get(target, key, receiver) {
        track(target, key);
        const result = Reflect.get(target, key, receiver);
        if (typeof result === "function") {
          return result.bind(receiver);
        }
        const descriptor = Reflect.getOwnPropertyDescriptor(target, key);
        if (descriptor == null ? void 0 : descriptor.get) {
          return descriptor.get.call(receiver);
        }
        if (typeof result === "object" && result !== null) {
          return createReactiveObject(result);
        }
        return result;
      },
      set(target, key, value, receiver) {
        const oldValue = target[key];
        const result = Reflect.set(target, key, value, receiver);
        if (oldValue !== value) {
          trigger(target, key);
        }
        return result;
      }
    });
    proxyMap.set(obj, proxy);
    return proxy;
  }
  return createReactiveObject(initialObject);
}
function baseResource(fetcher) {
  let loading = true;
  let error = null;
  let data = void 0;
  let promise = null;
  let promiseStatus = "pending";
  const version = state(0);
  const refetch = async () => {
    loading = true;
    error = null;
    data = void 0;
    promiseStatus = "pending";
    promise = fetcher();
    promise.then((result) => {
      data = result;
      error = null;
      promiseStatus = "fulfilled";
      loading = false;
      untrack(() => version.value++);
    }).catch((err) => {
      data = void 0;
      error = err;
      promiseStatus = "rejected";
      loading = false;
      untrack(() => version.value++);
    });
    untrack(() => version.value++);
  };
  effect(() => {
    refetch();
  });
  return {
    get loading() {
      version.value;
      return loading;
    },
    get error() {
      return error;
    },
    get data() {
      version.value;
      if (promiseStatus === "pending") throw promise;
      if (promiseStatus === "rejected") throw error;
      return data;
    },
    refetch,
    mutate(newValue) {
      data = newValue;
      version.value++;
    }
  };
}
const resourceCache = /* @__PURE__ */ new Map();
function resource(fetcher, key) {
  if (isServer) return baseResource(fetcher);
  onDestroy(() => {
    resourceCache.delete(key);
  });
  if (resourceCache.has(key)) {
    return resourceCache.get(key);
  }
  const resourceFn = baseResource(fetcher);
  resourceCache.set(key, resourceFn);
  return resourceFn;
}
const jsx = (type, {
  children,
  ...props
}, key) => {
  if (isServer) {
    return h(type, props, children);
  }
  return h$1(type, props, children, key);
};
const p = typeof window > "u", c = store({ pathname: p ? "/" : window.location.pathname, search: p ? "" : window.location.search });
p || window.addEventListener("popstate", () => {
  c.pathname = window.location.pathname, c.search = window.location.search;
});
function j(t) {
  p ? c.pathname = t : (history.pushState(null, "", t), c.pathname = t, c.search = window.location.search);
}
function k(t, n = true) {
  const e = c.pathname.split("/").filter(Boolean), a = t.split("/").filter(Boolean);
  return n && e.length !== a.length || !n && e.length < a.length ? false : a.every((o, i2) => o.startsWith(":") || o === e[i2]);
}
function x(t, n, e = "") {
  const a = (r, u) => (r + "/" + u).replace(/\/+/g, "/"), o = t.split("/").filter(Boolean);
  for (const r of n) {
    const u = a(e, r.path), d = u.split("/").filter(Boolean), h2 = {};
    let w = true;
    for (let s = 0; s < d.length; s++) {
      const f = d[s], g = o[s];
      if (f == null ? void 0 : f.startsWith("*")) {
        const y = f.slice(1) || "wildcard";
        return h2[y] = o.slice(s).join("/"), { chain: [r], params: h2 };
      }
      if (f == null ? void 0 : f.startsWith(":")) {
        if (!g) {
          w = false;
          break;
        }
        h2[f.slice(1)] = g;
      } else if (f !== g) {
        w = false;
        break;
      }
    }
    if (w) {
      if (r.children) {
        const s = x(t, r.children, u);
        if (s) return { chain: [r, ...s.chain], params: { ...h2, ...s.params } };
      }
      if (d.length === o.length) return { chain: [r], params: h2 };
    }
  }
  const i2 = n.find((r) => r.path.startsWith("*"));
  if (i2) {
    const r = i2.path.slice(1) || "wildcard";
    return { chain: [i2], params: { [r]: o.join("/") } };
  }
}
const l = store({});
function b({ url: t, routes: n }) {
  return t && (c.pathname = t), () => {
    const e = x(c.pathname, n);
    if (e) {
      const { chain: a, params: o } = e;
      for (const i2 in l) delete l[i2];
      return Object.assign(l, o), R(a);
    }
    for (const a in l) delete l[a];
    return jsx(Fragment, {});
  };
}
const [C, L] = createContext();
function O() {
  return L()();
}
function R(t) {
  let n = () => null;
  for (let e = t.length - 1; e >= 0; e--) {
    const a = t[e];
    if (!a.component) continue;
    const o = a.component, i2 = n;
    n = () => jsx(C, { value: () => i2, children: () => jsx(o, {}) });
  }
  return n();
}
const Template = ({
  title,
  children
}) => {
  return jsx("div", {
    class: () => "p-2 w-full",
    children: () => [() => jsx("h1", {
      class: () => "font-bold text-2xl mb-2",
      children: () => title
    }), () => children()]
  });
};
const ButtonPageList = () => {
  return jsx(Template, {
    title: () => "Pages",
    children: () => jsx("ul", {
      class: () => "flex flex-col gap-2",
      children: () => [() => jsx("li", {
        children: () => jsx("button", {
          onClick: () => () => j("/"),
          disabled: () => k("/"),
          children: () => "All"
        })
      }), () => jsx("li", {
        children: () => jsx("button", {
          onClick: () => () => j("/forms"),
          disabled: () => k("/forms"),
          children: () => "Forms"
        })
      }), () => jsx("li", {
        children: () => jsx("button", {
          onClick: () => () => j("/contexts"),
          disabled: () => k("/contexts"),
          children: () => "Contexts"
        })
      }), () => jsx("li", {
        children: () => jsx("button", {
          onClick: () => () => j("/dropdown-list"),
          disabled: () => k("/dropdown-list"),
          children: () => "Dropdown Lists"
        })
      }), () => jsx("li", {
        children: () => jsx("button", {
          onClick: () => () => j("/non-async-suspense"),
          disabled: () => k("/non-async-suspense"),
          children: () => "Non Async Suspense"
        })
      }), () => jsx("li", {
        children: () => jsx("button", {
          onClick: () => () => j("/stacked-suspense"),
          disabled: () => k("/stacked-suspense"),
          children: () => "Stacked Suspense"
        })
      }), () => jsx("li", {
        children: () => jsx("button", {
          onClick: () => () => j("/pokedex-list"),
          disabled: () => k("/pokedex-list"),
          children: () => "PokeDex List"
        })
      }), () => jsx("li", {
        children: () => jsx("button", {
          onClick: () => () => j("/pokedex-list-suspense"),
          disabled: () => k("/pokedex-list-suspense"),
          children: () => "PokeDex List with Suspense"
        })
      })]
    })
  });
};
function Contexts() {
  return jsx(Template, {
    title: () => "Contexts",
    children: () => [() => jsx(Form, {
      children: () => jsx(Input$1, {})
    }), () => jsx(Form, {
      children: () => jsx(Wrapper, {
        children: () => jsx(Input$1, {})
      })
    })]
  });
}
const [FormProvider, formContext] = createContext();
function Form({
  children
}) {
  const state2 = store({
    name: "asd"
  });
  return jsx(FormProvider, {
    value: () => state2,
    children: () => children()
  });
}
function Wrapper({
  children
}) {
  return jsx(Fragment, {
    children: () => [() => jsx("div", {
      children: () => "Hi"
    }), () => " ", () => children()]
  });
}
const i = state(0);
setInterval(() => {
  i.value++;
}, 1e3);
function Input$1() {
  const forms = formContext();
  const nameEl = () => jsx("div", {
    children: () => [() => "Name: ", () => forms.name, () => " Hi"]
  });
  return jsx(Fragment, {
    children: () => [() => jsx("div", {
      children: () => [() => "Name: ", () => forms.name]
    }), () => nameEl, () => jsx("input", {
      type: () => "text",
      name: () => "name",
      onInput: () => (event) => forms.name = event.currentTarget.value,
      placeholder: () => "name",
      autoComplete: () => "off",
      value: () => forms.name
    }), " ", () => i.value]
  });
}
const name = store({
  firstName: "First name",
  lastName: "Last name"
});
const Dropdowns = () => {
  const dropdownStore = store({
    showDropdown: true,
    sortDirection: "asc",
    numbers: [1, 2, 3, 4, 5, 6, 7, 8],
    handleSort() {
      this.numbers = [...this.numbers].sort((a, b2) => {
        return this.sortDirection === "desc" ? a - b2 : b2 - a;
      });
      this.sortDirection = this.sortDirection === "asc" ? "desc" : "asc";
    },
    handleRandomize() {
      const result = [...this.numbers];
      for (let i2 = result.length - 1; i2 > 0; i2--) {
        const j2 = Math.floor(Math.random() * (i2 + 1));
        [result[i2], result[j2]] = [result[j2], result[i2]];
      }
      this.numbers = result;
    },
    addDropdown() {
      let currentNumbers = [...this.numbers];
      if (currentNumbers.length >= 8) return;
      currentNumbers = currentNumbers.sort((a, b2) => a - b2);
      if (!currentNumbers.length) {
        this.numbers = [1];
      } else {
        this.numbers = [...currentNumbers, currentNumbers[currentNumbers.length - 1] + 1];
      }
    },
    removeDropdown() {
      if (this.numbers.length > 0) {
        this.numbers = this.numbers.slice(0, -1);
      }
    }
  });
  onMount(async () => {
    console.log("Dropdowns onMount");
  });
  onDestroy(async () => {
    console.log("Dropdowns onDestroy");
  });
  return jsx(Template, {
    title: () => "Dropdown List",
    children: () => jsx("div", {
      class: () => "flex flex-col gap-4",
      children: () => [() => jsx("div", {
        children: () => jsx("div", {
          class: () => "flex gap-2 items-center",
          children: () => [() => jsx("span", {
            children: () => "Add Dropdown"
          }), () => jsx("button", {
            class: () => "btn",
            onClick: () => dropdownStore.addDropdown,
            children: () => "+"
          }), () => jsx("button", {
            class: () => "btn",
            onClick: () => dropdownStore.removeDropdown,
            children: () => "-"
          })]
        })
      }), () => jsx("div", {
        class: () => "flex gap-2 items-center",
        children: () => [() => jsx("span", {
          children: () => "Sort"
        }), () => jsx("button", {
          class: () => "btn",
          onClick: () => dropdownStore.handleSort,
          children: () => dropdownStore.sortDirection === "asc" ? "↑" : "↓"
        }), () => jsx("button", {
          class: () => "btn",
          onClick: () => dropdownStore.handleRandomize,
          children: () => "Randomize"
        })]
      }), () => jsx("div", {
        children: () => jsx("button", {
          onClick: () => () => dropdownStore.showDropdown = !dropdownStore.showDropdown,
          children: () => "Unmount Dropdown List"
        })
      }), () => dropdownStore.showDropdown && jsx(DropdownList, {
        dropdowns: () => dropdownStore
      }), () => jsx("div", {
        children: () => "Hi"
      })]
    })
  });
};
const DropdownList = ({
  dropdowns
}) => {
  console.log("rerender");
  onMount(async () => {
    console.log("DropdownList onMount");
  });
  onDestroy(async () => {
    console.log("DropdownList onDestroy");
  });
  return jsx("div", {
    class: () => "flex gap-2 flex-col lg:flex-row",
    children: () => dropdowns.numbers.map((number) => jsx(Dropdown, {
      number: () => number
    }, () => number))
  });
};
const Dropdown = ({
  number
}) => {
  const isOpen = state(false);
  const handleToggle = () => {
    isOpen.value = !isOpen.value;
  };
  return jsx(Fragment, {
    children: () => jsx("div", {
      class: () => "relative lg:w-[calc(100%/8)]",
      children: () => [() => jsx("div", {
        children: () => [() => jsx("button", {
          class: () => "btn w-full",
          onClick: () => handleToggle,
          children: () => [() => "Open Dropdown ", () => number]
        }), () => jsx("div", {
          class: () => "break-all",
          children: () => [() => "Hi ", () => name.firstName]
        })]
      }), () => isOpen.value && jsx("div", {
        class: () => "absolute bg-white border border-gray-200 rounded p-4 w-[200px] z-10",
        children: () => jsx("ul", {
          children: () => Array.from({
            length: 3
          }).map((_, i2) => i2 + 1).map((item) => jsx("li", {
            class: () => "cursor-pointer p-2 rounded hover:bg-gray-100",
            children: () => [() => "Dropdown ", () => item]
          }))
        })
      })]
    })
  });
};
const Forms = () => {
  return jsx(Template, {
    title: () => "Forms",
    children: () => jsx("div", {
      children: () => [() => jsx("div", {
        children: () => [() => jsx("label", {
          class: () => "break-all",
          for: () => "name-input2",
          children: () => [() => "Hi ", () => name.firstName]
        }), () => jsx("div", {
          children: () => jsx("input", {
            type: () => "text",
            value: () => name.firstName,
            id: () => "name-input2"
          })
        })]
      }), () => jsx("div", {
        children: () => [() => jsx(Counter, {}), () => jsx(Input, {})]
      })]
    })
  });
};
function Counter() {
  const count = state(0);
  const double = computed(() => count.value);
  const handleCount = () => {
    count.value++;
  };
  effect(() => {
  });
  effect(() => {
  });
  onDestroy(() => {
    console.log("bye");
  });
  return jsx(Fragment, {
    children: () => [() => count.value, () => jsx("div", {
      children: () => [() => "Count: ", () => count.value]
    }), () => jsx("div", {
      children: () => [() => "Double Count: ", () => double.value]
    }), () => jsx("button", {
      disabled: () => count.value >= 5,
      onClick: () => handleCount,
      children: () => "Add counter"
    }), () => jsx("div", {
      children: () => count.value <= 3 ? jsx("div", {
        children: () => "Hi"
      }) : "string"
    })]
  });
}
function Input() {
  return jsx("div", {
    children: () => [() => jsx("label", {
      class: () => "break-all",
      for: () => "name-input",
      children: () => [() => "Name ", () => name.firstName, () => " ", () => jsx("span", {
        children: () => "Hi"
      })]
    }), () => jsx("div", {
      children: () => jsx("input", {
        id: () => "name-input",
        type: () => "text",
        onInput: () => (event) => {
          name.firstName = event.currentTarget.value;
        },
        value: () => name.firstName
      })
    })]
  });
}
function NonAsyncSuspense() {
  return jsx(Template, {
    title: () => "Non-Async Suspense",
    children: () => jsx("div", {
      children: () => jsx(Suspense, {
        fallback: () => jsx("div", {
          children: () => "hi"
        }),
        children: () => jsx("div", {
          children: () => "Children"
        })
      })
    })
  });
}
const sleep = (ms) => new Promise((resolve) => {
  setTimeout(resolve, ms);
});
const PokeDex = () => {
  const pokeDex = store({
    isLoading: true,
    pokeDexList: [],
    prevLink: "",
    nextLink: "",
    sortDirection: "asc",
    async fetchData(url, controller) {
      var _a, _b;
      if (!url) return;
      this.isLoading = true;
      const response = await fetch(url, {
        signal: controller == null ? void 0 : controller.signal
      });
      const json = await response.json();
      await sleep(1e3);
      this.pokeDexList = json.results;
      this.prevLink = ((_a = json.previous) == null ? void 0 : _a.replace(/limit=\d+/, "limit=20")) ?? "";
      this.nextLink = ((_b = json.next) == null ? void 0 : _b.replace(/limit=\d+/, "limit=20")) ?? "";
      this.isLoading = false;
    },
    handleSort(key) {
      this.sortDirection = this.sortDirection === "asc" ? "desc" : "asc";
      this.pokeDexList = [...this.pokeDexList].sort((a, b2) => {
        const cmp = a[key].localeCompare(b2[key]);
        return this.sortDirection === "asc" ? cmp : -cmp;
      });
    }
  });
  onMount(async () => {
    const controller = new AbortController();
    await pokeDex.fetchData("https://pokeapi.co/api/v2/pokemon/?offset=1100&limit=20", controller);
    return () => {
      console.log("Cleaning up PokeDex component");
      controller.abort();
    };
  });
  return jsx(Template, {
    title: () => "PokeDex List",
    children: () => [() => jsx("div", {
      class: () => "break-all",
      children: () => [() => "Hi ", () => name.firstName]
    }), () => jsx("table", {
      class: () => "w-full mx-auto my-2 table-fixed",
      children: () => [() => jsx("thead", {
        children: () => jsx("tr", {
          children: () => [() => jsx("th", {
            class: () => "w-1/3",
            children: () => "ID"
          }), () => jsx("th", {
            onClick: () => () => pokeDex.handleSort("name"),
            class: () => "select-none cursor-pointer w-1/3",
            children: () => "Name"
          }), () => jsx("th", {
            onClick: () => () => pokeDex.handleSort("url"),
            class: () => "select-none cursor-pointer w-1/3",
            children: () => "URL"
          })]
        })
      }), () => jsx("tbody", {
        children: () => [() => pokeDex.isLoading && jsx(Fragment, {
          children: () => loop(() => Array.from({
            length: 20
          }).map((_, i2) => i2 + 1)).each((number) => jsx("tr", {
            children: () => jsx("td", {
              colSpan: () => 3,
              class: () => "h-[24px] text-center",
              children: () => number === 10 && "loading..."
            })
          }))
        }), () => !pokeDex.isLoading && jsx(Fragment, {
          children: () => loop(() => pokeDex.pokeDexList).each(({
            name: name2,
            url
          }, index) => jsx("tr", {
            children: () => [() => jsx("td", {
              class: () => "w-1/3 text-center",
              children: () => index.value + 1
            }), () => jsx("td", {
              class: () => "w-1/3 text-center truncate",
              children: () => name2
            }), () => jsx("td", {
              class: () => "w-1/3 text-center truncate",
              onClick: () => () => alert(url),
              children: () => url
            })]
          }))
        })]
      })]
    }), () => jsx("div", {
      class: () => "flex gap-4 justify-center",
      children: () => [() => jsx("button", {
        class: () => "btn",
        onClick: () => () => pokeDex.fetchData(pokeDex.prevLink),
        disabled: () => pokeDex.isLoading || !pokeDex.prevLink,
        children: () => "Previous"
      }), () => jsx("button", {
        class: () => "btn",
        onClick: () => () => pokeDex.fetchData(pokeDex.nextLink),
        disabled: () => pokeDex.isLoading || !pokeDex.nextLink,
        children: () => "Next"
      })]
    })]
  });
};
const PokeDexSuspense = () => {
  const pokeDex = store({
    url: "https://pokeapi.co/api/v2/pokemon/?offset=1100&limit=20",
    sortDirection: "asc",
    sort(key) {
      if (!pokeDexResource.data) return;
      this.sortDirection = this.sortDirection === "asc" ? "desc" : "asc";
      pokeDexResource.mutate({
        ...pokeDexResource.data,
        results: [...pokeDexResource.data.results].sort((a, b2) => {
          const cmp = a[key].localeCompare(b2[key]);
          return this.sortDirection === "asc" ? cmp : -cmp;
        })
      });
    },
    changeUrl(newUrl) {
      if (pokeDexResource.loading || !newUrl) return;
      this.url = newUrl.replace(/limit=\d+/, "limit=20");
    }
  });
  const pokeDexResource = resource(async () => {
    const response = await fetch(pokeDex.url);
    const json = await response.json();
    await sleep(1e3);
    return json;
  }, "pokedex-resource");
  const showUrlOnClick = (url) => () => alert(url);
  const sortOnClick = (key) => () => pokeDex.sort(key);
  return jsx(Template, {
    title: () => "PokeDex List (via Suspense)",
    children: () => jsx("div", {
      children: () => [() => jsx("div", {
        class: () => "break-all",
        children: () => [() => "Hi ", () => name.firstName]
      }), () => jsx("table", {
        class: () => "w-full mx-auto my-2 table-fixed",
        children: () => [() => jsx("thead", {
          children: () => jsx("tr", {
            children: () => [() => jsx("th", {
              class: () => "w-1/3",
              children: () => "ID"
            }), () => jsx("th", {
              onClick: () => sortOnClick("name"),
              class: () => "select-none cursor-pointer w-1/3",
              children: () => "Name"
            }), () => jsx("th", {
              onClick: () => sortOnClick("url"),
              class: () => "select-none cursor-pointer w-1/3",
              children: () => "URL"
            })]
          })
        }), () => jsx("tbody", {
          children: () => jsx(Suspense, {
            fallback: () => jsx(Fragment, {
              children: () => Array.from({
                length: 20
              }).map((_, i2) => i2 + 1).map((number) => jsx("tr", {
                children: () => jsx("td", {
                  colSpan: () => 3,
                  class: () => "h-[24px] text-center",
                  children: () => number === 10 && "loading..."
                })
              }))
            }),
            children: () => jsx(Fragment, {
              children: () => pokeDexResource.data.results.map(({
                name: name2,
                url
              }, index) => jsx("tr", {
                children: () => [() => jsx("td", {
                  class: () => "w-1/3 text-center",
                  children: () => index + 1
                }), () => jsx("td", {
                  class: () => "w-1/3 text-center truncate",
                  children: () => name2
                }), () => jsx("td", {
                  class: () => "w-1/3 text-center truncate",
                  onClick: () => showUrlOnClick(url),
                  children: () => url
                })]
              }))
            })
          })
        })]
      }), () => jsx("div", {
        class: () => "flex gap-4 justify-center",
        children: () => [() => jsx("button", {
          class: () => "btn",
          onClick: () => () => {
            var _a;
            return pokeDex.changeUrl((_a = pokeDexResource.data) == null ? void 0 : _a.previous);
          },
          disabled: () => {
            var _a;
            return pokeDexResource.loading || !((_a = pokeDexResource.data) == null ? void 0 : _a.previous);
          },
          children: () => "Previous"
        }), () => jsx("button", {
          class: () => "btn",
          onClick: () => () => {
            var _a;
            return pokeDex.changeUrl((_a = pokeDexResource.data) == null ? void 0 : _a.next);
          },
          disabled: () => {
            var _a;
            return pokeDexResource.loading || !((_a = pokeDexResource.data) == null ? void 0 : _a.next);
          },
          children: () => "Next"
        })]
      })]
    })
  });
};
const StackedSuspense = () => {
  const msg2 = resource(async () => {
    await new Promise((resolve) => {
      setTimeout(resolve, 2e3);
    });
    return "hello world 2";
  }, "outer-suspense");
  return jsx(Template, {
    title: () => "Stacked Suspense",
    children: () => jsx("div", {
      class: () => "p-2 flex flex-col container m-auto",
      children: () => jsx(Suspense, {
        fallback: () => jsx("div", {
          children: () => "loading 1..."
        }),
        children: () => [() => jsx(Suspense, {
          fallback: () => jsx("div", {
            children: () => "loading 2..."
          }),
          children: () => msg2.data
        }), () => jsx(Component, {})]
      })
    })
  });
};
function Component() {
  const msg = resource(async () => {
    await sleep(1e3);
    return "hello world";
  }, "inner-suspense");
  return jsx("div", {
    children: () => msg.data
  });
}
const routes = [{
  path: "/",
  component: () => {
    console.log("layout rerender");
    return jsx("div", {
      class: () => "p-2 flex flex-col container m-auto",
      children: () => [() => jsx(ButtonPageList, {}), () => jsx(O, {})]
    });
  },
  children: [{
    path: "/",
    component: () => jsx(Fragment, {
      children: () => [() => jsx(Forms, {}), () => jsx(Contexts, {}), () => jsx(Dropdowns, {}), () => jsx(NonAsyncSuspense, {}), () => jsx(StackedSuspense, {}), () => jsx(PokeDex, {}), () => jsx(PokeDexSuspense, {})]
    })
  }, {
    path: "/contexts",
    component: Contexts
  }, {
    path: "/pokedex-list",
    component: PokeDex
  }, {
    path: "/stacked-suspense",
    component: StackedSuspense
  }, {
    path: "/pokedex-list-suspense",
    component: PokeDexSuspense
  }, {
    path: "/dropdown-list",
    component: Dropdowns
  }, {
    path: "/forms",
    component: Forms
  }, {
    path: "/non-async-suspense",
    component: NonAsyncSuspense
  }]
}];
const render = (url) => {
  return renderToString(() => jsx(b, {
    url: () => url,
    routes: () => routes
  }));
};
export {
  render
};
