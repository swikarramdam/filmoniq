import React from "react";

const MovieList = ({ movies, mood }) => {
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
        </div>
      ))}
    </div>
  );
};

export default MovieList;
