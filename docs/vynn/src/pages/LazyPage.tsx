import { CodeBlock } from "../components/CodeBlock";

export const LazyPage = () => {
  return (
    <div>
      <h1>lazy</h1>
      <section>
        <p>
          <code>lazy()</code> lets you dynamically load a component on demand — perfect for
          code-splitting or delaying non-critical components. It returns a render function that
          throws a <code>Promise</code> internally so it works seamlessly with
          <code>&lt;Suspense&gt;</code>.
        </p>

        <CodeBlock
          lang="tsx"
          code={`
            import { lazy, Suspense } from "vynn";

            const LazyHello = lazy(() => import("./Hello"));

            function App() {
              return (
                <div>
                  <Suspense fallback={<p>Loading component...</p>}>
                    <LazyHello />
                  </Suspense>
                </div>
              );
            }`}
        />

        <h2 class="mt-6">Named export support</h2>
        <p>
          You can optionally specify a named export as the second argument. If the export doesn't
          exist, it throws an error.
        </p>

        <CodeBlock
          lang="tsx"
          code={`
            // load 'export function Hello()' from ./Hello.ts
            const LazyNamed = lazy(() => import("./Hello"), "Hello");
          `}
        />

        <h2 class="mt-6">How it works</h2>
        <ul>
          <li>
            ❗ The first render throws a <code>Promise</code> while the module is loading
          </li>
          <li>🧠 Suspense catches the promise and shows the fallback</li>
          <li>✅ Once resolved, the real component is rendered</li>
          <li>🔁 The module is cached after the first load — no re-fetching</li>
        </ul>

        <h2 class="mt-6">Edge cases</h2>
        <ul>
          <li>
            If the module fails to load, an <code>Error</code> is thrown
          </li>
          <li>If the export doesn't exist, you get a custom error message</li>
        </ul>

        <CodeBlock
          lang="tsx"
          code={`
            // Throws if "MissingExport" doesn't exist in module
            const Bad = lazy(() => import("./MyComponent"), "MissingExport");
          `}
        />
      </section>
    </div>
  );
};
