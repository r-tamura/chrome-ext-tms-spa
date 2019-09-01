import * as React from "react";
import renderer from "react-test-renderer";
import { shallow, mount } from "enzyme";
import { AttendancePage } from "~/components/pages";
import {
  AttendanceSettingsModelBuilder,
  AttendanceViewModelBuilder,
  ProjectsBuilder
} from "../../../../test/__mocks__";
import * as hooks from "~/stores/hooks";
import { AppThemeProvider } from "~/components/Provider";

jest.mock("../../../stores/hooks");
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
    Component: (
      <AppThemeProvider>
        <AttendancePage />
      </AppThemeProvider>
    )
  };
};

describe("<AttendancePage />", () => {
  it("shoud match existing snapshot", () => {
    const { Component } = createComponent();
    const page = renderer.create(Component).toJSON();
    expect(page).toMatchSnapshot();
  });

  it("should be right next month", () => {
    const { Component } = createComponent();
    const w = shallow(Component);
  });

  it("should make disable submit button", () => {
    const { changeMonth, Component } = createComponent({
      attendanceMonthly: AttendanceViewModelBuilder.of()
        .hasApplied()
        .build()
    });
    const w = mount(Component);

    w.find("button#btn-next-month").simulate("click");
    expect(changeMonth.mock.calls[0]).toEqual([2018, 2]);

    w.find("button#btn-prev-month").simulate("click");
    expect(changeMonth.mock.calls[1]).toEqual([2017, 12]);
    const $submit = w.find("button#btn-submit");
    expect($submit.length).toBe(1);
  });

  // it("should submit Application", () => {
  //   const mock = createComponent({ attendanceMonthly: AttendanceViewModelBuilder.of().hasApplied().build() })
  //   const w = mount(mock.component)
  //   w.find("").simulate("click")
  //   expect()
  // })
});
