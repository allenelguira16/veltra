import { Route, Router } from "@veltra/router";

import { Layout } from "./Layout";
import { Computed } from "./pages/Computed";
import { Effect } from "./pages/Effect";
import { Home } from "./pages/Home";
import { Installation } from "./pages/Installation";
import { Introduction } from "./pages/Introduction";
import { Lazy } from "./pages/Lazy";
import { Loop } from "./pages/Loop";
import { Memo } from "./pages/Memo";
import { OnDestroy } from "./pages/OnDestroy";
import { OnMount } from "./pages/OnMount";
import { Resource } from "./pages/Resource";
import { State } from "./pages/State";
import { Store } from "./pages/Store";
import { Suspense } from "./pages/Suspense";

export const App = () => {
  return (
    <>
      <Router routes={routes} />
    </>
  );
};

export const routes: Route[] = [
  {
    path: "/",
    component: () => <Home />,
  },
  {
    path: "/docs",
    component({ children }) {
      return <Layout>{children()}</Layout>;
    },
    children: [
      {
        path: "/introduction",
        component: () => <Introduction />,
      },
      {
        path: "/installation",
        component: () => <Installation />,
      },
      {
        path: "/core-concepts/on-mount",
        component: () => <OnMount />,
      },
      {
        path: "/core-concepts/on-destroy",
        component: () => <OnDestroy />,
      },
      {
        path: "/core-concepts/state",
        component: () => <State />,
      },
      {
        path: "/core-concepts/store",
        component: () => <Store />,
      },
      {
        path: "/core-concepts/computed",
        component: () => <Computed />,
      },
      {
        path: "/core-concepts/effect",
        component: () => <Effect />,
      },
      {
        path: "/core-concepts/resource",
        component: () => <Resource />,
      },
      {
        path: "/core-concepts/resource",
        component: () => <Resource />,
      },
      {
        path: "/core-concepts/suspense",
        component: () => <Suspense />,
      },
      {
        path: "/core-concepts/lazy",
        component: () => <Lazy />,
      },
      {
        path: "/core-concepts/loop",
        component: () => <Loop />,
      },
      {
        path: "/core-concepts/memo",
        component: () => <Memo />,
      },
    ],
  },
];
