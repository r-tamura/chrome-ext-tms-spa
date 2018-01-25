import "jest"
import * as React from "react"
import renderer from "react-test-renderer"
import { shallow, mount } from "enzyme"
import Adapter from "enzyme-adapter-react-16"
import toJson from "enzyme-to-json"
import { AttendancePage } from "~/pages/Attendance"
import { getMockRouterProps } from "../__mock__/ReactRouteProps"

const attendanceMonthly = {
  monthlyId: "201801",
  reportId: "reportId",
  year: 2018,
  month: 1,
  days: [
    {
      dailyId: "20180101",
      day: 1,
      isWeekday: false,
      start: "09:00",
      end: "17:30",
      overwork: "00:00",
      overnightwork: "00:00",
      hasConfirmed: true,
      hasUpdated: false,
      project: { projectId: "000001", name: "Project 1"},
    },
  ],
  isFetching: false,
  lastUpdatedOn: 1516808776046,
}

const attendanceSettings = {
  start: "09:00",
  end: "17:30",
  projectId: "000001",
}

const projects = [
  {projectId: "201108010001", name: "総務（営業）"},
  {projectId: "201203010001", name: "社内教育（一般）"},
]

describe("<AttendancePage />", () => {

  it("shoud match existing snapshot", () => {
    const mockRoute = getMockRouterProps(null)
    const mockFunc = jest.fn()
    const page = renderer.create(
      <AttendancePage
        attendanceMonthly={attendanceMonthly}
        attendanceSettings={attendanceSettings}
        projects={projects}
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
    const component = shallow(
      <AttendancePage
        attendanceMonthly={attendanceMonthly}
        attendanceSettings={attendanceSettings}
        projects={projects}
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
    component.find("#btn-next-month").simulate("click")
    expect(mockFunc.mock.calls[0]).toEqual([2018, 2])

    component.find("#btn-prev-month").simulate("click")
    expect(mockFunc.mock.calls[1]).toEqual([2017, 12])
  })
})
