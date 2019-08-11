import * as React from "react";
import { connect } from "react-redux";
import { Helmet } from "react-helmet";
import { RouteComponentProps, withRouter } from "react-router-dom";
import {
  RootState,
  getMaster,
  getTransExpenses,
  getTransExpenseTemplates
} from "~/modules";
import {
  fetchExpensesAll,
  createExpense,
  createExpenseFromTemplate,
  deleteExpense,
  updateExpense
} from "~/modules/transexpenses";
import {
  fetchExpenseTemplatesAll,
  createExpenseTemplate,
  deleteExpenseTemplate,
  updateExpenseTemplate
} from "~/modules/transexpensetemplates";
import TransExpenseHistory from "~/containers/TransExpenseHistory";
import TransExpenseTemplates from "~/containers/TransExpenseTemplates";
import {
  Project,
  Usage,
  Objective,
  TransExpenseView,
  TransExpenseTemplateView
} from "~/types";

type OwnProps = RouteComponentProps<{}> & React.Props<{}>;

interface IProps extends OwnProps {
  expenses: TransExpenseView[];
  templates: TransExpenseTemplateView[];
  projects: Project[];
  usages: Usage[];
  objectives: Objective[];
  fetchExpensesAll: () => any;
  createExpense: () => any;
  createExpenseFromTemplate: () => any;
  deleteExpense: () => any;
  updateExpense: () => any;
  fetchExpenseTemplatesAll: () => any;
  createExpenseTemplate: () => any;
  deleteExpenseTemplate: () => any;
  updateExpenseTemplate: () => any;
}

class TransExpenseComponent extends React.Component<IProps, {}> {
  public componentDidMount() {
    this.props.fetchExpensesAll();
    this.props.fetchExpenseTemplatesAll();
  }

  public render() {
    const {
      expenses,
      projects,
      usages,
      objectives,
      templates,
      createExpenseTemplate,
      deleteExpenseTemplate,
      updateExpenseTemplate
    } = this.props;
    return (
      <main className="main">
        <Helmet>
          <title>Transportation | TMS</title>
        </Helmet>
        <div className="main-column">
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
            createExpense={createExpenseTemplate}
            deleteExpense={deleteExpenseTemplate}
            updateExpense={updateExpenseTemplate}
            createExpenseFromTemplate={createExpenseFromTemplate}
          />
        </div>
      </main>
    );
  }
}

export default connect(
  (state: RootState, ownProps: OwnProps) => {
    const { projects, usages, objectives } = getMaster(state);
    return {
      expenses: getTransExpenses(state),
      templates: getTransExpenseTemplates(state),
      projects,
      usages,
      objectives
    };
  },
  {
    fetchExpensesAll,
    createExpense,
    createExpenseFromTemplate,
    deleteExpense,
    updateExpense,
    fetchExpenseTemplatesAll,
    createExpenseTemplate,
    deleteExpenseTemplate,
    updateExpenseTemplate
  }
)(TransExpenseComponent);
