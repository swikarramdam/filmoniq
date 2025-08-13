import { useState } from "react";
import MoodSelector from "./MoodSelector";
import Home from "./Home";
import MyMovies from "./MyMovies";
// const [transcript, setTranscript] = useState("");

import "./index.css";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  NavLink, // <-- import this
  Navigate,
} from "react-router-dom";

function App() {
  return (
    <Router>
      <div>
        {/* Navbar */}
        <nav className="bg-gray-800 p-4">
          <ul className="flex gap-6 text-white">
            <li>
              <NavLink
                to="/"
                className={({ isActive }) =>
                  isActive ? "font-bold underline" : ""
                }
              >
                Home
              </NavLink>
            </li>
            <li>
              <NavLink
                to="/mymovies"
                className={({ isActive }) =>
                  isActive ? "font-bold underline" : ""
                }
              >
                MyMovies
              </NavLink>
            </li>
          </ul>
        </nav>

        {/* Routes */}
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/mymovies" element={<MyMovies />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
