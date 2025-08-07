import axiosInstance from "./axiosInstance";

export const loginAuth = async (userInfo, dispatch) => {
  dispatch({ type: "LOGIN_START" });
  try {
    const res = await axiosInstance.post("/auth/login", userInfo);
    const user = res.data.user;

    // Speichern der Benutzerdaten im localStorage
    localStorage.setItem("user", JSON.stringify(user));

    dispatch({ type: "LOGIN_SUCCESS", payload: user }); // Benutzer wird hier gesetzt
  } catch (error) {
    dispatch({ type: "LOGIN_FAILURE", payload: error });
  }
};

export const signupAuth = async (userInfo) => {
  try {
    const res = await axiosInstance.post("/auth/register", userInfo);
    return res.data;
  } catch (error) {
    throw error.response?.data?.message || "Registration failed";
  }
};
