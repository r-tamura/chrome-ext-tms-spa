import React from "react";
import styled from "styled-components";
import { Helmet } from "react-helmet";
import { SelectBox } from "~/components/SelectBox";
import { Button, ButtonGroup } from "~/components/atoms";
import { zerofill } from "~/helpers/common";
import { AttendanceMonthlyView } from "~/types";
import { MsgAttendance } from "~/helpers/_const";
import { useAttendance } from "~/stores/hooks";
import { MainContent } from "~/components/organisms";
import { BOLD } from "~/styles/font";

export const AttendancePage: React.FC = () => {
  const {
    projects,
    fetchAttendances,
    attendanceSettings,
    updateSettings,
    attendanceMonthly,
    saveAttendances,
    updateDaily,
    changeMonth,
    setMonthlyWithDefaults
  } = useAttendance();

  const { year, month } = attendanceMonthly;
  return (
    <main className="app-content-with-navbar">
      <Helmet>
        <title>Attendance | TMS</title>
      </Helmet>
      <MainContent>
        <h1>
          <Button id={"btn-prev-month"} onClick={onPrevMonthClick}>
            {"<"}
          </Button>
          {year} / {month}
          <Button id={"btn-next-month"} onClick={onNextMonthClick}>
            {">"}
          </Button>
        </h1>
        {renderMonthly(attendanceMonthly)}

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
      </MainContent>
    </main>
  );

  function renderMonthly({
    days,
    isFetching,
    hasApplied
  }: AttendanceMonthlyView) {
    if (isFetching) {
      // TODO: ロードインジケータを表示するように
      return <p>Now Loading...</p>;
    }

    if (days.length === 0) {
      return <p>勤怠データを取得できません</p>;
    }

    return (
      <div>
        <ButtonGroup>
          <Button id={"btn-set-default"} onClick={onSetDefaultClick}>
            set default
          </Button>
          <Button id={"btn-save"} onClick={onSaveClick}>
            Save
          </Button>
          <Button id={"btn-fetch"} onClick={fetchAttendances}>
            Reload
          </Button>
          {hasApplied ? (
            <Button id={"btn-submit"} title={"上長申請中"} disabled>
              Submit
            </Button>
          ) : (
            <Button id={"btn-submit"} title={"上長申請"} onClick={onSubmit}>
              Submit
            </Button>
          )}
        </ButtonGroup>
        <div>
          {/* <SelectBox
            value={attendanceSettings.projectId || ""}
            options={{
              items: projects,
              valueKey: "projectId",
              labelKey: "name"
            }}
            onChange={$select =>
              updateSettings({
                projectId: $select.selectedOptions[0].value
              })
            }
          /> */}
          select box
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
                {/* <td
                  className={
                    a.isWeekday ? "attendance-weekday" : "attendance-holiday"
                  }
                >
                  {zerofill(2, index + 1)}
                </td> */}
                {a.isWeekday ? (
                  <TdWeekday>{zerofill(2, index + 1)}</TdWeekday>
                ) : (
                  <TdHoliday>{zerofill(2, index + 1)}</TdHoliday>
                )}
                <td className="tms-textfield tms-textfield--table">
                  <input
                    type="time"
                    value={a.start}
                    list="timelist-am"
                    onChange={e =>
                      updateDaily(a.dailyId, {
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
                      updateDaily(a.dailyId, { end: e.target.value })
                    }
                  />
                </td>
                {/* プロジェクトが未設定の場合は表示なし */}
                <td>
                  {/* <SelectBox
                    value={a.project ? a.project.projectId : ""}
                    options={{
                      items: projects,
                      valueKey: "projectId",
                      labelKey: "name"
                    }}
                    onChange={$select =>
                      updateDaily(a.dailyId, {
                        projectId: $select.selectedOptions[0].value
                      })
                    }
                  // additionalClass={"tms-select--table"}
                  /> */}
                  select box
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

  function onSaveClick(): void {
    saveAttendances();
  }

  function onSetDefaultClick(): void {
    setMonthlyWithDefaults(attendanceMonthly.days.map(d => d.dailyId));
  }

  function onNextMonthClick(): void {
    const { year: curYear, month: curMonth } = attendanceMonthly;
    const nextMonth = (curMonth % 12) + 1;
    const nextYear = nextMonth === 1 ? curYear + 1 : curYear;
    changeMonth(nextYear, nextMonth);
  }

  function onPrevMonthClick(): void {
    const { year: curYear, month: curMonth } = attendanceMonthly;
    const prevMonth = ((curMonth + 10) % 12) + 1;
    const prevYear = prevMonth === 12 ? curYear - 1 : curYear;
    changeMonth(prevYear, prevMonth);
  }

  function onSubmit(): void {
    console.log("[Attendance] Submitted");
  }
};

const TdHoliday = styled.td`
  color: rgba(255, 0, 0, 0.4);
  font-weight: ${BOLD};
`;

const TdWeekday = styled.td``;
