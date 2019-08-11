import React from "react";
import renderer from "react-test-renderer";
import { mount } from "enzyme";
import toJson from "enzyme-to-json";
import { LoginPage } from "~/pages/LoginPage";
import { getMockRouterProps } from "../__mocks__/";

describe("<LoginPage />", () => {
  const mockRoute = getMockRouterProps(null);
  it("should render 'fetching...'", () => {
    const mockFunc1 = jest.fn();
    const mockFunc2 = jest.fn();
    const page = renderer
      .create(
        <LoginPage
          isFetching={true}
          isAuthenticated={false}
          name={""}
          loginUser={mockFunc1}
          navigateToDashBoard={mockFunc2}
          {...mockRoute}
        />
      )
      .toJSON();
    expect(page).toMatchSnapshot();
  });

  it("should render Login page", () => {
    const mockFunc1 = jest.fn();
    const mockFunc2 = jest.fn();
    const component = mount(
      <LoginPage
        isFetching={false}
        isAuthenticated={false}
        name={"test"}
        loginUser={mockFunc1}
        navigateToDashBoard={mockFunc2}
        {...mockRoute}
      />
    );
    component.find("form").simulate("submit", { preventDefault: () => ({}) });
    expect(toJson(component)).toMatchSnapshot();
  });

  it("should redirect to DashBoard", () => {
    const mockFunc1 = jest.fn();
    const mockFunc2 = jest.fn();
    const component = mount(
      <LoginPage
        isFetching={false}
        isAuthenticated={true}
        name={"test"}
        loginUser={mockFunc1}
        navigateToDashBoard={mockFunc2}
        {...mockRoute}
      />
    );
    expect(mockFunc2).toBeCalled();
  });
});
