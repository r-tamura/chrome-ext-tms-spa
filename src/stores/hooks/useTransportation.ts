import {
  RootState,
  getTransExpenses,
  getTransExpenseTemplates,
  getProjects,
  getUsages,
  getObjectives
} from "~/modules";
import { useSelector } from "react-redux";
import {
  fetchExpensesAll,
  createExpense,
  createExpenseFromTemplate,
  deleteExpense,
  updateExpense
} from "~/modules/transexpenses";
import {
  fetchExpenseTemplatesAll,
  deleteExpenseTemplate,
  createExpenseTemplate,
  updateExpenseTemplate
} from "~/modules/transexpensetemplates";
import { useEffect } from "react";
import { useThunkDispatch } from "./useThunkDispatcher";
import { compose } from "redux";

function selector(state: RootState) {
  return {
    expenses: getTransExpenses(state),
    templates: getTransExpenseTemplates(state),
    projects: getProjects(state),
    usages: getUsages(state),
    objectives: getObjectives(state)
  };
}

export function useTranspotation() {
  const state = useSelector(selector);
  const thunkDispatch = useThunkDispatch();
  useEffect(() => {
    thunkDispatch(fetchExpensesAll());
    thunkDispatch(fetchExpenseTemplatesAll());
  }, [thunkDispatch]);
  return {
    ...state,
    fetchExpensesAll: compose(
      thunkDispatch,
      fetchExpensesAll
    ),
    createExpense: compose(
      thunkDispatch,
      createExpense
    ),
    createExpenseFromTemplate: compose(
      thunkDispatch,
      createExpenseFromTemplate
    ),
    deleteExpense: compose(
      thunkDispatch,
      deleteExpense
    ),
    updateExpense: compose(
      thunkDispatch,
      updateExpense
    ),
    fetchExpenseTemplatesAll: compose(
      thunkDispatch,
      fetchExpenseTemplatesAll
    ),
    createExpenseTemplate: compose(
      thunkDispatch,
      createExpenseTemplate
    ),
    deleteExpenseTemplate: compose(
      thunkDispatch,
      deleteExpenseTemplate
    ),
    updateExpenseTemplate: compose(
      thunkDispatch,
      updateExpenseTemplate
    )
  };
}
