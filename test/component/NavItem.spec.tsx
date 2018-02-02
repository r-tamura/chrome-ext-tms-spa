import React from "react"
import renderer from "react-test-renderer"
import { mount, render } from "enzyme"
import toJson from "enzyme-to-json"
// @ts-ignore
import MockRouter from "react-mock-router"
import NavItem, { INavProps } from "~/components/NavItem"

const component = (props: INavProps = { to: "/" }) => (
  <MockRouter>
    <NavItem {...props}>
      Item
    </NavItem>
  </MockRouter>
)

describe("<NavItem />", () => {

  it("snap shot", () => {
    const c = renderer.create(component()).toJSON()
    expect(c).toMatchSnapshot()
  })

  it("full DOM rendering", () => {
    const w = mount(component({ to: "/" }))
    expect(toJson(w)).toMatchSnapshot()
    expect(w.text()).toBe("Item")

    const $link = w.find("Link")
    expect($link.length).toBe(1)
    expect($link.prop("to")).toBe("/")
  })

  it("should be selected", () => {
    const w = render(component({ to: "/", selected: true }))
    expect(w.hasClass("selected")).toBeTruthy()
  })

  it("should be disabled", () => {
    const w = render(component({ to: "/", disabled: true }))
    expect(w.is("div")).toBe(true)
    expect(w.hasClass("disabled")).toBeTruthy()
  })

  it("static rendering", () => {
    const w = render(component({ to: "/" }))
    expect(w.is("a")).toBe(true)
    expect(w.hasClass("selected")).toBeFalsy()
    expect(w.hasClass("disabled")).toBeFalsy()
  })
})
