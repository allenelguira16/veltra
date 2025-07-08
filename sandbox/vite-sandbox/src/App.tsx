import { location, navigate, Route, Router } from "@veltra/router";

import { Contextual } from "./components/Contextual";
import { Dropdowns } from "./components/DropdownList";
import { Forms } from "./components/Forms";
import { PokeDex } from "./components/PokeDex";
import { PokeDexSuspense } from "./components/PokeDexSuspense";
import { StackedSuspense } from "./components/StackedSuspense";

export const App = () => {
  return (
    <div class="p-2 flex flex-col container m-auto">
      <ButtonPageList />
      <Router routes={routes} />
    </div>
  );
};

const routes: Route[] = [
  {
    path: "/",
    component: () => (
      <>
        <Template title="Contexts">
          <Contextual />
        </Template>
        <Template title="PokeDex List">
          <PokeDex />
        </Template>
        <Template title="Stacked Suspense">
          <StackedSuspense />
        </Template>
        <Template title="PokeDex List (via Suspense)">
          <PokeDexSuspense />
        </Template>
        <Template title="Dropdown List">
          <Dropdowns />
        </Template>
        <Template title="Forms">
          <Forms />
        </Template>
      </>
    ),
  },
  {
    path: "/contexts",
    component: () => (
      <Template title="Contexts">
        <Contextual />
      </Template>
    ),
  },
  {
    path: "/pokedex-list",
    component: () => (
      <Template title="PokeDex List">
        <PokeDex />
      </Template>
    ),
  },
  {
    path: "/stacked-suspense",
    component: () => (
      <Template title="Stacked Suspense">
        <StackedSuspense />
      </Template>
    ),
  },
  {
    path: "/pokedex-list-suspense",
    component: () => (
      <Template title="PokeDex List (via Suspense)">
        <PokeDexSuspense />
      </Template>
    ),
  },
  {
    path: "/dropdown-list",
    component: () => (
      <Template title="Dropdown List">
        <Dropdowns />
      </Template>
    ),
  },
  {
    path: "/forms",
    component: () => (
      <Template title="Forms">
        <Forms />
      </Template>
    ),
  },
];

const Template = ({ title, children }: { title: string; children: JSX.Element }) => {
  return (
    <div class="p-2 w-full">
      <h1 class="font-bold text-2xl mb-2">{title}</h1>
      {children}
    </div>
  );
};

const ButtonPageList = () => {
  return (
    <Template title="Pages">
      <ul class="flex flex-col gap-2">
        <li>
          <button onClick={() => navigate("/")} disabled={location.value.pathname === "/"}>
            All
          </button>
        </li>
        <li>
          <button
            onClick={() => navigate("/contexts")}
            disabled={location.value.pathname === "/contexts"}
          >
            Contexts
          </button>
        </li>
        <li>
          <button
            onClick={() => navigate("/pokedex-list")}
            disabled={location.value.pathname === "/pokedex-list"}
          >
            PokeDex List
          </button>
        </li>
        <li>
          <button
            onClick={() => navigate("/stacked-suspense")}
            disabled={location.value.pathname === "/stacked-suspense"}
          >
            Stacked Suspense
          </button>
        </li>
        <li>
          <button
            onClick={() => navigate("/pokedex-list-suspense")}
            disabled={location.value.pathname === "/pokedex-list-suspense"}
          >
            PokeDex List with Suspense
          </button>
        </li>
        <li>
          <button
            onClick={() => navigate("/dropdown-list")}
            disabled={location.value.pathname === "/dropdown-list"}
          >
            Dropdown Lists
          </button>
        </li>
        <li>
          <button
            onClick={() => navigate("/forms")}
            disabled={location.value.pathname === "/forms"}
          >
            Forms
          </button>
        </li>
      </ul>
    </Template>
  );
};
