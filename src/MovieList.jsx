import React, { useEffect, useState } from "react";
const STORAGE_KEY = "myMovies";
const MovieList = ({ movies, mood }) => {
  const [savedIds, setSavedIds] = useState([]);

  useEffect(() => {
    const stored = JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");
    setSavedIds(stored.map((movie) => movie.id));
  }, []);

  function saveToMyList(movie) {
    let current = JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");
    if (!Array.isArray(current)) {
      current = []; // just in case something corrupts the data
    }
    if (current.some((m) => m.id === movie.id)) {
      return;
    }
    const minimal = {
      id: movie.id,
      title: movie.title,
      overview: movie.overview,
      poster_path: movie.poster_path,
      vote_average: movie.vote_average,
    };

    localStorage.setItem(STORAGE_KEY, JSON.stringify([...current, minimal]));
    setSavedIds([...savedIds, movie.id]);
  }

  if (!movies || movies.length === 0) {
    return mood.length > 0 ? <p>No movies found for these genres.</p> : null;
  }

  return (
    <div className="mt-6 grid gap-6 sm:grid-cols-2 md:grid-cols-3">
      {movies.map((movie) => (
        <div
          key={movie.id}
          className="rounded-lg border border-gray-300 p-4 shadow-sm hover:shadow-lg hover:scale-[1.02] transition-all duration-200"
        >
          <h3 className="mb-2 text-lg font-semibold text-gray-900">
            {movie.title}
          </h3>
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
            Rating: {movie.vote_average.toFixed(1)} ⭐
          </p>

          <p className="italic text-gray-700 line-clamp-5">{movie.overview}</p>
          {/* <button
            onClick={() => saveToMyList(movie)}
            className={`mt-3 w-full rounded-lg px-4 py-2 text-white ${
              savedIds.includes(movie.id)
                ? "bg-gray-400 cursor-not-allowed" // ⬅️ already saved
                : "bg-green-600 hover:bg-green-700" // ⬅️ not saved
            }`}
            disabled={savedIds.includes(movie.id)} // ⬅️ disable button if saved
          >
            {savedIds.includes(movie.id) ? "✅ Added" : "➕ Add to My List"}
          </button> */}
          <button
            onClick={() => saveToMyList(movie)}
            className={`mt-3 w-full rounded-lg bg-green-600 px-4 py-2 text-white hover:bg-green-00 ${
              savedIds.includes(movie.id)
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-green-600 hover:bg-green-700"
            }`}
            disabled={savedIds.includes(movie.id)}
          >
            {savedIds.includes(movie.id) ? " ✅ Added" : "Add to my list"}
          </button>
        </div>
      ))}
    </div>
  );
};

export default MovieList;
