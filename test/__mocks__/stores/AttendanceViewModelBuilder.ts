import { AttendanceMonthlyView } from "~/types";

class AttendanceViewModelBuilder {
  public static build() {
    return AttendanceViewModelBuilder.of().build();
  }

  public static of(
    props?: Partial<AttendanceMonthlyView>
  ): AttendanceViewModelBuilder {
    return new AttendanceViewModelBuilder(props);
  }

  private static _defaultProps = {
    monthlyId: "201801",
    reportId: "reportId",
    year: 2018,
    month: 1,
    days: [
      {
        dailyId: "20180101",
        day: 1,
        isWeekday: false,
        start: "09:00",
        end: "17:30",
        overwork: "00:00",
        overnightwork: "00:00",
        hasConfirmed: true,
        hasUpdated: false,
        project: { projectId: "000001", name: "Project 1" }
      },
      {
        dailyId: "20180102",
        day: 1,
        isWeekday: true,
        start: "09:00",
        end: "17:30",
        overwork: "00:00",
        overnightwork: "00:00",
        hasConfirmed: true,
        hasUpdated: false,
        project: { projectId: "000001", name: "Project 1" }
      }
    ],
    hasApplied: false,
    isFetching: false,
    lastUpdatedOn: 1516808776046
  };

  private props: AttendanceMonthlyView;

  constructor(props: Partial<AttendanceMonthlyView> = {}) {
    this.props = { ...AttendanceViewModelBuilder._defaultProps, ...props };
  }

  public hasApplied(hasApplied: boolean = true) {
    this.props.hasApplied = hasApplied;
    return this;
  }

  public isFetching(isFetching: boolean = true) {
    this.props.isFetching = isFetching;
    return this;
  }

  public lastUpdatedBefore() {
    this.props.lastUpdatedOn = 0;
    return this;
  }

  public build() {
    return this.props;
  }
}

export { AttendanceViewModelBuilder };
export default AttendanceViewModelBuilder;
