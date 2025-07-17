'use strict';

var app = require('@veltra/app');

const p = e => e == null || e === false;
function w(e, n = -1) {
  if (e instanceof Node) return e;
  if (!p(e)) return typeof e == "function" ? w(e(), n) : Array.isArray(e) ? e.map(t => w(t, n)) : document.createTextNode(String(e));
}
function H(e) {
  let n,
    t = true;
  return (...o) => (t && (n = e(...o), t = false), n);
}
let a = null;
function W(e) {
  a = e;
}
let h = null;
function se() {
  if (!h) throw new Error("Must be inside an effect");
  return h;
}
const N = new Set();
let L = false;
function re(e) {
  N.add(e), L || (L = true, queueMicrotask(() => {
    for (const n of N) n();
    N.clear(), L = false;
  }));
}
function x(e) {
  const n = b(),
    t = async () => {
      k(t), t.cleanup && (t.cleanup(), t.cleanup = void 0);
      const s = a,
        r = h;
      a = t, h = t.owner, n && n.effect.push(t);
      try {
        const i = e();
        if (typeof i == "function") t.cleanup = i;else if (i instanceof Promise) {
          const c = await i;
          typeof c == "function" && (t.cleanup = c);
        }
      } finally {
        a = s, h = r;
      }
    },
    o = () => k(t);
  return t.deps = [], t.owner = crypto.randomUUID(), t(), o;
}
function k(e) {
  if (e.deps) {
    for (const n of e.deps) n.delete(e);
    e.deps.length = 0;
  }
  e.cleanup && (e.cleanup(), e.cleanup = void 0);
}
const T = new WeakMap();
function _(e, n) {
  if (!a) return;
  let t = T.get(e);
  t || (t = new Map(), T.set(e, t));
  let o = t.get(n);
  o || (o = new Set(), t.set(n, o)), o.has(a) || (o.add(a), a.deps ? a.deps.push(o) : a.deps = [o]);
}
function B(e, n) {
  const t = T.get(e);
  if (!t) return;
  const o = t.get(n);
  if (o) for (const s of o) re(s);
}
function j(e) {
  const n = b();
  if (n && n.state) {
    const {
      states: t,
      index: o
    } = n.state;
    if (t.length <= o) {
      const s = q(e);
      t.push(s);
    }
    return t[n.state.index++];
  }
  return q(e);
}
function q(e) {
  const n = {
    value: e
  };
  return new Proxy(n, {
    get(t, o, s) {
      return _(t, o), Reflect.get(t, o, s);
    },
    set(t, o, s, r) {
      const i = t[o],
        c = Reflect.set(t, o, s, r);
      return i !== s && B(t, o), c;
    }
  });
}
function A(e) {
  const n = a;
  W(null);
  try {
    return e();
  } finally {
    W(n);
  }
}
const ce = new Set(["a", "animate", "animateMotion", "animateTransform", "circle", "clipPath", "defs", "desc", "discard", "ellipse", "feBlend", "feColorMatrix", "feComponentTransfer", "feComposite", "feConvolveMatrix", "feDiffuseLighting", "feDisplacementMap", "feDistantLight", "feDropShadow", "feFlood", "feFuncA", "feFuncB", "feFuncG", "feFuncR", "feGaussianBlur", "feImage", "feMerge", "feMergeNode", "feMorphology", "feOffset", "fePointLight", "feSpecularLighting", "feSpotLight", "feTile", "feTurbulence", "filter", "foreignObject", "g", "hatch", "hatchpath", "image", "line", "linearGradient", "marker", "mask", "mesh", "meshgradient", "meshpatch", "meshrow", "metadata", "mpath", "path", "pattern", "polygon", "polyline", "radialGradient", "rect", "script", "set", "solidcolor", "stop", "style", "svg", "switch", "symbol", "text", "textPath", "title", "tref", "tspan", "unknown", "use", "view"]),
  fe = new Set(["math", "maction", "maligngroup", "malignmark", "menclose", "merror", "mfenced", "mfrac", "mglyph", "mi", "mlabeledtr", "mmultiscripts", "mn", "mo", "mover", "mpadded", "mphantom", "mroot", "mrow", "ms", "mscarries", "mscarry", "msgroup", "mstack", "mstyle", "msub", "msubsup", "msup", "mtable", "mtd", "mtext", "mtr", "munder", "munderover", "semantics", "annotation", "annotation-xml"]),
  ue = ["animationIterationCount", "borderImageOutset", "borderImageSlice", "borderImageWidth", "boxFlex", "boxFlexGroup", "boxOrdinalGroup", "columnCount", "flex", "flexGrow", "flexPositive", "flexShrink", "flexNegative", "flexOrder", "gridRow", "gridColumn", "fontWeight", "lineClamp", "lineHeight", "opacity", "order", "orphans", "tabSize", "widows", "zIndex", "zoom", "fillOpacity", "floodOpacity", "stopOpacity", "strokeDasharray", "strokeDashoffset", "strokeMiterlimit", "strokeOpacity", "strokeWidth"],
  ae = typeof document > "u",
  z = (e, {
    children: n = [],
    ...t
  }, o) => ae ? Le(e, t, m(n)) : be(e, t, n, o),
  $ = new Map();
function le(e, n) {
  $.set(e, n);
}
function S(e) {
  const n = $.get(e);
  if (n) {
    for (const t of n) t();
    $.delete(e);
  }
  for (const t of e.childNodes) S(t);
}
function U(e) {
  const n = b();
  if (n && n.destroy) n.destroy.push(e);else throw new Error("onDestroy called outside of component");
}
function O(e) {
  const n = b();
  if (n && n.mount) n.mount.push(e);else throw new Error("onMount called outside of component");
}
function V(e) {
  const n = Ae(e);
  if (!n) return;
  const t = [];
  le(e, t), queueMicrotask(async () => {
    for (const o of n.mount) {
      const s = await o();
      s && t.push(s);
    }
    for (const o of n.destroy) t.push(o);
    for (const o of n.effect) t.push(() => Promise.resolve(k(o)));
  });
}
const M = new WeakMap();
function pe(e, n, t) {
  let o = M.get(e);
  o || (o = new Map(), M.set(e, o)), o.has(n) && e.removeEventListener(n, o.get(n)), e.addEventListener(n, t), o.set(n, t);
}
function de(e, n) {
  const t = M.get(e);
  if (!t) return;
  const o = t.get(n);
  o && (e.removeEventListener(n, o), t.delete(n)), t.size === 0 && M.delete(e);
}
function me(e, n) {
  for (const t in n) x(() => {
    const o = n[t],
      s = typeof o == "function" && t !== "ref" ? o() : o;
    if (t.startsWith("on") && typeof s == "function") {
      const i = t.slice(2).toLowerCase();
      return pe(e, i, s), () => de(e, i);
    }
    const r = e instanceof HTMLInputElement || e instanceof HTMLTextAreaElement || e instanceof HTMLSelectElement;
    if (t === "value" && r && typeof n.onInput != "function" && typeof n.onChange != "function") {
      e.value = s;
      const i = () => {
        e.value !== s && (e.value = s);
      };
      return e.setAttribute(t, s), e.addEventListener("input", i), () => e.removeEventListener("input", i);
    }
    if (t === "ref" && typeof s == "function") {
      s(e);
      return;
    }
    if (t === "style") {
      he(e, s);
      return;
    }
    if (typeof s == "boolean") {
      e.toggleAttribute(t, s);
      return;
    }
    if (t === "html" && typeof s == "string") {
      e.innerHTML = s;
      return;
    }
    e.setAttribute(t, s);
  });
}
function he(e, n) {
  if (e instanceof HTMLElement) for (const [t, o] of Object.entries(n)) {
    const s = t;
    if (s === "length" || s === "parentRule") continue;
    const r = typeof o == "number" && !ge(t) ? `${o}px` : String(o);
    e.style.setProperty(String(s), r);
  }
}
function ge(e) {
  return new Set(ue).has(e);
}
function J({
  children: e
}) {
  return e;
}
function K(e, n, t, o) {
  const s = Math.max(n.length, t.length);
  for (let r = 0; r < s; r++) {
    const i = n[r],
      c = t[r];
    if (p(i) && !p(c)) {
      o ? e.insertBefore(c, o) : e.appendChild(c), V(c), n[r] = c;
      continue;
    }
    if (!p(i) && p(c)) {
      S(i), e.removeChild(i), n[r] = void 0;
      continue;
    }
    if (!(p(i) && p(c))) {
      if (i && c) {
        S(i), V(c), i.replaceWith(c), n[r] = c;
        continue;
      }
      console.warn("[veltra]: warning - unknown dom detected: ", {
        old: i,
        new: c
      });
    }
  }
  return [...n];
}
function P(e, n, t) {
  const o = {
      disposer: [],
      oldNodes: []
    },
    s = n instanceof Function ? n() : n;
  for (const r of m(s)) {
    const i = document.createTextNode("");
    e.insertBefore(i, t ?? null);
    const c = Z(),
      f = () => {
        let u = [],
          l = [];
        const d = x(() => {
          try {
            l = m(w(r));
          } catch (y) {
            if (y instanceof Promise) c ? c(y) : (queueMicrotask(() => d()), y.then(() => f()));else throw y;
          }
          u = K(e, u, l, i), o.oldNodes.push(() => {
            K(e, u, [], t);
          });
        });
        o.disposer.push(() => {
          d();
        });
      };
    f();
  }
  return () => {
    o.disposer.forEach(r => r()), o.oldNodes.forEach(r => r());
  };
}
function Q(e, n) {
  for (const t of n.nodes) e.contains(t) && (S(t), e.removeChild(t));
}
function ye(e, n, t) {
  for (const o of n) e.insertBefore(o, t);
}
function we(e, n, t, o) {
  const s = new Map();
  let r = e.nextSibling;
  for (let i = 0; i < o.length; i++) {
    const c = o[i];
    s.set(c, (s.get(c) || 0) + 1);
    let f = 0;
    const u = t.find(l => l.item === c && ++f === s.get(c));
    u && (A(() => u.index.value = i), ye(n, u.nodes, r), r = u.nodes[u.nodes.length - 1].nextSibling);
  }
}
function X(e) {
  const n = new Map();
  for (const t of e) n.set(t, (n.get(t) || 0) + 1);
  return n;
}
function ve(e, n, t) {
  const o = X(n),
    s = X(t.map(r => r.item));
  return t.filter(r => (s.get(r.item) ?? 0) > (o.get(r.item) ?? 0) ? (Q(e, r), s.set(r.item, (s.get(r.item) ?? 0) - 1), false) : true);
}
function xe(e, n, t) {
  const o = [],
    s = new Map();
  for (const r of e) if (s.set(r, (s.get(r) || 0) + 1), n.filter(i => i.item === r).length + o.filter(i => i.item === r).length < (s.get(r) || 0)) {
    const i = j(-1),
      c = m(t(r, i));
    o.push({
      item: r,
      nodes: c,
      index: i
    });
  }
  return o;
}
function F({
  children: e,
  each: n,
  handler: t
}) {
  const o = R("Loop");
  g.add(o);
  let s = [];
  function r(c, f) {
    s = ve(c, f, s), s.push(...xe(f, s, e)), we(o, c, s, f);
  }
  const i = () => {
    x(() => {
      try {
        const c = o.parentNode;
        if (!c) return;
        const f = n();
        if (!f) return;
        r(c, [...f]);
      } catch (c) {
        if (c instanceof Promise) t && t(c);else throw c;
      }
    });
  };
  return O(() => {
    i();
  }), U(() => {
    for (const c of s) Q(o.parentNode, c);
  }), o;
}
const Me = [I, F];
function Ee(e, n) {
  if (!Me.includes(e)) for (const t in n) n[t] = n[t] instanceof Function ? n[t]() : n[t];
}
const g = new Set(),
  Ce = [I, F];
function Y(e, {
  key: n,
  ...t
}, o) {
  Ee(e, t);
  const s = n ? n() + se() : void 0,
    r = {
      mount: [],
      state: Te(s),
      effect: [],
      destroy: []
    };
  G(r);
  const i = m(A(() => e({
    ...t,
    children: o
  })));
  if (g.has(i[0]) && Ce.includes(e)) return G(null), oe(i[0], r), i;
  const c = R(e.name);
  return G(null), oe(c, r), [c, ...i];
}
const E = [];
function I(e) {
  const {
    fallback: n,
    children: t
  } = e;
  let o;
  const s = R("Suspense");
  g.add(s);
  const r = H(() => t()),
    i = () => n?.(),
    c = [],
    f = l => {
      queueMicrotask(() => {
        c.forEach(d => d()), i && u(i);
      }), l.then(() => {
        c.forEach(d => d()), u(r);
      });
    },
    u = l => {
      o && (E.push(f), c.push(P(o, m(l), s)), E.pop());
    };
  return O(() => {
    s.parentNode && (o = s.parentNode, u(r));
  }), s;
}
function Z() {
  return E[E.length - 1];
}
function be(e, n, t, o) {
  if (e === J) return t;
  if (typeof e == "function") return Y(e, {
    key: o,
    ...n
  }, t);
  const s = C[C.length - 1],
    r = n.xmlns?.() ?? s;
  C.push(r);
  const i = Ne(e, r);
  return me(i, n), P(i, t), C.pop(), i;
}
const C = [];
function Ne(e, n) {
  return (ce.has(e) || fe.has(e)) && n ? document.createElementNS(n, e) : document.createElement(e);
}
function Le(e, n, t) {
  return typeof e == "function" ? e({
    ...n,
    children: t
  }) : `<${e} ${ke(n)}>${ee(t)}</${e}>`;
}
function ke(e) {
  const n = [];
  for (const t in e) {
    if (t.startsWith("on") && typeof e[t] == "function") continue;
    const o = typeof e[t] == "function" ? e[t]() : e[t];
    t === "ref" && typeof o == "function" || t === "style" || (t === "disabled" && o ? n.push("disabled") : n.push(`${t}="${o}"`));
  }
  return n.join(" ");
}
function ee(e) {
  const n = [];
  for (const t of e) typeof t == "function" ? n.push(String(t())) : Array.isArray(t) ? t.forEach(o => n.push(ee([o]))) : n.push(t);
  return n.join("");
}
function R(e) {
  let n;
  return process.env.NODE_ENV === "development" ? n = document.createComment(e) : n = document.createTextNode(""), g.add(n), n;
}
const m = e => (Array.isArray(e) ? e : [e]).flat(1 / 0),
  D = new Map(),
  Te = e => {
    let n;
    return e !== void 0 ? (D.has(e) || D.set(e, {
      states: []
    }), n = D.get(e)) : n = {
      states: []
    }, {
      ...n,
      index: 0
    };
  };
let te = null;
function G(e) {
  te = e;
}
function b() {
  return te;
}
const ne = new Map();
function oe(e, n) {
  ne.set(e, n);
}
function Ae(e) {
  return ne.get(e);
}

const location = app.store({
  pathname: window.location.pathname,
  search: window.location.search
});
window.addEventListener("popstate", () => {
  location.pathname = window.location.pathname;
});

/**
 * navigate to a path
 *
 * @param path - The path to navigate to.
 */
function navigate(path) {
  history.pushState(null, "", path);
  location.pathname = path;
}
function isActiveRoute(path, exact = true) {
  const current = location.pathname;
  const currentParts = current.split("/").filter(Boolean);
  const targetParts = path.split("/").filter(Boolean);
  if (exact && currentParts.length !== targetParts.length) return false;
  if (!exact && currentParts.length < targetParts.length) return false;
  return targetParts.every((part, i) => {
    return part.startsWith(":") || part === currentParts[i];
  });
}
function matchRoute(path, routes, basePath = "") {
  const fullPath = (prefix, sub) => (prefix + "/" + sub).replace(/\/+/g, "/");
  const pathSegments = path.split("/").filter(Boolean);
  for (const route of routes) {
    const fullRoutePath = fullPath(basePath, route.path);
    const routeSegments = fullRoutePath.split("/").filter(Boolean);
    if (routeSegments.length > pathSegments.length) continue;
    const params = {};
    let matched = true;
    for (let i = 0; i < routeSegments.length; i++) {
      const routePart = routeSegments[i];
      const pathPart = pathSegments[i];
      if (routePart.startsWith(":")) {
        params[routePart.slice(1)] = pathPart;
      } else if (routePart !== pathPart) {
        matched = false;
        break;
      }
    }
    if (!matched) continue;
    if (routeSegments.length === pathSegments.length) {
      return {
        chain: [route],
        params
      };
    }
    if (route.children) {
      const childMatch = matchRoute(path, route.children, fullRoutePath);
      if (childMatch) {
        return {
          chain: [route, ...childMatch.chain],
          params: {
            ...params,
            ...childMatch.params
          }
        };
      }
    }
  }
  return undefined;
}
const params = app.store({});

/**
 * create a router
 *
 * @param props - The properties of the router.
 * @returns The router.
 */
function Router({
  routes
}) {
  const current = app.state(() => z(J, {}));
  app.effect(() => {
    const matched = matchRoute(location.pathname, routes);
    if (matched) {
      const {
        chain,
        params: extractedParams
      } = matched;

      // Clear and assign params
      for (const key in params) delete params[key];
      Object.assign(params, extractedParams);
      const lastRoute = chain[chain.length - 1];
      if (lastRoute.guard && !lastRoute.guard()) {
        current.value = () => z("div", {
          children: () => "Access Denied"
        });
        return;
      }
      current.value = () => buildComponentTree(chain);
    } else {
      for (const key in params) delete params[key];
      current.value = () => z(J, {});
    }
  });
  return () => {
    const Comp = current.value;
    return z(Comp, {});
  };
}
function buildComponentTree(chain) {
  let current = z(J, {});
  for (let i = chain.length - 1; i >= 0; i--) {
    const route = chain[i];
    if (route.lazy) {
      // Optional: support async lazy chain, currently we just fallback
      current = z("div", {
        children: () => "Loading..."
      });
    } else if (route.component) {
      const prev = current;
      current = route.component({
        children: () => prev
      });
    }
  }
  return current;
}
function Link({
  children,
  href,
  activeClass,
  class: className
}) {
  return z("a", {
    href: () => href,
    class: () => (className + (isActiveRoute(href) ? ` ${activeClass}` : "")).trim(),
    onClick: () => e => {
      e.preventDefault();
      navigate(href);
    },
    children: () => () => children()
  });
}

exports.Link = Link;
exports.Router = Router;
exports.isActiveRoute = isActiveRoute;
exports.location = location;
exports.navigate = navigate;
exports.params = params;
//# sourceMappingURL=index.js.map
