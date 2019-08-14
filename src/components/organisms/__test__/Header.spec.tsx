import React from "react";
import { mount } from "enzyme";
import { AppHeader } from "~/components/organisms/Header";
import { ThemeProvider } from "styled-components";
import { telema } from "~/styles/theme";
import * as hooks from "~/stores/hooks";

jest.mock("../../../stores/hooks");
const mockedHooks = hooks as jest.Mocked<typeof hooks>;

describe("<AppHeader />", () => {
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

  it("static rendering", () => {
    const mockLogoutUser = jest.fn();
    mockedHooks.useUser.mockReturnValue({
      isAuthenticated: true,
      isFetching: false,
      name: "testuser",
      login: jest.fn(),
      logout: mockLogoutUser
    });
    const w = mount(
      <ThemeProvider theme={telema}>
        <AppHeader />
      </ThemeProvider>
    );
    expect(w.find("Menu").children().length).toBe(0);
    w.find("span#header-user-button")
      .at(0)
      .simulate("click");
    expect(w.find("Menu").children().length).toBe(1);
    w.find("button#logout").simulate("click");
    expect(mockLogoutUser.mock.calls.length).toBe(1);
  });
});
