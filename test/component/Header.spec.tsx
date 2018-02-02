import * as React from "react"
import { mount, render, shallow } from "enzyme"
import { Header } from "~/components/Header"

describe("<Header />", () => {
  it("shallow rendering", () => {
    const mockLogoutUser = jest.fn()
    const wrapper = shallow(
      <Header
        logoutUser={mockLogoutUser}
        username={"test1"}
      />
    )

    expect(wrapper.find("header").length).toBe(1)

    const $a = wrapper.find("a")
    expect($a.length).toBe(1)
    expect($a.props().href).toBe("http://www.telema.jp/")

    const $HeaderUser = wrapper.find("HeaderUser")
    expect($HeaderUser.prop("onLogout")).toEqual(mockLogoutUser)
    expect($HeaderUser.children().text()).toBe("test1")
  })

  it("static rendering", () => {
    const mockLogoutUser = jest.fn()
    const w = mount(
      <Header
        logoutUser={mockLogoutUser}
        username={"test1"}
      />
    )
    expect(w.find("Menu").children().length).toBe(0)
    w.find("#header-user-button").simulate("click")
    expect(w.find("Menu").children().length).toBe(1)
    expect(w.find("Menu").children().hasClass("menu-main")).toBeTruthy()

    w.find("span#logout").simulate("click")
    expect(mockLogoutUser.mock.calls.length).toBe(1)
  })
})
