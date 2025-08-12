import React, { useState } from "react";
import { GoogleGenAI } from "@google/genai";

const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
const tmdbApiKey = import.meta.env.VITE_TMDB_API_KEY;

const ai = new GoogleGenAI({ apiKey });

// Map mood adjectives to TMDB genre IDs
const moodToGenre = {
  happy: 35, // Comedy
  sad: 18, // Drama
  action: 28, // Action
  scary: 27, // Horror
  chill: 10749, // Romance (cool chill vibes)
  // Add more moods and genres as you want
};

const MoodSelector = () => {
  const [loading, setLoading] = useState(false);
  const [mood, setMood] = useState("");
  const [error, setError] = useState("");
  const [prompt, setPrompt] = useState("");
  const [movies, setMovies] = useState([]);

  // Fetch movies from TMDB based on mood (genre)
  const fetchMoviesByMood = async (moodTag) => {
    const genreId = moodToGenre[moodTag.toLowerCase()] || 35; // default to Comedy
    const url = `https://api.themoviedb.org/3/discover/movie?api_key=${tmdbApiKey}&with_genres=${genreId}&language=en-US&sort_by=popularity.desc&page=1`;

    const res = await fetch(url);
    if (!res.ok) throw new Error("Failed to fetch movies from TMDB");
    const data = await res.json();
    return data.results;
  };

  const fetchData = async () => {
    setError("");
    setMovies([]);
    setMood("");
    try {
      setLoading(true);
      const moodPrompt = `Respond ONLY with one adjective that best describes the user's mood based on this input: "${prompt}".  
No extra words, punctuation, or explanation—just one adjective like: happy
`;
      const response = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: moodPrompt,
      });
      let Mood = response.text
        .replace(/[^a-zA-Z]/g, "")
        .toLowerCase()
        .trim();

      setMood(Mood);

      const fetchedMovies = await fetchMoviesByMood(Mood);
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
      <textarea
        placeholder="Enter your mood here"
        value={prompt}
        onChange={(e) => setPrompt(e.target.value)}
        style={{ width: "100%", height: "80px", padding: "0.5rem" }}
      />
      <br />
      <button onClick={fetchData} disabled={loading || !prompt.trim()}>
        {loading ? "Generating..." : "Generate"}
      </button>

      {error && <p style={{ color: "red" }}>{error}</p>}

      {mood && <h2>Mood detected: {mood}</h2>}

      <div>
        {movies.length === 0 && !loading && mood && (
          <p>No movies found for this mood.</p>
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
