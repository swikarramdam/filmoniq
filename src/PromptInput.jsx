import React from "react";

const PromptInput = ({
  prompt,
  setPrompt,
  listening,
  startListening,
  stopListening,
}) => {
  return (
    <div className="flex gap-0 overflow-hidden rounded-xl border border-gray-300">
      <textarea
        placeholder="Describe your movie genre or preference..."
        value={prompt}
        onChange={(e) => setPrompt(e.target.value)}
        className="w-full h-24 resize-none rounded-xl border border-gray-200 bg-white px-3 py-2 text-sm placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
      />
      <button
        onClick={listening ? stopListening : startListening}
        className={` rounded-lg px-3 py-2 text-white 
              ${
                listening
                  ? "bg-red-600 hover:bg-red-700"
                  : "bg-green-600 hover:bg-green-700"
              }`}
      >
        {listening ? "Stop" : "Speak"}
      </button>
    </div>
  );
};

export default PromptInput;
