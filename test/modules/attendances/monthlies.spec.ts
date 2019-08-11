import { ActionTypes } from "~/modules/attendances/actiontypes";
import monthlies, { MonthlisReducer } from "~/modules/attendances/monthlies";
import * as Act from "~/modules/attendances/actions";
import { getMockState } from "../../__mocks__";
import { Project } from "~/types";

describe("monthlies reducer", () => {
  it("fetch request", () => {
    const action = {
      type: ActionTypes.FETCH_REQUEST,
      monthlyId: "201802",
      isFetching: true
    };
    const state = {} as MonthlisReducer;
    const expected = {
      byId: { 201802: { isFetching: true } },
      allIds: [] as string[]
    };
    expect(monthlies(state, action)).toEqual(expected);
  });

  it("fetch success", () => {
    const action = {
      type: ActionTypes.FETCH_SUCCESS,
      monthlyId: "201802",
      isFetching: false,
      attendanceMonthlyResponse: {
        days: [
          {
            dailyId: "20180201",
            day: 1,
            end: "",
            hasConfirmed: false,
            isWeekday: true,
            overnightwork: "",
            overwork: "",
            projectId: null as Project,
            start: ""
          },
          {
            dailyId: "20180202",
            day: 2,
            end: "",
            hasConfirmed: false,
            isWeekday: true,
            overnightwork: "",
            overwork: "",
            projectId: null as Project,
            start: ""
          }
        ],
        monthlyId: "201802",
        reportId: "9999",
        year: 2018,
        month: 2,
        hasApplied: false,
        lastUpdatedOn: 0
      }
    };
    const state = {} as MonthlisReducer;
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
          days: ["20180201", "20180202"]
        }
      },
      allIds: ["201802"] as string[]
    };
    expect(monthlies(state, action)).toEqual(expected);
  });

  it("should fail fetching", () => {
    const action = {
      type: ActionTypes.FETCH_FAILURE,
      monthlyId: "201802",
      isFetching: false
    };
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
          days: ["20180201", "20180202"]
        }
      },
      allIds: [] as string[]
    };
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
          days: ["20180201", "20180202"]
        }
      },
      allIds: [] as string[]
    };
    expect(monthlies(state, action)).toEqual(expected);
  });

  it("should be isFetching (SubmitApplicationRequest)", () => {
    const action: Act.SubmitApplicationRequestAction = {
      type: ActionTypes.SUBMIT_APPLICATION_REQUEST,
      payload: {
        monthlyId: "201802",
        isFetching: true
      }
    };
    const state = getMockState("attendances.monthlies");
    const expected = { ...getMockState("attendances.monthlies") };
    expected.byId["201802"].isFetching = true;
    expect(monthlies(state, action)).toEqual(expected);
  });

  it("should be isFetching (SubmitApplicationOK)", () => {
    const action: Act.SubmitApplicationOkAction = {
      type: ActionTypes.SUBMIT_APPLICATION_OK,
      payload: {
        message: "Success message",
        monthlyId: "201802",
        isFetching: false
      }
    };
    const state = getMockState("attendances.monthlies");
    state.byId["201802"].isFetching = true;
    const expected = { ...getMockState("attendances.monthlies") };
    expected.byId["201802"].isFetching = false;
    expect(monthlies(state, action)).toEqual(expected);
  });

  it("should be isFetching (SubmitApplicationNG)", () => {
    const action: Act.SubmitApplicationNgAction = {
      type: ActionTypes.SUBMIT_APPLICATION_NG,
      payload: {
        message: "Not Found",
        monthlyId: "201802",
        isFetching: false
      },
      error: true
    };
    const state = getMockState("attendances.monthlies");
    state.byId["201802"].isFetching = true;
    const expected = { ...getMockState("attendances.monthlies") };
    expected.byId["201802"].isFetching = false;
    expect(monthlies(state, action)).toEqual(expected);
  });
});
