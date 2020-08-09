import React from "react";
import { shallow, mount } from "enzyme";
import { MenuList, MenuItem } from "~/components/molecules";

function setupWith2Items() {
  const mockedOnClick = jest.fn();
  return {
    mockedOnClick,
    Component: (
      <MenuList>
        <MenuItem as={"li"}>{"item1"}</MenuItem>
        <MenuItem as={"li"} onClick={mockedOnClick}>
          {"item2"}
        </MenuItem>
      </MenuList>
    )
  };
}

describe("<MenuItem />", () => {
  it("shallow rendering", () => {
    const { Component } = setupWith2Items();
    const $ = shallow(Component);
    expect($.find("MenuItem").length).toBe(2);
  });

  describe("リスト要素数: 2", () => {
    const { mockedOnClick, Component } = setupWith2Items();
    const $ = mount(Component);

    it("要素数が2", () => {
      expect($.find("li").length).toBe(2);
    });

    it("最後の要素のテキスト", () => {
      const $listItems = $.find("li");
      expect($listItems.last().text()).toBe("item2");
    });

    it("クリックイベント", () => {
      expect(mockedOnClick.mock.calls.length).toBe(0);
      $.find("li")
        .last()
        .simulate("click");
      expect(mockedOnClick.mock.calls.length).toBe(1);
    });
  });
});
