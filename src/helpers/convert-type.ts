import { pick } from "ramda"
import { TransExpenseTemplate, TransExpenseTemplateView } from "~/types"

export const templateViewToModel = (templateView: TransExpenseTemplateView) => ({
    ...pick(["templateId", "templateName", "expenseId", "strdate", "customer", "from", "to", "cost"], templateView),
    projectId: templateView.project.projectId,
    usageId: templateView.usage.usageId,
    objectiveId: templateView.objective.objectiveId,
  })
