import { Portal, state } from "vynn";
import { Router } from "vynn-router";

import { ButtonPageList } from "./components/ButtonPageList";
import { routes } from "./routes";

export const App = () => {
  const i = state(0);

  setInterval(() => {
    i.value++;
  }, 1000);

  return (
    <div class="p-2 flex flex-col container m-auto">
      <ButtonPageList />
      <Router routes={routes} />
      <div id="test-portal">{i.value}</div>
      <Portal target={document.body}>
        <Test />
      </Portal>
    </div>
  );
};

function Test() {
  return (
    <div>
      <h1>Portal</h1>
    </div>
  );
}
