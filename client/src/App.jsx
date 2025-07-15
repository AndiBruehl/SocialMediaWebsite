import { Routes, Route } from "react-router-dom";
import Pages from "./pages";
import MainLayout from "./layout/MainLayout.jsx"; // Neu!

function App() {
  return (
    <Routes>
      {/* Layout mit Navbar + Sidebar */}
      <Route element={<MainLayout />}>
        <Route path="/" element={<Pages.Home />} />
        <Route path="/profile/:userId" element={<Pages.Profile />} />
        <Route path="/profile/:userId/edit" element={<Pages.ProfileEdit />} />
      </Route>

      {/* Login/Register ohne Layout */}
      <Route path="/signin" element={<Pages.SignIn />} />
      <Route path="/signup" element={<Pages.SignUp />} />
    </Routes>
  );
}

export default App;
