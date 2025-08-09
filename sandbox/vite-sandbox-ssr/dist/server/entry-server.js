const ie = /* @__PURE__ */ new Set(["animationIterationCount", "borderImageOutset", "borderImageSlice", "borderImageWidth", "boxFlex", "boxFlexGroup", "boxOrdinalGroup", "columnCount", "flex", "flexGrow", "flexPositive", "flexShrink", "flexNegative", "flexOrder", "gridRow", "gridColumn", "fontWeight", "lineClamp", "lineHeight", "opacity", "order", "orphans", "tabSize", "widows", "zIndex", "zoom", "fillOpacity", "floodOpacity", "stopOpacity", "strokeDasharray", "strokeDashoffset", "strokeMiterlimit", "strokeOpacity", "strokeWidth"]), b = typeof document > "u";
function fe(e) {
  const n = [];
  for (const t in e) {
    if (t.startsWith("on") && typeof e[t] == "function") continue;
    const o = typeof e[t] == "function" ? e[t]() : e[t];
    if (t !== "ref" && t !== "style") {
      if (typeof o == "boolean") {
        o && n.push(t);
        continue;
      }
      n.push(`${t}="${o}"`);
    }
  }
  return n.length > 0 && n.unshift(""), n.join(" ");
}
function L(e) {
  if (e instanceof Node) return e;
  if (typeof e == "string" || typeof e == "number") return document.createTextNode(String(e));
  throw new Error(`Unknown value: ${e}`);
}
const k$1 = /* @__PURE__ */ new Map(), ue = (e) => {
  let n;
  return e !== void 0 ? (k$1.has(e) || k$1.set(e, {
    states: []
  }), n = k$1.get(e)) : n = {
    states: []
  }, {
    ...n,
    index: 0
  };
};
let U = null;
function A(e) {
  U = e;
}
function x() {
  return U;
}
const _ = /* @__PURE__ */ new Map();
function q(e, n) {
  _.set(e, n);
}
function ae(e) {
  return _.get(e);
}
function E(e) {
  let n;
  return process.env.NODE_ENV === "development" ? n = document.createComment(le(e)) : n = document.createTextNode(""), v.add(n), n;
}
function le(e) {
  return e.replace(/([a-z0-9])([A-Z])/g, "$1-$2").replace(/([A-Z])([A-Z][a-z])/g, "$1-$2").toLowerCase();
}
const B = (e) => e == null || e === false;
const y = (e) => (Array.isArray(e) ? e : [e]).flat(1 / 0);
function de(e) {
  const n = [];
  for (const t of y(O(e)).flat()) t && n.push(t);
  return n.join("");
}
function O(e) {
  if (typeof e == "string") return e;
  if (!B(e)) return e instanceof Function ? O(e()) : Array.isArray(e) ? e.map(O).flat() : String(e);
}
function he(e, n, t) {
  if (typeof e == "function") {
    for (const o in n) n[o] = n[o] instanceof Function ? n[o]() : n[o];
    return e({
      ...n,
      children: t
    });
  }
  return `<${e}${fe(n)}>${de(t)}</${e}>`;
}
const G = (e, {
  children: n = [],
  ...t
}, o) => b ? he(e, t, y(n)) : Pe(e, t, n, o);
let a = null;
function Z(e) {
  a = e;
}
const T = /* @__PURE__ */ new Set();
let P = false;
function me(e) {
  T.add(e), P || (P = true, queueMicrotask(() => {
    for (const n of T) n();
    T.clear(), P = false;
  }));
}
function $(e) {
  const n = x(), t = async () => {
    F(t), t.cleanup && (t.cleanup(), t.cleanup = void 0);
    const r = a;
    a = t, n && n.effect.push(t);
    try {
      const s = e();
      if (typeof s == "function") t.cleanup = s;
      else if (s instanceof Promise) {
        const c = await s;
        typeof c == "function" && (t.cleanup = c);
      }
    } finally {
      a = r;
    }
  }, o = () => F(t);
  return t.deps = [], t(), o;
}
function F(e) {
  if (e.deps) {
    for (const n of e.deps) n.delete(e);
    e.deps.length = 0;
  }
  e.cleanup && (e.cleanup(), e.cleanup = void 0);
}
const R = /* @__PURE__ */ new WeakMap();
function J(e, n) {
  if (!a) return;
  let t = R.get(e);
  t || (t = /* @__PURE__ */ new Map(), R.set(e, t));
  let o = t.get(n);
  o || (o = /* @__PURE__ */ new Set(), t.set(n, o)), o.has(a) || (o.add(a), a.deps ? a.deps.push(o) : a.deps = [o]);
}
function V(e, n) {
  const t = R.get(e);
  if (!t) return;
  const o = t.get(n);
  if (o) for (const r of o) me(r);
}
function K(e) {
  const n = x();
  if (n && n.state) {
    const {
      states: t,
      index: o
    } = n.state;
    if (t.length <= o) {
      const r = Q(e);
      t.push(r);
    }
    return t[n.state.index++];
  }
  return Q(e);
}
function Q(e) {
  const n = {
    value: e
  };
  return new Proxy(n, {
    get(t, o, r) {
      return J(t, o), Reflect.get(t, o, r);
    },
    set(t, o, r, s) {
      const c = t[o], i = Reflect.set(t, o, r, s);
      return c !== r && V(t, o), i;
    }
  });
}
function I(e) {
  const n = a;
  Z(null);
  try {
    return e();
  } finally {
    Z(n);
  }
}
const D = /* @__PURE__ */ new Map();
function ye(e, n) {
  D.set(e, n);
}
function H(e) {
  const n = D.get(e);
  if (n) {
    for (const t of n) t();
    D.delete(e);
  }
  for (const t of e.childNodes) H(t);
}
function X(e) {
  if (b) return;
  const n = x();
  if (n && n.destroy) n.destroy.push(e);
  else throw new Error("onDestroy called outside of component");
}
function W(e) {
  if (b) return;
  const n = x();
  if (n && n.mount) n.mount.push(e);
  else throw new Error("onMount called outside of component");
}
function ve(e) {
  const n = ae(e);
  if (!n) return;
  const t = [];
  ye(e, t), requestAnimationFrame(() => {
    Promise.resolve().then(async () => {
      for (const o of n.mount) {
        const r = await o();
        r && t.push(r);
      }
      for (const o of n.destroy) t.push(o);
      for (const o of n.effect) t.push(() => Promise.resolve(F(o)));
    });
  });
}
const C = /* @__PURE__ */ new WeakMap();
function we(e, n, t) {
  let o = C.get(e);
  o || (o = /* @__PURE__ */ new Map(), C.set(e, o)), o.has(n) && e.removeEventListener(n, o.get(n)), e.addEventListener(n, t), o.set(n, t);
}
function xe(e, n) {
  const t = C.get(e);
  if (!t) return;
  const o = t.get(n);
  o && (e.removeEventListener(n, o), t.delete(n)), t.size === 0 && C.delete(e);
}
function Ee(e, n) {
  for (const t in n) $(() => {
    const o = n[t], r = typeof o == "function" && t !== "ref" ? o() : o;
    if (t.startsWith("on") && e instanceof HTMLElement) {
      const c = t.slice(2).toLowerCase();
      return we(e, c, r), () => xe(e, c);
    }
    const s = e instanceof HTMLInputElement || e instanceof HTMLTextAreaElement || e instanceof HTMLSelectElement;
    if (t === "value" && s && typeof n.onInput != "function" && typeof n.onChange != "function") {
      e.value = r;
      const c = () => {
        e.value !== r && (e.value = r);
      };
      return e.setAttribute(t, r), e.addEventListener("input", c), () => e.removeEventListener("input", c);
    }
    if (t === "ref" && typeof r == "function") {
      r(e);
      return;
    }
    if (t === "style" && typeof r == "object" && e instanceof HTMLElement) {
      Se(e, r);
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
function Se(e, n) {
  if (e instanceof HTMLElement) for (const t in n) {
    if (!Object.hasOwn(n, t)) continue;
    const o = n[t];
    if (o == null || t === "length" || t === "parentRule") continue;
    const r = typeof o == "number", s = r && !ie.has(t);
    e.style[t] = r ? s ? `${o}px` : `${o}` : String(o);
  }
}
function Y({
  children: e
}) {
  return () => e instanceof Function ? e() : e;
}
function N(e, n, t = null) {
  const o = [];
  function r(c, i) {
    let f = [], u = [];
    const l = () => {
      for (const p2 of f) H(p2), p2.parentNode === e && e.removeChild(p2);
      for (const p2 of u) p2();
      f = [], u = [];
    }, m = $(() => {
      const p2 = ee();
      try {
        l();
        const g = y(c instanceof Function ? c() : c);
        for (const w of g) if (!B(w)) if (typeof w == "function") {
          const d = E("childAnchor");
          e.insertBefore(d, i);
          const ce = r(w, d);
          u.push(ce), f.push(d);
        } else {
          const d = L(w);
          ve(d), e.insertBefore(d, i), f.push(d);
        }
      } catch (g) {
        if (g instanceof Promise) p2 && p2(g);
        else throw g;
      }
    });
    return () => {
      m(), l();
    };
  }
  const s = r(n, t);
  return o.push(s), () => {
    for (const c of o) c();
  };
}
const M = [];
function z(e) {
  const {
    fallback: n,
    children: t
  } = e;
  let o;
  const r = E("Suspense"), s = () => t(), c = () => n == null ? void 0 : n(), i = [], f = (l) => {
    queueMicrotask(() => {
      i.forEach((m) => m()), c && u(c);
    }), l.then(() => {
      i.forEach((m) => m()), u(s);
    });
  }, u = (l) => {
    o && (M.push(f), i.push(N(o, l, r)), M.pop());
  };
  return W(() => {
    r.parentNode && (o = r.parentNode, u(s));
  }), r;
}
function ee() {
  return M[M.length - 1];
}
function te(e, n) {
  for (const t of n.nodes) e.contains(t) && (H(t), e.removeChild(t));
}
function $e(e, n, t) {
  for (const o of n) e.insertBefore(o, t);
}
function Ce(e, n, t, o) {
  const r = /* @__PURE__ */ new Map();
  let s = e.nextSibling;
  for (let c = 0; c < o.length; c++) {
    const i = o[c];
    r.set(i, (r.get(i) || 0) + 1);
    let f = 0;
    const u = t.find((l) => l.item === i && ++f === r.get(i));
    u && (I(() => u.index.value = c), $e(n, u.nodes, s), s = u.nodes[u.nodes.length - 1].nextSibling);
  }
}
function ne(e) {
  const n = /* @__PURE__ */ new Map();
  for (const t of e) n.set(t, (n.get(t) || 0) + 1);
  return n;
}
function Ne(e, n, t) {
  const o = ne(n), r = ne(t.map((s) => s.item));
  return t.filter((s) => (r.get(s.item) ?? 0) > (o.get(s.item) ?? 0) ? (te(e, s), r.set(s.item, (r.get(s.item) ?? 0) - 1), false) : true);
}
function Me(e, n, t) {
  const o = [], r = /* @__PURE__ */ new Map();
  for (const s of e) if (r.set(s, (r.get(s) || 0) + 1), n.filter((c) => c.item === s).length + o.filter((c) => c.item === s).length < (r.get(s) || 0)) {
    const c = K(-1), i = y(L(t(s, c)));
    o.push({
      item: s,
      nodes: i,
      index: c
    });
  }
  return o;
}
function j({
  children: e,
  each: n,
  handler: t
}) {
  const o = E("Loop");
  v.add(o);
  let r = [];
  function s(i, f) {
    r = Ne(i, f, r), r.push(...Me(f, r, e)), Ce(o, i, r, f);
  }
  const c = () => {
    $(() => {
      try {
        const i = o.parentNode;
        if (!i) return;
        const f = n();
        if (!f) return;
        s(i, [...f]);
      } catch (i) {
        if (i instanceof Promise) t && t(i);
        else throw i;
      }
    });
  };
  return W(() => {
    c();
  }), X(() => {
    for (const i of r) te(o.parentNode, i);
  }), o;
}
const Le = [z, j];
function ke(e, n) {
  if (!Le.includes(e)) for (const t in n) n[t] = n[t] instanceof Function ? n[t]() : n[t];
}
const v = /* @__PURE__ */ new WeakSet(), Ae = [z, j, Y];
function oe(e, {
  key: n,
  ...t
}, o) {
  ke(e, t);
  const r = n ? n().toString() + e.toString() : void 0, s = {
    id: crypto.randomUUID(),
    mount: [],
    state: ue(r),
    effect: [],
    destroy: []
  };
  A(s);
  const c = y(I(() => e({
    ...t,
    children: o
  })));
  if (v.has(c[0]) && Ae.includes(e)) return A(null), q(c[0], s), c;
  const i = E(e.name);
  return v.add(i), A(null), q(i, s), [i, ...c];
}
let re = [], se = 0;
function Oe() {
  try {
    const e = re[se];
    if (!e) return;
    for (let n = 0; n < e.childNodes.length; n++) {
      const t = e.childNodes[n];
      t instanceof Text && t.remove();
    }
    return e;
  } finally {
    se++;
  }
}
function Pe(e, n, t, o) {
  var _a;
  if (typeof e == "function") return oe(e, {
    key: o,
    ...n
  }, t);
  h.push(((_a = n.xmlns) == null ? void 0 : _a.call(n)) ?? h[h.length - 1]);
  const r = Fe(e);
  return Ee(r, n), N(r, t), h.pop(), r;
}
const h = [];
function Fe(e) {
  const n = Oe();
  if (n) return n;
  const t = h[h.length - 1];
  return t ? document.createElementNS(t, e) : document.createElement(e);
}
const p = /* @__PURE__ */ new WeakMap();
function k(r) {
  function t(e) {
    if (p.has(e)) return p.get(e);
    const n = new Proxy(e, {
      get(o, c, f) {
        J(o, c);
        const u = Reflect.get(o, c, f);
        if (typeof u == "function") return u.bind(f);
        const s = Reflect.getOwnPropertyDescriptor(o, c);
        return (s == null ? void 0 : s.get) ? s.get.call(f) : typeof u == "object" && u !== null ? t(u) : u;
      },
      set(o, c, f, u) {
        const s = o[c], y2 = Reflect.set(o, c, f, u);
        return s !== f && V(o, c), y2;
      }
    });
    return p.set(e, n), n;
  }
  return t(r);
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
      for (let i = result.length - 1; i > 0; i--) {
        const j2 = Math.floor(Math.random() * (i + 1));
        [result[i], result[j2]] = [result[j2], result[i]];
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
  return G(Y, {
    children: () => G("div", {
      class: () => "flex flex-col gap-4",
      children: () => [() => G("div", {
        children: () => G("div", {
          class: () => "flex gap-2 items-center",
          children: () => [() => G("span", {
            children: () => "Add Dropdown"
          }), () => G("button", {
            class: () => "btn",
            onClick: () => dropdownStore.addDropdown,
            children: () => "+"
          }), () => G("button", {
            class: () => "btn",
            onClick: () => dropdownStore.removeDropdown,
            children: () => "-"
          })]
        })
      }), () => G("div", {
        class: () => "flex gap-2 items-center",
        children: () => [() => G("span", {
          children: () => "Sort"
        }), () => G("button", {
          class: () => "btn",
          onClick: () => dropdownStore.handleSort,
          children: () => dropdownStore.sortDirection === "asc" ? "↑" : "↓"
        }), () => G("button", {
          class: () => "btn",
          onClick: () => dropdownStore.handleRandomize,
          children: () => "Randomize"
        })]
      }), () => G("div", {
        children: () => G("button", {
          onClick: () => () => dropdownStore.showDropdown = !dropdownStore.showDropdown,
          children: () => "Unmount Dropdown List"
        })
      }), () => dropdownStore.showDropdown && G(DropdownList, {
        dropdowns: () => dropdownStore
      }), () => G("div", {
        children: () => "Hi"
      })]
    })
  });
};
const DropdownList = ({
  dropdowns
}) => {
  return G("div", {
    class: () => "flex gap-2 flex-col lg:flex-row",
    children: () => dropdowns.numbers.map((number) => G(Dropdown, {
      number: () => number
    }, () => number))
  });
};
const Dropdown = ({
  number
}) => {
  const isOpen = K(false);
  const handleToggle = () => {
    isOpen.value = !isOpen.value;
  };
  return G(Y, {
    children: () => G("div", {
      class: () => "relative lg:w-[calc(100%/8)]",
      children: () => [() => G("div", {
        children: () => [() => G("button", {
          class: () => "btn w-full",
          onClick: () => handleToggle,
          children: () => ["Open Dropdown ", () => number]
        }), () => G("div", {
          class: () => "break-all",
          children: () => ["Hi ", () => name.firstName]
        })]
      }), () => isOpen.value && G("div", {
        class: () => "absolute bg-white border border-gray-200 rounded p-4 w-[200px] z-10",
        children: () => G("ul", {
          children: () => Array.from({
            length: 3
          }).map((_2, i) => i + 1).map((item) => G("li", {
            class: () => "cursor-pointer p-2 rounded hover:bg-gray-100",
            children: () => ["Dropdown ", () => item]
          }))
        })
      })]
    })
  });
};
function App() {
  return G("div", {
    children: () => G(Dropdowns, {})
  });
}
const render = () => {
  return G(App, {});
};
export {
  render
};
