import React from "react";
import Helmet from "react-helmet";
import {
  TransExpenseHistory,
  TransExpenseTemplates
} from "~/components/organisms";
import { useTranspotation } from "~/stores/hooks";
import { MainContent } from "~/components/organisms";

export const TransportExpensePage: React.FC = () => {
  const {
    /* states */
    expenses,
    projects,
    usages,
    objectives,
    templates,
    /* dispatchers */
    createExpenseTemplate,
    deleteExpenseTemplate,
    updateExpenseTemplate,
    createExpense,
    createExpenseFromTemplate,
    updateExpense,
    deleteExpense
  } = useTranspotation();

  return (
    <main className="app-content-with-navbar">
      <Helmet>
        <title>Transportation | TMS</title>
      </Helmet>
      <MainContent>
        <h1>交通費テンプレート</h1>
        <TransExpenseTemplates
          templates={templates}
          projects={projects}
          usages={usages}
          objectives={objectives}
          createExpenseTemplate={createExpenseTemplate}
          deleteExpenseTemplate={deleteExpenseTemplate}
          updateExpenseTemplate={updateExpenseTemplate}
        />
        <h1>交通費履歴</h1>
        <TransExpenseHistory
          expenses={expenses}
          templates={templates}
          projects={projects}
          usages={usages}
          objectives={objectives}
          createExpense={createExpense}
          deleteExpense={deleteExpense}
          updateExpense={updateExpense}
          createExpenseFromTemplate={createExpenseFromTemplate}
        />
      </MainContent>
    </main>
  );
};
