import { createContext, store } from "@veltra/app";

export function Contextual() {
  return (
    <>
      <Form>
        <Input />
      </Form>
      <Form>
        <Input />
      </Form>
    </>
  );
}

const [FormProvider, formContext] = createContext<{ name: string }>();

function Form({ children }: { children: () => JSX.Element }) {
  const state = store<{ name: string }>({ name: "" });

  return <FormProvider value={state}>{children()}</FormProvider>;
}

function Input() {
  const state = formContext();

  return (
    <div>
      <div>Name: {state.name}</div>
      <input
        type="text"
        onInput={(event) => (state.name = event.currentTarget.value)}
        placeholder="name"
      />
    </div>
  );
}
