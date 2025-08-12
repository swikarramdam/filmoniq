import React, { useState, useEffect, useRef } from "react"; //  Added useEffect & useRef for mic setup
import { GoogleGenAI } from "@google/genai";

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
    <div style={{ maxWidth: "600px", margin: "auto", padding: "1rem" }}>
      {/* 🆕 Wrapped textarea + mic button in a flexbox */}
      <div style={{ display: "flex", gap: "8px" }}>
        <textarea
          placeholder="Describe your movie genre or preference..."
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          style={{ width: "100%", height: "80px", padding: "0.5rem" }}
        />
        {/* 🆕 Mic button to start/stop speech recognition */}
        <button
          onClick={listening ? stopListening : startListening}
          style={{
            background: listening ? "red" : "green",
            color: "#fff",
            padding: "10px",
            border: "none",
            borderRadius: "8px",
            cursor: "pointer",
          }}
        >
          {listening ? "Stop" : "🎤"}
        </button>
      </div>

      <br />
      <button onClick={fetchData} disabled={loading || !prompt.trim()}>
        {loading ? "Generating..." : "Generate"}
      </button>

      {error && <p style={{ color: "red" }}>{error}</p>}
      {mood.length > 0 && <h2>Genres detected: {mood.join(", ")}</h2>}

      <div>
        {movies.length === 0 && !loading && mood.length > 0 && (
          <p>No movies found for these genres.</p>
        )}
        {movies.map((movie) => (
          <div
            key={movie.id}
            style={{
              borderBottom: "1px solid #ddd",
              marginBottom: "1rem",
              paddingBottom: "1rem",
            }}
          >
            <h3>{movie.title}</h3>
            {movie.poster_path ? (
              <img
                src={`https://image.tmdb.org/t/p/w200${movie.poster_path}`}
                alt={movie.title}
                style={{ borderRadius: "8px" }}
              />
            ) : (
              <p>No image available</p>
            )}
            <p>Rating: {movie.vote_average} ⭐</p>
            <p style={{ fontStyle: "italic" }}>{movie.overview}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MoodSelector;
