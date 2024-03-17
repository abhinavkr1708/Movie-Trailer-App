// Importing necessary modules and components
import { useEffect, useState, useRef } from "react";
import "./App.css";
import axios from "axios";
import Movie from "./components/Movie";
import Youtube from "react-youtube";

function App() {
  // API endpoints and keys
  const MOVIE_API = "https://api.themoviedb.org/3/";
  const SEARCH_API = MOVIE_API + "search/movie";
  const DISCOVER_API = MOVIE_API + "discover/movie";
  const API_KEY = "9c90e39fe1f42ec6da54ddbf23fc7caf";

  // References and state variables
  const searchInputRef = useRef(null); // Reference for the search input field
  const [playing, setPlaying] = useState(false); // State for tracking if trailer is playing
  const [trailer, setTrailer] = useState(null); // State for storing current trailer
  const [movies, setMovies] = useState([]); // State for storing fetched movies
  const [searchKey, setSearchKey] = useState(""); // State for search query
  const [selectedMovie, setSelectedMovie] = useState(null); // State for selected movie

  // Fetch movies when component mounts
  useEffect(() => {
    fetchMovies();
  }, []);

  // Listen for keyboard shortcut (Ctrl + k) to focus search input
  useEffect(() => {
    const handleShortcut = (event) => {
      if (event.ctrlKey && event.key === "k") {
        event.preventDefault();
        searchInputRef.current.focus();
      }
    };

    document.addEventListener("keydown", handleShortcut);

    return () => {
      document.removeEventListener("keydown", handleShortcut);
    };
  }, []);

  // Function to fetch movies based on search query
  const fetchMovies = async (event) => {
    if (event) {
      event.preventDefault();
    }

    const { data } = await axios.get(
      `${searchKey ? SEARCH_API : DISCOVER_API}`,
      {
        params: {
          api_key: API_KEY,
          query: searchKey,
        },
      }
    );

    // Update state with fetched movies
    setMovies(data.results);
  };

  // Function to fetch additional movie details, including trailer
  const fetchMovie = async (id) => {
    const { data } = await axios.get(`${MOVIE_API}movie/${id}`, {
      params: {
        api_key: API_KEY,
        append_to_response: "videos",
      },
    });

    // Find official trailer and set it as current trailer
    if (data.videos && data.videos.results) {
      const trailer = data.videos.results.find(
        (vid) => vid.name === "Official Trailer"
      );
      setTrailer(trailer ? trailer : data.videos.results[0]);
    }
  };

  // Function to handle selection of a movie
  const selectMovie = async (movie) => {
    await fetchMovie(movie.id);
    setSelectedMovie(movie);
    setPlaying(true); // Start playing trailer
  };

  // Function to render movie components
  const renderMovies = () =>
    movies.map((movie) => (
      <div key={movie.id}>
        <Movie selectMovie={selectMovie} movie={movie} />
        {/* Render trailer if a movie is selected and playing */}
        {selectedMovie && selectedMovie.id === movie.id && playing && (
          <div className="trailer-container">
            <div className="trailer-wrapper">
              <Youtube
                videoId={trailer ? trailer.key : ""}
                className={"youtube amru"}
                containerClassName={"youtube-container amru"}
                opts={{
                  width: "100%",
                  height: "100%",
                }}
              />
              {/* Button to close the trailer */}
              <button
                onClick={() => setPlaying(false)}
                className={"button close-video"}
              >
                Close
              </button>
            </div>
          </div>
        )}
      </div>
    ));

  return (
    <div className="App">
      {/* Header section */}
      <header className="center-max-size header">
        <h2>cTrailers</h2>
        {/* Search form */}
        <form className="form" onSubmit={fetchMovies}>
          <input
            ref={searchInputRef}
            className="search"
            placeholder="Search your Movie/ctrl+k"
            type="text"
            id="search"
            // Update search key state on input change
            onInput={(event) => setSearchKey(event.target.value)}
          />
          <button
            className="submit-search button"
            type="button"
            onClick={fetchMovies}
          >
            Search
          </button>
        </form>
      </header>
      {/* Render movies if there are any, otherwise display a message */}
      {movies.length ? (
        <main>
          <div className={"center-max-size container"}>{renderMovies()}</div>
        </main>
      ) : (
        "Sorry, no movies found"
      )}
    </div>
  );
}

export default App;
