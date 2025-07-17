import { lazy, Suspense } from "vynn";
import { Route, Router } from "vynn-router";

import Layout from "./Layout";
import { ComputedPage } from "./pages/ComputedPage";
import { EffectPage } from "./pages/EffectPage";
import { HomePage } from "./pages/HomePage";
import { InstallationPage } from "./pages/InstallationPage";
import { IntroductionPage } from "./pages/IntroductionPage";
import { LazyPage } from "./pages/LazyPage";
import { LoopPage } from "./pages/LoopPage";
import { MemoPage } from "./pages/MemoPage";
import { OnDestroyPage } from "./pages/OnDestroyPage";
import { OnMountPage } from "./pages/OnMountPage";
import { ResourcePage } from "./pages/ResourcePage";
import { StatePage } from "./pages/StatePage";
import { StorePage } from "./pages/StorePage";
import { SuspensePage } from "./pages/SuspensePage";
import { ThingsToKnowPage } from "./pages/ThingsToKnowPage";

export const App = () => {
  return (
    <Suspense>
      <Router routes={routes} />
    </Suspense>
  );
};

export const routes: Route[] = [
  {
    path: "/",
    component: lazy(async () => ({ default: HomePage })),
  },
  {
    path: "/docs",
    component: Layout,
    children: [
      {
        path: "/introduction",
        component: lazy(async () => ({ default: IntroductionPage })),
      },
      {
        path: "/installation",
        component: lazy(async () => ({ default: InstallationPage })),
      },
      {
        path: "/things-to-know",
        component: lazy(async () => ({ default: ThingsToKnowPage })),
      },
      {
        path: "/core-concepts/on-mount",
        component: lazy(async () => ({ default: OnMountPage })),
      },
      {
        path: "/core-concepts/on-destroy",
        component: lazy(async () => ({ default: OnDestroyPage })),
      },
      {
        path: "/core-concepts/state",
        component: lazy(async () => ({ default: StatePage })),
      },
      {
        path: "/core-concepts/store",
        component: lazy(async () => ({ default: StorePage })),
      },
      {
        path: "/core-concepts/computed",
        component: lazy(async () => ({ default: ComputedPage })),
      },
      {
        path: "/core-concepts/effect",
        component: lazy(async () => ({ default: EffectPage })),
      },
      {
        path: "/core-concepts/resource",
        component: lazy(async () => ({ default: ResourcePage })),
      },
      {
        path: "/core-concepts/suspense",
        component: lazy(async () => ({ default: SuspensePage })),
      },
      {
        path: "/core-concepts/lazy",
        component: lazy(async () => ({ default: LazyPage })),
      },
      {
        path: "/core-concepts/loop",
        component: lazy(async () => ({ default: LoopPage })),
      },
      {
        path: "/core-concepts/memo",
        component: lazy(async () => ({ default: MemoPage })),
      },
    ],
  },
];
