import { JSX, jsx } from "~/jsx-runtime";

export let isStreaming = false;

export let resolveStream: () => void;

export function renderToStream(App: () => JSX.Element) {
  isStreaming = true;

  return new ReadableStream<Uint8Array<ArrayBuffer>>({
    start(controller) {
      const html = jsx(App, {}) as string;
      controller.enqueue(new TextEncoder().encode(html));
      controller.close();

      isStreaming = false;
    },
  });
}
