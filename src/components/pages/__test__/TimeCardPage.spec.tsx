import React from "react";
import { shallow, mount } from "enzyme";
import { TimeCardPage } from "~/components/pages";
import {
  AttendanceSettingsModelBuilder,
  AttendanceViewModelBuilder,
  ProjectsBuilder
} from "../../../../test/__mocks__";
import * as hooks from "~/stores/hooks";
import { AppThemeProvider } from "~/components/Provider";
import toJson from "enzyme-to-json";

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
  submitApplication = jest.fn(),
  nextMonth = jest.fn(),
  prevMonth = jest.fn()
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
    submitApplication,
    nextMonth,
    prevMonth
  });
  return {
    spyFetchAttendances: fetchAttendancesIfNeeded,
    spyFetchSettings: fetchSettings,
    spySaveAttendances: saveAttendancesIfNeeded,
    spyUpdateDaily: updateDaily,
    spySetMonthlyWithDefaults: setMonthlyWithDefaults,
    spyUpdateSettings: updateSettings,
    spyChangeMonth: changeMonth,
    spySubmitApplication: submitApplication,
    spyNextMonth: nextMonth,
    spyPrevMonth: prevMonth,
    Component: (
      <AppThemeProvider>
        <TimeCardPage />
      </AppThemeProvider>
    )
  };
};

describe("<TimeCardPage />", () => {
  it("shallow render snapshot", () => {
    const { Component } = createComponent();
    const $ = shallow(Component);
    expect(toJson($)).toMatchSnapshot();
  });

  describe("承認申請済み勤怠", () => {
    const { Component, ...dispatchers } = createComponent({
      attendanceMonthly: AttendanceViewModelBuilder.of()
        .hasApplied()
        .build()
    });
    const $ = mount(Component);

    it("年月", () => {
      expect($.find("h1 span").text()).toBe("2018 / 1");
    });

    it("次の月へ移動", () => {
      $.find("button#btn-next-month").simulate("click");
      expect(dispatchers.spyNextMonth.mock.calls.length).toBe(1);
    });

    it("前の月へ移動", () => {
      $.find("button#btn-prev-month").simulate("click");
      expect(dispatchers.spyPrevMonth.mock.calls.length).toBe(1);
    });

    it("申請ボタン(無効)", () => {
      const $submit = $.find("button#btn-submit");
      expect($submit.length).toBe(1);
      expect($submit.prop("title")).toBe("上長申請中");
      expect($submit.prop("disabled")).toBe(true);
    });

    it("デフォルト勤怠のセット", () => {
      $.find("button#btn-set-default").simulate("click");
      expect(dispatchers.spySetMonthlyWithDefaults.mock.calls.length).toBe(1);
      expect(dispatchers.spySetMonthlyWithDefaults.mock.calls[0][0]).toEqual([
        "20180101",
        "20180102"
      ]);
    });

    it("入力データの保存", () => {
      $.find("button#btn-save").simulate("click");
      expect(dispatchers.spySaveAttendances.mock.calls.length).toBe(1);
    });

    it("リロード", () => {
      $.find("button#btn-force-fetch").simulate("click");
      expect(dispatchers.spyFetchAttendances.mock.calls.length).toBe(1);
    });
  });

  describe("未承認申請勤怠", () => {
    const { Component, spySubmitApplication } = createComponent({
      attendanceMonthly: AttendanceViewModelBuilder.of()
        .hasApplied(false)
        .build()
    });
    const $ = mount(Component);
    it("申請ボタン(有効)", () => {
      const $submit = $.find("button#btn-submit");
      expect($submit.prop("disabled")).toBeFalsy();
      // expect(spySubmitApplication.mock.calls.length).toBe(0);
      // $submit.simulate("click");
      // expect(spySubmitApplication.mock.calls.length).toBe(1);
    });
  });
});
