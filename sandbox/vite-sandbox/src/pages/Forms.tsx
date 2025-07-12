import { effect, store } from "@veltra/app";

import { name } from "../globalState";

export const Forms = () => {
  return (
    <div>
      <div>
        <label class="break-all" for="name-input2">
          Hi {name.firstName}
        </label>
        <div>
          <input type="text" value={name.firstName} id="name-input2" />
        </div>
      </div>
      <div>
        <Counter />
        <Input />
      </div>
    </div>
  );
};

export function Counter() {
  const state = store({
    count: 0,
    get double() {
      return this.count * 2;
    },
  });

  const handleCount = () => {
    state.count++;
  };

  effect(() => {
    console.log(state.count);
  });

  effect(() => {
    console.log(state.double);
  });

  return (
    <div>
      <div>Count: {state.count}</div>
      <div>Double Count: {state.double}</div>
      <button disabled={state.count >= 5} onClick={handleCount}>
        Add counter
      </button>
      <div>{state.count <= 3 ? <div>Hi</div> : "string"}</div>
    </div>
  );
}

function Input() {
  return (
    <div>
      <label class="break-all" for="name-input">
        Name {name.firstName}
      </label>
      <div>
        <input
          id="name-input"
          type="text"
          onInput={(event) => {
            name.firstName = event.currentTarget.value;
          }}
          value={name.firstName}
        />
      </div>
    </div>
  );
}
