import { resource, Suspense } from "@veltra/app";

export const StackedSuspense = () => {
  const msg2 = resource(async () => {
    await new Promise((resolve) => {
      setTimeout(resolve, 2000); // delay for 2 second
    });

    return "hello world 2";
  });

  return (
    <div class="p-2 flex flex-col container m-auto">
      <Suspense fallback={<div>loading 1...</div>}>
        <Suspense fallback={<div>loading 2...</div>}>{msg2.data}</Suspense>
        <Component />
      </Suspense>
    </div>
  );
};

function Component() {
  const msg = resource(async () => {
    await new Promise((resolve) => {
      setTimeout(resolve, 1000); // delay for 1 second
    });
    return "hello world";
  });

  return <div>{msg.data}</div>;
}
