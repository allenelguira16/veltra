import { computed, effect, state } from "@veltra/app";

export function App() {
  const count = state(0);
  const double = computed(() => count.value * 2);

  const handleCount = () => {
    count.value++;
  };

  effect(() => {
    console.log("hi");
  });

  return (
    <div class="test" aria-role="display">
      <div>Count: {count.value}</div>
      <div>Double Count: {double.value}</div>
      <button disabled={count.value >= 5} onClick={handleCount}>
        Add counter
      </button>
      <div>{count.value <= 3 ? <div>Hi</div> : "string"}</div>
    </div>
  );
}
