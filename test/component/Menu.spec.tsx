import * as React from "react"
// @ts-ignore
import MockRouter from "react-mock-router"
import { mount, render, shallow } from "enzyme"
import Menu, { MenuItem } from "~/components/Menu"

const onClick = jest.fn()
const createComponent = () => (
  <MockRouter>
    <Menu title={"Test Menu"} open={true} onClick={onClick}>
      <MenuItem to={"/"} >{"item1"}</MenuItem>
      <MenuItem to={"/"} >{"item2"}</MenuItem>
    </Menu>
  </MockRouter>
)

describe("<Menu />", () => {
  it("shallow rendering", () => {
    const wrapper = shallow(createComponent())
    wrapper.simulate("click")
    expect(onClick.mock.calls.length).toBe(1)
  })
  it("full DOM rendering", () => {
    const wrapper = mount(createComponent())
    expect(wrapper.find("div").at(1).text()).toBe("Test Menu")
  })

  it("should be not opened", () => {
    const wrapper = shallow(<Menu title={"not opened"} onClick={onClick}/>)
    expect(wrapper.html()).toBe(null)
  })
})
