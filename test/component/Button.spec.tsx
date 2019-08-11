import * as React from "react"
import { MemoryRouter } from "react-router"
import { mount, render, shallow } from "enzyme"
import Button, { Color } from "~/components/Button"

describe("<Button />", () => {
  it("should be button", () => {
    const $btn = mount(<MemoryRouter><Button /></MemoryRouter>).find(".tms-btn")
    expect($btn.length).toBe(1)
    expect($btn.hasClass("tms-btn")).toBeTruthy()
    expect($btn.hasClass("disabled")).toBeFalsy()
  })

  it("should be button", () => {
    const mockOnClick = jest.fn()
    const $link = mount(
      <MemoryRouter>
        <Button
          button={false}
          className={"foo bar"}
          disabled={true}
          onClick={mockOnClick}
          color={Color.PRIMARY}
          block={true}
          size={"small"}
          to={"/"}
        >
        Foo Button
        </Button>
      </MemoryRouter>
    ).find("a")

    expect($link.text()).toBe("Foo Button")
    expect($link.hasClass("disabled")).toBeTruthy()
    expect($link.hasClass("primary")).toBeTruthy()

    $link.simulate("click")
    expect(mockOnClick.mock.calls.length).toBe(1)
  })
})
