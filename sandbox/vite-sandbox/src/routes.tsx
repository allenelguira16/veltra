import { params, Route } from "@vynn/router";

import { Template } from "./components/Template";
import { Contexts } from "./pages/Contexts";
import { Dropdowns } from "./pages/DropdownList";
import { Forms } from "./pages/Forms";
import { PokeDex } from "./pages/PokeDex";
import { PokeDexSuspense } from "./pages/PokeDexSuspense";
import { StackedSuspense } from "./pages/StackedSuspense";

export const routes: Route[] = [
  {
    path: "/",
    component: () => (
      <>
        <Template title={"Forms"}>
          <Forms />
        </Template>
        <Template title={"Contexts"}>
          <Contexts />
        </Template>
        <Template title={"Dropdown List"}>
          <Dropdowns />
        </Template>
        <Template title={"Stacked Suspense"}>
          <StackedSuspense />
        </Template>
        <Template title={"PokeDex List"}>
          <PokeDex />
        </Template>
        <Template title={"PokeDex List (via Suspense)"}>
          <PokeDexSuspense />
        </Template>
      </>
    ),
  },
  {
    path: "/test/:name",
    component: () => {
      return <div>Hi {params.name}</div>;
    },
  },
  {
    path: "/contexts",
    component: () => (
      <Template title={"Contexts"}>
        <Contexts />
      </Template>
    ),
  },
  {
    path: "/pokedex-list",
    component: () => (
      <Template title={"PokeDex List"}>
        <PokeDex />
      </Template>
    ),
  },
  {
    path: "/stacked-suspense",
    component: () => (
      <Template title={"Stacked Suspense"}>
        <StackedSuspense />
      </Template>
    ),
  },
  {
    path: "/pokedex-list-suspense",
    component: () => (
      <Template title={"PokeDex List (via Suspense)"}>
        <PokeDexSuspense />
      </Template>
    ),
  },
  {
    path: "/dropdown-list",
    component: () => (
      <Template title={"Dropdown List"}>
        <Dropdowns />
      </Template>
    ),
  },
  {
    path: "/forms",
    component: () => (
      <Template title={"Forms"}>
        <Forms />
      </Template>
    ),
  },
];
