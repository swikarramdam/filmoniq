import React, { useState, useEffect, useRef } from "react";
import { GoogleGenAI } from "@google/genai";
import MovieList from "./MovieList";
import PromptInput from "./PromptInput";
import useSpeechRecognition from "./useSpeechRecognition";

const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
const tmdbApiKey = import.meta.env.VITE_TMDB_API_KEY;
const ai = new GoogleGenAI({ apiKey });

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
  "tv-movie": 10770,
  documentary: 99,
  "music-video": 10402,
  foreign: 10769,
  history: 36,
  war: 10752,
  western: 37,
  animation: 16,
  family: 10751,
  music: 10402,
  news: 100,
  reality: 10764,
  talk: 10767,
  soap: 110,
  "game-show": 10763,
  variety: 10766,
};

const MoodSelector = () => {
  const [loading, setLoading] = useState(false);
  const [mood, setMood] = useState([]);
  const [error, setError] = useState("");
  const [prompt, setPrompt] = useState("");
  const [movies, setMovies] = useState([]);

  const {
    transcript,
    setTranscript,
    listening,
    startListening,
    stopListening,
  } = useSpeechRecognition();

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
User input: "${transcript}"
Choose 3 movie genres that match the user's mood.
You can pick from any of these genres: Action, Adventure, Comedy, Drama, Horror, Romance, Thriller, Sci-Fi, Fantasy, Mystery, Documentary, Animation, Family, History, War, Western, Music, TV-Movie, News, Reality, Talk, Soap, Game-Show, Variety, Foreign, Music-Video.
Respond ONLY with a comma-separated list of 3 genres from this list.
No explanation, just the list.
Example: Comedy, Romance, Drama
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
    <div className="mx-auto max-w-6xl w-full p-4 sm:p-6">
      <PromptInput
        prompt={transcript}
        setPrompt={setTranscript}
        listening={listening}
        startListening={startListening}
        stopListening={stopListening}
      />

      <br />

      <div className="mt-2">
        <button
          onClick={fetchData}
          disabled={loading || !transcript.trim()}
          className="w-full rounded-lg bg-[#E50000] px-5 py-2 text-white 
            hover:bg-[#FF1A1A] transition-all duration-200 font-bold"
        >
          {loading ? "Recommending..." : "Recommend"}
        </button>
      </div>

      {error && <p className="mt-2 text-sm text-red-600">{error}</p>}
      {mood.length > 0 && (
        <div className="mt-6 flex flex-wrap items-center gap-2">
          <span className="text-white font-semibold text-lg">
            Genres detected:
          </span>
          {mood.map((genre) => (
            <span
              key={genre}
              className="bg-[#E50000] text-white text-sm font-medium px-3 py-1 rounded-full"
            >
              {genre.charAt(0).toUpperCase() + genre.slice(1)}
            </span>
          ))}
        </div>
      )}

      <MovieList movies={movies} mood={mood} />
    </div>
  );
};

export default MoodSelector;
