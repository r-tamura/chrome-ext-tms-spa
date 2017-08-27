import { has, prop } from "ramda"
import { zerofill } from "~/helpers/common"
import { AttendanceDaily } from "~/types"

const zerofill2 = zerofill(2)
const zerofill4 = zerofill(4)

type Text = string | number
export const createMonthlyId = (year: Text, month: Text): string => `${year}${zerofill2(month)}`
export const createDailyId =
  (year: Text, month: Text, day: Text) => `${createMonthlyId(year, month)}${zerofill2(day)}`

export const isMonthly = (monthly: object): boolean =>
  monthly && has("days", monthly) && typeof prop("days", monthly) !== "undefined"

export const hasUpdated = (day: AttendanceDaily) => day.hasUpdated
