import { AttendanceMonthly } from "~/types"

class AttendanceModelBuilder {
  public static build() {
    return AttendanceModelBuilder.of().build()
  }

  public static of(props?: Partial<AttendanceMonthly>): AttendanceModelBuilder {
    return new AttendanceModelBuilder(props)
  }

  private static _defaultProps = {
    monthlyId: "201801",
    reportId: "reportId",
    year: 2018,
    month: 1,
    days: ["20180101", "20180102", "20180103"],
    hasApplied: false,
    isFetching: false,
    lastUpdatedOn: 1516808776046,
  }

  private props: AttendanceMonthly

  constructor(props: Partial<AttendanceMonthly> = {}) {
    this.props = { ...AttendanceModelBuilder._defaultProps, ...props }
  }

  public hasApplied(hasApplied: boolean = true) {
    this.props.hasApplied = hasApplied
    return this
  }

  public isFetching(isFetching: boolean = true) {
    this.props.isFetching = isFetching
    return this
  }

  public lastUpdatedBefore() {
    this.props.lastUpdatedOn = 0
    return this
  }

  public with30Days() {
    this.props.days = Array(30).fill(null).map((e, i) => `${this.props.monthlyId}${i.toString().padStart(2, "0")}`)
    return this
  }

  public build() {
    return this.props
  }
}

export {
  AttendanceModelBuilder,
}
export default AttendanceModelBuilder
