import { Dropdowns } from "./components/DropdownList";
import { PokeDex } from "./components/PokeDex";
import { Forms } from "./components/Forms";
// import { effect, state, untrack } from "@veltra/app";
import { onMount } from "@veltra/app";

// const count = state(0);
// const count2 = state(10);

// effect(() => {
//   effect(() => {
//     console.log(untrack(() => count.value));
//     console.log(count2.value);
//   });
// });

// setInterval(() => {
//   count.value++;
//   count2.value++;
// }, 1000);

export const App = () => {
  let element!: HTMLElement;
  // When state is updating in the child component, it won't rerender all components, it will just rerender the current component

  onMount(() => {
    console.log("App should not rerender");
    console.log(element);
  });

  return (
    <>
      <div ref={element} class="p-2 flex flex-col container m-auto">
        <div class="p-2 w-full">
          <h1 class="font-bold text-2xl">PokeDex</h1>
          <PokeDex />
        </div>
        <div class="p-2 w-full">
          <h1 class="font-bold text-2xl">Dropdown List</h1>
          <Dropdowns />
        </div>
        <div class="p-2 w-full">
          <h1 class="font-bold text-2xl">Forms</h1>
          <Forms />
        </div>
      </div>
    </>
  );
};

// console.log(<App />);
