import React from "react";
import { mount } from "enzyme";
import { MemoryRouter } from "react-router";
import toJson from "enzyme-to-json";
import { matchers } from "jest-emotion";
import { NavItem } from "~/components/molecules";
import { AppThemeProvider } from "~/components/Provider";
import { telema } from "~/styles/theme";

expect.extend(matchers);

const withRouter = (children: React.ReactNode) => (
  // keyを与えないとスナップショットテストに失敗する
  // refers: https://github.com/ReactTraining/react-router/issues/5579
  <AppThemeProvider>
    <MemoryRouter initialEntries={[{ pathname: "/", key: "testKey" }]}>
      {children}
    </MemoryRouter>
  </AppThemeProvider>
);

describe("<NavItem />", () => {
  it("Snapshot", () => {
    const $ = mount(withRouter(<NavItem to="/">Item</NavItem>));

    expect(toJson($)).toMatchSnapshot();
  });

  describe("未選択状態", () => {
    const $ = mount(withRouter(<NavItem to="/">Item</NavItem>));
    const $link = $.find("a");

    it("未選択状態", () => {
      const $Item = $.find("div");
      expect($Item.length).toBe(1);
      expect($Item.prop("disabled")).toBe(false);
    });

    it("指定されたテキストが表示される", () => {
      expect($.text()).toBe("Item");
    });
    it("リンクタグを含む", () => {
      expect($link.length).toBe(1);
    });

    it("リンク先が指定されたパスとなっている", () => {
      expect($link.prop("href")).toBe("/");
    });

    // TODO: emotionのstyled-componentsで指定されたスタイルがテストできない
    // it("リンクはblockスタイル", () => {
    //   // console.log(toJson($link));
    //   expect(toJson($)).toHaveStyleRule("display", "block");
    // });
  });

  describe("選択状態", () => {
    const $ = mount(
      withRouter(
        <NavItem to="/" selected={true}>
          Item
        </NavItem>
      )
    );
    it("背景色がプライマリカラーの濃い色", () => {
      const $item = $.find("div");
      const bg = ($item.getDOMNode() as HTMLElement).style.backgroundColor;
      expect(bg).toBe(telema.primaryDark);
    });
  });

  describe("無効状態", () => {
    const $ = mount(
      withRouter(
        <NavItem to="/" disabled={true}>
          Item
        </NavItem>
      )
    );

    it("リンクが無効(aタグが存在しない)", () => {
      const $link = $.find("a");
      expect($link.length).toBe(0);
    });
  });
  // it("should be disabled", () => {

  //   expect(w.is("div")).toBe(true);
  //   expect(w.hasClass("disabled")).toBeTruthy();
  // });

  // it("static rendering", () => {
  //   const w = mount(withRouter(<NavItem to="/">Item</NavItem>));
  //   expect(w.is("a")).toBe(true);
  //   expect(w.hasClass("selected")).toBeFalsy();
  //   expect(w.hasClass("disabled")).toBeFalsy();
  // });
});
