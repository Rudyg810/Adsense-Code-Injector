import {
  // requestGameState - get
  REQUEST_GAME_STATE_PENDING,
  REQUEST_GAME_STATE_SUCCESS,
  REQUEST_GAME_STATE_FAILED,
  //   putGameState - put
  PUT_GAME_STATE_PENDING,
  PUT_GAME_STATE_SUCCESS,
  PUT_GAME_STATE_FAILED,
  //   setUserName
  SET_USERNAME_SUCCESS,
} from "../../utilis/constants";
import axiosInstance from "../../apis/client";
import { endpoints } from "../../apis/endpoints";

const requestGameState = (params) => async (dispatch) => {
  console.log("paramss", params);
  dispatch({ type: REQUEST_GAME_STATE_PENDING });
  try {
    const result = await axiosInstance.get(endpoints.game, { params });
    dispatch({ type: REQUEST_GAME_STATE_SUCCESS, payload: result });
  } catch (e) {
    console.log("error =>", e);
    dispatch({ type: REQUEST_GAME_STATE_FAILED });
  }
};

const putGameState = (params) => async (dispatch) => {
  dispatch({ type: PUT_GAME_STATE_PENDING });
  try {
    const res = await axiosInstance.put(endpoints.game, { ...params });
    console.log("res", res, res.data);
    dispatch({ type: PUT_GAME_STATE_SUCCESS, payload: res.data });
  } catch (e) {
    console.log(e);
    dispatch({
      type: PUT_GAME_STATE_FAILED,
      payload: {
        error: e,
      },
    });
  }
};

const setUserName = (params) => async (dispatch) => {
  try {
    dispatch({ type: SET_USERNAME_SUCCESS, payload: params });
  } catch (e) {
    console.log(e);
  }
};

export { requestGameState, putGameState, setUserName };
