import * as React from "react";
import renderer from "react-test-renderer";
import { shallow, mount } from "enzyme";
import { AttendancePage } from "~/pages";
import {
  AttendanceSettingsModelBuilder,
  AttendanceViewModelBuilder,
  ProjectsBuilder
} from "../../../test/__mocks__";
import * as hooks from "~/stores/hooks";

jest.mock("../../stores/hooks");
const mockedHooks = hooks as jest.Mocked<typeof hooks>;

const createComponent = ({
  attendanceMonthly = AttendanceViewModelBuilder.build(),
  attendanceSettings = AttendanceSettingsModelBuilder.build(),
  projects = ProjectsBuilder.of()
    .with2Projects()
    .build(),
  fetchAttendancesIfNeeded = jest.fn(),
  fetchSettings = jest.fn(),
  saveAttendancesIfNeeded = jest.fn(),
  updateDaily = jest.fn(),
  setMonthlyWithDefaults = jest.fn(),
  updateSettings = jest.fn(),
  changeMonth = jest.fn(),
  submitApplication = jest.fn()
} = {}) => {
  mockedHooks.useAttendance.mockReturnValue({
    attendanceMonthly,
    attendanceSettings,
    projects,
    fetchAttendances: fetchAttendancesIfNeeded,
    fetchSettings,
    saveAttendances: saveAttendancesIfNeeded,
    updateDaily,
    setMonthlyWithDefaults,
    updateSettings,
    changeMonth,
    submitApplication
  });
  return {
    fetchAttendancesIfNeeded,
    fetchSettings,
    saveAttendancesIfNeeded,
    updateDaily,
    setMonthlyWithDefaults,
    updateSettings,
    changeMonth,
    submitApplication,
    Component: <AttendancePage />
  };
};

describe("<AttendancePage />", () => {
  it("shoud match existing snapshot", () => {
    const { Component } = createComponent();
    const page = renderer.create(Component).toJSON();
    expect(page).toMatchSnapshot();
  });

  it("should be right next month", () => {
    const { changeMonth, Component } = createComponent();
    const w = shallow(Component);
    w.find("#btn-next-month").simulate("click");
    expect(changeMonth.mock.calls[0]).toEqual([2018, 2]);

    w.find("#btn-prev-month").simulate("click");
    expect(changeMonth.mock.calls[1]).toEqual([2017, 12]);
  });

  it("should make disable submit button", () => {
    const mock = createComponent({
      attendanceMonthly: AttendanceViewModelBuilder.of()
        .hasApplied()
        .build()
    });
    const w = mount(mock.Component);
    const $submit = w.find("button#btn-submit");
    expect($submit.length).toBe(1);
    expect($submit.hasClass("disabled")).toBeTruthy();
  });

  // it("should submit Application", () => {
  //   const mock = createComponent({ attendanceMonthly: AttendanceViewModelBuilder.of().hasApplied().build() })
  //   const w = mount(mock.component)
  //   w.find("").simulate("click")
  //   expect()
  // })
});
