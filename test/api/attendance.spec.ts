import "jest"
import {
  getHasApplied,
  saveMonthlyAttendances,
} from "~/api/attendance"
import { Status } from "~/types"

describe("/api/attendance/getHasApplied", () => {
  it("should have applied", async () => {
    expect.assertions(1)
    expect(getHasApplied(2017, 12)).resolves.toBeTruthy()
  })

  it("should not have applied", async () => {
    expect.assertions(1)
    expect(getHasApplied(2018, 12)).resolves.toBeFalsy()
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
