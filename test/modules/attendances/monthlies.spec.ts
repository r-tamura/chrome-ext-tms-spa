import { ActionTypes } from "~/modules/attendances/actiontypes"
import monthlies from "~/modules/attendances/monthlies"
import { Project } from "~/types"

describe("monthlies reducer", () => {
  it("fetch request", () => {
    const action = {
      type: ActionTypes.FETCH_REQUEST,
      monthlyId: "201802",
      isFetching: true,
    }
    const state = {}
    const expected = {
      byId: { 201802: { isFetching: true } },
      allIds: [] as string[],
    }
    expect(monthlies(state, action)).toEqual(expected)
  })

  it("fetch success", () => {
    const action = {
      type: ActionTypes.FETCH_SUCCESS,
      monthlyId: "201802",
      isFetching: false,
      attendanceMonthlyResponse: {
        days: [
          {
            dailyId: "20180201", day: 1, end: "", hasConfirmed: false, isWeekday: true,
            overnightwork: "", overwork: "", projectId: null as Project, start: "" ,
          },
          {
            dailyId: "20180202", day: 2, end: "", hasConfirmed: false, isWeekday: true,
            overnightwork: "", overwork: "", projectId: null as Project, start: "",
          },
        ],
        monthlyId: "201802",
        reportId: "9999",
        year: 2018,
        month: 2,
        hasApplied: false,
        lastUpdatedOn: 0,
      },
    }
    const state = {}
    const expected = {
      byId: {
        201802: {
          monthlyId: "201802",
          reportId: "9999",
          year: 2018,
          month: 2,
          hasApplied: false,
          isFetching: false,
          lastUpdatedOn: 0,
          days: ["20180201", "20180202"],
        },
      },
      allIds: ["201802"] as string[],
    }
    expect(monthlies(state, action)).toEqual(expected)
  })

  it("should fail fetching", () => {
    const action = {
      type: ActionTypes.FETCH_FAILURE,
      monthlyId: "201802",
      isFetching: false,
    }
    const state = {
      byId: {
        201802: {
          monthlyId: "201802",
          reportId: "9999",
          year: 2018,
          month: 2,
          hasApplied: false,
          isFetching: true,
          lastUpdatedOn: 0,
          days: ["20180201", "20180202"],
        },
      },
    }
    const expected = {
      byId: {
        201802: {
          monthlyId: "201802",
          reportId: "9999",
          year: 2018,
          month: 2,
          hasApplied: false,
          isFetching: false,
          lastUpdatedOn: 0,
          days: ["20180201", "20180202"],
        },
      },
      allIds: [] as string[],
    }
    expect(monthlies(state, action)).toEqual(expected)
  })
})
