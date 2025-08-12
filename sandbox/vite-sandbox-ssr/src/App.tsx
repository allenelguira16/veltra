import { state } from "@vynn/core";

import { PokeDex } from "./pages/PokeDex";
import { StackedSuspense } from "./pages/StackedSuspense";

export function App() {
  const i = state(0);

  setInterval(() => {
    i.value++;
  }, 1000);

  return (
    <div>
      <img src="https://media1.tenor.com/m/CNI1fSM1XSoAAAAC/shocked-surprised.gif" />
      <h1>Vynn App</h1>
      <StackedSuspense />
      <PokeDex />
      {/* <PokeDexSuspense /> */}
      {/* {i.value} */}
    </div>
  );
}
