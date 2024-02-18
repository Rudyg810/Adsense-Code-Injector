import {
  REQUEST_LEADERBOARD_PENDING,
  REQUEST_LEADERBOARD_SUCCESS,
} from "../../utilis/constants";

const INTIAL_STATE = {
  userScores: [],
};

export const leaderBoardReducer = (state = INTIAL_STATE, action = {}) => {
  switch (action.type) {
    case REQUEST_LEADERBOARD_SUCCESS:
      return { ...state, userScores: action.payload?.data };
    case REQUEST_LEADERBOARD_PENDING:
      return { ...state, isPending: true };
    default:
      return state;
  }
};
