import { createContext, store } from "@veltra/app";

export function Contexts() {
  return (
    <>
      <Form>
        <Input />
      </Form>
      <Form>
        <Wrapper>
          <Input />
        </Wrapper>
      </Form>
    </>
  );
}

const [FormProvider, formContext] = createContext<{ name: string }>();

function Form({ children }: { children: () => JSX.Element }) {
  const state = store<{ name: string }>({ name: "" });

  return <FormProvider value={state}>{children()}</FormProvider>;
}

function Wrapper({ children }: { children: () => JSX.Element }) {
  return <div>{children}</div>;
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
