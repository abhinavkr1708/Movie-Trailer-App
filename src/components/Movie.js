import React from "react";

// Movie component receives 'movie' object and 'selectMovie' function as props
const Movie = ({ movie, selectMovie }) => {
  // Base URL for movie poster images
  const IMAGE_PATH = "https://image.tmdb.org/t/p/w342";

  return (
    // Click handler to select the movie
    <div onClick={() => selectMovie(movie)} className={"movie"}>
      <div className="movie-title">
        {/* Render movie poster if available */}
        {movie.poster_path && (
          <img src={IMAGE_PATH + movie.poster_path} alt={movie.title} />
        )}
        <div className={"flex between movie-infos"}>
          {/* Display movie title */}
          <h5 className={"movie-title"}>{movie.title}</h5>
        </div>
      </div>
    </div>
  );
};

export default Movie;
