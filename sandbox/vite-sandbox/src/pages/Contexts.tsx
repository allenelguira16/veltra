import { createContext, JSX, state, store } from "@veltra/app";

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
  const forms = formContext();

  const i = state(0);

  setInterval(() => {
    i.value++;
  }, 1000);

  return (
    <div>
      <div>Name: {forms.name}</div>
      <input
        type="text"
        onInput={(event) => (forms.name = event.currentTarget.value)}
        placeholder="name"
      />
      {i.value}
    </div>
  );
}
