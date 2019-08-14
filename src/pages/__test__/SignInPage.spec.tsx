import React from "react";
import renderer from "react-test-renderer";
import { mount } from "enzyme";
import toJson from "enzyme-to-json";
import { SignInPage } from "~/pages/SignInPage";
import * as hooks from "~/stores/hooks";

// Jest Mock in TypeScript
// https://stackoverflow.com/questions/51495473/typescript-and-jest-avoiding-type-errors-on-mocked-functions
jest.mock("../../stores/hooks");
const mockedHooks = hooks as jest.Mocked<typeof hooks>;

describe("<SignInPage />", () => {
  it("should render 'Fetching...'", () => {
    mockedHooks.useUser.mockReturnValue({
      isAuthenticated: false,
      isFetching: true,
      name: null,
      login: jest.fn(),
      logout: jest.fn()
    });
    mockedHooks.useRouter.mockReturnValue({
      pathname: "/signin",
      goto: jest.fn(),
      gotoSignIn: jest.fn(),
      gotoDashboard: jest.fn(),
      gotoTransportation: jest.fn(),
      gotoAttendance: jest.fn()
    });
    const page = renderer.create(<SignInPage />).toJSON();
    expect(page).toMatchSnapshot();
  });
  it("should render Login page", () => {
    mockedHooks.useUser.mockReturnValue({
      isAuthenticated: true,
      isFetching: false,
      name: "testuser",
      login: jest.fn(),
      logout: jest.fn()
    });
    const component = mount(<SignInPage />);
    component.find("form").simulate("submit", { preventDefault: () => ({}) });
    expect(toJson(component)).toMatchSnapshot();
  });
  it("should redirect to DashBoard", () => {
    const mockedGoto = jest.fn();
    mockedHooks.useUser.mockReturnValue({
      isAuthenticated: true,
      isFetching: false,
      name: "testuser",
      login: jest.fn(),
      logout: jest.fn()
    });
    mockedHooks.useRouter.mockReturnValue({
      pathname: "/signin",
      goto: mockedGoto,
      gotoSignIn: jest.fn(),
      gotoDashboard: jest.fn(),
      gotoTransportation: jest.fn(),
      gotoAttendance: jest.fn()
    });
    mount(<SignInPage />);
    expect(mockedGoto).toBeCalled();
  });
});
