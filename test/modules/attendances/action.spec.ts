import * as Act from "~/modules/attendances"
import { ActionTypes } from "~/modules/attendances/actiontypes"
import getMockState from "../../__mocks__/getMockState"

describe("/attendances/action/fetchAttendances", () => {
  it("should fetch not applied attendances", async () => {
    const dispatch = jest.fn()
    const getState = jest.fn().mockReturnValue({
      master: {
        projects: [], usages: [], objective: [],
      },
    })
    expect.assertions(4)
    await Act.fetchAttendances(2018, 2)(dispatch, getState)

    const expected1 = {
      type: ActionTypes.FETCH_REQUEST,
      monthlyId: "201802",
      isFetching: true,
    }
    const expected2 = {
      type: ActionTypes.FETCH_SUCCESS,
      attendanceMonthlyResponse: {
        monthlyId: "201802",
        year: 2018,
        month: 2,
        hasApplied: false,
      },
      isFetching: false,
    }
    expect(dispatch.mock.calls.length).toBe(2)
    expect(dispatch.mock.calls[0][0]).toEqual(expected1)
    // Date.now()で値を取得しているプロパティがあるのでtoMatchObjectを利用
    expect(dispatch.mock.calls[1][0]).toMatchObject(expected2)
    expect(dispatch.mock.calls[1][0].attendanceMonthlyResponse.days[0]).toEqual({
      dailyId: "20180201",
      day: 1,
      isWeekday: true,
      start: "",
      end: "",
      overwork: "",
      overnightwork: "",
      projectId: null,
      hasConfirmed: false,
    })
  })
})

describe("/attendances/action/fetchAttendancesIfNeeded", () => {
  it("should dispatch action", () => {
    const dispatch = jest.fn()
    const getState = jest.fn().mockReturnValue(getMockState())
    Act.fetchAttendancesIfNeeded()(dispatch, getState)
    expect(dispatch.mock.calls.length).toBe(1)
  })

  it("should not dispatch (isFetching)", () => {
    const dispatch = jest.fn()
    const getState = jest.fn().mockReturnValue({
      attendances: {
        yearAndMonth: {
          selectedYear: 2018,
          selectedMonth: 1,
        },
        monthlies: {
          byId: {
            201801: {
              isFetching: true,
            },
          },
        },
      },
    })
    Act.fetchAttendancesIfNeeded()(dispatch, getState)
    expect(dispatch.mock.calls.length).toBe(0)
  })

  it("should not dispatch (no days updated)", () => {
    const dispatch = jest.fn()
    const getState = jest.fn().mockReturnValue({
      attendances: {
        yearAndMonth: {
          selectedYear: 2018,
          selectedMonth: 1,
        },
        dailies: {
          byId: {
            20180101: {
              hasUpdated: false,
            },
            20180102: {
              hasUpdated: false,
            },
          },
        },
        monthlies: {
          byId: {
            201801: {
              isFetching: false,
              days: ["20180101", "20180102"],
              lastUpdatedOn: (new Date()).getTime(),
            },
          },
        },
      },
    })
    Act.fetchAttendancesIfNeeded()(dispatch, getState)
    expect(dispatch.mock.calls.length).toBe(0)
  })

  it("should dispatch (1 day updated)", () => {
    const dispatch = jest.fn()
    const getState = jest.fn().mockReturnValue({
      attendances: {
        yearAndMonth: {
          selectedYear: 2018,
          selectedMonth: 1,
        },
        dailies: {
          byId: {
            20180101: {
              hasUpdated: false,
            },
            20180102: {
              hasUpdated: true,
            },
          },
        },
        monthlies: {
          byId: {
            201801: {
              isFetching: false,
              days: ["20180101", "20180102"],
              lastUpdatedOn: (new Date()).getTime(),
            },
          },
        },
      },
    })
    Act.fetchAttendancesIfNeeded()(dispatch, getState)
    expect(dispatch.mock.calls.length).toBe(1)
  })
})
