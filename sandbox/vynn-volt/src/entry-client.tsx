/// <reference types="vinxi/types/client" />
// import { AppProps } from "@vynn/volt";
// import { getManifest } from "vinxi/manifest";
// import { hydrateApp, JSX } from "vynn";
// import { Router } from "vynn-router";

// import App from "./app";
// import { routes } from "./parse-route";

// export const hydrateClient = async (App: (props: AppProps) => JSX.Element) => {
//   const clientManifest = getManifest("client");

//   const rawAssets = await clientManifest.inputs[clientManifest.handler].assets();

//   type Assets = ((typeof rawAssets)[number] & { children: string })[];
//   const assets = (
//     <>
//       {(rawAssets as Assets).map(({ tag: Tag, attrs, children }) => (
//         <Tag {...attrs}>{children}</Tag>
//       ))}
//     </>
//   );
//   const scripts = (
//     <>
//       <nohydration></nohydration>
//       <nohydration></nohydration>
//       {/* <script html={`window.manifest = ${JSON.stringify(clientManifest?.json?.() || {})}`} />
//       <script type="module" src={clientManifest.inputs[clientManifest.handler].output.path} /> */}
//     </>
//   );

//   hydrateApp(() => (
//     <App assets={assets} scripts={scripts}>
//       <div id="app">
//         <Router url={location.pathname} routes={routes} />
//       </div>
//     </App>
//   )).mount(document);
// };
import { hydrateClient } from "@vynn/volt/client";

import App from "./app";

hydrateClient(App);
