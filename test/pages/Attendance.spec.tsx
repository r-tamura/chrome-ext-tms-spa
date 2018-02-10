import "jest"
import * as React from "react"
import renderer from "react-test-renderer"
import { shallow, mount } from "enzyme"
import Adapter from "enzyme-adapter-react-16"
import toJson from "enzyme-to-json"
import { AttendancePage } from "~/pages/Attendance"
import {
  getMockRouterProps,
  AttendanceSettingsModelBuilder,
  AttendanceViewModelBuilder,
  ProjectsBuilder,
} from "../__mocks__/"
import { AttendanceMonthlyView } from "~/types"

describe("<AttendancePage />", () => {

  it("shoud match existing snapshot", () => {
    const mockRoute = getMockRouterProps(null)
    const mockFunc = jest.fn()
    const page = renderer.create(
      <AttendancePage
        attendanceMonthly={AttendanceViewModelBuilder.build()}
        attendanceSettings={AttendanceSettingsModelBuilder.build()}
        projects={ProjectsBuilder.of().with2Projects().build()}
        fetchAttendancesIfNeeded={jest.fn()}
        fetchSettings={jest.fn()}
        saveAttendancesIfNeeded={jest.fn()}
        updateDaily={jest.fn()}
        setMonthlyWithDefaults={jest.fn()}
        updateSettings={jest.fn()}
        changeMonth={mockFunc}
        {...mockRoute}
      />
    ).toJSON()

    expect(page).toMatchSnapshot()
  })

  it("should be right next month", () => {
    const mockRoute = getMockRouterProps(null)
    const mockFunc = jest.fn()
    const w = shallow(
      <AttendancePage
        attendanceMonthly={AttendanceViewModelBuilder.build()}
        attendanceSettings={AttendanceSettingsModelBuilder.build()}
        projects={ProjectsBuilder.of().with2Projects().build()}
        fetchAttendancesIfNeeded={jest.fn()}
        fetchSettings={jest.fn()}
        saveAttendancesIfNeeded={jest.fn()}
        updateDaily={jest.fn()}
        setMonthlyWithDefaults={jest.fn()}
        updateSettings={jest.fn()}
        changeMonth={mockFunc}
        {...mockRoute}
      />
    )
    w.find("#btn-next-month").simulate("click")
    expect(mockFunc.mock.calls[0]).toEqual([2018, 2])

    w.find("#btn-prev-month").simulate("click")
    expect(mockFunc.mock.calls[1]).toEqual([2017, 12])
  })

  it("should make disable submit button", () => {
    const mockRoute = getMockRouterProps(null)
    const mockFunc = jest.fn()
    const w = mount(
      <AttendancePage
        attendanceMonthly={AttendanceViewModelBuilder.of().hasApplied().build()}
        attendanceSettings={AttendanceSettingsModelBuilder.build()}
        projects={ProjectsBuilder.of().with2Projects().build()}
        fetchAttendancesIfNeeded={jest.fn()}
        fetchSettings={jest.fn()}
        saveAttendancesIfNeeded={jest.fn()}
        updateDaily={jest.fn()}
        setMonthlyWithDefaults={jest.fn()}
        updateSettings={jest.fn()}
        changeMonth={mockFunc}
        {...mockRoute}
      />
    )
    const $submit = w.find("button#btn-submit")
    expect($submit.length).toBe(1)
    expect($submit.hasClass("disabled")).toBeTruthy()
  })
})
