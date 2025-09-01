import { JSX } from "vynn";

export let Assets: () => JSX.Element;
export let Scripts: () => JSX.Element;
export let VynnApp: () => JSX.Element;

export const setAssets = (component: () => JSX.Element) => (Assets = component);
export const setScripts = (component: () => JSX.Element) => (Scripts = component);
export const setVynnApp = (component: () => JSX.Element) => (VynnApp = component);
