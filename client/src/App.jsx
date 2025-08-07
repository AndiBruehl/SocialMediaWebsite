import React, { useContext } from "react";
import { Routes, Route } from "react-router-dom";
import { AuthContext } from "./context/AuthContext";
import Pages from "./pages";
import MainLayout from "./layout/MainLayout";
import ProtectedRoute from "./ProtectedRoute";

function App() {
  const { isFetching } = useContext(AuthContext); // Benutzer und Ladezustand aus dem AuthContext holen

  if (isFetching) {
    return <div>Loading...</div>; // Ladeanzeige, wenn die Authentifizierung noch läuft
  }

  return (
    <Routes>
      {/* Login/Registrierung ohne Layout */}
      <Route path="/signin" element={<Pages.SignIn />} />
      <Route path="/signup" element={<Pages.SignUp />} />

      {/* Geschützte Routen */}
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
        />
      </Route>

      {/* Optional: Fallback-Route */}
      <Route path="*" element={<Pages.NotFound />} />
    </Routes>
  );
}

export default App;
