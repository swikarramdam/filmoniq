import { useState } from "react";
import PlaylistDisplay from "./MovieList";
import MoodSelector from "./MoodSelector";
import Home from "./Home";
import "./index.css";

function App() {
  const [count, setCount] = useState(0);

  return (
    <>
      <MoodSelector />
    </>
  );
}

export default App;
