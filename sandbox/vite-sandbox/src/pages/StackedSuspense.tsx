import { resource, Suspense } from "@vynn/core";

import { sleep } from "~/sleep";

export const StackedSuspense = () => {
  const msg2 = resource(async () => {
    await new Promise((resolve) => {
      setTimeout(resolve, 2000); // delay for 2 second
    });

    return "hello world 2";
  }, "outer-suspense");

  return (
    <div class="p-2 flex flex-col container m-auto">
      <Suspense fallback={<div>loading 1...</div>}>
        <>
          {/* {msg2.data} */}
          <Suspense fallback={<div>loading 2...</div>}>{msg2.data}</Suspense>
          <Component />
        </>
      </Suspense>
    </div>
  );
};

function Component() {
  const msg = resource(async () => {
    const res = await fetch("https://pokeapi.co/api/v2/pokemon/?offset=1100&limit=1");
    await res.json();

    await sleep(1000);

    return "hello world";
  }, "inner-suspense");

  return <div>{msg.data}</div>;
}
