import { state } from "vynn";

import { Contexts } from "./pages/Contexts";
import { Dropdowns } from "./pages/DropdownList";
import { Forms } from "./pages/Forms";
import { PokeDex } from "./pages/PokeDex";
import { PokeDexSuspense } from "./pages/PokeDexSuspense";
import { StackedSuspense } from "./pages/StackedSuspense";

export function App() {
  const i = state(0);

  setInterval(() => {
    i.value++;
  }, 1000);

  return (
    <div class="p-2 flex flex-col container m-auto">
      <div class="p-2 w-full">
        <img src="https://media1.tenor.com/m/CNI1fSM1XSoAAAAC/shocked-surprised.gif" />
        <h1>Vynn App</h1>
      </div>
      <div class="p-2 w-full">
        <Forms />
      </div>
      <div class="p-2 w-full">
        <Contexts />
      </div>
      <div class="p-2 w-full">
        <Dropdowns />
      </div>
      <div class="p-2 w-full">
        <StackedSuspense />
      </div>
      <div class="p-2 w-full">
        <PokeDex />
      </div>
      <div class="p-2 w-full">
        <PokeDexSuspense />
      </div>
    </div>
  );
}
