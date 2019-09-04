import React, { useState } from "react";
import useForm from "react-hook-form";
import { find, propEq } from "ramda";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrash, faEdit } from "@fortawesome/free-solid-svg-icons";
import { Modal } from "~/components/atoms/Modal";
import { Button, ButtonGroup, Panel, Input } from "~/components/atoms";
import { AddIcon } from "~/components/Icon";
import { CURRENCY } from "~/helpers/_const";
import {
  Project,
  Usage,
  Objective,
  TransExpenseTemplateView,
  TransExpenseTemplateCreateRequest,
  TransExpenseTemplateUpdateRequest,
  TransExpenseTemplate,
  TemplateId
} from "~/types";
import { Table, Tr, Td } from "~/components/atoms/Table";
import { useModal } from "~/components/hooks";
import { SelectBox } from "../SelectBox";
import { ReactHookFormError } from "react-hook-form/dist/types";

interface IProps {
  templates: TransExpenseTemplateView[];
  projects: Project[];
  usages: Usage[];
  objectives: Objective[];
  createExpenseTemplate: (template: TransExpenseTemplateCreateRequest) => void;
  deleteExpenseTemplate: (templateId: string) => void;
  updateExpenseTemplate: (template: TransExpenseTemplateUpdateRequest) => void;
}

/**
 * 交通費テンプレートコンポーネント
 */
export const TransExpenseTemplates: React.FC<IProps> = ({
  templates,
  projects,
  usages,
  objectives,
  createExpenseTemplate,
  updateExpenseTemplate,
  deleteExpenseTemplate
}) => {
  const { isOpen: isModalOpen, open, close } = useModal(false);
  const [selected, setSelected] = useState<TemplateId | null>(null);
  return (
    <div>
      {/* テンプレート一覧 */}
      {templates.length > 0 ? (
        <TemplatesTable />
      ) : (
        <p>交通費テンプレートがブラウザに登録されていません。登録しますか？</p>
      )}
      {/* 新規登録ボタン */}
      <ButtonGroup>
        <Button
          id={"create-trans-expense-template"}
          color={"primary"}
          variant={"circle"}
          onClick={openCreateModal}
        >
          <AddIcon />
        </Button>
      </ButtonGroup>

      {/* 編集モーダル */}
      <EditorModal />
    </div>
  );

  function TemplatesTable() {
    const header = [
      "#",
      "テンプレート名",
      "プロジェクト",
      "利用区分",
      "目的",
      "金額",
      "",
      ""
    ];

    function createHandleDelete(templateId: TemplateId) {
      return () => deleteExpenseTemplate(templateId);
    }
    return (
      <div>
        <Table header={header}>
          {templates.map((t, i) => (
            <Tr key={t.templateId} hover>
              <Td className="record-id">{i + 1}</Td>
              <Td>{t.templateName}</Td>
              <Td>{t.project.name}</Td>
              <Td>{t.usage.name}</Td>
              <Td>{t.objective.name}</Td>
              <Td>{CURRENCY.format(t.cost)}</Td>
              <Td>
                <Button
                  onClick={() => openEditModal(t.templateId)}
                  variant="icon"
                  color="primary"
                  title="編集"
                >
                  <FontAwesomeIcon icon={faEdit} />
                </Button>
              </Td>
              <Td>
                <Button
                  variant="icon"
                  color="danger"
                  title="削除"
                  onClick={createHandleDelete(t.templateId)}
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
    type FormData = Record<keyof TransExpenseTemplate, string>;
    const {
      register,
      handleSubmit,
      errors,
      setError,
      formState,
      clearError
    } = useForm<FormData>();
    function onSubmit({
      templateName,
      projectId,
      usageId,
      objectiveId,
      customer,
      from,
      to,
      cost
    }: FormData) {
      let costNumber;
      try {
        costNumber = Number.parseInt(cost, 10);
        if (costNumber < 0) {
          setError("cost", "NaN", "正の整数値を入力してください");
          return;
        }
      } catch (e) {
        setError("cost", "NaN", "正の整数値を入力してください");
        return;
      }

      if (selected) {
        // 更新
        updateExpenseTemplate({
          templateId: find<TransExpenseTemplateView>(
            propEq("templateId", selected),
            templates
          ).templateId,
          templateName,
          projectId,
          usageId,
          objectiveId,
          customer,
          from,
          to,
          cost: costNumber
        });
      } else {
        // 新規作成
        createExpenseTemplate({
          templateName,
          projectId,
          usageId,
          objectiveId,
          customer,
          from,
          to,
          cost: costNumber
        });
      }
      close();
    }

    function handleCancelClick(event: React.MouseEvent) {
      event.stopPropagation();
      event.preventDefault();
      close();
    }

    const defaultTemplate: TransExpenseTemplateView = {
      templateId: "",
      templateName: "",
      project: null,
      usage: null,
      objective: null,
      customer: "",
      from: "",
      to: "",
      cost: 0
    };
    const {
      templateName,
      project,
      usage,
      objective,
      customer,
      from,
      to,
      cost
    } = selected
      ? find(propEq("templateId", selected), templates)
      : defaultTemplate;
    const costStr = cost === 0 ? "" : cost.toString();

    function RequiredInput({
      label,
      ...otherProps
    }: {
      name: keyof FormData;
      label: string;
      placeholder: string;
      defaultValue: string;
      error: ReactHookFormError;
    }) {
      return (
        <Input
          {...otherProps}
          error={!!otherProps.error}
          label={label + " *"}
          ref={register({ required: `${label}は必須入力です` })}
          onFocus={() => clearError(otherProps.name)}
        />
      );
    }

    return (
      <Modal isOpen={isModalOpen} onRequestClose={handleModalClose}>
        <Panel>
          <form onSubmit={handleSubmit(onSubmit)}>
            <RequiredInput
              name="templateName"
              label="テンプレート名"
              placeholder="ex: 定期代(JR千葉駅)"
              defaultValue={templateName}
              error={errors.templateName}
            />
            <SelectBox
              name="projectId"
              label="プロジェクトコード *"
              defaultValue={project ? project.projectId : ""}
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
              defaultValue={usage ? usage.usageId : ""}
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
              defaultValue={objective ? objective.objectiveId : ""}
              options={{
                items: objectives,
                value: (objective: Objective) => objective.objectiveId,
                label: (objective: Objective) => objective.name
              }}
              ref={register({ required: true })}
            />
            <RequiredInput
              name="customer"
              label="顧客先"
              placeholder="ex: XX株式会社"
              defaultValue={customer}
              error={errors.customer}
            />
            <RequiredInput
              name="from"
              label="乗車地"
              placeholder="ex: JR千葉駅"
              defaultValue={from}
              error={errors.from}
            />
            <RequiredInput
              name="to"
              label="降車地"
              placeholder="ex: JR東京駅"
              defaultValue={to}
              error={errors.to}
            />
            <RequiredInput
              name="cost"
              label="金額"
              placeholder="500"
              defaultValue={costStr}
              error={errors.cost}
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
                作成/更新
              </Button>
            </ButtonGroup>
          </form>
        </Panel>
      </Modal>
    );
  }

  function handleModalClose() {
    close();
  }

  /* 編集モーダルオープン */
  function openEditModal(templateId: string) {
    setSelected(templateId);
    open();
  }

  /* 新規登録ボタンクリックイベント */
  function openCreateModal(e: React.MouseEvent<HTMLButtonElement>) {
    open();
    setSelected("");
  }
};
