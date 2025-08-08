import React, { useContext, useEffect } from "react";
import { Routes, Route } from "react-router-dom";
import { AuthContext } from "./context/AuthContext";
import Pages from "./pages";
import MainLayout from "./layout/MainLayout";
import ProtectedRoute from "./ProtectedRoute";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function App() {
  const { isFetching } = useContext(AuthContext);

  // 🚫 Rechtsklick auf Bilder verhindern
  useEffect(() => {
    const handleContextMenu = (e) => {
      if (e.target.tagName === "IMG") {
        e.preventDefault();
      }
    };
    document.addEventListener("contextmenu", handleContextMenu);

    return () => {
      document.removeEventListener("contextmenu", handleContextMenu);
    };
  }, []);

  if (isFetching) return <div>Loading...</div>;

  return (
    <>
      <Routes>
        <Route path="/signin" element={<Pages.SignIn />} />
        <Route path="/signup" element={<Pages.SignUp />} />

        <Route element={<MainLayout />}>
          <Route
            path="/"
            element={
              <ProtectedRoute>
                <Pages.Home />
              </ProtectedRoute>
            }
          />
          <Route
            path="/profile/:userId"
            element={
              <ProtectedRoute>
                <Pages.Profile />
              </ProtectedRoute>
            }
          />
          <Route
            path="/profile/:userId/edit"
            element={
              <ProtectedRoute>
                <Pages.ProfileEdit />
              </ProtectedRoute>
            }
          />{" "}
          <Route
            path="/post/:postId"
            element={
              <ProtectedRoute>
                <Pages.PostDetail />
              </ProtectedRoute>
            }
          />
        </Route>

        <Route path="*" element={<Pages.NotFound />} />
      </Routes>

      <ToastContainer
        position="top-right"
        autoClose={2500}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="dark"
      />
    </>
  );
}

export default App;
