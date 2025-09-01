import { JSX, PropsWithChildren } from "vynn";

// export * from "./components";
export { defineConfig } from "./define-config";
export type AppProps = PropsWithChildren<{ assets: JSX.Element; scripts: JSX.Element }>;
