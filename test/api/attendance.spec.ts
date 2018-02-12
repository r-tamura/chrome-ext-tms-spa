import "jest"
import getMockState from "../__mocks__/getMockState"
import {
  fetchMonthlyAttendance,
  fetchHasApplied,
  fetchSummary,
  submitApplication,
  saveMonthlyAttendances,
} from "~/api/attendance"
import { Project, AttendanceDaily, Status, ResultStatus, ApiResponse, ApiError } from "~/types"

describe("/api/attendance/fetchMonthlyAttendance", () => {

  it("should be AttendanceMonthlyAPI Data", async () => {
    const projects = getMockState("master.projects")
    expect.assertions(2)
    const actual = fetchMonthlyAttendance(2018, 2, { projects, usages: [], objectives: [] })
    const expectedDays: AttendanceDaily[] = [
      {
         dailyId: "20180201",
         day: 1,
         end: "",
         hasConfirmed: false,
         isWeekday: true,
         overnightwork: "",
         overwork: "",
         projectId: null,
         start: "",
      },
   ]
    const expectedOthers = {
      month: 2,
      monthlyId: "201802",
      reportId: "0133",
      year: 2018,
    }
    const { days: actualDays, ...acutalOthers } = await actual
    expect(actualDays[0]).toEqual(expectedDays[0])
    expect(acutalOthers).toEqual(expectedOthers)
  })
})

describe("/api/attendance/getHasApplied", () => {
  it("should have applied", async () => {
    expect.assertions(1)
    expect(fetchHasApplied(2017, 12)).resolves.toBeTruthy()
  })

  it("should not have applied", async () => {
    expect.assertions(1)
    expect(fetchHasApplied(2018, 12)).resolves.toBeFalsy()
  })
})

describe("/api/attendance/fetchSummary", () => {
  it("total 120 hours", async () => {
    expect.assertions(1)
    const actual = await fetchSummary(2017, 12)
    const expected = {
      status: Status.OK,
      body: {
        totalTime: 432000,
        normalTime: 9960,
        midnightTime: 0,
        weekendTime: 0,
        allnightTime: 0,
      },
    }
    expect(actual).toEqual(expected)
  })

})

describe("/api/attendance/saveMonthlyAttendances", () => {
  it("should not send request.", async () => {
    expect.assertions(1)
    const expected = {
      status: Status.OK,
      message: "There was no update.",
    }
    expect(saveMonthlyAttendances(2018, 1, [])).resolves.toEqual(expected)
  })

  it("should send 1 request", async () => {
    expect.assertions(1)
    const expected = {
      status: Status.OK,
      message: "1 attendances recordes was sent",
    }
    expect(saveMonthlyAttendances(2018, 1, [
      {
        dailyId: "20180104",
        day: 4,
        end: "", // endが指定されていない
        hasConfirmed: false,
        hasUpdated: true,
        isWeekday: true,
        overnightwork: "",
        overwork: "",
        projectId: "201108010001",
        start: "09:00",
      },
      {
        dailyId: "20180104",
        day: 4,
        end: "17:30",
        hasConfirmed: false,
        hasUpdated: true,
        isWeekday: true,
        overnightwork: "",
        overwork: "",
        projectId: "201108010001",
        start: "", // startが指定されていない
      },
      {
        dailyId: "20180105",
        day: 5,
        end: "17:30",
        hasConfirmed: false,
        hasUpdated: true,
        isWeekday: true,
        overnightwork: "",
        overwork: "",
        projectId: "201108010001",
        start: "09:00",
      },
    ])).resolves.toEqual(expected)
  })
})

describe("/api/attendance/apply", () => {
  it("should be resolved", async () => {
    expect.assertions(1)
    const status = await submitApplication({ monthlyId: "201801", isFetching: true })
    const expected: ApiResponse = {
      status: Status.OK,
      body: {
        message: "申請が完了しました",
      },
    }
    expect(status).toEqual(expected)
  })

  it("should be rejected", async () => {
    expect.assertions(1)
    const expected: ApiError = {
      response: {
        status: Status.NG,
        error: {
          message: "Not Found",
        },
        statusCode: 404,
      },
    }
    try {
      await submitApplication({ monthlyId: "201712", isFetching: true })
    } catch (e) {
      expect(e).toEqual(expected)
    }
  })
})
