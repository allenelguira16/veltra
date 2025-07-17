import { DestroyFn, MountFn } from "~/lifecycle";
import { EffectFn, State } from "~/reactivity";

export interface RuntimeContext {
  id: string;
  mount: MountFn[];
  effect: EffectFn[];
  state: {
    states: State<any>[];
    index: number;
  };
  destroy: DestroyFn[];
}

let runtimeContext: RuntimeContext | null = null;

export function setRuntimeContext(ctx: RuntimeContext | null) {
  runtimeContext = ctx;
}

export function getRuntimeContext(): RuntimeContext | null {
  return runtimeContext;
}

// const componentContext = new Map<Node, RuntimeContext>();

// export function setComponentContext(targetNode: Node, context: RuntimeContext) {
//   componentContext.set(targetNode, context);
// }

// export function getComponentContext(targetNode: Node): RuntimeContext | undefined {
//   return componentContext.get(targetNode);
// }
