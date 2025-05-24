import { state, computed } from "../../mini-app";
import { name } from "../globalState";

export const Forms = () => {
  return (
    <div>
      <div class="break-all">Hi {name.value}</div>
      <div>
        <input type="text" value={name.value} />
      </div>
      <div>
        <Counter />
        <Input />
      </div>
    </div>
  );
};

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
      <button disabled={count.value >= 5} onClick={handleCount}>
        Add counter
      </button>
      <div>{count.value <= 3 ? <div>Hi</div> : "string"}</div>
    </div>
  );
}

function Input() {
  return (
    <div>
      <div class="break-all">Name {name.value}</div>
      <input
        type="text"
        onInput={(event: KeyboardEvent) => {
          const input = event.currentTarget as HTMLInputElement;
          name.value = input.value;
        }}
        value={name.value}
      />
    </div>
  );
}
