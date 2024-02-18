import {
  REQUEST_GAME_STATE_FAILED,
  REQUEST_GAME_STATE_SUCCESS,
  REQUEST_GAME_STATE_PENDING,
  SET_GAME_STATE_PENDING,
  SET_GAME_STATE_SUCCESS,
  SET_GAME_STATE_FAILED,
  PUT_GAME_STATE_PENDING,
  PUT_GAME_STATE_SUCCESS,
  SET_USERNAME_SUCCESS,
  PUT_GAME_STATE_FAILED,
} from "../../utilis/constants";

const INTIAL_STATE = {
  gameCards: null,
  isPending: true,
  score: 0,
  hasDefuseCard: false,
  activeCard: "",
  error: "",
};

export const gameStateReducer = (state = INTIAL_STATE, action = {}) => {
  switch (action.type) {
    case SET_USERNAME_SUCCESS:
      return { ...state, userName: action.payload };
    case REQUEST_GAME_STATE_PENDING:
      return { ...state, isPending: true };
    case REQUEST_GAME_STATE_SUCCESS: {
      const { activeCard, hasDefuseCard, score, gameCards } =
        action.payload?.data;
      return {
        ...state,
        gameCards: gameCards,
        activeCard: activeCard,
        hasDefuseCard: hasDefuseCard,
        isPending: false,
        score: score,
      };
    }
    case REQUEST_GAME_STATE_FAILED:
      return { ...state, error: action.payload };
    case SET_GAME_STATE_PENDING:
      return { ...state, isPending: true };
    case SET_GAME_STATE_SUCCESS:
      return {
        ...state,
        gameCards: action.payload?.gameCards,
        isPending: false,
      };
    case SET_GAME_STATE_FAILED:
      return { ...state, error: action.payload };
    case PUT_GAME_STATE_PENDING:
      return { ...state, isPending: true };
    case PUT_GAME_STATE_SUCCESS: {
      const { gameCards, activeCard, hasDefuseCard, score } = action.payload;
      return {
        ...state,
        gameCards: gameCards,
        activeCard: activeCard,
        hasDefuseCard: hasDefuseCard,
        isPending: false,
        score: score,
      };
    }
    case PUT_GAME_STATE_FAILED:
      return {
        ...state,
        error: action.payload.error,
      };
    default:
      return state;
  }
};
