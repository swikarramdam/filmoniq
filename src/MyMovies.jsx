import React, { useEffect, useState } from "react";
const STORAGE_KEY = "myMovies";

const MyMovies = () => {
  const [movies, setMovies] = useState([]);
  useEffect(() => {
    const stored = JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");
    setMovies(stored);
  }, []);
  const [selectedMovie, setSelectedMovie] = useState(null);

  const removeFromMyList = (id) => {
    const updated = movies.filter((movie) => movie.id !== id);
    setMovies(updated);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  };

  if (movies.length === 0) {
    return (
      <div className="mx-auto max-w-6xl w-full p-4 sm:p-6">
        <h1 className="text-xl font-bold">My Movies</h1>
        <p className="text-gray-600 mt-2">No Movies saved yet</p>
      </div>
    );
  }
  return (
    <div className="mx-auto max-w-6xl p-4 sm:p-6">
      <h1 className="text-xl font-bold">My Movies</h1>
      <div className="mt-6 grid gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
        {movies.map((movie) => (
          <div
            key={movie.id}
            onClick={() => setSelectedMovie(movie)}
            className="rounded-lg bg-[#1E1E1E] border border-[#333333] p-4 shadow-md hover:shadow-lg hover:scale-[1.02] transition-all duration-200 min-h-[600px] flex flex-col"
          >
            <h3 className="mb-3 text-lg font-semibold text-white">
              {movie.title}
            </h3>
            {movie.poster_path && (
              <img
                src={`https://image.tmdb.org/t/p/w300${movie.poster_path}`}
                alt={movie.title}
                className="mb-3 rounded-lg shadow-lg w-full h-[350px] object-cover"
              />
            )}
            <p className="mb-2 font-medium text-white">
              Rating: {movie.vote_average.toFixed(1)} ⭐
            </p>
            <p className="mb-4 italic text-white line-clamp-5">
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
      {selectedMovie && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-70"
          onClick={() => setSelectedMovie(null)} // click outside closes modal
        >
          <div
            className="bg-[#141414] text-white rounded-lg p-6 max-w-3xl w-full overflow-y-auto relative flex gap-6"
            onClick={(e) => e.stopPropagation()} // prevent closing when clicking inside
          >
            {/* Left: Poster */}
            {selectedMovie.poster_path && (
              <img
                src={`https://image.tmdb.org/t/p/w500${selectedMovie.poster_path}`}
                alt={selectedMovie.title}
                className="rounded-lg w-1/3 h-auto object-cover"
              />
            )}

            {/* Right: Details */}
            <div className="flex-1 flex flex-col">
              {/* Close button */}
              <button
                onClick={() => setSelectedMovie(null)}
                className="absolute top-2 right-2 text-red-500 text-2xl"
              >
                ×
              </button>

              <h2 className="text-3xl font-bold mb-4">{selectedMovie.title}</h2>
              <p className="mb-2 font-medium">
                Rating: {selectedMovie.vote_average.toFixed(1)} ⭐
              </p>
              <p className="text-gray-300 mb-4">{selectedMovie.overview}</p>

              {/* Remove button */}
              <button
                onClick={() => {
                  removeFromMyList(selectedMovie.id);
                  setSelectedMovie(null); // close modal after remove
                }}
                className="w-full rounded-lg px-4 py-2 bg-red-600 hover:bg-red-700 text-white transition-all duration-200"
              >
                Remove
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MyMovies;
