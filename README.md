# Veltra

An ultra fast and swift frontend library that breaks free from the virtual DOM.

Veltra is a React-like UI library designed with one core principle: **go native**, **go fast**. By bypassing the virtual DOM and updating the real DOM directly, Veltra achieves ultra-low latency rendering: making it faster, leaner, and closer to the bare-metal than traditional frameworks.

## Install

Currently there's no npm package for it since this is just a hobby project but still you can install it via git

But first you must use yarn berry for it to work (sorry npm users this is yarn exclusive)

### Setup environment

First install yarn if you don't have it

```bash
npm i -g yarn
```

Then install version to berry (yarn 2+)

```bash
yarn set version berry
```

Add node_modules as nodeLinker

```yml
yarnPath: .yarn/releases/yarn-4.9.2.cjs

nodeLinker: node-modules # add this line
```

### Installing @veltra/app

```bash
yarn add "@veltra/app@git+https://github.com/allenelguira16/veltra.git#workspace=@veltra/app"
```

#### tsconfig.json (**important**)

Also in your editor, it will show an error that _JSX_ runtime is missing since by default tsconfig will search for React JSX runtime
For that to work, you must add the following config in tsconfig.json so it will use the @veltra/app JSX runtime

```json
{
  "compilerOptions": {
    // add the following...
    "jsx": "react-jsx",
    "jsxImportSource": "@veltra/app"
  }
}
```

### Installing vite plugin

```bash
yarn add "vite-plugin-veltra@git+https://github.com/allenelguira16/veltra.git#workspace=vite-plugin-veltra"
```

And in your vite config add it to the plugin

```ts
import { defineConfig } from "vite";
import veltraPlugin from "vite-plugin-veltra";

export default defineConfig({
  plugins: [veltraPlugin()],
});
```

### Installing babel preset

```bash
yarn add "@babel/preset-veltra@git+https://github.com/allenelguira16/veltra.git#workspace=@babel/preset-veltra"
```

Then add it as plugin in your babel config

```json
{
  "presets": ["@babel/preset-veltra"]
}
```

## Example

```tsx
import { createRoot } from "@veltra/app";

function App() {
  return (
    <div>
      <h1>Hello World!</h1>
    </div>
  );
}

createRoot(document.getElementById("app")!, <App />);
```

## Core concepts

### Life-cycle hooks

#### onMount

onMount is a life-cycle that makes you do anything after the DOM is created. This allows you to do things to work on once the dom is created.

There's also a cleanup function as return to do things when component is removed from the DOM tree

```tsx
import { createRoot } from "@veltra/app";

function App() {
  onMount(() => {
    function handleClick(event: any) {
      console.log("Clicked!", event);
    }

    // Add event listener when component is created
    window.addEventListener("click", handleClick);

    return () => {
      // Remove event listener when component is removed
      window.removeEventListener("click", handleClick);
    };
  });

  return (
    <div>
      <h1>Click anywhere</h1>
      <span>Once the component is removed, click will no longer work</span>
    </div>
  );
}

createRoot(document.getElementById("app")!, <App />);
```

#### onDestroy

onDestroy let you do things once the component is going to be removed.
Yes it is similar to onMount's return, but there are cases where you need to use onDestroy without the use of onMount.
As much as possible use onMount's cleanup if it is tightly coupled with onMount.

```tsx
import { createRoot } from "@veltra/app";

function App() {
  onDestroy(() => {
    console.log("Help, I am going to be k---");
  });

  return <div>Hello, World~</div>;
}

createRoot(document.getElementById("app")!, <App />);
```

### State Management

```tsx
import { createRoot } from "@veltra/app";

function Counter() {
  const count = state(0);

  const handleCount = () => {
    count.value++;
  };

  return (
    <div>
      <div>Count: {count.value}</div>
      <button disabled={count.value > 5} onClick={handleCount}>
        Add counter
      </button>
      <div>{count.value <= 3 ? <div>Hi</div> : "string"}</div>
    </div>
  );
}

createRoot(document.getElementById("app")!, <App />);
```

You may wonder why is state seems weird and different from react useState.
It is because it is inspired with vue state where it can do reactivity.

Under the hood, it uses proxy object to do magic and do updates to the dom without re-rendering.
It is fast and more efficient than React!

#### In fact, you can use the state outside to create state globally!

Btw state is using the signal strategy

```tsx
import { createRoot } from "@veltra/app";

const name = state("");

function App() {
  const handleInput = (event: KeyboardEvent) => {
    const input = event.currentTarget as HTMLInputElement;
    name.value = input.value;
  };

  return (
    <div>
      <div>
        <div>Enter your name</div>
        <input type="text" onInput={handleInput} value={name.value} />
      </div>
      <div>
        <Home />
        <Work />
        <World />
      </div>
    </div>
  );
}

function Home() {
  return <div>Hi {name.value}, a msg from Home</div>;
}

function Work() {
  return <div>Hi {name.value}, a msg from Work</div>;
}

function World() {
  return <div>Hi {name.value}, a msg from World</div>;
}

createRoot(document.getElementById("app")!, <App />);
```

### Computed

Computed are derived data from state with additional steps

```tsx
import { state, computed, createRoot } from "@veltra/app";

function Counter() {
  const count = state(0);
  const double = computed(() => count.value * 2);

  const handleCount = () => {
    count.value++;
  };

  return (
    <div>
      <div>Count: {count.value}</div>
      <div>Double Count: {double.value}</div>
      <button disabled={count.value > 5} onClick={handleCount}>
        Add counter
      </button>
    </div>
  );
}

createRoot(document.getElementById("app")!, <App />);
```

### Subscribing to an effect

Effects are different from useEffect in react.
Instead of manually track them, it knows what to check when changes are made

```tsx
import { state, createRoot } from "@veltra/app";

function Counter() {
  const count = state(0);

  const handleCount = () => {
    count.value++;
  };

  effect(() => {
    console.log(count.value);
  }); // no need to manually track them, just call .value

  return (
    <div>
      <div>Count: {count.value}</div>
      <button disabled={count.value > 5} onClick={handleCount}>
        Add counter
      </button>
      <div>{count.value <= 3 ? <div>Hi</div> : "string"}</div>
    </div>
  );
}

createRoot(document.getElementById("app")!, <App />);
```

### Looping through elements

When looping through elements, you can use the `<For>` component.
While you can still loop using .map in array, it is not efficient.

Use .map only if purely representational, if it needs cache like it looping through components and it has state, use `<For>` component

With `<For>` component, it is efficient and cache's DOM elements properly.

```tsx
import { For, effect, state, createRoot } from "@veltra/app";

type SortDirection = "asc" | "desc";

export const DropdownList = () => {
  const currentDirection = state<SortDirection>("asc");
  const numbers = state([1, 2, 3]);

  const handleSort = (dir: SortDirection) => () => {
    currentDirection.value = dir === "asc" ? "desc" : "asc";

    numbers.value = numbers.value.sort((a, b) => {
      return currentDirection.value === "desc" ? a - b : b - a;
    });
  };

  const addDropdown = () => {
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
    <div>
      <div>
        <span>Add Dropdown</span>
        <button onClick={addDropdown}>Add</button>
        <button onClick={removeDropdown}>Remove</button>
      </div>
      <div>
        <span>Sort</span>
        <button onClick={handleSort("asc")}>Ascending</button>
        <button onClick={handleSort("desc")}>Descending</button>
      </div>
      <div style={{ display: "flex" }}>
        {/* Component is cached properly and state is preserved, unlike traditional .map */}
        <For items={numbers.value} fallback={<div>Empty</div>}>
          {(number) => <Dropdown number={number} />}
        </For>
      </div>
    </div>
  );
};

const Dropdown = ({ number }: { number: number }) => {
  const isOpen = state(false);

  const handleToggle = () => {
    isOpen.value = !isOpen.value;
  };

  return (
    <div style={{ position: "relative" }}>
      <div>
        <button onClick={handleToggle}>Open Dropdown {number}</button>
      </div>
      {isOpen.value && (
        <div style={{ position: "absolute" }}>
          <ul>
            <li>Dropdown 1</li>
            <li>Dropdown 2</li>
            <li>Dropdown 3</li>
          </ul>
        </div>
      )}
    </div>
  );
};

createRoot(document.getElementById("app")!, <App />);
```

## Future features to be added

- Proper DOM Types
