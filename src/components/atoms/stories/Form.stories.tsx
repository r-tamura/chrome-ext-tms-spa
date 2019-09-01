import React from "react";
import { storiesOf } from "@storybook/react";
import { Input } from "../TextField";
import { SelectBox } from "~/components/SelectBox";
import { Panel } from "../Panel";
import { AppThemeProvider } from "~/components/Provider";
import useForm from "react-hook-form";
import { Button } from "..";

function FormSample() {
  type Data = Record<"email" | "password" | "selectbox", string>;
  const { register, handleSubmit, errors } = useForm<Data>();

  const onSubmit = (data: Data) => {
    console.log("data", data);
    console.log("errors", errors);
  };
  return (
    <AppThemeProvider>
      <Panel
        style={{
          display: "grid",
          gridGap: "10px",
          gridTemplateColumns: "repeat(auto-fit, minmax(200px, auto))"
        }}
      >
        <form onSubmit={handleSubmit(onSubmit)}>
          <Input
            error={true}
            name="email"
            label="E-mail *"
            ref={register({ required: true })}
          ></Input>
          <Input
            error={!!errors.password}
            name="password"
            type="password"
            label="Password *"
            ref={register({ required: true })}
          ></Input>
          <SelectBox
            // error={!errors.selectbox}
            name="selectbox"
            label="Select box"
            ref={register({ required: true })}
            options={{
              items: ["選択肢1", "選択肢2", "選択肢3"],
              value: (s: string) => s,
              label: (s: string) => s
            }}
          />
          <Button variant="contained">Submit</Button>
        </form>
      </Panel>
    </AppThemeProvider>
  );
}

storiesOf("Form", module)
  .add("sample", () => <FormSample />)
  .add("input", () => (
    <AppThemeProvider>
      <Panel
        style={{
          display: "grid",
          gridGap: "10px",
          gridTemplateColumns: "repeat(auto-fit, minmax(200px, auto))"
        }}
      >
        <Input label="demo input"></Input>
        <Input label="default value" defaultValue={"default value"}></Input>
      </Panel>
    </AppThemeProvider>
  ))
  .add("select", () => (
    <AppThemeProvider>
      <Panel>
        <SelectBox
          options={{
            items: [
              { value: "1", displayValue: "選択肢1" },
              { value: "2", displayValue: "選択肢2" },
              { value: "3", displayValue: "選択肢3" }
            ],
            value: (o: any) => o.value,
            label: (o: any) => o.displayValue
          }}
        ></SelectBox>
      </Panel>
    </AppThemeProvider>
  ));
