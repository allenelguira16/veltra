import { m as memo, g as getNode, s as state, e as effect, t as trigger, a as track, c as componentRootNodes, j as jsx, u as untrack, b as mountComponent, r as renderChildren } from './chunks/h-Dpy91G2A.js';
export { F as Fragment, S as Suspense, l as loop, o as onDestroy, d as onMount, f as stopEffect } from './chunks/h-Dpy91G2A.js';

function resolveChildren(child) {
  const item = memo(() => getNode(child));
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

function logJsx(nodes) {
  const newNodes = [
    ...nodes.filter((node) => !(node instanceof Text && componentRootNodes.has(node)))
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
    return jsx(Comp, {});
  };
}

function resource(fetcher) {
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
      effect(() => {
        const app = mountComponent(App, {}, []);
        cleanup = renderChildren(node, app);
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
      effect(() => {
        const app = mountComponent(App, {}, []);
        cleanup = renderChildren(node, app);
      });
    },
    unmount: () => {
      if (!cleanup) throw new Error("Can only unmount if the app is mounted");
      cleanup();
    }
  };
}

export { computed, createApp, createContext, effect, hydrateApp, lazy, logJsx, memo, resolveChildren, resource, state, store, untrack, unwrap };
//# sourceMappingURL=index.js.map
