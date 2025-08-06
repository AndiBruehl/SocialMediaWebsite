import React, { useContext } from "react";
import { Navigate } from "react-router-dom";
import { AuthContext } from "./context/AuthContext";

const ProtectedRoute = ({ children }) => {
  const { user, isFetching } = useContext(AuthContext); // hole `user` und `isFetching`

  // Falls die Authentifizierung noch läuft (isFetching = true), rendere null oder ein Ladezeichen
  if (isFetching) {
    return null; // Ladebildschirm oder nichts anzeigen, während die Authentifizierung läuft
  }

  // Wenn der Benutzer nicht eingeloggt ist, leite ihn zu /signin weiter
  if (!user) {
    return <Navigate to="/signin" />;
  }

  // Wenn der Benutzer eingeloggt ist, rendere die Kinder (geschützte Seite)
  return children;
};

export default ProtectedRoute;
