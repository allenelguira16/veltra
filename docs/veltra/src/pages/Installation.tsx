import { CodeBlock } from "../components/CodeBlock";

export const Installation = () => {
  return (
    <div>
      <h1>Installation</h1>
      <section>
        <p>
          Currently there's no npm package for it since this is just a hobby project but still you
          can install it via git
        </p>
        <p>
          But first you must use yarn berry for it to work (sorry npm users this is yarn exclusive)
        </p>
      </section>
      <section>
        <h2>Setup environment</h2>
        <section>
          <p>First install yarn if you don't have it</p>
          <CodeBlock lang="bash" code={`npm i -g yarn`} />
        </section>
        <section>
          <p>Then install version to berry (yarn 2+)</p>
          <CodeBlock lang="bash" code={`yarn set version berry`} />
        </section>
        <section>
          <p>Add node_modules as nodeLinker</p>
          <CodeBlock
            lang="bash"
            code={`
            yarnPath: .yarn/releases/yarn-4.9.2.cjs

            nodeLinker: node-modules # add this line
          `}
          />
        </section>
      </section>
      <section>
        <h2>Installing @veltra/app</h2>
        <CodeBlock
          lang="bash"
          code={`yarn add "@veltra/app@git+https://github.com/allenelguira16/veltra.git#workspace=@veltra/app"`}
        />
        <p>tsconfig.json (important)</p>
        <p>
          Also in your editor, it will show an error that JSX runtime is missing since by default
          tsconfig will search for React JSX runtime For that to work, you must add the following
          config in tsconfig.json so it will use the @veltra/app JSX runtime
        </p>
        <CodeBlock
          lang="json5"
          code={`
            {
              "compilerOptions": {
                // add the following...
                "jsx": "preserve",
                "jsxImportSource": "@veltra/app"
              }
            }
          `}
        />
      </section>
      <section>
        <h2>Installing vite plugin</h2>
        <CodeBlock
          lang="json5"
          code={`yarn add "vite-plugin-veltra@git+https://github.com/allenelguira16/veltra.git#workspace=vite-plugin-veltra"`}
        />
        <p>And in your vite config add it to the plugin</p>
        <CodeBlock
          lang="tsx"
          code={`
            import { defineConfig } from "vite";
            import veltra from "vite-plugin-veltra";

            export default defineConfig({
              plugins: [veltra()],
            });
          `}
        />
        <section>
          <p>Installing babel preset</p>
          <CodeBlock
            lang="bash"
            code={`
              yarn add "@babel/preset-veltra@git+https://github.com/allenelguira16/veltra.git#workspace=@babel/preset-veltra"
            `}
          />
          <p>Then add it as plugin in your babel config</p>
          <CodeBlock
            lang="json5"
            code={`
              {
                "presets": ["@babel/preset-veltra"]
              }
            `}
          />
        </section>
        <section>
          <h2>Example</h2>
          <CodeBlock
            lang="tsx"
            code={`
              import { createRoot } from "@veltra/app";

              function App() {
                return (
                  <div>
                    <h1>Hello World!</h1>
                  </div>
                );
              }

              createApp(App).mount("#app");
          `}
          />
        </section>
      </section>
    </div>
  );
};
