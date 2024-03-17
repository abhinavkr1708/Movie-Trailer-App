import { useEffect, useState, useRef } from "react";
import "./App.css";
import axios from "axios";
import Movie from "./components/Movie";
import Youtube from "react-youtube";

function App() {
  const MOVIE_API = "https://api.themoviedb.org/3/";
  const SEARCH_API = MOVIE_API + "search/movie";
  const DISCOVER_API = MOVIE_API + "discover/movie";
  const API_KEY = "9c90e39fe1f42ec6da54ddbf23fc7caf";

  const searchInputRef = useRef(null);

  const [playing, setPlaying] = useState(false);
  const [trailer, setTrailer] = useState(null);
  const [movies, setMovies] = useState([]);
  const [searchKey, setSearchKey] = useState("");
  const [selectedMovie, setSelectedMovie] = useState(null);

  useEffect(() => {
    fetchMovies();
  }, []);

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

    console.log(data.results[0]);
    setMovies(data.results);
  };

  const fetchMovie = async (id) => {
    const { data } = await axios.get(`${MOVIE_API}movie/${id}`, {
      params: {
        api_key: API_KEY,
        append_to_response: "videos",
      },
    });

    if (data.videos && data.videos.results) {
      const trailer = data.videos.results.find(
        (vid) => vid.name === "Official Trailer"
      );
      setTrailer(trailer ? trailer : data.videos.results[0]);
    }
  };

  const selectMovie = async (movie) => {
    await fetchMovie(movie.id);
    setSelectedMovie(movie);
    setPlaying(true);
  };

  const renderMovies = () =>
    movies.map((movie) => (
      <div key={movie.id}>
        <Movie selectMovie={selectMovie} movie={movie} />
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
      <header className="center-max-size header">
        <h2>cTrailers</h2>
        <form className="form" onSubmit={fetchMovies}>
          <input
            ref={searchInputRef}
            className="search"
            placeholder="Search your Movie/ctrl+k"
            type="text"
            id="search"
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
