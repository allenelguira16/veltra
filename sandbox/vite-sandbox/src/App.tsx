import { state } from "vynn";
import { Router } from "vynn-router";

import { routes } from "./routes";

export const App = () => {
  const i = state(0);

  setInterval(() => {
    i.value++;
  }, 1000);

  return (
    <>
      <Router routes={routes} />
      {/* <div id="test-portal">{i.value}</div>
      <Portal target={document.body}>
        <Test />
      </Portal> */}
    </>
  );
};

// function Test() {
//   return (
//     <div>
//       <h1>Portal</h1>
//     </div>
//   );
// }
