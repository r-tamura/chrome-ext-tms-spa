import * as React from "react";
import { connect } from "react-redux";
import { Helmet } from "react-helmet";
import { RouteComponentProps } from "react-router-dom";
import SelectBox from "~/components/SelectBox";
import { Button } from "~/components/Button";
import {
  RootState,
  getProjects,
  getAttendancesSelectedMonth,
  getAttendanceSettings
} from "~/modules";
import {
  fetchAttendancesIfNeeded,
  saveAttendancesIfNeeded,
  updateDaily,
  fetchSettings,
  setMonthlyWithDefaults,
  updateSettings,
  changeMonth
} from "~/modules/attendances";
import { zerofill } from "~/helpers/common";
import { AttendanceMonthlyView, AttendanceSettings, Project } from "~/types";
import { MsgAttendance } from "~/helpers/_const";

interface OwnProps extends RouteComponentProps<{}>, React.Props<{}> {}

interface IProps extends OwnProps {
  attendanceMonthly: AttendanceMonthlyView;
  attendanceSettings: AttendanceSettings;
  projects: Project[];
  fetchAttendancesIfNeeded: () => any;
  fetchSettings: () => any;
  saveAttendancesIfNeeded: () => any;
  updateDaily: (dailyId: string, patch: any) => any;
  setMonthlyWithDefaults: (dailyIds: string[]) => any;
  updateSettings: (patch: Partial<AttendanceSettings>) => any;
  changeMonth: (year: number, month: number) => any;
  submitApplication: (year: number, month: number) => any;
}

class AttendancePage extends React.Component<IProps, {}> {
  constructor(props: IProps) {
    super(props);
    this.props.fetchSettings();
    this.props.fetchAttendancesIfNeeded();
  }

  public render() {
    const { attendanceMonthly } = this.props;
    const { year, month, days } = attendanceMonthly;
    return (
      <main className="main">
        <Helmet>
          <title>Attendance | TMS</title>
        </Helmet>
        <div className="main-column">
          <h1>
            <Button id={"btn-prev-month"} onClick={this.onPrevMonthClick}>
              {"<"}
            </Button>
            {year} / {month}
            <Button id={"btn-next-month"} onClick={this.onNextMonthClick}>
              {">"}
            </Button>
          </h1>
          {this.renderMonthly(attendanceMonthly)}

          {/* 時間リスト */}
          <datalist id="timelist-am">
            <option>09:00</option>
            <option>09:30</option>
            <option>10:00</option>
            <option>10:30</option>
          </datalist>
          <datalist id="timelist-pm">
            <option>17:30</option>
            <option>18:00</option>
            <option>18:30</option>
            <option>19:00</option>
            <option>19:30</option>
            <option>19:30</option>
            <option>20:00</option>
            <option>20:30</option>
            <option>21:00</option>
            <option>21:30</option>
            <option>22:00</option>
            <option>22:30</option>
            <option>23:00</option>
            <option>23:30</option>
          </datalist>
        </div>
      </main>
    );
  }

  private renderMonthly(attendanceMonthly: AttendanceMonthlyView) {
    const { year, month, days, isFetching, hasApplied } = attendanceMonthly;

    if (isFetching) {
      // TODO: ロードインジケータを表示するように
      return <p>Now Loading...</p>;
    }

    if (days.length === 0) {
      return <p>勤怠データを取得できません</p>;
    }

    return (
      <div>
        <div className={"tms-btn-group"}>
          <Button id={"btn-set-default"} onClick={this.onSetDefaultClick}>
            set default
          </Button>
          <Button id={"btn-save"} onClick={this.onSaveClick}>
            Save
          </Button>
          <Button
            id={"btn-fetch"}
            onClick={this.props.fetchAttendancesIfNeeded}
          >
            Reload
          </Button>
          {hasApplied ? (
            <Button id={"btn-submit"} title={"上長申請中"} disabled>
              Submit
            </Button>
          ) : (
            <Button
              id={"btn-submit"}
              title={"上長申請"}
              onClick={this.onSubmit}
            >
              Submit
            </Button>
          )}
        </div>
        <div>
          <SelectBox
            value={this.props.attendanceSettings.projectId || ""}
            options={{
              items: this.props.projects,
              valueKey: "projectId",
              labelKey: "name"
            }}
            onChange={$select =>
              this.props.updateSettings({
                projectId: $select.selectedOptions[0].value
              })
            }
          />
        </div>
        <table className="tms-table tms-table--bordered">
          <thead>
            <tr>
              <th>日</th>
              <th>出勤</th>
              <th>退勤</th>
              {/* <th>合計</th>
              <th>Extra</th>
              <th>MN Extra</th> */}
              <th>プロジェクト</th>
              <th>承認</th>
            </tr>
          </thead>
          <tbody>
            {days.map((a, index) => (
              <tr
                key={a.dailyId}
                className={a.hasUpdated ? "attendance-diff" : ""}
              >
                <td
                  className={
                    a.isWeekday ? "attendance-weekday" : "attendance-holiday"
                  }
                >
                  {zerofill(2, index + 1)}
                </td>
                <td className="tms-textfield tms-textfield--table">
                  <input
                    type="time"
                    value={a.start}
                    list="timelist-am"
                    onChange={e =>
                      this.props.updateDaily(a.dailyId, {
                        start: e.target.value
                      })
                    }
                  />
                </td>
                <td className="tms-textfield tms-textfield--table">
                  <input
                    type="time"
                    value={a.end}
                    list="timelist-pm"
                    onChange={e =>
                      this.props.updateDaily(a.dailyId, { end: e.target.value })
                    }
                  />
                </td>
                {/* プロジェクトが未設定の場合は表示なし */}
                <td>
                  <SelectBox
                    value={a.project ? a.project.projectId : ""}
                    options={{
                      items: this.props.projects,
                      valueKey: "projectId",
                      labelKey: "name"
                    }}
                    onChange={$select =>
                      this.props.updateDaily(a.dailyId, {
                        projectId: $select.selectedOptions[0].value
                      })
                    }
                    additionalClass={"tms-select--table"}
                  />
                </td>
                <td>
                  {a.hasConfirmed
                    ? MsgAttendance.HAS_SUBMITED
                    : MsgAttendance.NOT_SUBMITED}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  }

  private onSaveClick = (e: React.MouseEvent<HTMLButtonElement>): void => {
    this.props.saveAttendancesIfNeeded();
  };

  private onSetDefaultClick = (
    e: React.MouseEvent<HTMLButtonElement>
  ): void => {
    this.props.setMonthlyWithDefaults(
      this.props.attendanceMonthly.days.map(d => d.dailyId)
    );
  };

  private onNextMonthClick = (e: React.MouseEvent<HTMLButtonElement>): void => {
    const { year: curYear, month: curMonth } = this.props.attendanceMonthly;
    const nextMonth = (curMonth % 12) + 1;
    const nextYear = nextMonth === 1 ? curYear + 1 : curYear;
    this.props.changeMonth(nextYear, nextMonth);
  };

  private onPrevMonthClick = (e: React.MouseEvent<HTMLButtonElement>): void => {
    const { year: curYear, month: curMonth } = this.props.attendanceMonthly;
    const prevMonth = ((curMonth + 10) % 12) + 1;
    const prevYear = prevMonth === 12 ? curYear - 1 : curYear;
    this.props.changeMonth(prevYear, prevMonth);
  };

  private onSubmit = (e: React.MouseEvent<HTMLButtonElement>): void => {
    console.log("[Attendance] Submitted");
  };
}

const mapStateToProps = (state: RootState, onwProps: OwnProps) => {
  return {
    projects: getProjects(state),
    attendanceSettings: getAttendanceSettings(state),
    attendanceMonthly: getAttendancesSelectedMonth(state)
  };
};

export { AttendancePage };

export default connect(
  mapStateToProps,
  {
    fetchAttendancesIfNeeded,
    saveAttendancesIfNeeded,
    updateDaily,
    fetchSettings,
    setMonthlyWithDefaults,
    updateSettings,
    changeMonth
  }
)(AttendancePage);
