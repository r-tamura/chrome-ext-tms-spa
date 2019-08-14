import { Project, Usage, Objective } from "./master";

export type ExpenseId = string;

type TransExpenseBase = {
  expenseId?: ExpenseId;
  strdate?: string; // 交通費使用日
  customer: string;
  from: string;
  to: string;
  cost: number;
};

export type TransExpense = TransExpenseBase & {
  projectId: string;
  usageId: string;
  objectiveId: string;
};

export type TransExpenseView = TransExpenseBase & {
  project?: Project;
  usage?: Usage;
  objective?: Objective;
};

interface TransExpenseTemplateB {
  templateId: string;
  templateName: string;
  createdOn?: string;
  lastUpdatedOn?: string; // 最終更新日時 yyyymmdd
}
export type TransExpenseTemplate = TransExpense & TransExpenseTemplateB;
export type TransExpenseTemplateView = TransExpenseView & TransExpenseTemplateB;
