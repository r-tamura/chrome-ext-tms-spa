import * as React from "react"
import { connect } from "react-redux"
import { Helmet } from "react-helmet"
import { RouteComponentProps, withRouter } from "react-router-dom"
import { RootState, getMaster, getTransExpenses, getTransExpenseTemplates } from "~/modules"
import {
  fetchExpensesAll,
  createExpense,
  createExpenseFromTemplate,
  deleteExpense,
  updateExpense,
} from "~/modules/transexpenses"
import {
  fetchExpenseTemplatesAll,
  createExpenseTemplate,
  deleteExpenseTemplate,
  updateExpenseTemplate,
} from "~/modules/transexpensetemplates"
import TransExpenseHistory from "~/containers/TransExpenseHistory"
import TransExpenseTemplates from "~/containers/TransExpenseTemplates"
import { Project, Usage, Objective, TransExpenseView, TransExpenseTemplateView } from "~/types"

type OwnProps = RouteComponentProps<{}> & React.Props<{}>

interface IProps extends OwnProps {
  expenses: TransExpenseView[]
  templates: TransExpenseTemplateView[]
  projects: Project[]
  usages: Usage[]
  objectives: Objective[]
  fetchExpensesAll: () => void
  createExpense: () => void
  createExpenseFromTemplate: () => void
  deleteExpense: () => void
  updateExpense: () => void
  fetchExpenseTemplatesAll: () => void
  createExpenseTemplate: () => void
  deleteExpenseTemplate: () => void
  updateExpenseTemplate: () => void
}

class TransExpenseComponent extends React.Component<IProps, {}> {

  constructor(props: IProps) {
    super(props)
    this.props.fetchExpensesAll()
    this.props.fetchExpenseTemplatesAll()
  }

  public render() {
    const { expenses, projects, usages, objectives } = this.props
    return (
      <main className="main">
        <Helmet>
          <title>Transportation | TMS</title>
        </Helmet>
        <h1>Transportation Templates</h1>
        <TransExpenseTemplates {...this.props}/>
        <h1>Transportation Expenses</h1>
        <TransExpenseHistory {...this.props}/>
      </main>
    )
  }
}

export default connect((state: RootState, ownProps: OwnProps) => {
  const { projects, usages, objectives } = getMaster(state)
  return {
    expenses: getTransExpenses(state),
    templates: getTransExpenseTemplates(state),
    projects, usages, objectives,
  }
}, {
  fetchExpensesAll,
  createExpense,
  createExpenseFromTemplate,
  deleteExpense,
  updateExpense,
  fetchExpenseTemplatesAll,
  createExpenseTemplate,
  deleteExpenseTemplate,
  updateExpenseTemplate,
 })(TransExpenseComponent)
