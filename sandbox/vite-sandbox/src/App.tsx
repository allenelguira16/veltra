import { DropdownList } from "./components/DropdownList";
import { PokeDex } from "./components/PokeDex";
import { Forms } from "./components/Forms";

export const App = () => {
  // When state is updating in the child component, it won't rerender all components, it will just rerender the current component
  console.log("App should not rerender");

  return (
    <div class="p-2 flex flex-col container m-auto">
      <div class="p-2 w-full">
        <h1 class="font-bold text-2xl">PokeDex</h1>
        <PokeDex />
      </div>
      <div class="p-2 w-full">
        <h1 class="font-bold text-2xl">Dropdown List</h1>
        <DropdownList />
      </div>
      <div class="p-2 w-full">
        <h1 class="font-bold text-2xl">Forms</h1>
        <Forms />
      </div>
    </div>
  );
};
