import React from "react";
import { mount } from "enzyme";
import toJson from "enzyme-to-json";
import { MemoryRouter } from "react-router";
import Nav, { INavProps } from "~/components/organisms/Nav";
import { AppThemeProvider } from "~/components/Provider";

const createComponent = (props: INavProps = { path: "transportation" }) => (
  <AppThemeProvider>
    <MemoryRouter>
      <Nav {...props}>Item</Nav>
    </MemoryRouter>
  </AppThemeProvider>
);

describe("<Nav />", () => {
  it("Snapshot", () => {
    const $ = mount(createComponent({ path: "transportation" }));
    expect(toJson($)).toMatchSnapshot();
  });

  describe("交通費選択中", () => {
    const $ = mount(createComponent({ path: "transportation" }));
    const $NavItems = $.find("NavItem");

    it("リンクは3つ", () => {
      expect($NavItems.length).toBe(3);
    });

    it("交通費が選択されている", () => {
      expect($NavItems.at(0).text()).toBe("交通費");
      expect($NavItems.at(0).prop("selected")).toBeTruthy();
    });

    it("勤怠管理が選択されていない", () => {
      expect($NavItems.at(1).text()).toBe("勤怠管理");
      expect($NavItems.at(1).prop("selected")).toBeFalsy();
    });

    it("資源管理は未実装のため無効", () => {
      expect($NavItems.at(2).prop("disabled")).toBeTruthy();
    });
  });

  describe("勤怠管理選択中", () => {
    const w = mount(createComponent({ path: "attendance" }));
    const $NavItems = w.find("NavItem");

    it("交通費管理が選択されていない", () => {
      expect($NavItems.at(0).prop("selected")).toBeFalsy();
    });

    it("勤怠管理が選択されている", () => {
      expect($NavItems.at(1).prop("selected")).toBeTruthy();
    });
  });
});
