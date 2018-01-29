import * as React from "react"
// @ts-ignore
import MockRouter from "react-mock-router"
import { mount, render, shallow } from "enzyme"
import { MenuList, MenuItem } from "~/components/Menu"

const createComponent = (mockFunc: (e: any) => any =  (e: any) => null) => (
  <MockRouter>
    <MenuList>
      <MenuItem to={"/"} >{"item1"}</MenuItem>
      <MenuItem button onClick={mockFunc} >{"item2"}</MenuItem>
    </MenuList>
  </MockRouter>
)

describe("<MenuItem />", () => {

  it("shallow rendering", () => {
    const mockFunc = jest.fn()
    const wrapper = shallow(createComponent(mockFunc))
    wrapper.find("MenuItem").at(1).simulate("click")
    expect(mockFunc.mock.calls)
    expect(mockFunc.mock.calls.length).toBe(1)
  })

  it("static rendering", () => {
    const wrapper = render(createComponent())
    expect(wrapper.find("li").length).toBe(2)
    const $listItems = wrapper.find("li").children()
    expect($listItems.last().text()).toBe("item2")
  })

})
