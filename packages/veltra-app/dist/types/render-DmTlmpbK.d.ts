declare function createRoot($root: HTMLElement, app: JSX.Element): void;
declare function h(type: string | Function, props: Record<string, any>, children: JSX.Element[]): any;
declare function setCurrentRenderingDOM(dom: HTMLElement): void;
declare function Fragment({ children }: {
    children: any[];
}): any[];

export { Fragment as F, createRoot as c, h, setCurrentRenderingDOM as s };
