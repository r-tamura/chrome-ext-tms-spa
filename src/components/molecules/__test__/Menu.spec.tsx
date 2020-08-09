import React from "react";
import { mount, shallow } from "enzyme";
import { Menu, MenuItem } from "~/components/molecules";
import { MemoryRouter } from "react-router";

function setup() {
  const mockedOnClick = jest.fn();
  return {
    mockedOnClick,
    Component: (
      <Menu title={"Test Menu"} open={true} onClose={mockedOnClick}>
        <MenuItem>{"item1"}</MenuItem>
        <MenuItem>{"item2"}</MenuItem>
      </Menu>
    )
  };
}

describe("<Menu />", () => {
  it("shallow rendering", () => {
    const mockedOnClick = jest.fn();
    const wrapper = shallow(
      <Menu title={"Test Menu"} open={true} onClose={mockedOnClick}>
        <MenuItem>{"item1"}</MenuItem>
        <MenuItem>{"item2"}</MenuItem>
      </Menu>
    );
    expect(wrapper.text().includes("Test Menu")).toBe(true);
    expect(wrapper.find("MenuItem").length).toBe(2);
  });
  it("full DOM rendering", () => {
    const { Component } = setup();
    const wrapper = mount(Component);
    expect(
      wrapper
        .find("div")
        .at(1)
        .text()
    ).toBe("Test Menu");
  });

  it("should be not opened", () => {
    const wrapper = shallow(<Menu title={"not opened"} onClose={jest.fn()} />);
    expect(wrapper.html()).toBe(null);
  });
});
