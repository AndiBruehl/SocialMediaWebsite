import axiosInstance from "./axiosInstance";

export const loginAuth = async (userInfo, dispatch) => {
  dispatch({ type: "LOGIN_START" });
  try {
    const res = await axiosInstance.post("/auth/login", userInfo);
    dispatch({ type: "LOGIN_SUCCESS", payload: res.data.userData });
  } catch (error) {
    dispatch({ type: "LOGIN_FAILURE", payload: error });
  }
};
