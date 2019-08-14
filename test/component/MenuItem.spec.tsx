import React from "react";
import { MemoryRouter } from "react-router";
import { mount, render } from "enzyme";
import { MenuItem } from "~/components/Menu";

const createComponent = () => (
  <MemoryRouter>
    <MenuItem to={"/"}>{"item1"}</MenuItem>
  </MemoryRouter>
);

describe("<MenuItem />", () => {
  it("static rendering", () => {
    const wrapper = render(createComponent());
    expect(wrapper.text()).toBe("item1");
    const $a = wrapper.find("a");
    expect($a.length).toBe(1);
  });

  it("full DOM rendering", () => {
    const wrapper = mount(createComponent());
    wrapper.find("a").simulate("click");
  });

  it("Button item", () => {
    const mockOnClick = jest.fn();
    const wrapper = mount(
      <MenuItem button onClick={mockOnClick}>
        {"button item"}
      </MenuItem>
    );

    expect(mockOnClick.mock.calls.length).toBe(0);
    wrapper.find("button").simulate("click");
    expect(mockOnClick.mock.calls.length).toBe(1);
  });
});
