import * as React from "react"
// @ts-ignore
import MockRouter from "react-mock-router"
import { mount, render } from "enzyme"
import Menu, { MenuItem } from "~/components/Menu"

const createComponent = () =>
  <MockRouter><MenuItem to={"/"} >{"item1"}</MenuItem></MockRouter>

describe("<MenuItem />", () => {
  it("static rendering", () => {
    const wrapper = render(createComponent())
    expect(wrapper.text()).toBe("item1")
    const $a = wrapper.find("a")
    expect($a.length).toBe(1)
  })

  it("full DOM rendering", () => {
    const wrapper = mount(createComponent())
    wrapper.find("a").simulate("click")
  })

  it("Button item", () => {
    const mockOnClick = jest.fn()
    const wrapper = mount(
      <MenuItem
        button
        onClick={mockOnClick}
      >
        {"button item"}
      </MenuItem>
    )

    expect(mockOnClick.mock.calls.length).toBe(0)
    wrapper.find("button").simulate("click")
    expect(mockOnClick.mock.calls.length).toBe(1)
  })
})
