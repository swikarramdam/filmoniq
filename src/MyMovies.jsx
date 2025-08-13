import React, { useEffect, useState } from "react";
const STORAGE_KEY = "myMovies";

const MyMovies = () => {
  const [movies, setMovies] = useState([]);
  useEffect(() => {
    const stored = JSON.parse(localStorage.getItem(STORAGE_KEY || "[]"));
    setMovies(stored);
  }, []);

  const removeFromMyList = (id) => {
    const updated = movies.filter((movie) => movie.id !== id);
    setMovies(updated);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  };

  if (movies.length === 0) {
    <div className="p-4">
      <h1 className="text-xl font-bold">My Movies</h1>
      <p className="text-gray-600 mt-2">No Movies saved yet</p>
    </div>;
  }
  return (
    <div className="p-4">
      <h1 className="text-xl font-bold">My Movies</h1>
      <div className="grid gap-6 sm:grid-cols-2 md:grid-cols-3">
        {movies.map((movie) => (
          <div
            key={movie.id}
            className="rounded-lg border border-gray-300 p-4 shadow-sm"
          >
            <h3 className="mb-2 text-lg font-semibold">{movie.title}</h3>
            {movie.poster_path && (
              <img
                src={`https://image.tmdb.org/t/p/w200${movie.poster_path}`}
                alt={movie.title}
                className="mb-3 rounded-lg"
              />
            )}
            <p className="italic text-gray-700 line-clamp-5">
              {movie.overview}
            </p>
            <button
              onClick={() => removeFromMyList(movie.id)}
              className="mt-3 w-full rounded-lg bg-red-600 px-4 py-2 text-white hover:bg-red-700"
            >
              Remove
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MyMovies;
