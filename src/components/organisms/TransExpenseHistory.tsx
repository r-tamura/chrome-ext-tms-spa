import React, { useState } from "react";
import { find, propEq } from "ramda";
import {
  Button,
  ButtonGroup,
  Panel,
  RequiredInput,
  Modal
} from "~/components/atoms";
import { AddIcon } from "~/components/Icon";
import { CURRENCY } from "~/helpers/_const";
import {
  Project,
  Usage,
  Objective,
  TransExpenseView,
  TransExpenseTemplateView,
  ExpenseId,
  TransExpenseCreateRequest,
  TransExpenseUpdateRequest,
  TransExpense
} from "~/types";

import { Table, Tr, Td } from "~/components/atoms/Table";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEdit, faTrash } from "@fortawesome/free-solid-svg-icons";
import { useModal } from "~/components/hooks";
import useForm from "react-hook-form";
import { SelectBox } from "../SelectBox";

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
  return (
    <div>
      {expenses.length > 0 ? <Expenses /> : <p>交通費が登録されていません。</p>}
      <ButtonGroup>
        <Button
          variant={"contained"}
          color={"secondary"}
          onClick={openCreateFromTemplateModal}
        >
          テンプレートから新規登録
        </Button>
        <Button
          id={"create-trans-expense"}
          variant={"circle"}
          color={"primary"}
          onClick={openCreateModal}
        >
          <AddIcon />
        </Button>
      </ButtonGroup>

      {/* 編集モーダル */}
      <EditorModal />
    </div>
  );

  function Expenses() {
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
      <div>
        <Table header={header}>
          {expenses.map((e, i) => (
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
  function EditorModal() {
    type FormData = Record<keyof TransExpense, string>;
    const {
      register,
      handleSubmit,
      clearError,
      errors,
      setError,
      formState
    } = useForm<FormData>();
    const {
      expenses,
      projects,
      usages,
      objectives,
      createExpense,
      updateExpense
    } = props;
    const { selected } = state;

    function handleCancelClick(e: React.MouseEvent) {
      e.preventDefault();
      e.stopPropagation();
      closeModal();
    }

    function onSubmit({
      strdate,
      projectId,
      usageId,
      objectiveId,
      customer,
      from,
      to,
      cost: costStr
    }: FormData) {
      let cost;
      cost = Number.parseInt(costStr, 10);
      if (Number.isNaN(cost)) {
        setError(
          "cost",
          "NaN",
          "有効な金額ではありません、正の整数値を入力してください"
        );
        return;
      }
      if (cost < 0) {
        setError("cost", "NaN", "正の整数値を入力してください");
        return;
      }

      if (selected) {
        updateExpense({
          expenseId,
          strdate,
          projectId,
          usageId,
          objectiveId,
          customer,
          from,
          to,
          cost
        });
      } else {
        createExpense({
          strdate,
          projectId,
          usageId,
          objectiveId,
          customer,
          from,
          to,
          cost
        });
      }
      closeModal();
    }

    const defaultExpense: TransExpenseView = {
      expenseId: null,
      strdate: "",
      project: projects[0],
      usage: usages[0],
      objective: objectives[0],
      customer: "",
      from: "",
      to: "",
      cost: 0
    };

    const {
      expenseId,
      strdate,
      project,
      usage,
      objective,
      customer,
      from,
      to,
      cost
    }: TransExpenseView =
      find(propEq("expenseId", selected), expenses) || defaultExpense;
    const costStr = cost.toString();
    return (
      <Modal isOpen={isModalOpen} onRequestClose={() => close()}>
        <Panel>
          <form onSubmit={handleSubmit(onSubmit)}>
            <RequiredInput
              name={"strdate"}
              label={"日付"}
              placeholder={"ex: 20190401"}
              error={errors.strdate}
              defaultValue={strdate}
              register={register}
              clearError={clearError}
            />
            <SelectBox
              name="projectId"
              label="プロジェクトコード *"
              defaultValue={project.projectId}
              options={{
                items: projects,
                value: (project: Project) => project.projectId,
                label: (project: Project) => project.name
              }}
              ref={register({ required: true })}
            />
            <SelectBox
              name="usageId"
              label="利用区分 *"
              defaultValue={usage.usageId}
              options={{
                items: usages,
                value: (usage: Usage) => usage.usageId,
                label: (usage: Usage) => usage.name
              }}
              ref={register({ required: true })}
            />
            <SelectBox
              name="objectiveId"
              label="目的コード *"
              defaultValue={objective.objectiveId}
              options={{
                items: objectives,
                value: (objective: Objective) => objective.objectiveId,
                label: (objective: Objective) => objective.name
              }}
              ref={register({ required: true })}
            />
            <RequiredInput
              name={"customer"}
              label={"顧客先"}
              placeholder={"ex: XXXX 株式会社"}
              error={errors.customer}
              defaultValue={customer}
              register={register}
              clearError={clearError}
            />
            <RequiredInput
              name={"from"}
              label={"乗車地"}
              placeholder={"ex: JR 千葉駅"}
              error={errors.from}
              defaultValue={from}
              register={register}
              clearError={clearError}
            />
            <RequiredInput
              name={"to"}
              label={"降車地"}
              placeholder={"ex: JR 東京駅"}
              error={errors.to}
              defaultValue={to}
              register={register}
              clearError={clearError}
            />
            <RequiredInput
              name={"cost"}
              label={"金額"}
              placeholder={"ex: 500"}
              error={errors.cost}
              defaultValue={costStr}
              register={register}
              clearError={clearError}
            />
            <ButtonGroup>
              <Button variant="contained" onClick={handleCancelClick}>
                キャンセル
              </Button>
              <Button
                variant="contained"
                color="primary"
                disabled={!formState.isValid}
              >
                {expenseId ? "更新" : "作成"}
              </Button>
            </ButtonGroup>
          </form>
        </Panel>
      </Modal>
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
      <div> history template</div>
    );
  }

  function getInitState(props: IProps): IState {
    return { useTemplate: false, selected: undefined };
  }

  /* モーダルクローズ */
  function closeModal() {
    setState({
      useTemplate: false,
      selected: null
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
  function openCreateModal() {
    setState({
      useTemplate: false,
      selected: null
    });
    open();
  }

  /* テンプレートから新規登録モーダル */
  function openCreateFromTemplateModal() {
    setState({
      useTemplate: true,
      selected: null
    });
    open();
  }
};
