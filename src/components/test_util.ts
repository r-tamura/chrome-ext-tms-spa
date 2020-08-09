import { ReactWrapper } from "enzyme";

export async function wait(ms: number = 100) {
  return new Promise((r, _) => setTimeout(r, ms));
}

export function setValue(wrapper: ReactWrapper, name: string, value: string) {
  wrapper
    .find(`input[name="${name}"]`)
    .getDOMNode<HTMLInputElement>().value = value;
}
