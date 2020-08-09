import React from "react";
import { mount } from "enzyme";
import { SelectBox } from "../SelectBox";

interface TestOption {
  id: string;
  name: string;
}

describe("<SelectBox />", () => {
  describe("defaultValue", () => {
    const $ = mount(
      <SelectBox
        readOnly
        value={"002"}
        label={"test"}
        options={{
          items: [
            { id: "001", name: "Item1" },
            { id: "002", name: "Item2" },
            { id: "003", name: "Item3" }
          ],
          label: (item: TestOption) => item.name,
          value: (item: TestOption) => item.id
        }}
      />
    );

    const $select = $.find("select").getDOMNode() as HTMLSelectElement;

    it("選択された値が選択される", () => {
      expect($select.value).toBe("002");
    });

    it("選択された値に対応する文字列が表示される", () => {
      expect($select.options.item(1).text).toBe("Item2");
    });

    it("指定された値に対応するオプションが選択される", () => {
      const $selected = Array.from($select.options).filter(
        o => o.selected === true
      );
      expect($selected.length).toBe(1);
      expect($selected[0].value).toBe("002");
    });
  });
});
