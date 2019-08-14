import * as React from "react";
import { find, propEq } from "ramda";
import Button, { Color } from "~/components/Button";
import { AddIcon } from "~/components/Icon";
import ModalContainer from "~/components/ModalContainer";
import ModalBody from "~/components/ModalBody";
import { CURRENCY } from "~/helpers/_const";
import {
  Project,
  Usage,
  Objective,
  TransExpenseView,
  TransExpenseTemplateView,
  FormItemType,
  ExpenseId
} from "~/types";

interface IProps extends React.Props<{}> {
  expenses: TransExpenseView[];
  templates: TransExpenseTemplateView[];
  projects: Project[];
  usages: Usage[];
  objectives: Objective[];
  deleteExpense: (expenseId: ExpenseId) => void;
  createExpense: (expense: Partial<TransExpenseView>) => void;
  updateExpense: (expense: Partial<TransExpenseView>) => void;
  createExpenseFromTemplate: (templateId: string, strdate: string) => void;
}

interface IState {
  selected?: ExpenseId; // 選択中の交通費ID
  isModalOpen?: boolean; // 編集モーダルがオープン状態であるか
  useTemplate?: boolean;
}

/**
 * 登録済み交通費リストセクション
 */
class TransExpenseHistory extends React.Component<IProps, IState> {
  constructor(props: IProps) {
    super(props);
    this.state = this.getInitState(props);
  }

  public render() {
    const { expenses, deleteExpense } = this.props;
    const { isModalOpen, useTemplate } = this.state;
    const $expenses = this.renderExpenses(expenses, deleteExpense);
    const $modalBody = isModalOpen
      ? useTemplate
        ? this.renderCreateFromTemplateModal(this.props, this.state)
        : this.renderEditorModal(this.props, this.state)
      : null;
    return (
      <div>
        {/* 交通費登録テーブル */}
        {$expenses}
        {/* 新規登録ボタン */}
        <div className="tms-btn-group">
          <Button
            className="secondary-button btn-raised"
            onClick={this.openCreateFromTemplateModal}
          >
            テンプレートから新規登録
          </Button>
          <Button
            color={Color.PRIMARY}
            circle={true}
            onClick={this.openAddModal}
          >
            <AddIcon />
          </Button>
        </div>

        {/* 編集モーダル */}
        <ModalContainer isOpen={isModalOpen} onClose={this.closeModal}>
          {$modalBody}
        </ModalContainer>
      </div>
    );
  }

  private renderExpenses = (
    expenses: TransExpenseView[],
    deleteExpense: (expenseId: ExpenseId) => void
  ): JSX.Element => {
    const headers = [
      "#",
      "利用日",
      "プロジェクト",
      "利用区分",
      "目的",
      "金額",
      "",
      ""
    ];
    return (
      <div className="mr-records">
        <table className="tms-table tms-table--bordered">
          <thead>
            <tr>
              {headers.map((e, i) => (
                <th key={i}>{e}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {expenses.length > 0 &&
              expenses.map((e, i) => (
                <tr key={(() => e.expenseId)()}>
                  <td className="record-id">{i + 1}</td>
                  <td>{e.strdate}</td>
                  <td>{e.project.name}</td>
                  <td>{e.usage.name}</td>
                  <td>{e.objective.name}</td>
                  <td>{CURRENCY.format(e.cost)}</td>
                  <td>
                    <Button
                      className="edit reverse link"
                      onClick={() => this.openEditModal(e.expenseId)}
                    >
                      編集
                    </Button>
                  </td>
                  <td>
                    <Button
                      className="remove reverse link"
                      onClick={() => deleteExpense(e.expenseId.toString())}
                    >
                      削除
                    </Button>
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>
    );
  };

  /*
   * 交通費新規作成/編集モーダルをレンダーします
   */
  private renderEditorModal(props: IProps, state: IState) {
    const {
      expenses,
      projects,
      usages,
      objectives,
      createExpense,
      updateExpense
    } = props;
    const { selected } = state;
    const {
      expenseId,
      strdate = "",
      project,
      usage,
      objective,
      customer = "",
      from = "",
      to = "",
      cost = 0
    }: TransExpenseView = find(propEq("expenseId", selected), expenses) || {};
    return (
      <ModalBody
        formItems={[
          {
            type: FormItemType.TEXT,
            name: "strdate",
            label: "日付",
            value: strdate
          },
          {
            type: FormItemType.SELECT,
            name: "projectId",
            label: "プロジェクトコード",
            value: project ? project.projectId : "",
            options: {
              items: projects,
              valueKey: "projectId",
              labelKey: "name"
            }
          },
          {
            type: FormItemType.SELECT,
            name: "usageId",
            label: "利用区分",
            value: usage ? usage.usageId : "",
            options: { items: usages, valueKey: "usageId", labelKey: "name" }
          },
          {
            type: FormItemType.SELECT,
            name: "objectiveId",
            label: "目的コード",
            value: objective ? objective.objectiveId : "",
            options: {
              items: objectives,
              valueKey: "objectiveId",
              labelKey: "name"
            }
          },
          {
            type: FormItemType.TEXT,
            name: "customer",
            label: "顧客先",
            value: customer
          },
          {
            type: FormItemType.TEXT,
            name: "from",
            label: "乗車地",
            value: from
          },
          {
            type: FormItemType.TEXT,
            name: "to",
            label: "降車地",
            value: to
          },
          {
            type: FormItemType.TEXT,
            name: "cost",
            label: "金額",
            value: cost
          }
        ]}
        onClose={this.closeModal}
        onOKClick={
          selected
            ? s => {
                updateExpense({ ...s, expenseId });
              }
            : s => createExpense(s)
        }
      />
    );
  }

  private renderCreateFromTemplateModal(
    props: IProps,
    state: IState
  ): JSX.Element {
    const { templates, createExpenseFromTemplate } = this.props;
    return (
      <ModalBody
        formItems={[
          {
            type: FormItemType.TEXT,
            name: "strdate",
            label: "日付",
            value: ""
          },
          {
            type: FormItemType.SELECT,
            name: "templateId",
            label: "テンプレート名",
            value: "",
            options: {
              items: templates,
              valueKey: "templateId",
              labelKey: "templateName"
            }
          }
        ]}
        onClose={this.closeModal}
        onOKClick={({
          templateId,
          strdate
        }: {
          templateId: string;
          strdate: string;
        }) => createExpenseFromTemplate(templateId, strdate)}
      />
    );
  }

  private getInitState(props: IProps): IState {
    return { isModalOpen: false, useTemplate: false, selected: undefined };
  }

  /* モーダルクローズ */
  private closeModal = () => {
    this.setState({
      isModalOpen: false,
      useTemplate: false,
      selected: undefined
    });
  };

  /* 更新モーダル */
  private openEditModal = (expenseId: ExpenseId) => {
    this.setState({
      isModalOpen: true,
      useTemplate: false,
      selected: expenseId
    });
  };

  /* 新規登録モーダル */
  private openAddModal = () => {
    this.setState({
      isModalOpen: true,
      useTemplate: false,
      selected: undefined
    });
  };

  /* テンプレートから新規登録モーダル */
  private openCreateFromTemplateModal = () => {
    this.setState({
      isModalOpen: true,
      useTemplate: true,
      selected: undefined
    });
  };
}

export default TransExpenseHistory;
