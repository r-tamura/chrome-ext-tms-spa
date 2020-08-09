import { useDispatch } from "react-redux";
import { RootState, RootAction } from "~/modules";
import { ThunkDispatch } from "redux-thunk";

export const useThunkDispatch = () =>
  useDispatch<ThunkDispatch<RootState, {}, RootAction>>();
