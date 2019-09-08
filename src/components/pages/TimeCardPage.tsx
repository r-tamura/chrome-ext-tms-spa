import React from "react";
import styled from "styled-components";
import { Helmet } from "react-helmet";
import { SelectBox } from "~/components/SelectBox";
import { Button, ButtonGroup, Input } from "~/components/atoms";
import { zerofill } from "~/helpers/common";
import { AttendanceMonthlyView, Project } from "~/types";
import { MsgAttendance } from "~/helpers/_const";
import { useAttendance } from "~/stores/hooks";
import { MainContent } from "~/components/organisms";
import { BOLD } from "~/styles/font";
import { Table, Tr, Td } from "../atoms/Table";

export const TimeCardPage: React.FC = () => {
  const {
    projects,
    fetchAttendances,
    attendanceSettings,
    updateSettings,
    attendanceMonthly,
    saveAttendances,
    updateDaily,
    setMonthlyWithDefaults,
    submitApplication,
    nextMonth,
    prevMonth
  } = useAttendance();

  const { year, month } = attendanceMonthly;
  return (
    <main className="app-content-with-navbar">
      <Helmet>
        <title>Attendance | TMS</title>
      </Helmet>
      <MainContent>
        <h1>
          <Button id={"btn-prev-month"} onClick={handlePrevMonthClick}>
            {"<"}
          </Button>
          <span>
            {year} / {month}
          </span>
          <Button id={"btn-next-month"} onClick={handleNextMonthClick}>
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
          <Button
            id={"btn-set-default"}
            variant={"contained"}
            color={"default"}
            onClick={handleSetDefaultClick}
          >
            set default
          </Button>
          <Button
            id={"btn-force-fetch"}
            variant={"contained"}
            color={"default"}
            onClick={fetchAttendances}
          >
            Reload
          </Button>
          <Button
            id={"btn-save"}
            variant={"contained"}
            color={"primary"}
            onClick={handleSaveClick}
          >
            Save
          </Button>
          {hasApplied ? (
            <Button
              id={"btn-submit"}
              variant={"contained"}
              color={"secondary"}
              title={"上長申請中"}
              disabled
            >
              Submit
            </Button>
          ) : (
            <Button
              id={"btn-submit"}
              variant={"contained"}
              color={"secondary"}
              title={"上長申請"}
              onClick={onSubmit}
            >
              Submit
            </Button>
          )}
        </ButtonGroup>
        <div>
          <SelectBox
            name="projectId"
            label="デフォルトプロジェクト"
            defaultValue={
              attendanceSettings.projectId ? attendanceSettings.projectId : ""
            }
            options={{
              items: projects,
              value: (project: Project) => project.projectId,
              label: (project: Project) => project.name
            }}
            onChange={e => {
              updateSettings({
                projectId: e.currentTarget.selectedOptions.item(0).value
              });
            }}
          />
        </div>
        <Table header={["日", "出勤", "退勤", "プロジェクト", "承認"]}>
          {days.map((record, index) => (
            <Tr
              key={record.dailyId}
              className={record.hasUpdated ? "attendance-diff" : ""}
            >
              {record.isWeekday ? (
                <TdWeekday>{zerofill(2, index + 1)}</TdWeekday>
              ) : (
                <TdHoliday>{zerofill(2, index + 1)}</TdHoliday>
              )}
              <Td>
                <Input
                  type="time"
                  value={record.start}
                  list="timelist-am"
                  onChange={e =>
                    updateDaily(record.dailyId, {
                      start: e.currentTarget.value
                    })
                  }
                />
              </Td>
              <Td>
                <Input
                  type="time"
                  value={record.end}
                  list="timelist-pm"
                  onChange={e =>
                    updateDaily(record.dailyId, { end: e.currentTarget.value })
                  }
                />
              </Td>
              {/* プロジェクトが未設定の場合は表示なし */}
              <Td>
                <SelectBox
                  name="projectId"
                  defaultValue={record.project ? record.project.projectId : ""}
                  options={{
                    items: projects,
                    value: (project: Project) => project.projectId,
                    label: (project: Project) => project.name
                  }}
                  onChange={e =>
                    updateDaily(record.dailyId, {
                      projectId: e.currentTarget.selectedOptions.item(0).value
                    })
                  }
                  // ref={register({ required: true })}
                />
              </Td>
              <Td>
                {record.hasConfirmed
                  ? MsgAttendance.HAS_SUBMITED
                  : MsgAttendance.NOT_SUBMITED}
              </Td>
            </Tr>
          ))}
        </Table>
      </div>
    );
  }

  function handleSaveClick() {
    saveAttendances();
  }

  function handleSetDefaultClick() {
    setMonthlyWithDefaults(attendanceMonthly.days.map(d => d.dailyId));
  }

  function handleNextMonthClick() {
    nextMonth();
  }

  function handlePrevMonthClick() {
    prevMonth();
  }

  function onSubmit() {
    console.log(`[Attendance] Submitted ${year}/${month}`);
    // const { year, month } = attendanceMonthly;
    // submitApplication(year, month);
  }
};

const TdHoliday = styled.td`
  color: rgba(255, 0, 0, 0.4);
  font-weight: ${BOLD};
`;

const TdWeekday = styled.td``;
