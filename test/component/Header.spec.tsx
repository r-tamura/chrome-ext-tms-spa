import * as React from "react"
import { mount, render, shallow } from "enzyme"
import { Header } from "~/components/Header"

describe("<Header />", () => {
  it("shallow rendering", () => {
    const wrapper = shallow(
      <Header
        logoutUser={jest.fn()}
        username={"test1"}
      />
    )

    expect(wrapper.find("header").length).toBe(1)

    const $a = wrapper.find("a")
    expect($a.length).toBe(1)
    expect($a.props().href).toBe("http://www.telema.jp/")

    const HeaderUser = wrapper.find("HeaderUser")
    expect(HeaderUser.children().text()).toBe("test1")
  })
})
