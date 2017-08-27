import * as React from "react"
import { connect } from "react-redux"
import { Helmet } from "react-helmet"
import { RouteComponentProps } from "react-router-dom"
import { RootState, getAttendancesSelectedMonth } from "~/modules"
import { fetchAttendancesIfNeeded, saveAttendancesIfNeeded, updateDaily } from "~/modules/attendances"
import { zerofill } from "~/helpers/common"
import { AttendanceMonthlyView } from "~/types"
import { MsgAttendance } from "~/helpers/_const"

interface OwnProps extends RouteComponentProps<{}>, React.Props<{}> {}

interface IProps extends OwnProps {
  attendanceMonthly: AttendanceMonthlyView
  fetchAttendancesIfNeeded: () => void
  saveAttendancesIfNeeded: () => void
  updateDaily: (dailyId: string, patch: any) => void
}

class Attendance extends React.Component<IProps, {}> {

  constructor(props: IProps) {
    super(props)
    this.props.fetchAttendancesIfNeeded()
  }

  public render() {
    const { attendanceMonthly } = this.props
    const { year, month, days } = attendanceMonthly
    return (
    <main className="main">
      <Helmet>
        <title>Attendance | TMS</title>
      </Helmet>
      <h1>
        <button>{"<"}</button>
        {year} / {month}
        <button>{">"}</button>
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
    </main>
    )
  }

  private renderMonthly(attendanceMonthly: AttendanceMonthlyView) {
    const { year, month, days, isFetching } = attendanceMonthly

    if (isFetching) {
      return <p>Now Loading...</p>
    }

    if (days.length === 0) {
      return <p>勤怠データを取得できません</p>
    }

    return (
      <div style={{overflowX: "auto"}}>
        <div>
          <button onClick={this.onSaveClick}>Save</button>
          <button onClick={this.props.fetchAttendancesIfNeeded}>Reset</button>
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
          {
            days.map((a, index) => (
              <tr key={a.dailyId} className={a.hasUpdated ? "attendance-diff" : ""}>
                <td className={a.isWeekday ? "attendance-weekday" : "attendance-holiday"}>
                  {zerofill(2, index + 1)}
                </td>
                <td className="tms-textfield tms-textfield--table">
                  <input
                    type="time"
                    value={a.start}
                    list="timelist-am"
                    onChange={e => this.props.updateDaily(a.dailyId, { start: e.target.value })}
                  />
                </td>
                <td className="tms-textfield tms-textfield--table">
                  <input
                    type="time"
                    value={a.end}
                    list="timelist-pm"
                    onChange={e => this.props.updateDaily(a.dailyId, { end: e.target.value })}
                  />
                </td>
                {/* プロジェクトが未設定の場合は表示なし */}
                <td>{a.project ? a.project.name : ""}</td>
                <td>{a.hasConfirmed ? MsgAttendance.HAS_SUBMITED : MsgAttendance.NOT_SUBMITED}</td>
              </tr>
            ))
          }
          </tbody>
        </table>
      </div>
    )
  }

  private onSaveClick = (e: React.MouseEvent<HTMLButtonElement>): void => {
    this.props.saveAttendancesIfNeeded()
  }
}

const mapStateToProps = (state: RootState, onwProps: OwnProps) => {
  return {
    attendanceMonthly: getAttendancesSelectedMonth(state),
  }
}

export default connect(mapStateToProps, {
  fetchAttendancesIfNeeded,
  saveAttendancesIfNeeded,
  updateDaily,
})(Attendance)
