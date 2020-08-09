import React from "react";
import { mount } from "enzyme";
import { MenuItem } from "~/components/molecules/Menu";

describe("<MenuItem />", () => {
  describe("子要素がテキスト", () => {
    const $ = mount(<MenuItem>{"item1"}</MenuItem>);
    it("テキスト", () => {
      expect($.text()).toBe("item1");
    });

    describe("スタイルの上書き", () => {
      const $ = mount(<MenuItem style={{ color: "red" }}>{"item1"}</MenuItem>);
      it("上書きされたスタイルが適用されている", () => {
        const color = ($.getDOMNode() as HTMLElement).style.color;
        expect(color).toBe("red");
      });
    });
  });
});
