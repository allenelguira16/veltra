import { computed, effect, For, onDestroy, onMount, state } from "@veltra/app";
import { name } from "../globalState";
// import { memo } from "../memo";

type SortDirection = "asc" | "desc";

export const Dropdowns = () => {
  let showDropdown = state(true);
  const dir = state<SortDirection>("asc");
  const numbers = state([1, 2, 3, 4, 5, 6, 7, 8]);

  onMount(() => {
    console.log("Dropdown List onMount");
  });

  onDestroy(() => {
    console.log("Dropdown List onDestroy");
  });

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
    let currentNumbers = [...numbers.value];

    if (currentNumbers.length >= 8) return;

    currentNumbers = currentNumbers.sort((a, b) => {
      return a - b;
    });

    if (!currentNumbers.length) {
      numbers.value = [1];
    } else {
      numbers.value = [
        ...currentNumbers,
        currentNumbers[currentNumbers.length - 1] + 1,
      ];
    }
  };

  const removeDropdown = () => {
    if (numbers.value.length > 0) {
      numbers.value = numbers.value.slice(0, -1);
    }
  };

  // const Data = memo(() => <DropdownList numbers={numbers} />);

  return (
    <>
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
        <div>
          <button onClick={() => (showDropdown.value = !showDropdown.value)}>
            Unmount Dropdown List
          </button>
        </div>
        <div class="flex gap-2 flex-col lg:flex-row">
          {showDropdown.value && <DropdownList numbers={numbers} />}
        </div>
      </div>
    </>
  );
};

const DropdownList = ({ numbers }: { numbers: { value: number[] } }) => {
  const doubledNumbers = computed(() => numbers.value.map((n) => n * 2));

  effect(() => {
    // console.log(numbers.value);
    console.log(doubledNumbers.value);
  }); // logging multiple times
  console.log("rendering");

  onDestroy(() => {
    console.log("bye~");
  });

  return (
    // <div class="flex gap-2 flex-col lg:flex-row">
    <>
      <For items={numbers.value}>
        {(number) => <Dropdown number={number} />}
      </For>
      {/* {numbers.value.map((number) => (
        <Dropdown number={number} />
      ))} */}
    </>
    // </div>
  );
};

const Dropdown = ({ number }: { number: number }) => {
  let divElement!: HTMLElement;
  const isOpen = state(false);

  const handleToggle = () => {
    isOpen.value = !isOpen.value;
  };

  // effect(() => {
  //   console.log(isOpen.value);
  // });
  // console.log
  const value = Array.from({ length: 3 }).map((_, i) => i + 1);

  return (
    <div ref={divElement} class="relative lg:w-[calc(100%/8)]">
      <div>
        <button class="btn w-full" onClick={handleToggle}>
          Open Dropdown {number}
        </button>
        <div class="break-all">Hi {name.value}</div>
      </div>
      {isOpen.value && (
        <div class="absolute bg-white border border-gray-200 rounded p-4 w-[200px] z-10">
          <ul>
            <For items={value}>
              {(item) => (
                <li class="cursor-pointer p-2 rounded hover:bg-gray-100">
                  Dropdown {item}
                </li>
              )}
            </For>
          </ul>
        </div>
      )}
    </div>
  );
};

// console.log(<Dropdowns />);
