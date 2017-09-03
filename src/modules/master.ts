import { Action, Dispatch } from "redux"
import { find, propEq } from "ramda"
import { fetchMasterInfo } from "~/api/common"
import { RootState } from "~/modules"
import { composeAsync } from "~/helpers/common"
import { Project, Usage, Objective, Master } from "~/types"

/**
 * Actions
 */
enum ActionTypes {
  FETCH_MASTER_REQUEST = "master/request",
  FETCH_MASTER_SUCCESS = "master/success",
  FETCH_MASTER_FAILURE = "master/failuer",
}

interface IMasterRequest extends Action {
  type: ActionTypes.FETCH_MASTER_REQUEST
  isFetching: boolean
}

interface IMasterSuccess extends Action {
  type: ActionTypes.FETCH_MASTER_SUCCESS
  master: Master
  isFetching: boolean
}

interface IMasterFailure extends Action {
  type: ActionTypes.FETCH_MASTER_FAILURE
  isFetching: boolean
}

export const fetchMasterRequest = (): IMasterRequest => ({
  type: ActionTypes.FETCH_MASTER_REQUEST,
  isFetching: true,
})

export const fetchMasterSuccess = (m: Master) => ({
  type: ActionTypes.FETCH_MASTER_SUCCESS,
  isFetching: false,
  master: m,
})

export const fetchMasterFailure = (err: Error) => ({
  type: ActionTypes.FETCH_MASTER_FAILURE,
  isFetching: false,
  err,
})

export const fetchMaster = () => {
  return async (dispatch: Dispatch<{}>) => {
    dispatch(fetchMasterRequest())
    try {
      composeAsync(dispatch, fetchMasterSuccess, fetchMasterInfo)()
    } catch (err) {
      dispatch(fetchMasterFailure(err))
    }
  }
}

export type MasterAction = IMasterRequest | IMasterSuccess | IMasterFailure

/**
 * State
 */
export type MasterState = {
  projects: Project[],
  usages: Usage[],
  objectives: Objective[],
  isFetching: boolean,
}

const initialState: MasterState = {
  projects: [],
  usages: [],
  objectives: [],
  isFetching: false,
}

/**
 * Selectors
 */
export const getMaster = (state: MasterState) => state
export const getProjects = (state: MasterState) => state.projects
export const getProject = (state: MasterState, id: string) => find(propEq("projectId", id), state.projects)
export const getUsage = (state: MasterState, id: string) => find(propEq("usageId", id), state.usages)
export const getObjective = (state: MasterState, id: string) => find(propEq("objectiveId", id), state.objectives)
export const getUsages = (state: MasterState) => state.usages
export const getObjectives = (state: MasterState) => state.objectives
export const getIsFetching = (state: MasterState) => state.isFetching

/**
 * Reducer
 */
function master(state: MasterState = initialState, action: MasterAction): MasterState {
  switch (action.type) {
    case ActionTypes.FETCH_MASTER_REQUEST:
      return { ...state, isFetching: action.isFetching }
    case ActionTypes.FETCH_MASTER_SUCCESS:
      return { ...state, ...action.master }
    case ActionTypes.FETCH_MASTER_FAILURE:
      return state
    default:
      return state
  }
}

export default master
