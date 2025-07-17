const b = /* @__PURE__ */ new Map(), se = (e) => {
  let n;
  return e !== void 0 ? (b.has(e) || b.set(e, { states: [] }), n = b.get(e)) : n = { states: [] }, { ...n, index: 0 };
};
let q = null;
function I(e) {
  q = e;
}
function w() {
  return q;
}
let a$1 = null;
function U(e) {
  a$1 = e;
}
const A = /* @__PURE__ */ new Set();
let H = false;
function ce(e) {
  A.add(e), H || (H = true, queueMicrotask(() => {
    for (const n of A) n();
    A.clear(), H = false;
  }));
}
function M(e) {
  const n = w(), t = async () => {
    k$1(t), t.cleanup && (t.cleanup(), t.cleanup = void 0);
    const r = a$1;
    a$1 = t, n && n.effect.push(t);
    try {
      const s2 = e();
      if (typeof s2 == "function") t.cleanup = s2;
      else if (s2 instanceof Promise) {
        const u2 = await s2;
        typeof u2 == "function" && (t.cleanup = u2);
      }
    } finally {
      a$1 = r;
    }
  }, o = () => k$1(t);
  return t.deps = [], t(), o;
}
function k$1(e) {
  if (e.deps) {
    for (const n of e.deps) n.delete(e);
    e.deps.length = 0;
  }
  e.cleanup && (e.cleanup(), e.cleanup = void 0);
}
const T = /* @__PURE__ */ new WeakMap();
function W$1(e, n) {
  if (!a$1) return;
  let t = T.get(e);
  t || (t = /* @__PURE__ */ new Map(), T.set(e, t));
  let o = t.get(n);
  o || (o = /* @__PURE__ */ new Set(), t.set(n, o)), o.has(a$1) || (o.add(a$1), a$1.deps ? a$1.deps.push(o) : a$1.deps = [o]);
}
function j$2(e, n) {
  const t = T.get(e);
  if (!t) return;
  const o = t.get(n);
  if (o) for (const r of o) ce(r);
}
function C(e) {
  const n = w();
  if (n && n.state) {
    const { states: t, index: o } = n.state;
    if (t.length <= o) {
      const r = z(e);
      t.push(r);
    }
    return t[n.state.index++];
  }
  return z(e);
}
function z(e) {
  const n = { value: e };
  return new Proxy(n, { get(t, o, r) {
    return W$1(t, o), Reflect.get(t, o, r);
  }, set(t, o, r, s2) {
    const u2 = t[o], f = Reflect.set(t, o, r, s2);
    return u2 !== r && j$2(t, o), f;
  } });
}
function B$1(e) {
  const n = a$1;
  U(null);
  try {
    return e();
  } finally {
    U(n);
  }
}
const L = /* @__PURE__ */ new WeakMap();
function ie(e, n, t) {
  let o = L.get(e);
  o || (o = /* @__PURE__ */ new Map(), L.set(e, o)), o.has(n) && e.removeEventListener(n, o.get(n)), e.addEventListener(n, t), o.set(n, t);
}
function fe(e, n) {
  const t = L.get(e);
  if (!t) return;
  const o = t.get(n);
  o && (e.removeEventListener(n, o), t.delete(n)), t.size === 0 && L.delete(e);
}
function le(e, n) {
  for (const t in n) M(() => {
    const o = n[t], r = typeof o == "function" && t !== "ref" ? o() : o;
    if (t.startsWith("on") && e instanceof HTMLElement) {
      const u2 = t.slice(2).toLowerCase();
      return ie(e, u2, r), () => fe(e, u2);
    }
    const s2 = e instanceof HTMLInputElement || e instanceof HTMLTextAreaElement || e instanceof HTMLSelectElement;
    if (t === "value" && s2 && typeof n.onInput != "function" && typeof n.onChange != "function") {
      e.value = r;
      const u2 = () => {
        e.value !== r && (e.value = r);
      };
      return e.setAttribute(t, r), e.addEventListener("input", u2), () => e.removeEventListener("input", u2);
    }
    if (t === "ref" && typeof r == "function") {
      r(e);
      return;
    }
    if (t === "style" && typeof r == "object" && e instanceof HTMLElement) {
      pe(e, r);
      return;
    }
    if (typeof r == "boolean") {
      e.toggleAttribute(t, r);
      return;
    }
    if (t === "html" && typeof r == "string") {
      e.innerHTML = r;
      return;
    }
    e.setAttribute(t, r);
  });
}
function ae(e) {
  return CSS.supports(e, "0") && !CSS.supports(e, "0px");
}
function pe(e, n) {
  if (e instanceof HTMLElement) for (const t in n) {
    if (!Object.hasOwn(n, t)) continue;
    const o = n[t];
    if (o == null || t === "length" || t === "parentRule") continue;
    const r = typeof o == "number", s2 = r && !ae(t);
    e.style[t] = r ? s2 ? `${o}px` : `${o}` : String(o);
  }
}
function de(e) {
  let n;
  return process.env.NODE_ENV === "development" ? n = document.createComment(he(e)) : n = document.createTextNode(""), ee.add(n), n;
}
function he(e) {
  return e.replace(/([a-z0-9])([A-Z])/g, "$1-$2").replace(/([A-Z])([A-Z][a-z])/g, "$1-$2").toLowerCase();
}
const Z = (e) => e == null || e === false;
function P(e) {
  let n, t = true;
  return (...o) => (t && (n = e(...o), t = false), n);
}
const D$1 = (e) => (Array.isArray(e) ? e : [e]).flat(1 / 0), p$1 = typeof window > "u", O = /* @__PURE__ */ new Map();
function ge(e, n) {
  O.set(e, n);
}
function R$1(e) {
  const n = O.get(e);
  if (n) {
    for (const t of n) t();
    O.delete(e);
  }
  for (const t of e.childNodes) R$1(t);
}
function ye(e) {
  return { id: crypto.randomUUID(), mount: [], state: se(e), effect: [], destroy: [] };
}
function J(e) {
  if (p$1) return;
  const n = w();
  if (!n) throw new Error("onDestroy called outside of component");
  n.destroy.push(e);
}
function V(e) {
  if (p$1) return;
  const n = w();
  if (!n) throw new Error("onMount called outside of component");
  n.mount.push(e);
}
function ve(e, n) {
  if (!n) return;
  const t = [];
  ge(e, t);
  const o = async () => {
    for (const r of n.mount) {
      const s2 = await r();
      s2 && t.push(s2);
    }
    for (const r of n.destroy) t.push(r);
    for (const r of n.effect) t.push(() => Promise.resolve(k$1(r)));
  };
  queueMicrotask(() => Promise.resolve().then(o));
}
const S = [], x$1 = [];
function _() {
  return S[S.length - 1];
}
function we() {
  return x$1[x$1.length - 1];
}
function G(e) {
  const { fallback: n, children: t } = e, o = P(() => t()), r = n ? P(() => n()) : void 0;
  if (p$1) return r == null ? void 0 : r();
  const s2 = C(() => r == null ? void 0 : r()), u2 = () => (x$1.pop(), r == null ? void 0 : r()), f = (c2) => {
    S.pop(), queueMicrotask(() => {
      r && (s2.value = r);
    }), c2.then(() => {
      d(o);
    });
  }, d = (c2) => {
    p$1 ? x$1.push(u2) : S.push(f);
    try {
      s2.value = c2;
    } catch (i2) {
      if (i2 instanceof Promise) p$1 ? s2.value = () => {
        throw i2;
      } : f(i2);
      else throw i2;
    }
  };
  function h(c2) {
    if (!ne().isHydrating) {
      c2();
      return;
    }
    requestAnimationFrame(() => h(c2));
  }
  try {
    return () => s2.value();
  } finally {
    h(() => {
      d(o);
    });
  }
}
function Ee({ children: e }) {
  return e;
}
const K = (e, { children: n, ...t } = {}, o) => oe(e, t, n, o);
function Me(e) {
  return { each(n) {
    const t = e;
    return n = n, p$1 ? t().map((o, r) => n(o, { value: r })) : K(Q, { each: t, children: n });
  } };
}
function Q({ each: e, children: n }) {
  const t = _(), o = C([]), r = Ce(e, n);
  return M(() => {
    try {
      o.value = r();
    } catch (s2) {
      if (s2 instanceof Promise && t) t(s2);
      else throw s2;
    }
  }), () => o.value;
}
function Ce(e, n) {
  let t = [];
  return () => {
    var _a, _b;
    const o = e() || [], r = o.length, s2 = new Array(r), u2 = /* @__PURE__ */ new Map();
    for (let c2 = 0; c2 < t.length; c2++) {
      const i2 = t[c2].value;
      u2.has(i2) || u2.set(i2, []), u2.get(i2).push(c2);
    }
    const f = new Array(r).fill(-1);
    for (let c2 = 0; c2 < r; c2++) {
      const i2 = o[c2], l2 = u2.get(i2);
      if (l2 && l2.length) {
        const m2 = l2.shift();
        f[c2] = m2, s2[c2] = t[m2];
      } else {
        const m2 = C(c2), g2 = n(i2, m2);
        s2[c2] = { value: i2, index: m2, element: g2 };
      }
    }
    for (let c2 = 0; c2 < t.length; c2++) if (!f.includes(c2)) {
      const i2 = t[c2].element;
      (_a = i2.parentNode) == null ? void 0 : _a.removeChild(i2);
    }
    const d = Le(f);
    let h = d.length - 1;
    for (let c2 = r - 1; c2 >= 0; c2--) {
      const i2 = s2[c2];
      if (f[c2] === -1 || c2 !== d[h]) {
        const l2 = c2 + 1 < r ? s2[c2 + 1].element : null;
        (_b = i2.element.parentNode) == null ? void 0 : _b.insertBefore(i2.element, l2);
      } else h--;
      i2.index.value = c2;
    }
    return t = s2, t.map((c2) => c2.element);
  };
}
function Le(e) {
  const n = e.slice(), t = [];
  let o, r;
  for (let s2 = 0; s2 < e.length; s2++) {
    const u2 = e[s2];
    if (!(u2 < 0)) {
      if (t.length === 0 || e[t[t.length - 1]] < u2) {
        n[s2] = t.length > 0 ? t[t.length - 1] : -1, t.push(s2);
        continue;
      }
      for (o = 0, r = t.length - 1; o < r; ) {
        const f = (o + r) / 2 | 0;
        e[t[f]] < u2 ? o = f + 1 : r = f;
      }
      u2 < e[t[o]] && (o > 0 && (n[s2] = t[o - 1]), t[o] = s2);
    }
  }
  for (o = t.length, r = t[o - 1]; o-- > 0; ) t[o] = r, r = n[r];
  return t;
}
function X({ children: e, target: n }) {
  let t;
  return V(() => {
    const o = (n instanceof Function ? n() : n) ?? document.body;
    t = N(o, e);
  }), J(() => {
    t();
  }), null;
}
function Se(e) {
  if (e instanceof Node) return e;
  if (typeof e == "string" || typeof e == "number") return document.createTextNode(String(e));
  throw new Error(`Unknown value: ${e}`);
}
function N(e, n) {
  const t = [];
  function o(s2, u2) {
    let f = [], d = [];
    const h = () => {
      for (const l2 of f) R$1(l2), l2.parentNode === e && e.removeChild(l2);
      for (const l2 of d) l2();
      f = [], d = [];
    }, c2 = _(), i2 = M(() => {
      try {
        h();
        const l2 = s2 instanceof Function ? s2() : s2, m2 = D$1(l2);
        for (const g2 of m2) if (!Z(g2)) if (typeof g2 == "function") {
          const y2 = document.createTextNode("");
          e.insertBefore(y2, u2);
          const re = o(g2, y2);
          d.push(re), f.push(y2);
        } else {
          const y2 = Se(g2);
          e.insertBefore(y2, u2), f.push(y2);
        }
      } catch (l2) {
        if (l2 instanceof Promise) c2 == null ? void 0 : c2(l2);
        else throw l2;
      }
    });
    return () => {
      i2(), h();
    };
  }
  const r = o(n, null);
  return t.push(r), () => {
    console.log("run");
    for (const s2 of t) s2();
  };
}
const xe = [G, Q, X];
function Y(e, n) {
  if (!xe.includes(e)) for (const t in n) n[t] = n[t] instanceof Function ? n[t]() : n[t];
}
const ee = /* @__PURE__ */ new WeakSet();
function te(e, n = {}, t, o) {
  Y(e, n);
  const r = o ? o().toString() + e.toString() : void 0, s2 = ye(r);
  I(s2);
  const u2 = de(e.name), f = D$1([u2, B$1(() => e({ ...n, children: t }))]).flat();
  return I(null), ve(u2, s2), f;
}
queueMicrotask(() => {
  p$1 || new MutationObserver((e) => {
    for (const n of e) for (const t of n.removedNodes) R$1(t);
  }).observe(document.body, { childList: true, subtree: true });
});
let $$1 = [], F = 0;
function ne() {
  return { renderedDOM: $$1, get currentDOM() {
    if (p$1) return;
    const e = $$1[F];
    if (e) return e;
  }, get isHydrating() {
    return F < $$1.length;
  }, nextElement: () => F++ };
}
function oe(e, n, t, o) {
  var _a;
  if (typeof e == "function") return te(e, n, t, o);
  v$1.push(((_a = n.xmlns) == null ? void 0 : _a.call(n)) ?? v$1[v$1.length - 1]);
  const r = $e(e);
  return le(r, n), N(r, t), v$1.pop(), r;
}
const v$1 = [];
function $e(e) {
  const { currentDOM: n, isHydrating: t, nextElement: o } = ne();
  if (t && n) try {
    if (n.tagName.toLocaleLowerCase() !== e) throw new Error("Hydration mismatch because the initial UI does not match what was rendered on the server");
    return n;
  } finally {
    o();
  }
  const r = v$1[v$1.length - 1];
  return r ? document.createElementNS(r, e) : document.createElement(e);
}
function u$1(n) {
  const o = [];
  for (const t in n) {
    if (t.startsWith("on") && typeof n[t] == "function") continue;
    const e = typeof n[t] == "function" ? n[t]() : n[t];
    if (t !== "ref" && t !== "style" && t !== "html") {
      if (typeof e == "boolean") {
        e && o.push(t);
        continue;
      }
      o.push(`${t}="${e}"`);
    }
  }
  return o.length > 0 && o.unshift(""), o.join(" ");
}
function m$1(n) {
  function o(t) {
    const e = [], f = t instanceof Function ? t() : t, i2 = D$1(f);
    for (const r of i2) if (!Z(r)) if (typeof r == "function") e.push(o(r));
    else {
      const c2 = y$2(r);
      e.push(c2);
    }
    return e.join("");
  }
  return o(n);
}
function y$2(n) {
  if (typeof n == "string" || typeof n == "number") return String(n);
  throw new Error(`Unknown value: ${n}`);
}
const $ = /* @__PURE__ */ new Set(["area", "base", "br", "col", "embed", "hr", "img", "input", "link", "meta", "param", "source", "track", "wbr"]);
function g(n, o, t) {
  if (typeof n == "function") {
    Y(n, o);
    const e = n({ ...o, children: t }), f = we();
    try {
      return s(e);
    } catch (i2) {
      if (i2 instanceof Promise) return (f == null ? void 0 : f()) || null;
      throw i2;
    }
  }
  return $.has(n) ? `<${n}${u$1(o)}>` : `<${n}${u$1(o)}>${m$1("html" in o ? o.html : t)}</${n}>`;
}
function s(n) {
  return n == null ? "" : typeof n == "function" ? s(n()) : Array.isArray(n) ? n.map(s).join("") : String(n);
}
function m(e) {
  return e();
}
const y$1 = /* @__PURE__ */ new WeakMap();
function R() {
  const r = Symbol("context");
  function t(n) {
    return y$1.set(r, n.value), n.children();
  }
  function e() {
    const n = y$1.get(r);
    if (!n) throw new Error("No provider found for context.");
    return n;
  }
  return [t, e];
}
function j$1(r) {
  const t = C();
  return M(() => {
    t.value = r();
  }), { get value() {
    return t.value;
  } };
}
const p = /* @__PURE__ */ new WeakMap();
function k(r) {
  function t(e) {
    if (p.has(e)) return p.get(e);
    const n = new Proxy(e, { get(o, u2, s2) {
      W$1(o, u2);
      const c2 = Reflect.get(o, u2, s2);
      if (typeof c2 == "function") return c2.bind(s2);
      const f = Reflect.getOwnPropertyDescriptor(o, u2);
      return (f == null ? void 0 : f.get) ? f.get.call(s2) : typeof c2 == "object" && c2 !== null ? t(c2) : c2;
    }, set(o, u2, s2, c2) {
      const f = o[u2], S2 = Reflect.set(o, u2, s2, c2);
      return f !== s2 && j$2(o, u2), S2;
    } });
    return p.set(e, n), n;
  }
  return t(r);
}
function v(r) {
  let t = true, e = null, n, o = null, u2 = "pending";
  const s2 = C(0), c2 = async () => {
    t = true, e = null, n = void 0, u2 = "pending", o = r(), o.then((f) => {
      n = f, e = null, u2 = "fulfilled", t = false, B$1(() => s2.value++);
    }).catch((f) => {
      n = void 0, e = f, u2 = "rejected", t = false, B$1(() => s2.value++);
    }), B$1(() => s2.value++);
  };
  return M(() => {
    c2();
  }), { get loading() {
    return s2.value, t;
  }, get error() {
    return e;
  }, get data() {
    if (s2.value, u2 === "pending") throw o;
    if (u2 === "rejected") throw e;
    return n;
  }, refetch: c2, mutate(f) {
    n = f, s2.value++;
  } };
}
const l$1 = /* @__PURE__ */ new Map();
function D(r, t) {
  if (p$1) return v(r);
  if (J(() => {
    l$1.delete(t);
  }), l$1.has(t)) return l$1.get(t);
  const e = v(r);
  return l$1.set(t, e), e;
}
const a = (s2, { children: r, ...o }, t) => p$1 ? g(s2, o, r) : oe(s2, o, r, t);
const u = typeof window > "u", c = k({ pathname: u ? "/" : window.location.pathname, search: u ? "" : window.location.search });
u || window.addEventListener("popstate", () => {
  c.pathname = window.location.pathname, c.search = window.location.search;
});
function j(n) {
  u ? c.pathname = n : (history.pushState(null, "", n), c.pathname = n, c.search = window.location.search);
}
function B(n, t = true) {
  const e = c.pathname.split("/").filter(Boolean), a2 = n.split("/").filter(Boolean);
  return t && e.length !== a2.length || !t && e.length < a2.length ? false : a2.every((r, o) => r.startsWith(":") || r === e[o]);
}
function W(n, t, e = "") {
  const a2 = (i2, m2) => (i2 + "/" + m2).replace(/\/+/g, "/"), r = n.split("/").filter(Boolean);
  for (const i2 of t) {
    const m2 = a2(e, i2.path), d = m2.split("/").filter(Boolean), h = {};
    let w2 = true;
    for (let s2 = 0; s2 < d.length; s2++) {
      const f = d[s2], g2 = r[s2];
      if (f == null ? void 0 : f.startsWith("*")) {
        const b2 = f.slice(1) || "wildcard";
        return h[b2] = r.slice(s2).join("/"), { chain: [i2], params: h };
      }
      if (f == null ? void 0 : f.startsWith(":")) {
        if (!g2) {
          w2 = false;
          break;
        }
        h[f.slice(1)] = g2;
      } else if (f !== g2) {
        w2 = false;
        break;
      }
    }
    if (w2) {
      if (i2.children) {
        const s2 = W(n, i2.children, m2);
        if (s2) return { chain: [i2, ...s2.chain], params: { ...h, ...s2.params } };
      }
      if (d.length === r.length) return { chain: [i2], params: h };
    }
  }
  const o = t.find((i2) => i2.path.startsWith("*"));
  if (o) {
    const i2 = o.path.slice(1) || "wildcard";
    return { chain: [o], params: { [i2]: r.join("/") } };
  }
}
const l = k({});
function x({ url: n, routes: t }) {
  return n && (c.pathname = n), () => {
    const e = W(c.pathname, t);
    if (e) {
      const { chain: a2, params: r } = e;
      for (const o in l) delete l[o];
      return Object.assign(l, r), y(a2);
    }
    for (const a2 in l) delete l[a2];
    return a(Ee, {});
  };
}
function y(n) {
  let t = () => a(Ee, {});
  for (let e = n.length - 1; e >= 0; e--) {
    const a$12 = n[e];
    if (a$12.component) {
      const r = t, o = a$12.component;
      t = () => a(o, { children: () => r });
    }
  }
  return a(t, {});
}
const Template = ({
  title,
  children
}) => {
  return a("div", {
    class: () => "p-2 w-full",
    children: () => [() => a("h1", {
      class: () => "font-bold text-2xl mb-2",
      children: () => title
    }), () => children()]
  });
};
const ButtonPageList = () => {
  return a(Template, {
    title: () => "Pages",
    children: () => a("ul", {
      class: () => "flex flex-col gap-2",
      children: () => [() => a("li", {
        children: () => a("button", {
          onClick: () => () => j("/"),
          disabled: () => B("/"),
          children: () => "All"
        })
      }), () => a("li", {
        children: () => a("button", {
          onClick: () => () => j("/forms"),
          disabled: () => B("/forms"),
          children: () => "Forms"
        })
      }), () => a("li", {
        children: () => a("button", {
          onClick: () => () => j("/contexts"),
          disabled: () => B("/contexts"),
          children: () => "Contexts"
        })
      }), () => a("li", {
        children: () => a("button", {
          onClick: () => () => j("/dropdown-list"),
          disabled: () => B("/dropdown-list"),
          children: () => "Dropdown Lists"
        })
      }), () => a("li", {
        children: () => a("button", {
          onClick: () => () => j("/non-async-suspense"),
          disabled: () => B("/non-async-suspense"),
          children: () => "Non Async Suspense"
        })
      }), () => a("li", {
        children: () => a("button", {
          onClick: () => () => j("/stacked-suspense"),
          disabled: () => B("/stacked-suspense"),
          children: () => "Stacked Suspense"
        })
      }), () => a("li", {
        children: () => a("button", {
          onClick: () => () => j("/pokedex-list"),
          disabled: () => B("/pokedex-list"),
          children: () => "PokeDex List"
        })
      }), () => a("li", {
        children: () => a("button", {
          onClick: () => () => j("/pokedex-list-suspense"),
          disabled: () => B("/pokedex-list-suspense"),
          children: () => "PokeDex List with Suspense"
        })
      })]
    })
  });
};
function Contexts() {
  return a(Template, {
    title: () => "Contexts",
    children: () => [() => a(Form, {
      children: () => a(Input$1, {})
    }), () => a(Form, {
      children: () => a(Wrapper, {
        children: () => a(Input$1, {})
      })
    })]
  });
}
const [FormProvider, formContext] = R();
function Form({
  children
}) {
  const state2 = k({
    name: ""
  });
  return a(FormProvider, {
    value: () => state2,
    children: () => children()
  });
}
function Wrapper({
  children
}) {
  return a(Ee, {
    children: () => [() => a("div", {
      children: () => "Hi"
    }), () => " ", () => children()]
  });
}
const i = C(0);
setInterval(() => {
  i.value++;
}, 1e3);
function Input$1() {
  const forms = formContext();
  const nameEl = a("div", {
    children: () => [() => "Name: ", () => forms.name, () => " Hi"]
  });
  console.log("rerendering");
  return a(Ee, {
    children: () => [() => a("div", {
      children: () => [() => "Name: ", () => forms.name]
    }), () => nameEl, () => a("input", {
      type: () => "text",
      name: () => "name",
      onInput: () => (event) => forms.name = event.currentTarget.value,
      placeholder: () => "name",
      autoComplete: () => "off"
    }), " ", () => i.value]
  });
}
const name = k({
  firstName: "First name",
  lastName: "Last name"
});
const Dropdowns = () => {
  const dropdownStore = k({
    showDropdown: true,
    sortDirection: "asc",
    numbers: [1, 2, 3, 4, 5, 6, 7, 8],
    handleSort() {
      this.numbers = [...this.numbers].sort((a2, b2) => {
        return this.sortDirection === "desc" ? a2 - b2 : b2 - a2;
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
      currentNumbers = currentNumbers.sort((a2, b2) => a2 - b2);
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
  V(async () => {
    console.log("Dropdowns onMount");
  });
  J(async () => {
    console.log("Dropdowns onDestroy");
  });
  return a(Template, {
    title: () => "Dropdown List",
    children: () => a("div", {
      class: () => "flex flex-col gap-4",
      children: () => [() => a("div", {
        children: () => a("div", {
          class: () => "flex gap-2 items-center",
          children: () => [() => a("span", {
            children: () => "Add Dropdown"
          }), () => a("button", {
            class: () => "btn",
            onClick: () => dropdownStore.addDropdown,
            children: () => "+"
          }), () => a("button", {
            class: () => "btn",
            onClick: () => dropdownStore.removeDropdown,
            children: () => "-"
          })]
        })
      }), () => a("div", {
        class: () => "flex gap-2 items-center",
        children: () => [() => a("span", {
          children: () => "Sort"
        }), () => a("button", {
          class: () => "btn",
          onClick: () => dropdownStore.handleSort,
          children: () => dropdownStore.sortDirection === "asc" ? "↑" : "↓"
        }), () => a("button", {
          class: () => "btn",
          onClick: () => dropdownStore.handleRandomize,
          children: () => "Randomize"
        })]
      }), () => a("div", {
        children: () => a("button", {
          onClick: () => () => dropdownStore.showDropdown = !dropdownStore.showDropdown,
          children: () => "Unmount Dropdown List"
        })
      }), () => dropdownStore.showDropdown && a(DropdownList, {
        dropdowns: () => dropdownStore
      }), () => a("div", {
        children: () => "Hi"
      })]
    })
  });
};
const DropdownList = ({
  dropdowns
}) => {
  console.log("rerender");
  V(async () => {
    console.log("DropdownList onMount");
  });
  J(async () => {
    console.log("DropdownList onDestroy");
  });
  return a("div", {
    class: () => "flex gap-2 flex-col lg:flex-row",
    children: () => dropdowns.numbers.map((number) => a(Dropdown, {
      number: () => number
    }, () => number))
  });
};
const Dropdown = ({
  number
}) => {
  const isOpen = C(false);
  const handleToggle = () => {
    isOpen.value = !isOpen.value;
  };
  return a(Ee, {
    children: () => a("div", {
      class: () => "relative lg:w-[calc(100%/8)]",
      children: () => [() => a("div", {
        children: () => [() => a("button", {
          class: () => "btn w-full",
          onClick: () => handleToggle,
          children: () => [() => "Open Dropdown ", () => number]
        }), () => a("div", {
          class: () => "break-all",
          children: () => [() => "Hi ", () => name.firstName]
        })]
      }), () => isOpen.value && a("div", {
        class: () => "absolute bg-white border border-gray-200 rounded p-4 w-[200px] z-10",
        children: () => a("ul", {
          children: () => Array.from({
            length: 3
          }).map((_2, i2) => i2 + 1).map((item) => a("li", {
            class: () => "cursor-pointer p-2 rounded hover:bg-gray-100",
            children: () => [() => "Dropdown ", () => item]
          }))
        })
      })]
    })
  });
};
const Forms = () => {
  return a(Template, {
    title: () => "Forms",
    children: () => a("div", {
      children: () => [() => a("div", {
        children: () => [() => a("label", {
          class: () => "break-all",
          for: () => "name-input2",
          children: () => [() => "Hi ", () => name.firstName]
        }), () => a("div", {
          children: () => a("input", {
            type: () => "text",
            value: () => name.firstName,
            id: () => "name-input2"
          })
        })]
      }), () => a("div", {
        children: () => [() => a(Counter, {}), () => a(Input, {})]
      })]
    })
  });
};
function Counter() {
  const count = C(0);
  const double = j$1(() => count.value);
  const handleCount = () => {
    count.value++;
  };
  M(() => {
  });
  M(() => {
  });
  J(() => {
    console.log("bye");
  });
  return a(Ee, {
    children: () => [() => count.value, () => a("div", {
      children: () => [() => "Count: ", () => count.value]
    }), () => a("div", {
      children: () => [() => "Double Count: ", () => double.value]
    }), () => a("button", {
      disabled: () => count.value >= 5,
      onClick: () => handleCount,
      children: () => "Add counter"
    }), () => a("div", {
      children: () => count.value <= 3 ? a("div", {
        children: () => "Hi"
      }) : "string"
    })]
  });
}
function Input() {
  return a("div", {
    children: () => [() => a("label", {
      class: () => "break-all",
      for: () => "name-input",
      children: () => [() => "Name ", () => name.firstName, () => " ", () => a("span", {
        children: () => "Hi"
      })]
    }), () => a("div", {
      children: () => a("input", {
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
  return a(Template, {
    title: () => "Non-Async Suspense",
    children: () => a("div", {
      children: () => a(G, {
        fallback: () => a("div", {
          children: () => "hi"
        }),
        children: () => a("div", {
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
  const pokeDex = k({
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
      this.pokeDexList = [...this.pokeDexList].sort((a2, b2) => {
        const cmp = a2[key].localeCompare(b2[key]);
        return this.sortDirection === "asc" ? cmp : -cmp;
      });
    }
  });
  V(async () => {
    const controller = new AbortController();
    await pokeDex.fetchData("https://pokeapi.co/api/v2/pokemon/?offset=1100&limit=20", controller);
    return () => {
      console.log("Cleaning up PokeDex component");
      controller.abort();
    };
  });
  return a(Template, {
    title: () => "PokeDex List",
    children: () => [() => a("div", {
      class: () => "break-all",
      children: () => [() => "Hi ", () => name.firstName]
    }), () => a("table", {
      class: () => "w-full mx-auto my-2 table-fixed",
      children: () => [() => a("thead", {
        children: () => a("tr", {
          children: () => [() => a("th", {
            class: () => "w-1/3",
            children: () => "ID"
          }), () => a("th", {
            onClick: () => () => pokeDex.handleSort("name"),
            class: () => "select-none cursor-pointer w-1/3",
            children: () => "Name"
          }), () => a("th", {
            onClick: () => () => pokeDex.handleSort("url"),
            class: () => "select-none cursor-pointer w-1/3",
            children: () => "URL"
          })]
        })
      }), () => a("tbody", {
        children: () => [() => pokeDex.isLoading && a(Ee, {
          children: () => Me(() => Array.from({
            length: 20
          }).map((_2, i2) => i2 + 1)).each((number) => a("tr", {
            children: () => a("td", {
              colSpan: () => 3,
              class: () => "h-[24px] text-center",
              children: () => number === 10 && "loading..."
            })
          }))
        }), () => !pokeDex.isLoading && a(Ee, {
          children: () => Me(() => pokeDex.pokeDexList).each(({
            name: name2,
            url
          }, index) => a("tr", {
            children: () => [() => a("td", {
              class: () => "w-1/3 text-center",
              children: () => index.value + 1
            }), () => a("td", {
              class: () => "w-1/3 text-center truncate",
              children: () => name2
            }), () => a("td", {
              class: () => "w-1/3 text-center truncate",
              onClick: () => () => alert(url),
              children: () => url
            })]
          }))
        })]
      })]
    }), () => a("div", {
      class: () => "flex gap-4 justify-center",
      children: () => [() => a("button", {
        class: () => "btn",
        onClick: () => () => pokeDex.fetchData(pokeDex.prevLink),
        disabled: () => pokeDex.isLoading || !pokeDex.prevLink,
        children: () => "Previous"
      }), () => a("button", {
        class: () => "btn",
        onClick: () => () => pokeDex.fetchData(pokeDex.nextLink),
        disabled: () => pokeDex.isLoading || !pokeDex.nextLink,
        children: () => "Next"
      })]
    })]
  });
};
const PokeDexSuspense = () => {
  const pokeDex = k({
    url: "https://pokeapi.co/api/v2/pokemon/?offset=1100&limit=20",
    sortDirection: "asc",
    sort(key) {
      if (!pokeDexResource.data) return;
      this.sortDirection = this.sortDirection === "asc" ? "desc" : "asc";
      pokeDexResource.mutate({
        ...pokeDexResource.data,
        results: [...pokeDexResource.data.results].sort((a2, b2) => {
          const cmp = a2[key].localeCompare(b2[key]);
          return this.sortDirection === "asc" ? cmp : -cmp;
        })
      });
    },
    changeUrl(newUrl) {
      if (pokeDexResource.loading || !newUrl) return;
      this.url = newUrl.replace(/limit=\d+/, "limit=20");
    }
  });
  const pokeDexResource = D(async () => {
    const response = await fetch(pokeDex.url);
    const json = await response.json();
    await sleep(1e3);
    return json;
  }, "pokedex-resource");
  const showUrlOnClick = (url) => () => alert(url);
  const sortOnClick = (key) => () => pokeDex.sort(key);
  return a(Template, {
    title: () => "PokeDex List (via Suspense)",
    children: () => a("div", {
      children: () => [() => a("div", {
        class: () => "break-all",
        children: () => [() => "Hi ", () => name.firstName]
      }), () => a("table", {
        class: () => "w-full mx-auto my-2 table-fixed",
        children: () => [() => a("thead", {
          children: () => a("tr", {
            children: () => [() => a("th", {
              class: () => "w-1/3",
              children: () => "ID"
            }), () => a("th", {
              onClick: () => sortOnClick("name"),
              class: () => "select-none cursor-pointer w-1/3",
              children: () => "Name"
            }), () => a("th", {
              onClick: () => sortOnClick("url"),
              class: () => "select-none cursor-pointer w-1/3",
              children: () => "URL"
            })]
          })
        }), () => a("tbody", {
          children: () => a(G, {
            fallback: () => a(Ee, {
              children: () => Array.from({
                length: 20
              }).map((_2, i2) => i2 + 1).map((number) => a("tr", {
                children: () => a("td", {
                  colSpan: () => 3,
                  class: () => "h-[24px] text-center",
                  children: () => number === 10 && "loading..."
                })
              }))
            }),
            children: () => a(Ee, {
              children: () => pokeDexResource.data.results.map(({
                name: name2,
                url
              }, index) => a("tr", {
                children: () => [() => a("td", {
                  class: () => "w-1/3 text-center",
                  children: () => index + 1
                }), () => a("td", {
                  class: () => "w-1/3 text-center truncate",
                  children: () => name2
                }), () => a("td", {
                  class: () => "w-1/3 text-center truncate",
                  onClick: () => showUrlOnClick(url),
                  children: () => url
                })]
              }))
            })
          })
        })]
      }), () => a("div", {
        class: () => "flex gap-4 justify-center",
        children: () => [() => a("button", {
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
        }), () => a("button", {
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
  const msg2 = D(async () => {
    await new Promise((resolve) => {
      setTimeout(resolve, 2e3);
    });
    return "hello world 2";
  }, "outer-suspense");
  return a(Template, {
    title: () => "Stacked Suspense",
    children: () => a("div", {
      class: () => "p-2 flex flex-col container m-auto",
      children: () => a(G, {
        fallback: () => a("div", {
          children: () => "loading 1..."
        }),
        children: () => [() => a(G, {
          fallback: () => a("div", {
            children: () => "loading 2..."
          }),
          children: () => msg2.data
        }), () => a(Component, {})]
      })
    })
  });
};
function Component() {
  const msg = D(async () => {
    await sleep(1e3);
    return "hello world";
  }, "inner-suspense");
  return a("div", {
    children: () => msg.data
  });
}
const routes = [{
  path: "/",
  component: ({
    children
  }) => a("div", {
    class: () => "p-2 flex flex-col container m-auto",
    children: () => [() => a(ButtonPageList, {}), () => children()]
  }),
  children: [{
    path: "/",
    component: () => a(Ee, {
      children: () => [() => a(Forms, {}), () => a(Contexts, {}), () => a(Dropdowns, {}), () => a(NonAsyncSuspense, {}), () => a(StackedSuspense, {}), () => a(PokeDex, {}), () => a(PokeDexSuspense, {})]
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
  return m(() => a(x, {
    url: () => url,
    routes: () => routes
  }));
};
export {
  render
};
