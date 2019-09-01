import React, { useState } from "react";
import { find, propEq } from "ramda";
import { Button, ButtonGroup } from "~/components/atoms";
import { AddIcon } from "~/components/Icon";
import { Modal } from "~/components/atoms/Modal";
import { CURRENCY } from "~/helpers/_const";
import {
  Project,
  Usage,
  Objective,
  TransExpenseView,
  TransExpenseTemplateView,
  ExpenseId,
  TransExpenseCreateRequest,
  TransExpenseUpdateRequest
} from "~/types";

import { Table, Tr, Td } from "~/components/atoms/Table";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEdit, faTrash } from "@fortawesome/free-solid-svg-icons";
import { useModal } from "~/components/hooks";

interface IProps {
  expenses: TransExpenseView[];
  templates: TransExpenseTemplateView[];
  projects: Project[];
  usages: Usage[];
  objectives: Objective[];
  deleteExpense: (expenseId: ExpenseId) => void;
  createExpense: (expense: TransExpenseCreateRequest) => void;
  updateExpense: (expense: TransExpenseUpdateRequest) => void;
  createExpenseFromTemplate: (templateId: string, strdate: string) => void;
}

interface IState {
  selected?: ExpenseId; // 選択中の交通費ID
  useTemplate?: boolean;
}

/**
 * 登録済み交通費リストセクション
 */
export const TransExpenseHistory: React.FC<IProps> = props => {
  const { isOpen: isModalOpen, open, close } = useModal(false);
  const [state, setState] = useState(getInitState(props));

  const { expenses, deleteExpense } = props;
  const { useTemplate } = state;
  const $expenses = renderExpenses(expenses, deleteExpense);
  const $modalBody = isModalOpen
    ? useTemplate
      ? renderCreateFromTemplateModal()
      : renderEditorModal()
    : null;
  return (
    <div>
      {/* 交通費登録テーブル */}
      {$expenses}
      {/* 新規登録ボタン */}
      <ButtonGroup>
        <Button
          variant={"contained"}
          color={"secondary"}
          onClick={openCreateFromTemplateModal}
        >
          テンプレートから新規登録
        </Button>
        <Button variant={"circle"} color={"primary"} onClick={openAddModal}>
          <AddIcon />
        </Button>
      </ButtonGroup>

      {/* 編集モーダル */}
      {$modalBody}
    </div>
  );

  function renderExpenses(
    expenses: TransExpenseView[],
    deleteExpense: (expenseId: ExpenseId) => void
  ) {
    const header = [
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
        <Table header={header}>
          {expenses.length > 0 &&
            expenses.map((e, i) => (
              <Tr key={(() => e.expenseId)()} hover>
                <Td className="record-id">{i + 1}</Td>
                <Td>{e.strdate}</Td>
                <Td>{e.project.name}</Td>
                <Td>{e.usage.name}</Td>
                <Td>{e.objective.name}</Td>
                <Td>
                  <strong>{CURRENCY.format(e.cost)}</strong>
                </Td>
                <Td>
                  <Button
                    variant="icon"
                    color="primary"
                    onClick={() => openEditModal(e.expenseId)}
                    title="編集"
                  >
                    <FontAwesomeIcon icon={faEdit} />
                  </Button>
                </Td>
                <Td>
                  <Button
                    variant="icon"
                    color="danger"
                    onClick={() => deleteExpense(e.expenseId.toString())}
                    title="削除"
                  >
                    <FontAwesomeIcon icon={faTrash} />
                  </Button>
                </Td>
              </Tr>
            ))}
        </Table>
      </div>
    );
  }

  /*
   * 交通費新規作成/編集モーダルをレンダーします
   */
  function renderEditorModal() {
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
      // <FormModal
      //   isOpen={isModalOpen}
      //   formItems={[
      //     {
      //       type: FormItemType.TEXT,
      //       name: "strdate",
      //       label: "日付",
      //       value: strdate
      //     },
      //     {
      //       type: FormItemType.SELECT,
      //       name: "projectId",
      //       label: "プロジェクトコード",
      //       value: project ? project.projectId : "",
      //       options: {
      //         items: projects,
      //         valueKey: "projectId",
      //         labelKey: "name"
      //       }
      //     },
      //     {
      //       type: FormItemType.SELECT,
      //       name: "usageId",
      //       label: "利用区分",
      //       value: usage ? usage.usageId : "",
      //       options: { items: usages, valueKey: "usageId", labelKey: "name" }
      //     },
      //     {
      //       type: FormItemType.SELECT,
      //       name: "objectiveId",
      //       label: "目的コード",
      //       value: objective ? objective.objectiveId : "",
      //       options: {
      //         items: objectives,
      //         valueKey: "objectiveId",
      //         labelKey: "name"
      //       }
      //     },
      //     {
      //       type: FormItemType.TEXT,
      //       name: "customer",
      //       label: "顧客先",
      //       value: customer
      //     },
      //     {
      //       type: FormItemType.TEXT,
      //       name: "from",
      //       label: "乗車地",
      //       value: from
      //     },
      //     {
      //       type: FormItemType.TEXT,
      //       name: "to",
      //       label: "降車地",
      //       value: to
      //     },
      //     {
      //       type: FormItemType.TEXT,
      //       name: "cost",
      //       label: "金額",
      //       value: cost
      //     }
      //   ]}
      //   onClose={closeModal}
      //   onOKClick={
      //     selected
      //       ? (s: TransExpenseCreateRequest) => {
      //           updateExpense({ ...s, expenseId });
      //         }
      //       : (s: TransExpenseCreateRequest) => createExpense(s)
      //   }
      // />
      <div>history</div>
    );
  }

  function renderCreateFromTemplateModal() {
    const { templates, createExpenseFromTemplate } = props;
    return (
      // <Modal
      //   isOpen={isModalOpen}
      //   formItems={[
      //     {
      //       type: FormItemType.TEXT,
      //       name: "strdate",
      //       label: "日付",
      //       value: ""
      //     },
      //     {
      //       type: FormItemType.SELECT,
      //       name: "templateId",
      //       label: "テンプレート名",
      //       value: "",
      //       options: {
      //         items: templates,
      //         valueKey: "templateId",
      //         labelKey: "templateName"
      //       }
      //     }
      //   ]}
      //   onClose={closeModal}
      //   onOKClick={({
      //     templateId,
      //     strdate
      //   }: {
      //     templateId: string;
      //     strdate: string;
      //   }) => createExpenseFromTemplate(templateId, strdate)}
      // />
      <div>history template</div>
    );
  }

  function getInitState(props: IProps): IState {
    return { useTemplate: false, selected: undefined };
  }

  /* モーダルクローズ */
  function closeModal() {
    setState({
      useTemplate: false,
      selected: undefined
    });
    close();
  }

  /* 編集モーダル */
  function openEditModal(expenseId: ExpenseId) {
    setState({
      useTemplate: false,
      selected: expenseId
    });
    open();
  }

  /* 新規登録モーダル */
  function openAddModal() {
    setState({
      useTemplate: false,
      selected: undefined
    });
    open();
  }

  /* テンプレートから新規登録モーダル */
  function openCreateFromTemplateModal() {
    setState({
      useTemplate: true,
      selected: undefined
    });
    open();
  }
};
