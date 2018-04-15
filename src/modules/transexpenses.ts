import { Action, Dispatch, combineReducers } from "redux"
import { cond } from "ramda"
import { RootState } from "~/modules"
import { getTransExpenseTemplate } from "~/modules/transexpensetemplates"
import { fetchAll, update, create, delete_ } from "~/api/transexpense"
import { composeAsync } from "~/helpers/common"
import { TransExpense, ResultStatus, Status } from "~/types"

/**
 * Actions
 */
enum ActionTypes {
  TRANS_EXPENSES_FETCH_REQUEST = "transexpense/fetchrequest",
  TRANS_EXPENSES_FETCH_SUCCESS = "transexpense/fetchsuccess",
  TRANS_EXPENSES_FETCH_FAILURE = "transexpense/fetchfailure",
  TRANS_EXPENSES_UPDATE_REQUEST = "transexpense/updaterequest",
  TRANS_EXPENSES_UPDATE_SUCCESS = "transexpense/updatesuccess",
  TRANS_EXPENSES_UPDATE_FAILURE = "transexpense/updatefailure",
  TRANS_EXPENSES_DELETE_REQUEST = "transexpense/updaterequest",
  TRANS_EXPENSES_DELETE_SUCCESS = "transexpense/updatesuccess",
  TRANS_EXPENSES_DELETE_FAILURE = "transexpense/updatefailure",
}

interface ITransExpensesFetchRequest extends Action {
  type: ActionTypes.TRANS_EXPENSES_FETCH_REQUEST
  isFetching: boolean
}

interface ITransExpensesFetchSuccess extends Action {
  type: ActionTypes.TRANS_EXPENSES_FETCH_SUCCESS
  expenses: TransExpense[]
  isFetching: boolean
}

interface ITransExpensesFetchFailure extends Action {
  type: ActionTypes.TRANS_EXPENSES_FETCH_FAILURE
  isFetching: boolean
}

export const fetchExpensesAll = () => (dispatch: Dispatch<{}>, getState: () => RootState) => {
  dispatch(fetchTransExpensesRequest())
  const { master } = getState()
  try {
    composeAsync(dispatch, fetchTransExpensesSuccess, fetchAll)(master)
  } catch (err) {
    dispatch(fetchTransExpensesFailure())
  }
}

export const fetchTransExpensesRequest = () => ({
  type: ActionTypes.TRANS_EXPENSES_FETCH_REQUEST,
  isFetching: true,
})

export const fetchTransExpensesSuccess = (expenses: TransExpense[]) => ({
  type: ActionTypes.TRANS_EXPENSES_FETCH_SUCCESS,
  expenses,
  isFetching: false,
})

export const fetchTransExpensesFailure = () => ({
  type: ActionTypes.TRANS_EXPENSES_FETCH_FAILURE,
  isFetching: false,
})

interface ITransExpensesUpdateRequest extends Action {
  type: ActionTypes.TRANS_EXPENSES_UPDATE_REQUEST | ActionTypes.TRANS_EXPENSES_DELETE_REQUEST
  isUpdating: boolean
}

interface ITransExpensesUpdateSuccess extends Action {
  type: ActionTypes.TRANS_EXPENSES_UPDATE_SUCCESS | ActionTypes.TRANS_EXPENSES_DELETE_SUCCESS
  result: ResultStatus
  isUpdating: boolean
}

interface ITransExpensesUpdateFailure extends Action {
  type: ActionTypes.TRANS_EXPENSES_UPDATE_FAILURE | ActionTypes.TRANS_EXPENSES_DELETE_FAILURE
  result?: ResultStatus
  error?: object
  isUpdating: boolean
}

const successOrFailToUpdate = (dispatch: Dispatch<{}>, getState: () => RootState) =>
  cond([
    [
      r => r.status === Status.OK,
      composeAsync(
        () => fetchExpensesAll()(dispatch, getState),
        dispatch,
        updateTransExpensesSuccess
      ),
    ],
    [
      () => true,
      composeAsync(
        dispatch,
        updateTransExpensesFailure
      ),
    ],
  ])

export const createExpense = (expense: TransExpense) => (dispatch: Dispatch<{}>, getState: () => RootState) => {
    dispatch(updateTransExpensesRequest())
    try {
      composeAsync(
        successOrFailToUpdate(dispatch, getState),
        create
      )(expense)
    } catch (err) {
      dispatch(updateTransExpensesFailure({error: err}))
    }
  }

export const createExpenseFromTemplate = (templateId: string, date: string) =>
  (dispatch: Dispatch<{}>, getState: () => RootState) => {
    const state = getState()
    const template = getTransExpenseTemplate(state.transexpensetemplates, templateId)
    createExpense({ ...(template as TransExpense), strdate: date})(dispatch, getState)
  }

export const deleteExpense = (expenseId: number) => (dispatch: Dispatch<{}>, getState: () => RootState) => {
    dispatch(updateTransExpensesRequest())
    try {
      composeAsync(
        successOrFailToUpdate(dispatch, getState),
        delete_
      )(expenseId)
    } catch (err) {
      dispatch(updateTransExpensesFailure({error: err}))
    }
  }

export const updateExpense = (expense: TransExpense) => (dispatch: Dispatch<{}>, getState: () => RootState) => {
    dispatch(updateTransExpensesRequest())
    try {
      composeAsync(
        successOrFailToUpdate(dispatch, getState),
        update
      )(expense)
    } catch (err) {
      dispatch(updateTransExpensesFailure({error: err}))
    }
  }

export const updateTransExpensesRequest = () => ({
  type: ActionTypes.TRANS_EXPENSES_UPDATE_REQUEST,
  isUpdating: true,
})

export const updateTransExpensesSuccess = (result: ResultStatus) => ({
  type: ActionTypes.TRANS_EXPENSES_UPDATE_SUCCESS,
  result,
  isUpdating: false,
})

export const updateTransExpensesFailure = ({result, error}: {result?: ResultStatus, error?: Error}) => ({
  type: ActionTypes.TRANS_EXPENSES_UPDATE_FAILURE,
  result,
  error,
  isUpdating: false,
})

export type TransExpenseAction =
  ITransExpensesFetchRequest | ITransExpensesFetchSuccess | ITransExpensesFetchFailure |
  ITransExpensesUpdateRequest | ITransExpensesUpdateSuccess | ITransExpensesUpdateFailure

/**
 * State
 */
type ById = { [expenseId: number]: TransExpense }
type AllIds = number[]

export type TransExpenseState =  {
  byId: ById,
  allIds: AllIds,
  isFetching: boolean,
  isUpdating: boolean,
}

/**
 * Selectors
 */
export const getTransExpenses = (state: TransExpenseState): TransExpense[] =>
  state.allIds.map(id => state.byId[id])

export const getIsFetching = (state: TransExpenseState) => state.isFetching

/**
 * Reducers
 */
function byId(state: ById = {}, action: TransExpenseAction): ById {
  switch (action.type) {
  case ActionTypes.TRANS_EXPENSES_FETCH_SUCCESS:
    return action.expenses.reduce((acc, v) => ({ ...acc, [v.expenseId]: v }), {})
  default:
    return state
  }
}

function allIds(state: AllIds = [], action: TransExpenseAction): AllIds {
  switch (action.type) {
  case ActionTypes.TRANS_EXPENSES_FETCH_SUCCESS:
    return action.expenses.map(e => e.expenseId)
  default:
    return state
  }
}

function isFetching(state: boolean = false, action: TransExpenseAction): boolean {
  switch (action.type) {
  case ActionTypes.TRANS_EXPENSES_FETCH_REQUEST:
  case ActionTypes.TRANS_EXPENSES_FETCH_SUCCESS:
  case ActionTypes.TRANS_EXPENSES_FETCH_FAILURE:
    return action.isFetching
  default:
    return state
  }
}

function isUpdating(state: boolean = false, action: TransExpenseAction): boolean {
  switch (action.type) {
  case ActionTypes.TRANS_EXPENSES_UPDATE_REQUEST:
  case ActionTypes.TRANS_EXPENSES_UPDATE_SUCCESS:
  case ActionTypes.TRANS_EXPENSES_UPDATE_FAILURE:
    return action.isUpdating
  default:
    return state
  }
}

export default combineReducers({
  byId,
  allIds,
  isFetching,
  isUpdating,
})
