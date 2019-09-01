import * as React from "react";
import { MemoryRouter } from "react-router";
import { mount } from "enzyme";
import { Button } from "~/components/atoms";
import { AppThemeProvider } from "~/components/Provider";

describe("<Button />", () => {
  it("should be button", () => {
    const $btn = mount(
      <MemoryRouter>
        <AppThemeProvider>
          <Button />
        </AppThemeProvider>
      </MemoryRouter>
    ).find("button");
    expect($btn.length).toBe(1);
    expect($btn.prop("disabled")).toBeFalsy();
    expect($btn.hasClass("disabled")).toBe(false);
  });

  it("should be button", () => {
    const mockOnClick = jest.fn();
    const $link = mount(
      <MemoryRouter>
        <Button
          variant={"link"}
          className={"foo bar"}
          disabled={true}
          onClick={mockOnClick}
          color={"primary"}
          block={true}
          size={"small"}
          to={"/"}
        >
          Foo Button
        </Button>
      </MemoryRouter>
    ).find("a");

    expect($link.text()).toBe("Foo Button");
    $link.simulate("click");
    expect(mockOnClick.mock.calls.length).toBe(1);
  });
});
