import { Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar/Navbar.jsx";
import Pages from "./pages";
import "./index.css";

function App() {
  return (
    <div>
      <Navbar />
      <Routes>
        <Route path="/" element={<Pages.Home />} />
        <Route path="/profile" element={<Pages.Profile />} />
      </Routes>
    </div>
  );
}

export default App;
