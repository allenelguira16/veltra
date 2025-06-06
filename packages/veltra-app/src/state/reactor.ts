type Reactors = Set<ReactorFn>;

export type ReactorFn = {
  (): void;
  renderEffects?: Reactors[];
};

export let activeReactor: ReactorFn | null = null;
export let reactorStack: ReactorFn[] | null = null;

const reactors: ReactorFn[] = [];

export function setReactorStack(stack: ReactorFn[]) {
  reactorStack = stack;
}

export function detachReactorStack() {
  reactorStack = null;
}

export function removeReactor(effectFn: ReactorFn) {
  if (effectFn.renderEffects) {
    for (const dep of effectFn.renderEffects) {
      dep.delete(effectFn);
    }
    effectFn.renderEffects.length = 0;
  }
}

export function reactor(fn: ReactorFn) {
  return wrapReactor(fn);
}

export function wrapReactor(fn: ReactorFn): ReactorFn {
  const run = (() => {
    reactors.push(run);
    activeReactor = run;
    run.renderEffects = [];
    fn();
    reactors.pop();
    activeReactor = reactors[reactors.length - 1] || null;
  }) as ReactorFn;

  run.renderEffects = [];
  run();

  reactorStack?.push(run);
  return run;
}
