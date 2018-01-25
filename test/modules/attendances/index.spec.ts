import "jest"
import attendances, { yearAndMonth } from "~/modules/attendances/index"
import { ActionTypes } from "~/modules/attendances/actiontypes"
import { AttendanceAction } from "~/modules/attendances/actions"

describe("Reducer yearAndMonth", () => {

  // TODO: Initialテストのaction型問題を解決する
  // it("should be current month", () => {
  //   const action = {}
  //   const now = new Date()
  //   const expected = {
  //     selectedYear: now.getFullYear(),
  //     selectedMonth: now.getMonth() + 1,
  //   }

  //   expect(yearAndMonth()).toEqual(expected)
  // })

  it("should be set 2018/01", () => {
    const action: AttendanceAction = {
      type: ActionTypes.SET_MONTH,
      year: 2018,
      month: 1,
    }

    const state = {
      selectedYear: 2017,
      selectedMonth: 12,
    }

    const expected = {
      selectedYear: 2018,
      selectedMonth: 1,
    }

    expect(yearAndMonth(state, action)).toEqual(expected)
  })
})
