import { Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar/Navbar.jsx";
import Pages from "./pages";
import "./index.css";

function App() {
  return (
    <>
      <div className="bg-red-500 text-white p-4">Tailwind funktioniert</div>
      <Navbar />
      <Routes>
        <Route path="/" element={<Pages.Home />} />
        <Route path="/profile" element={<Pages.Profile />} />
      </Routes>
    </>
  );
}

export default App;
