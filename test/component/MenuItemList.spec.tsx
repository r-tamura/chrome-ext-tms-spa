import React from "react";
import { MemoryRouter } from "react-router";
import { shallow, mount } from "enzyme";
import { MenuList, MenuItem } from "~/components/Menu";

function setup() {
  const mockedOnClick = jest.fn();
  return {
    mockedOnClick,
    Component: (
      <MenuList>
        <MemoryRouter>
          <MenuItem to={"/"}>{"item1"}</MenuItem>
        </MemoryRouter>
        <MemoryRouter>
          <MenuItem button onClick={mockedOnClick}>
            {"item2"}
          </MenuItem>
        </MemoryRouter>
      </MenuList>
    )
  };
}

describe("<MenuItem />", () => {
  it("shallow rendering", () => {
    const { Component } = setup();
    const wrapper = shallow(Component);
    expect(wrapper.find("MenuItem").length).toBe(2);
  });

  it("static rendering", () => {
    const { mockedOnClick, Component } = setup();
    const wrapper = mount(Component);
    expect(wrapper.find("li").length).toBe(2);
    const $listItems = wrapper.find("li").children();
    expect($listItems.last().text()).toBe("item2");

    expect(mockedOnClick.mock.calls.length).toBe(0);
    wrapper.find("button").simulate("click");
    expect(mockedOnClick.mock.calls.length).toBe(1);
  });
});
