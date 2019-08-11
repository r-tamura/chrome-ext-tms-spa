import path from "path";
import { promisify } from "util";
import ejs from "ejs";
import toFormData from "~/helpers/to-formdata";
import { urls } from "~/helpers/_const";
import { Status } from "~/types";

const renderFile = promisify<string, object, string>(ejs.renderFile);

const users = new Map<string, { id: string; name: string; password: string }>([
  ["alice", { id: "alice", name: "Alice Cooper", password: "password" }],
  ["bob", { id: "bob", name: "Bob Warner", password: "bobpass" }],
  ["marie", { id: "marie", name: "Marie Fredriksson", password: "marie1986" }],
  ["per", { id: "per", name: "Per Gessle", password: "pa22w0rd" }]
]);

const MOCK_RESPONSE_DIR = __dirname + "/responses";

async function get(url: string, params: object = {}): Promise<string> {
  return post(url, params);
}

const mockLoginResponse = (fd: FormData) => {
  const id = fd.get("id").toString();
  if (users.has(id)) {
    const user = users.get(id);
    return renderFile(path.resolve(MOCK_RESPONSE_DIR, "T0010_menu.html"), {
      name: user.name
    });
  }
  return Promise.resolve("<html><body>");
};

const mockAttendanceCalendarResponse = (fd: FormData): Promise<string> => {
  // 2018年からは未申請
  return renderFile(path.resolve(MOCK_RESPONSE_DIR, "T2020_it_report.html"), {
    name: users.get("bob").name,
    hasApplied: fd.get("year").valueOf() < 2018
  });
};

const mockAttendanceSummaryResponse = (fd: FormData): Promise<string> => {
  return renderFile(
    path.resolve(MOCK_RESPONSE_DIR, "T2023_it_report_apply.html"),
    {
      name: users.get("bob").name,
      yrar: fd.get("year").toString(),
      month: fd.get("month").toString()
    }
  );
};

const mockAttendanceEditResponse = (fd: FormData): Promise<string> => {
  const func = fd.get("func").toString();

  switch (func) {
    case "commit": {
      const monthlyId = fd.get("eym").toString();
      return monthlyId === "201801"
        ? Promise.resolve(`
      <html><body>
        <p align=\"center\"><p>
        <p align=\"center\"><p>
        <p align=\"center\">申請が完了しました<p>
      </body></html>
    `)
        : Promise.reject({
            response: {
              status: Status.NG,
              error: { message: "Not Found" },
              statusCode: 404
            }
          });
    }
    case "accept":
    default:
      return Promise.resolve(`
    <html><body>
      <p align=\"center\"><p>
      <p align=\"center\"><p>
      <p align=\"center\">承認が完了しました<p>
    </body></html>
  `);
  }
};

const mockAttendancePreviewResponse = (fd: FormData): Promise<string> => {
  return renderFile(
    path.resolve(MOCK_RESPONSE_DIR, "T2022_it_report_preview.html"),
    {
      name: "Marie Fredriksson"
    }
  );
};

async function post(url: string, formdata: FormData | object): Promise<string> {
  const fd = formdata instanceof FormData ? formdata : toFormData(formdata);
  const funcMap = {
    [urls.TMSX_MENU]: mockLoginResponse,
    [urls.ATTENDANCE_REPORT]: mockAttendanceCalendarResponse,
    [urls.ATTENDANCE_EDIT]: mockAttendanceEditResponse,
    [urls.TMSX_ATTENDANCE_PREVIEW]: mockAttendancePreviewResponse,
    [urls.ATTENDANCE_APPLY]: mockAttendanceSummaryResponse
  };
  const func = funcMap[url];
  if (func) {
    return func(fd);
  }
  return Promise.reject("Specified URL doesn't exist");
}

export { get, post };
