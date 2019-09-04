import { Project, Usage, Objective } from "./master";

export type ExpenseId = string;
export type TemplateId = string;

interface TransExpenseAttributes {
  customer: string;
  from: string;
  to: string;
  cost: number;
}

/* Transportation Expense Types */
interface TransExpenseBase extends TransExpenseAttributes {
  expenseId: ExpenseId;
  strdate: string; // 交通費使用日 "yyyymmdd"
}

export interface TransExpense extends TransExpenseBase {
  projectId: string;
  usageId: string;
  objectiveId: string;
}

export type TransExpenseUpdateRequest = TransExpense;
export type TransExpenseCreateRequest = Omit<TransExpense, "expenseId">;

export interface TransExpenseView extends TransExpenseBase {
  project: Project;
  usage: Usage;
  objective: Objective;
}

/* Transportation Expense Template Types */
interface TransExpenseTemplateBase extends TransExpenseAttributes {
  templateId: TemplateId;
  templateName: string;
  // Note: 作成日時と更新日時プロパティを登録する機能を作成する。それまではOptional
  createdOn?: string; // 作成日時 yyyy:mm:dd HH:MM:SS
  lastUpdatedOn?: string; // 最終更新日時 yyyy:mm:dd HH:MM:SS
}

export interface TransExpenseTemplate extends TransExpenseTemplateBase {
  projectId: string;
  usageId: string;
  objectiveId: string;
}
export type TransExpenseTemplateUpdateRequest = Omit<
  TransExpenseTemplate,
  "createdOn" | "lastUpdatedOn"
>;
export type TransExpenseTemplateCreateRequest = Omit<
  TransExpenseTemplate,
  "templateId" | "createdOn" | "lastUpdatedOn"
>;
export interface TransExpenseTemplateView extends TransExpenseTemplateBase {
  project: Project;
  usage: Usage;
  objective: Objective;
}
