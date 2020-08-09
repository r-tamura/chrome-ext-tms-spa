import { has, prop } from "ramda";
import { zerofill } from "~/helpers/common";
import { AttendanceDaily, AttendanceMonthly } from "~/types";

const zerofill2 = zerofill(2);
const zerofill4 = zerofill(4);

type Text = string | number;
const createMonthlyId = (year: Text, month: Text): string =>
  `${year}${zerofill2(month)}`;
const createDailyId = (year: Text, month: Text, day: Text) =>
  `${createMonthlyId(year, month)}${zerofill2(day)}`;

const isMonthly = (monthly: AttendanceMonthly): boolean =>
  monthly &&
  has("days", monthly) &&
  typeof prop("days", monthly) !== "undefined";

const hasUpdated = (day: AttendanceDaily) => day.hasUpdated;

export {
  zerofill2,
  zerofill4,
  createMonthlyId,
  createDailyId,
  isMonthly,
  hasUpdated
};
