const AuthReducer = (state, action) => {
  switch (action.type) {
    case "LOGIN_START":
      return { ...state, isFetching: true };
    case "LOGIN_SUCCESS":
      return { ...state, isFetching: false, user: action.payload };
    case "LOGIN_FAILURE":
      return { ...state, isFetching: false, error: action.payload };
    case "LOGOUT":
      localStorage.removeItem("user"); // Entferne den Benutzer aus localStorage
      return { ...state, user: null, isFetching: false, error: null };
    default:
      return state;
  }
};

export default AuthReducer;
