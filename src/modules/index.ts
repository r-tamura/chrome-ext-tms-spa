import { combineReducers } from "redux";
import {
  connectRouter,
  RouterState,
  RouterAction
} from "connected-react-router";
import { History } from "history";
import { pick } from "ramda";
import user, * as fromUser from "./user";
import master, * as fromMaster from "./master";
import transexpenses, * as fromTransExpense from "./transexpenses";
import transexpensetemplates, * as fromTransExpenseTemplates from "./transexpensetemplates";
import attendances, * as fromAttendances from "./attendances";
import {
  TransExpenseView,
  TransExpenseTemplateView,
  AttendanceMonthlyView,
  TransExpenseTemplate,
  TransExpense
} from "~/types";

/**
 * Selectors
 */

type S = RootState;
export const getMaster = (state: S) => fromMaster.getMaster(state.master);
export const getProjects = (state: S) => fromMaster.getProjects(state.master);
export const getObjectives = (state: S) =>
  fromMaster.getObjectives(state.master);
export const getUsages = (state: S) => fromMaster.getUsages(state.master);

export const getAttendanceSettings = (state: S) =>
  fromAttendances.getSettings(state.attendances.settings);

export const getUserName = (state: S) => fromUser.getUserName(state.user);
export const getIsAuthenticated = (state: S) =>
  fromUser.getIsAuthenticated(state.user);

export const getTransExpenses = (state: S): TransExpenseView[] =>
  fromTransExpense.getTransExpenses(state.transexpenses).map(expense => ({
    ...pick<TransExpense, keyof TransExpense>(
      ["expenseId", "strdate", "customer", "from", "to", "cost"],
      expense
    ),
    project: fromMaster.getProject(state.master, expense.projectId),
    usage: fromMaster.getUsage(state.master, expense.usageId),
    objective: fromMaster.getObjective(state.master, expense.objectiveId)
  }));

export const getTransExpenseTemplates = (
  state: S
): TransExpenseTemplateView[] =>
  fromTransExpenseTemplates
    .getTransExpenseTemplates(state.transexpensetemplates)
    .map(template => ({
      ...pick<TransExpenseTemplate, keyof TransExpenseTemplate>(
        ["templateId", "templateName", "customer", "from", "to", "cost"],
        template
      ),
      project: fromMaster.getProject(state.master, template.projectId),
      usage: fromMaster.getUsage(state.master, template.usageId),
      objective: fromMaster.getObjective(state.master, template.objectiveId)
    }));

export const getAttendancesSelectedMonth = (
  state: S
): AttendanceMonthlyView => {
  const manthly = fromAttendances.getAttendancesSelectedMonth(
    state.attendances
  );

  if (!manthly.days) {
    return { ...manthly, days: [] };
  }

  return {
    ...manthly,
    days: manthly.days.map(d => ({
      ...d,
      project: fromMaster.getProject(state.master, d.projectId)
    }))
  };
};

export type RootAction =
  | fromUser.UserAction
  | fromMaster.MasterAction
  | fromTransExpense.TransExpenseAction
  | fromTransExpenseTemplates.TransExpenseAction
  | fromAttendances.AttendanceAction
  | RouterAction;

/**
 * Root State
 */
export type RootState = {
  user: fromUser.UserState;
  master: fromMaster.MasterState;
  transexpenses: fromTransExpense.TransExpenseState;
  transexpensetemplates: fromTransExpenseTemplates.TransExpenseTemplateState;
  attendances: fromAttendances.AttendanceState;
  router: RouterState;
};

/**
 * Root Reducer
 */
export const createRootReducer = (history: History) =>
  combineReducers({
    user,
    master,
    transexpenses,
    transexpensetemplates,
    attendances,
    router: connectRouter(history)
  });
