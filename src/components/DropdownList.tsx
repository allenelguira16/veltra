import { effect, state, For } from "../../mini-app";
import { name } from "../globalState";

type SortDirection = "asc" | "desc";

export const DropdownList = () => {
  const dir = state<SortDirection>("asc");
  const numbers = state([1, 2, 3, 4, 5, 6, 7, 8]);

  const handleSort = () => {
    numbers.value = numbers.value.sort((a, b) => {
      return dir.value === "desc" ? a - b : b - a;
    });
    dir.value = dir.value === "asc" ? "desc" : "asc";
  };

  const handleRandomize = () => {
    const result = numbers.value;
    for (let i = result.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [result[i], result[j]] = [result[j], result[i]];
    }

    numbers.value = result;
  };

  const addDropdown = () => {
    if (numbers.value.length >= 8) return;

    if (!numbers.value.length) {
      numbers.value = [1];
    } else {
      numbers.value = [...numbers.value, numbers.value.length + 1];
    }
  };

  const removeDropdown = () => {
    if (numbers.value.length > 0) {
      numbers.value = numbers.value.slice(0, -1);
    }
  };

  return (
    <div class="flex flex-col gap-4">
      <div>
        <div class="flex gap-2 items-center">
          <span>Add Dropdown</span>
          <button class="btn" onClick={addDropdown}>
            +
          </button>
          <button class="btn" onClick={removeDropdown}>
            -
          </button>
        </div>
      </div>
      <div class="flex gap-2 items-center">
        <span>Sort</span>
        <button class="btn" onClick={handleSort}>
          {dir.value === "asc" ? "↑" : "↓"}
        </button>
        <button class="btn" onClick={handleRandomize}>
          Randomize
        </button>
      </div>
      <div class="flex gap-2">
        <For items={numbers.value} fallback={<div>hi</div>}>
          {(number) => <Dropdown number={number} />}
        </For>
      </div>
    </div>
  );
};

const Dropdown = ({ number }: { number: number }) => {
  let divElement!: HTMLElement;
  const isOpen = state(false);

  const handleToggle = () => {
    isOpen.value = !isOpen.value;
  };

  return (
    <div ref={divElement} class="relative w-[calc(100%/8)]">
      <div>
        <button class="btn w-full" onClick={handleToggle}>
          Open Dropdown {number}
        </button>
        <div class="break-all">Hi {name.value}</div>
      </div>
      {isOpen.value && (
        <div class="absolute bg-white border border-gray-200 rounded p-4 w-[200px]">
          <ul>
            <li class="cursor-pointer p-2 rounded hover:bg-gray-100">
              Dropdown 1
            </li>
            <li class="cursor-pointer p-2 rounded hover:bg-gray-100">
              Dropdown 2
            </li>
            <li class="cursor-pointer p-2 rounded hover:bg-gray-100">
              Dropdown 3
            </li>
          </ul>
        </div>
      )}
    </div>
  );
};
