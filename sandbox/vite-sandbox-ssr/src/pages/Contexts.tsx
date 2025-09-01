import { createContext, JSX, state, store } from "vynn";

import { Template } from "~/components/Template";

export function Contexts() {
  return (
    <Template title="Contexts">
      <Form>
        <Input />
      </Form>
      <Form>
        <Wrapper>
          <Input />
        </Wrapper>
      </Form>
    </Template>
  );
}

const [FormProvider, formContext] = createContext<{ name: string }>();

function Form({ children }: { children: () => JSX.Element }) {
  const state = store<{ name: string }>({ name: "asd" });

  return <FormProvider value={state}>{children()}</FormProvider>;
}

function Wrapper({ children }: { children: () => JSX.Element }) {
  return (
    <>
      <div>Hi</div> {children()}
    </>
  );
}

const i = state(0);

setInterval(() => {
  i.value++;
}, 1000);

function Input() {
  const forms = formContext();

  const nameEl = <div>Name: {forms.name} Hi</div>;

  // console.log("rerendering");

  return (
    <>
      <div>Name: {forms.name}</div>
      {nameEl}
      <input
        type="text"
        name="name"
        onInput={(event) => (forms.name = event.currentTarget.value)}
        placeholder="name"
        autoComplete="off"
        value={forms.name}
      />{" "}
      {i.value}
    </>
  );
}
