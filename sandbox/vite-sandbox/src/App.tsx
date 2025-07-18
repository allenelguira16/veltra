import { state } from "@veltra/app";
import { Router } from "@veltra/router";

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
      <div>hi</div>
    </div>
  );
};
