import { state, computed, effect } from "@veltra/app";
import { name } from "../globalState";

export const Forms = () => {
  return (
    <div>
      <div>
        <label class="break-all" for="name-input2">
          Hi {name.value.firstName}
        </label>
        <input type="text" value={name.value.firstName} id="name-input2" />
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

  // effect(() => {
  //   console.log(count.value);
  // });

  // effect(() => {
  //   console.log(double.value);
  // });

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
      <label class="break-all" for="name-input">
        Name {name.value.firstName}
      </label>
      <input
        id="name-input"
        type="text"
        onInput={(event: KeyboardEvent) => {
          const input = event.currentTarget as HTMLInputElement;
          name.value.firstName = input.value;
        }}
        value={name.value.firstName}
      />
    </div>
  );
}
