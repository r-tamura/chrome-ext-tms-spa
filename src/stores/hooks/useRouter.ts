import { useSelector, useDispatch } from "react-redux";
import { navigateTo } from "~/modules/user";
import { RootState } from "~/modules";

/** 遷移先リスト */
type Page = "signin" | "transportation" | "attendance";

export function useRouter() {
  const { location } = useSelector((state: RootState) => state.router);
  const dispatch = useDispatch();
  function goto(page: Page) {
    dispatch(navigateTo(page));
  }
  return {
    pathname: location.pathname,
    goto,
    gotoSignIn: () => goto("signin"),
    gotoDashboard: () => goto("transportation"),
    gotoTransportation: () => goto("transportation"),
    gotoAttendance: () => goto("attendance")
  };
}
