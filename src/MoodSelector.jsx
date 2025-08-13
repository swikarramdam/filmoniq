import React, { useState, useEffect, useRef } from "react"; //  Added useEffect & useRef for mic setup
import { GoogleGenAI } from "@google/genai";
// import { MicrophoneIcon, MicrophoneSlashIcon } from "@heroicons/react/24/solid";

const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
const tmdbApiKey = import.meta.env.VITE_TMDB_API_KEY;
const ai = new GoogleGenAI({ apiKey });

// Map TMDB genre names to IDs
const genreMap = {
  action: 28,
  adventure: 12,
  comedy: 35,
  drama: 18,
  horror: 27,
  romance: 10749,
  thriller: 53,
  "sci-fi": 878,
  fantasy: 14,
  mystery: 9648,
};

const MoodSelector = () => {
  const [loading, setLoading] = useState(false);
  const [mood, setMood] = useState([]);
  const [error, setError] = useState("");
  const [prompt, setPrompt] = useState("");
  const [movies, setMovies] = useState([]);
  const [listening, setListening] = useState(false);
  const recognitionRef = useRef(null);

  // 🆕 Setup speech recognition when component mounts
  useEffect(() => {
    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;

    if (!SpeechRecognition) {
      console.warn("The browser doesn't support speech recognition");
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.lang = "en-US";
    recognition.interimResults = true;
    recognition.continuous = true; // keep it open

    recognition.onresult = (event) => {
      let transcript = "";
      for (let i = event.resultIndex; i < event.results.length; i++) {
        transcript += event.results[i][0].transcript;
      }
      setPrompt(transcript);
    };

    recognition.onerror = (event) => {
      console.error("Speech recognition error:", event.error);
      if (
        event.error === "not-allowed" ||
        event.error === "service-not-allowed"
      ) {
        setListening(false);
      }
    };

    recognition.onend = () => {
      if (listening) {
        try {
          recognition.start();
          listening;
        } catch (e) {
          console.error("Failed to restart recognition:", e);
        }
      }
    };

    recognitionRef.current = recognition;

    if (listening) {
      recognition.start();
    }

    return () => {
      recognition.stop();
    };
  }, [listening]);

  const startListening = () => {
    setListening(true);
  };

  const stopListening = () => {
    setListening(false);
  };

  const fetchMoviesByGenres = async (genres) => {
    const genreIds = genres.map((g) => genreMap[g]).filter(Boolean);
    if (genreIds.length === 0) throw new Error("No valid genres found");

    const url = `https://api.themoviedb.org/3/discover/movie?api_key=${tmdbApiKey}&with_genres=${genreIds.join(
      ","
    )}&language=en-US&sort_by=popularity.desc&page=1`;

    const res = await fetch(url);
    if (!res.ok) throw new Error("Failed to fetch movies from TMDB");
    const data = await res.json();
    return data.results;
  };

  const fetchData = async () => {
    setError("");
    setMovies([]);
    setMood([]);
    try {
      setLoading(true);

      const moodPrompt = `
User input: "${prompt}"
Respond ONLY with a comma-separated list of 3 genres (from: Action, Comedy, Drama, Horror, Romance, Thriller, Sci-Fi, Adventure, Fantasy, Mystery).
Example: Comedy, Romance, Drama
No explanation, just the list.
`;

      const response = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: moodPrompt,
      });

      const genreList = response.text
        .toLowerCase()
        .split(",")
        .map((g) => g.trim())
        .filter(Boolean);

      setMood(genreList);
      const fetchedMovies = await fetchMoviesByGenres(genreList);
      setMovies(fetchedMovies);
    } catch (error) {
      console.error("Error:", error);
      setError("Failed to load movies. Try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    //   <div className="mx-auto max-w-3xl p-4 sm:p-6">
    // <div className="rounded-2xl border bg-white/70 backdrop-blur shadow-md p-4 sm:p-6">

    <div className="mx-auto max-w-3xl p-4 sm:p-6">
      {/* 🆕 Wrapped textarea + mic button in a flexbox */}
      <div>
        <textarea
          placeholder="Describe your movie genre or preference..."
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          className="w-full h-24 resize-none rounded-xl border border-gray-200 bg-white px-3 py-2 text-sm placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
        />
        {/* 🆕 Mic button to start/stop speech recognition */}
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

      <br />
      <div className="mt-4">
        {/* <button
    onClick={fetchData}
    disabled={loading || !prompt.trim()}
    className="rounded-lg bg-indigo-600 px-5 py-2 text-white 
               hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed"
  >
    {loading ? "Generating..." : "Generate"}
  </button>
  */}
      </div>

      <button
        onClick={fetchData}
        disabled={loading || !prompt.trim()}
        className="rounded-lg bg-indigo-600 px-5 py-2 text-white hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {loading ? "Generating..." : "Generate"}
      </button>

      {error && <p className="mt-2 text-sm text-red-600">{error}</p>}
      {mood.length > 0 && (
        <h2 className="mt-6 text-base font-medium text-gray-700">
          Genres detected:{" "}
          <span className="font-semibold text-gray-900">{mood.join(", ")}</span>
        </h2>
      )}

      <div className="mt-6 grid gap-6 sm:grid-cols-2 md:grid-cols-3">
        {movies.length === 0 && !loading && mood.length > 0 && (
          <p>No movies found for these genres.</p>
        )}
        {movies.map((movie) => (
          <div
            key={movie.id}
            className="rounded-lg border border-gray-300 p-4 shadow-sm hover:shadow-md transition-shadow"
          >
            <h3 className="mb-2 text-lg font-semibold text-gray-900">
              {movie.title}
            </h3>
            {/* <div className="flex flex-wrap gap-2 mb-3">
              {mood.map((genre) => (
                <span
                  key={genre}
                  className="bg-indigo-100 text-indigo-800 text-xs font-medium px-2 py-1 rounded-full"
                >
                  {genre.charAt(0).toUpperCase() + genre.slice(1)}
                </span>
              ))}
            </div> */}
            <div className="flex flex-wrap gap-2 mb-3">
              {mood.map((genre) => (
                <span
                  key={genre}
                  className="bg-indigo-100 text-indigo-800 text-xs font-medium px-2 py-1 rounded-full"
                >
                  {genre.charAt(0).toUpperCase() + genre.slice(1)}
                </span>
              ))}
            </div>
            {movie.poster_path ? (
              <img
                src={`https://image.tmdb.org/t/p/w200${movie.poster_path}`}
                alt={movie.title}
                className="mb-3 rounded-lg shadow-md"
              />
            ) : (
              <p mb-3 italic text-gray-500>
                No image available
              </p>
            )}
            <p className="mb-1 font-medium text-yellow-600">
              Rating: {movie.vote_average} ⭐
            </p>
            <p className="italic text-gray-700">{movie.overview}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MoodSelector;
