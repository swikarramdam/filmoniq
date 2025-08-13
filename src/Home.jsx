import React from "react";
import PromptInput from "./PromptInput";
import MoodSelector from "./MoodSelector";
const Home = () => {
  return (
    <div>
      {/* <PromptInput
        prompt={transcript} // ⬅️ controlled input from App.jsx
        setPrompt={setTranscript} // ⬅️ updates lifted state
      /> */}
      <MoodSelector />
    </div>
  );
};

export default Home;
