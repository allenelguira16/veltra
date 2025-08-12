const UNIT_LESS_PROPS = /* @__PURE__ */ new Set(["animationIterationCount", "borderImageOutset", "borderImageSlice", "borderImageWidth", "boxFlex", "boxFlexGroup", "boxOrdinalGroup", "columnCount", "flex", "flexGrow", "flexPositive", "flexShrink", "flexNegative", "flexOrder", "gridRow", "gridColumn", "fontWeight", "lineClamp", "lineHeight", "opacity", "order", "orphans", "tabSize", "widows", "zIndex", "zoom", "fillOpacity", "floodOpacity", "stopOpacity", "strokeDasharray", "strokeDashoffset", "strokeMiterlimit", "strokeOpacity", "strokeWidth"]);
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
  if (transformedProps.length > 0) transformedProps.unshift("");
  return transformedProps.join(" ");
}
function getNode$1(jsxElement) {
  if (jsxElement instanceof Node) {
    return jsxElement;
  }
  if (typeof jsxElement === "string" || typeof jsxElement === "number") {
    return document.createTextNode(String(jsxElement));
  }
  throw new Error(`Unknown value: ${jsxElement}`);
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
function createTargetNode(name2) {
  let targetNode;
  if (process.env.NODE_ENV === "development") {
    targetNode = document.createComment(toKebabCase(name2));
  } else {
    targetNode = document.createTextNode("");
  }
  rootNodes.add(targetNode);
  return targetNode;
}
function toKebabCase(str) {
  return str.replace(/([a-z0-9])([A-Z])/g, "$1-$2").replace(/([A-Z])([A-Z][a-z])/g, "$1-$2").toLowerCase();
}
const isNil = (value) => {
  return value === void 0 || value === null || value === false;
};
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
    return type({
      ...props,
      children
    });
  }
  return `<${type}${applyProps$1(props)}>${renderChildren$1(children)}</${type}>`;
}
const jsx = (type, {
  children = [],
  ...props
}, key) => {
  if (IS_SSR) {
    return h$1(type, props, children);
  }
  return h(type, props, children, key);
};
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
const suspenseHandlerStack = [];
function getSuspenseHandler() {
  return suspenseHandlerStack[suspenseHandlerStack.length - 1];
}
function Suspense(props) {
  if (IS_SSR) return props.fallback;
  const {
    fallback: _fallback,
    children: _children
  } = props;
  const children = memo(() => _children());
  const fallback = () => _fallback == null ? void 0 : _fallback();
  const view = state();
  const handler = (promise) => {
    suspenseHandlerStack.pop();
    view.value = fallback;
    promise.then(() => {
      withSuspenseRender(children);
    });
  };
  const withSuspenseRender = (newView) => {
    suspenseHandlerStack.push(handler);
    view.value = newView;
  };
  withSuspenseRender(children);
  return () => {
    var _a;
    return (_a = view.value) == null ? void 0 : _a.call(view);
  };
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
function applyStyle(element, style) {
  if (!(element instanceof HTMLElement)) return;
  for (const key in style) {
    if (!Object.hasOwn(style, key)) continue;
    const value = style[key];
    if (value == null) continue;
    if (key === "length" || key === "parentRule") continue;
    const isNumeric = typeof value === "number";
    const needsUnit = isNumeric && !UNIT_LESS_PROPS.has(key);
    element.style[key] = isNumeric ? needsUnit ? `${value}px` : `${value}` : String(value);
  }
}
function Fragment({
  children
}) {
  return () => children instanceof Function ? children() : children;
}
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
let renderedDOM = [];
let deferredRenderedDOM = [];
let i = 0;
function serverRenderedDOM() {
  const nextDOM = () => {
    const dom = [...renderedDOM, ...deferredRenderedDOM][i];
    if (!dom) {
      return void 0;
    }
    for (let j = 0; j < dom.childNodes.length; j++) {
      const child = dom.childNodes[j];
      if (child instanceof Text) {
        child.remove();
      }
    }
    return dom;
  };
  return {
    renderedDOM: [...renderedDOM, ...deferredRenderedDOM],
    get currentDOM() {
      return nextDOM();
    },
    get isHydrating() {
      return i < renderedDOM.length;
    },
    next: () => i++
  };
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
  const waitForHydration = () => {
    if (!serverRenderedDOM().isHydrating) {
      queueMicrotask(() => Promise.resolve().then(runMounts));
    } else {
      requestAnimationFrame(waitForHydration);
    }
  };
  waitForHydration();
}
function renderChildren(parentNode, children, baseAnchor = null) {
  const cleanups = [];
  function renderRecursive(value, anchor) {
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
    const disposer = effect(() => {
      try {
        cleanup();
        const resolvedChildren = value instanceof Function ? value() : value;
        const children2 = toArray(resolvedChildren);
        for (const child of children2) {
          if (isNil(child)) continue;
          if (typeof child === "function") {
            const childAnchor = document.createTextNode("");
            parentNode.insertBefore(childAnchor, anchor);
            const childDisposer = renderRecursive(child, childAnchor);
            disposers.push(childDisposer);
            nodes.push(childAnchor);
          } else {
            const node = getNode$1(child);
            parentNode.insertBefore(node, anchor);
            nodes.push(node);
          }
        }
      } catch (error) {
        const handler = getSuspenseHandler();
        if (error instanceof Promise && handler) {
          handler(error);
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
  const dispose = renderRecursive(children, baseAnchor);
  cleanups.push(dispose);
  return () => {
    for (const c of cleanups) c();
  };
}
function setParentNode(node) {
}
function loop(items) {
  return {
    each: (children) => {
      const each = items;
      children = children;
      if (IS_SSR) {
        const renderedItems = each().map((item, i2) => children(item, {
          value: i2
        }));
        return renderedItems;
      }
      return jsx(Loop, {
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
  const result = state([]);
  const listFn = mapArray(each, children);
  effect(() => {
    try {
      result.value = listFn();
    } catch (err) {
      if (err instanceof Promise) {
        const handler = getSuspenseHandler();
        handler == null ? void 0 : handler(err);
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
  const p = arr.slice();
  const result = [];
  let u, v;
  for (let i2 = 0; i2 < arr.length; i2++) {
    const n = arr[i2];
    if (n < 0) continue;
    if (result.length === 0 || arr[result[result.length - 1]] < n) {
      p[i2] = result.length > 0 ? result[result.length - 1] : -1;
      result.push(i2);
      continue;
    }
    u = 0;
    v = result.length - 1;
    while (u < v) {
      const c = (u + v) / 2 | 0;
      if (arr[result[c]] < n) u = c + 1;
      else v = c;
    }
    if (n < arr[result[u]]) {
      if (u > 0) p[i2] = result[u - 1];
      result[u] = i2;
    }
  }
  u = result.length;
  v = result[u - 1];
  while (u-- > 0) {
    result[u] = v;
    v = p[v];
  }
  return result;
}
const IGNORE_COMPONENT = [Suspense, Loop];
function resolveComponentProps(type, props) {
  if (IGNORE_COMPONENT.includes(type)) return;
  for (const key in props) {
    props[key] = props[key] instanceof Function ? props[key]() : props[key];
  }
}
const rootNodes = /* @__PURE__ */ new WeakSet();
function mountComponent(type, {
  key: _key,
  ...props
}, children) {
  resolveComponentProps(type, props);
  const key = _key ? _key().toString() + type.toString() : void 0;
  const context = createLifeCycleContext(key);
  setRuntimeContext(context);
  const rootNode = createTargetNode(type.name);
  const jsxElements = toArray([rootNode, untrack(() => type({
    ...props,
    children
  }))]);
  setRuntimeContext(null);
  runLifecycle(rootNode, context);
  return jsxElements;
}
if (!IS_SSR) {
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
function h(type, props, children, key) {
  var _a;
  try {
    if (typeof type === "function") {
      return mountComponent(type, {
        key,
        ...props
      }, children);
    }
    xmlnsStack.push(((_a = props.xmlns) == null ? void 0 : _a.call(props)) ?? xmlnsStack[xmlnsStack.length - 1]);
    const element = createElement(type);
    setParentNode(element);
    applyProps(element, props);
    renderChildren(element, children);
    xmlnsStack.pop();
    return element;
  } finally {
  }
}
const xmlnsStack = [];
function createElement(tag) {
  const {
    currentDOM,
    isHydrating,
    next
  } = serverRenderedDOM();
  if (isHydrating && currentDOM) {
    try {
      return currentDOM;
    } finally {
      next();
    }
  }
  const currentXmlns = xmlnsStack[xmlnsStack.length - 1];
  return currentXmlns ? document.createElementNS(currentXmlns, tag) : document.createElement(tag);
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
  if (resourceCache.has(key)) {
    return resourceCache.get(key);
  }
  const resourceFn = baseResource(fetcher);
  resourceCache.set(key, resourceFn);
  return resourceFn;
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
function onMount(fn) {
  if (IS_SSR) return;
  const context = getRuntimeContext();
  if (!context) {
    throw new Error("onMount called outside of component");
  }
  context.mount.push(fn);
}
const sleep = (ms) => new Promise((resolve) => {
  setTimeout(resolve, ms);
});
const name = store({
  firstName: "First name",
  lastName: "Last name"
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
      await sleep(200);
      this.pokeDexList = json.results;
      this.prevLink = ((_a = json.previous) == null ? void 0 : _a.replace(/limit=\d+/, "limit=20")) ?? "";
      this.nextLink = ((_b = json.next) == null ? void 0 : _b.replace(/limit=\d+/, "limit=20")) ?? "";
      this.isLoading = false;
    },
    handleSort(key) {
      this.sortDirection = this.sortDirection === "asc" ? "desc" : "asc";
      this.pokeDexList = [...this.pokeDexList].sort((a, b) => {
        const cmp = a[key].localeCompare(b[key]);
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
  return jsx(Fragment, {
    children: () => [() => jsx("div", {
      class: () => "break-all",
      children: () => ["Hi ", () => name.firstName]
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
const StackedSuspense = () => {
  const msg2 = resource(async () => {
    await new Promise((resolve) => {
      setTimeout(resolve, 2e3);
    });
    return "hello world 2";
  }, "outer-suspense");
  return jsx("div", {
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
  });
};
function Component() {
  const msg = resource(async () => {
    await new Promise((resolve) => {
      setTimeout(resolve, 1e3);
    });
    return "hello world";
  }, "inner-suspense");
  return jsx("div", {
    children: () => msg.data
  });
}
function App() {
  const i2 = state(0);
  setInterval(() => {
    i2.value++;
  }, 1e3);
  return jsx("div", {
    children: () => [() => jsx("img", {
      src: () => "https://media1.tenor.com/m/CNI1fSM1XSoAAAAC/shocked-surprised.gif"
    }), () => jsx("h1", {
      children: () => "Vynn App"
    }), () => jsx(StackedSuspense, {}), () => jsx(PokeDex, {})]
  });
}
const render = () => {
  return jsx(App, {});
};
export {
  render
};
