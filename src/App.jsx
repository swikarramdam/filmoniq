import { useState } from "react";
import PlaylistDisplay from "./PlaylistDisplay";
import MoodSelector from "./MoodSelector";
import Home from "./Home";
function App() {
  const [count, setCount] = useState(0);

  return (
    <>
      <MoodSelector />
    </>
  );
}

export default App;
