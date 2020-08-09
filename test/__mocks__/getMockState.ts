import fs from "fs";
import path from "path";
import { RootState } from "~/modules";

const loadJson = (name: string) => {
  const text = fs.readFileSync(
    path.resolve(__dirname, "stores", name + ".json"),
    "utf8"
  );
  return JSON.parse(text);
};

const getRoot = (): RootState => ({
  user: {
    isFetching: false,
    isAuthenticated: false,
    name: ""
  },
  transexpensetemplates: {
    byId: {},
    allIds: [""],
    isFetching: false,
    isUpdating: false
  },
  transexpenses: {
    byId: {
      "1": {
        expenseId: "1",
        strdate: "20190801",
        customer: "1",
        from: "A",
        to: "B",
        cost: 500,
        projectId: "20190501",
        usageId: "2000",
        objectiveId: "0303"
      }
    },
    allIds: ["1"],
    isFetching: false,
    isUpdating: false
  },
  attendances: loadJson("attendances"),
  master: {
    projects: loadJson("projects"),
    usages: [],
    objectives: [],
    isFetching: false
  },
  router: {
    location: {
      pathname: "",
      search: "",
      state: null,
      hash: ""
    },
    action: "REPLACE"
  }
});

const getMockState = (filepath: string = ""): any => {
  let state: any = getRoot();

  if (filepath.length === 0) {
    return state;
  }

  const keys = filepath.split(".");
  for (const key of keys) {
    state = state[key];
  }
  return state;
};

export { getMockState };
// export default getMockState
