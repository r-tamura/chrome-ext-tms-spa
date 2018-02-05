import { projects, attendances } from "./stores"
import { RootState } from "~/modules"

const getRoot = (): RootState => ({
  user: {
    isFetching: false,
    isAuthenticated: false,
    name: "",
  },
  transexpensetemplates: {
    byId: {},
    allIds: [""],
    isFetching: false,
    isUpdating: false,
  },
  transexpenses: {
    byId: {},
    allIds: [1],
    isFetching: false,
    isUpdating: false,
  },
  // attendances: {
  //   yearAndMonth: {
  //     selectedYear: 2000,
  //     selectedMonth: 1,
  //   },
  //   dailies: {
  //     byId: {},
  //     allIds: [""],
  //   },
  //   monthlies: {
  //     byId: {},
  //     allIds: [""],
  //   },
  //   settings: {},
  // },
  attendances,
  master: {
    projects,
    usages: [],
    objectives: [],
    isFetching: false,
  },
})

const getMockState = (path: string = ""): any => {
  let state: any = getRoot()

  if (path.length === 0) {
    return state
  }

  const keys = path.split(".")
  for (const key of keys) {
    state = state[key]
  }
  return state
}

export default getMockState
