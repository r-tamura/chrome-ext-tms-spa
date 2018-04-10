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

const fn = () => jest.fn()

const createComponent = ({
  attendanceMonthly = AttendanceViewModelBuilder.build(),
  attendanceSettings = AttendanceSettingsModelBuilder.build(),
  projects = ProjectsBuilder.of().with2Projects().build(),
  fetchAttendancesIfNeeded = jest.fn(),
  fetchSettings = jest.fn(),
  saveAttendancesIfNeeded = jest.fn(),
  updateDaily = jest.fn(),
  setMonthlyWithDefaults = jest.fn(),
  updateSettings = jest.fn(),
  changeMonth = jest.fn(),
  submitApplication = jest.fn(),
} = {}) => {
  const data = {
    attendanceMonthly,
    attendanceSettings,
    projects,
  }
  const fns = {
    fetchAttendancesIfNeeded,
    fetchSettings,
    saveAttendancesIfNeeded,
    updateDaily,
    setMonthlyWithDefaults,
    updateSettings,
    changeMonth,
    submitApplication,
  }
  return {
    fns,
    component: <AttendancePage {...data} {...fns} {...getMockRouterProps(null)} />,
  }
}

describe("<AttendancePage />", () => {

  it("shoud match existing snapshot", () => {
    const mock = createComponent()
    const page = renderer.create(mock.component).toJSON()
    expect(page).toMatchSnapshot()
  })

  it("should be right next month", () => {
    const mock = createComponent()
    const { changeMonth } = mock.fns
    const w = shallow(mock.component)
    w.find("#btn-next-month").simulate("click")
    expect(changeMonth.mock.calls[0]).toEqual([2018, 2])

    w.find("#btn-prev-month").simulate("click")
    expect(changeMonth.mock.calls[1]).toEqual([2017, 12])
  })

  it("should make disable submit button", () => {
    const mock = createComponent({ attendanceMonthly: AttendanceViewModelBuilder.of().hasApplied().build() })
    const w = mount(mock.component)
    const $submit = w.find("button#btn-submit")
    expect($submit.length).toBe(1)
    expect($submit.hasClass("disabled")).toBeTruthy()
  })

  // it("should submit Application", () => {
  //   const mock = createComponent({ attendanceMonthly: AttendanceViewModelBuilder.of().hasApplied().build() })
  //   const w = mount(mock.component)
  //   w.find("").simulate("click")
  //   expect()
  // })
})
