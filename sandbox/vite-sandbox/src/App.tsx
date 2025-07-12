import { Router } from "@veltra/router";

import { ButtonPageList } from "./components/ButtonPageList";
import { routes } from "./routes";

export const App = () => {
  return (
    <div class="p-2 flex flex-col container m-auto">
      <ButtonPageList />
      <Router routes={routes} />
    </div>
  );
};
