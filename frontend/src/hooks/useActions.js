import { useDispatch } from "react-redux";
import { bindActionCreators } from "redux";
import {
  getLeaderBoard,
  updateLeaderboard,
  requestGameState,
  putGameState,
  setUserName,
} from "../store/actions";

const actions = {
  getLeaderBoard,
  updateLeaderboard,
  requestGameState,
  putGameState,
  setUserName,
};

export const useActions = () => {
  const dispatch = useDispatch();
  return bindActionCreators(actions, dispatch);
};
