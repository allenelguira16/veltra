'use strict';

var jsxRuntime = require('./chunks/h-BrfZzpI7.js');

function resolveChildren(child) {
  const item = jsxRuntime.memo(() => jsxRuntime.getNode(child));
  return item;
}

const contextStack = [];
function createContext() {
  function Provider(props) {
    contextStack.push(props.value);
    const children = resolveChildren(props.children);
    try {
      return children();
    } finally {
      contextStack.pop();
    }
  }
  function getContext() {
    if (!contextStack.length) {
      throw new Error("No provider found for context.");
    }
    const context = contextStack[contextStack.length - 1];
    return context;
  }
  return [Provider, getContext];
}

function computed(getter) {
  const result = jsxRuntime.state();
  jsxRuntime.effect(() => {
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
        jsxRuntime.track(target, key);
        const result = Reflect.get(target, key, receiver);
        if (typeof result === "function") {
          return result.bind(receiver);
        }
        const descriptor = Reflect.getOwnPropertyDescriptor(target, key);
        if (descriptor?.get) {
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
          jsxRuntime.trigger(target, key);
        }
        return result;
      }
    });
    proxyMap.set(obj, proxy);
    return proxy;
  }
  return createReactiveObject(initialObject);
}

function logJsx(nodes) {
  const newNodes = [
    ...nodes.filter((node) => !(node instanceof Text && jsxRuntime.componentRootNodes.has(node)))
  ];
  return newNodes.length === 1 ? newNodes[0] : newNodes;
}

function unwrap(value) {
  function deepUnwrap(obj) {
    if (obj === null || typeof obj !== "object") return obj;
    if (typeof obj === "function") return obj;
    const result = {};
    for (const key of Reflect.ownKeys(obj)) {
      const value2 = obj[key];
      result[key] = deepUnwrap(value2);
    }
    return result;
  }
  return deepUnwrap(value);
}

function lazy(loader, namedExport) {
  let component;
  let error;
  let promise = null;
  const key = namedExport ?? "default";
  const getComponent = () => {
    if (component) return component;
    if (error) throw error;
    if (!promise) {
      promise = loader().then((mod) => {
        if (!(key in mod)) {
          throw new Error(`lazy(): Export "${String(key)}" not found in module`);
        }
        component = mod[key];
      }).catch((err) => {
        error = err instanceof Error ? err : new Error(String(err));
      });
    }
    throw promise;
  };
  return () => {
    const Comp = getComponent();
    return jsxRuntime.jsx(Comp, {});
  };
}

function resource(fetcher) {
  let loading = true;
  let error = null;
  let data = void 0;
  let promise = null;
  let promiseStatus = "pending";
  const version = jsxRuntime.state(0);
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
      jsxRuntime.untrack(() => version.value++);
    }).catch((err) => {
      data = void 0;
      error = err;
      promiseStatus = "rejected";
      loading = false;
      jsxRuntime.untrack(() => version.value++);
    });
    jsxRuntime.untrack(() => version.value++);
  };
  jsxRuntime.effect(() => {
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

function createApp(App) {
  let cleanup;
  return {
    mount: (id) => {
      let node;
      if (typeof id === "string") {
        node = document.querySelector(id);
      } else {
        node = id;
      }
      if (!(node instanceof HTMLElement)) throw new Error("Node must be of type Element");
      jsxRuntime.effect(() => {
        const app = jsxRuntime.mountComponent(App, {}, []);
        cleanup = jsxRuntime.renderChildren(node, app);
      });
    },
    unmount: () => {
      if (!cleanup) throw new Error("Can only unmount if the app is mounted");
      cleanup();
    }
  };
}

function hydrateApp(App) {
  let cleanup;
  return {
    mount: (id) => {
      let node;
      if (typeof id === "string") {
        node = document.querySelector(id);
      } else {
        node = id;
      }
      if (!(node instanceof HTMLElement)) throw new Error("Node must be of type Element");
      jsxRuntime.effect(() => {
        const app = jsxRuntime.mountComponent(App, {}, []);
        cleanup = jsxRuntime.renderChildren(node, app);
      });
    },
    unmount: () => {
      if (!cleanup) throw new Error("Can only unmount if the app is mounted");
      cleanup();
    }
  };
}

exports.Fragment = jsxRuntime.Fragment;
exports.Suspense = jsxRuntime.Suspense;
exports.effect = jsxRuntime.effect;
exports.loop = jsxRuntime.loop;
exports.memo = jsxRuntime.memo;
exports.onDestroy = jsxRuntime.onDestroy;
exports.onMount = jsxRuntime.onMount;
exports.state = jsxRuntime.state;
exports.stopEffect = jsxRuntime.stopEffect;
exports.untrack = jsxRuntime.untrack;
exports.computed = computed;
exports.createApp = createApp;
exports.createContext = createContext;
exports.hydrateApp = hydrateApp;
exports.lazy = lazy;
exports.logJsx = logJsx;
exports.resolveChildren = resolveChildren;
exports.resource = resource;
exports.store = store;
exports.unwrap = unwrap;
//# sourceMappingURL=index.js.map
