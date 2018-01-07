import { Action, Dispatch, combineReducers } from "redux"
import { cond } from "ramda"
import { RootState } from "~/modules"
import { fetchTemplatesAll, createTemplate, deleteTemplate, updateTemplate } from "~/api/transexpense"
import { composeAsync } from "~/helpers/common"
import { TransExpenseTemplate, ResultStatus, Status } from "~/types"

/**
 * Actions
 */
enum ActionTypes {
  TRANS_EXPENSES_TEMPLATE_FETCH_REQUEST = "transexpensetemplate/fetchrequest",
  TRANS_EXPENSES_TEMPLATE_FETCH_SUCCESS = "transexpensetemplate/fetchsuccess",
  TRANS_EXPENSES_TEMPLATE_FETCH_FAILURE = "transexpensetemplate/fetchfailure",
  TRANS_EXPENSES_TEMPLATE_UPDATE_REQUEST = "transexpensetemplate/updaterequest",
  TRANS_EXPENSES_TEMPLATE_UPDATE_SUCCESS = "transexpensetemplate/updatesuccess",
  TRANS_EXPENSES_TEMPLATE_UPDATE_FAILURE = "transexpensetemplate/updatefailure",
}

interface ITransExpensesTemplateFetchRequest extends Action {
  type: ActionTypes.TRANS_EXPENSES_TEMPLATE_FETCH_REQUEST
  isFetching: boolean
}

interface ITransExpensesTemplateFetchSuccess extends Action {
  type: ActionTypes.TRANS_EXPENSES_TEMPLATE_FETCH_SUCCESS
  templates: TransExpenseTemplate[]
  isFetching: boolean
}

interface ITransExpensesTemplateFetchFailure extends Action {
  type: ActionTypes.TRANS_EXPENSES_TEMPLATE_FETCH_FAILURE
  isFetching: boolean
}

export const fetchExpenseTemplatesAll = () => (dispatch: Dispatch<{}>, getState: () => RootState) => {
  dispatch(fetchTransExpensesRequest())
  const { master } = getState()
  try {
    composeAsync(dispatch, fetchTransExpensesSuccess, fetchTemplatesAll)(master)
  } catch (err) {
    dispatch(fetchTransExpensesFailure())
  }
}

export const fetchTransExpensesRequest = () => ({
  type: ActionTypes.TRANS_EXPENSES_TEMPLATE_FETCH_REQUEST,
  isFetching: true,
})

export const fetchTransExpensesSuccess = (templates: TransExpenseTemplate[]) => ({
  type: ActionTypes.TRANS_EXPENSES_TEMPLATE_FETCH_SUCCESS,
  templates,
  isFetching: false,
})

export const fetchTransExpensesFailure = () => ({
  type: ActionTypes.TRANS_EXPENSES_TEMPLATE_FETCH_FAILURE,
  isFetching: false,
})

interface ITransExpensesTemplateUpdateRequest extends Action {
  type: ActionTypes.TRANS_EXPENSES_TEMPLATE_UPDATE_REQUEST
  isUpdating: boolean
}

interface ITransExpensesTemplateUpdateSuccess extends Action {
  type: ActionTypes.TRANS_EXPENSES_TEMPLATE_UPDATE_SUCCESS
  result: ResultStatus
  isUpdating: boolean
}

interface ITransExpensesTemplateUpdateFailure extends Action {
  type: ActionTypes.TRANS_EXPENSES_TEMPLATE_UPDATE_FAILURE
  result?: ResultStatus
  error?: object
  isUpdating: boolean
}

const successOrFailToUpdate = (dispatch: Dispatch<{}>, getState: () => RootState) =>
  cond([
    [
      r => r.status === Status.OK,
      composeAsync(
        () => fetchExpenseTemplatesAll()(dispatch, getState),
        dispatch,
        updateTransExpensesSuccess,
      ),
    ],
    [
      () => true,
      dispatch,
      updateTransExpensesFailure,
    ],
  ])

export const createExpenseTemplate = (template: TransExpenseTemplate) => {
  return (dispatch: Dispatch<{}>, getState: () => RootState) => {
    dispatch(updateTransExpensesRequest())
    try {
      composeAsync(
        successOrFailToUpdate(dispatch, getState),
        createTemplate,
      )(template)
    } catch (err) {
      dispatch(updateTransExpensesFailure({error: err}))
    }
  }
}

export const deleteExpenseTemplate = (templateId: string) => {
  return (dispatch: Dispatch<{}>, getState: () => RootState) => {
    dispatch(updateTransExpensesRequest())
    try {
      composeAsync(
        successOrFailToUpdate(dispatch, getState),
        deleteTemplate,
      )(templateId)
    } catch (err) {
      dispatch(updateTransExpensesFailure({error: err}))
    }
  }
}

export const updateExpenseTemplate =
  (template: TransExpenseTemplate) => (dispatch: Dispatch<{}>, getState: () => RootState) => {
    dispatch(updateTransExpensesRequest())
    try {
      composeAsync(
        successOrFailToUpdate(dispatch, getState),
        updateTemplate,
      )(template)
    } catch (err) {
      dispatch(updateTransExpensesFailure({error: err}))
    }
  }

export const updateTransExpensesRequest = () => ({
  type: ActionTypes.TRANS_EXPENSES_TEMPLATE_UPDATE_REQUEST,
  isUpdating: true,
})

export const updateTransExpensesSuccess = (result: ResultStatus) => ({
  type: ActionTypes.TRANS_EXPENSES_TEMPLATE_UPDATE_SUCCESS,
  result,
  isUpdating: false,
})

export const updateTransExpensesFailure = ({result, error}: {result?: ResultStatus, error?: Error}) => ({
  type: ActionTypes.TRANS_EXPENSES_TEMPLATE_UPDATE_FAILURE,
  result,
  error,
  isUpdating: false,
})

export type TransExpenseAction =
  ITransExpensesTemplateFetchRequest | ITransExpensesTemplateFetchSuccess | ITransExpensesTemplateFetchFailure |
  ITransExpensesTemplateUpdateRequest | ITransExpensesTemplateUpdateSuccess | ITransExpensesTemplateUpdateFailure

/**
 * State
 */
type ById = { [s: string]: TransExpenseTemplate }
type AllIds = string[]

export type TransExpenseTemplateState = {
  byId: ById,
  allIds: AllIds,
  isFetching: boolean,
  isUpdating: boolean,
}

/**
 * Selectors
 */
export const getTransExpenseTemplates = (state: TransExpenseTemplateState): TransExpenseTemplate[] =>
  state.allIds.map(id => state.byId[id])

export const getTransExpenseTemplate =
  (state: TransExpenseTemplateState, templateId: string): TransExpenseTemplate => state.byId[templateId]

export const getIsFetching = (state: TransExpenseTemplateState) => state.isFetching
export const getIsUpdating = (state: TransExpenseTemplateState) => state.isUpdating

/**
 * Reducers
 */
function byId(state: ById = {}, action: TransExpenseAction): ById {
  switch (action.type) {
  case ActionTypes.TRANS_EXPENSES_TEMPLATE_FETCH_SUCCESS:
    return action.templates.reduce((acc, v) => ({ ...acc, [v.templateId]: v }), {})
  default:
    return state
  }
}

function allIds(state: AllIds = [], action: TransExpenseAction): AllIds {
  switch (action.type) {
  case ActionTypes.TRANS_EXPENSES_TEMPLATE_FETCH_SUCCESS:
    return action.templates.map(e => e.templateId)
  default:
    return state
  }
}

function isFetching(state: boolean = false, action: TransExpenseAction): boolean {
  switch (action.type) {
  case ActionTypes.TRANS_EXPENSES_TEMPLATE_FETCH_REQUEST:
  case ActionTypes.TRANS_EXPENSES_TEMPLATE_FETCH_SUCCESS:
  case ActionTypes.TRANS_EXPENSES_TEMPLATE_FETCH_FAILURE:
    return action.isFetching
  default:
    return state
  }
}

function isUpdating(state: boolean = false, action: TransExpenseAction): boolean {
  switch (action.type) {
  case ActionTypes.TRANS_EXPENSES_TEMPLATE_UPDATE_REQUEST:
  case ActionTypes.TRANS_EXPENSES_TEMPLATE_UPDATE_SUCCESS:
  case ActionTypes.TRANS_EXPENSES_TEMPLATE_UPDATE_FAILURE:
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
