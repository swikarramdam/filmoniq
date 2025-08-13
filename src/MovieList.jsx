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
    <div className="mt-6 grid gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
      {movies.map((movie) => (
        <div
          key={movie.id}
          className="rounded-lg bg-[#1E1E1E] border border-[#333333] p-4 shadow-md hover:shadow-lg hover:scale-[1.02] transition-all duration-200"
        >
          <h3 className="mb-3 text-lg font-semibold text-white">
            {movie.title}
          </h3>

          <div className="flex flex-wrap gap-2 mb-4">
            {mood.map((genre) => (
              <span
                key={genre}
                className="bg-[#E50000] text-white text-xs font-medium px-2 py-1 rounded-full"
              >
                {genre.charAt(0).toUpperCase() + genre.slice(1)}
              </span>
            ))}
          </div>

          {movie.poster_path ? (
            <img
              src={`https://image.tmdb.org/t/p/w300${movie.poster_path}`}
              alt={movie.title}
              className="mb-3 rounded-lg shadow-lg w-full h-[350px] object-cover"
            />
          ) : (
            <p className="mb-3 italic text-gray-400">No image available</p>
          )}

          <p className="mb-2 font-medium text-white">
            Rating: {movie.vote_average.toFixed(1)} ⭐
          </p>

          <p className="mb-4 italic text-white line-clamp-5">
            {movie.overview}
          </p>

          <button
            onClick={() => saveToMyList(movie)}
            className={`mt-3 w-full rounded-lg px-4 py-2 text-white transition-all duration-200 ${
              savedIds.includes(movie.id)
                ? "bg-gray-600 cursor-not-allowed"
                : "bg-[#E50000] hover:bg-[#FF1A1A]"
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
