import React from "react"
import { mount, render, shallow } from "enzyme"
import { MemoryRouter } from "react-router"
import Nav, { INavProps } from "~/components/Nav"

const component = (props: INavProps = { path: "transportation" }) => (
  <MemoryRouter>
    <Nav {...props}>
      Item
    </Nav>
  </MemoryRouter>
)

describe("<Nav />", () => {
  it("full DOM rendering", () => {
    const w = mount(component())
    const $NavItems = w.find("NavItem")
    expect($NavItems.length).toBe(3)

    expect($NavItems.at(0).text()).toBe("交通費")
    expect($NavItems.at(0).prop("selected")).toBeTruthy()

    expect($NavItems.at(1).text()).toBe("勤怠管理")
    expect($NavItems.at(1).prop("selected")).toBeFalsy()

    expect($NavItems.at(2).prop("disabled")).toBeTruthy()
  })

  it("attendance should be selected", () => {
    const w = mount(component({ path: "attendance" }))
    const $NavItems = w.find("NavItem")
    expect($NavItems.at(0).prop("selected")).toBeFalsy()
    expect($NavItems.at(1).prop("selected")).toBeTruthy()
  })
})
