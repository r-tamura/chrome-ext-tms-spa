import React from "react";
import { mount } from "enzyme";
import { AppHeader } from "~/components/organisms/Header";
import { ThemeProvider } from "styled-components";
import { telema } from "~/styles/theme";
import * as hooks from "~/stores/hooks";
import toJson from "enzyme-to-json";

jest.mock("../../../stores/hooks");
const mockedHooks = hooks as jest.Mocked<typeof hooks>;

describe("<AppHeader />", () => {
  it("shallow render snapshot", () => {
    const mockLogoutUser = jest.fn();
    mockedHooks.useUser.mockReturnValue({
      isAuthenticated: true,
      isFetching: false,
      name: "testuser",
      login: jest.fn(),
      logout: mockLogoutUser
    });
    const $ = mount(
      <ThemeProvider theme={telema}>
        <AppHeader />
      </ThemeProvider>
    );

    expect(toJson($)).toMatchSnapshot();
  });

  it("shallow rendering", () => {
    const mockLogoutUser = jest.fn();
    mockedHooks.useUser.mockReturnValue({
      isAuthenticated: true,
      isFetching: false,
      name: "testuser",
      login: jest.fn(),
      logout: mockLogoutUser
    });
    const wrapper = mount(
      <ThemeProvider theme={telema}>
        <AppHeader />
      </ThemeProvider>
    );

    const $a = wrapper.find("a");
    expect($a.length).toBe(1);
    expect($a.props().href).toBe("http://www.telema.jp/");

    const $HeaderUser = wrapper.find("HeaderUser");
    expect($HeaderUser.prop("onLogout")).toEqual(mockLogoutUser);
    expect($HeaderUser.children().text()).toBe("testuser");
  });

  describe("", () => {
    const mockLogoutUser = jest.fn();
    mockedHooks.useUser.mockReturnValue({
      isAuthenticated: true,
      isFetching: false,
      name: "testuser",
      login: jest.fn(),
      logout: mockLogoutUser
    });
    const $ = mount(
      <ThemeProvider theme={telema}>
        <AppHeader />
      </ThemeProvider>
    );

    it("子要素が2", () => {
      expect($.find("Menu").children().length).toBe(0);
    });

    it("クリックイベント", () => {
      $.find("span#header-user-button")
        .at(0)
        .simulate("click");
      expect($.find("Menu").children().length).toBe(1);
      $.find("button#logout").simulate("click");
      expect(mockLogoutUser.mock.calls.length).toBe(1);
    });
  });
});
