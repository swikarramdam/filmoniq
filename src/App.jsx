import { useState } from "react";
import PlaylistDisplay from "./PlaylistDisplay";
import MoodSelector from "./MoodSelector";
import Home from "./Home";
function App() {
  const [count, setCount] = useState(0);

  return (
    <>
      <h1>Hi</h1>
      {/* <Home /> */}
      <MoodSelector />
    </>
  );
}

export default App;
