import React, { useRef } from "react";

const Header = ({ setSearchKey, fetchMovies }) => {
  const searchInputRef = useRef(null);

  const handleSearch = (event) => {
    event.preventDefault();
    fetchMovies();
  };

  const handleShortcut = (event) => {
    if (event.ctrlKey && event.key === "k") {
      event.preventDefault();
      searchInputRef.current.focus();
    }
  };

  return (
    <header className="center-max-size header">
      <h2>cTrailers</h2>
      <form className="form" onSubmit={handleSearch}>
        <input
          ref={searchInputRef}
          className="search"
          placeholder="Search your Movie"
          type="text"
          id="search"
          onInput={(event) => setSearchKey(event.target.value)}
        />
        <button className="submit-search button" type="submit">
          Search
        </button>
      </form>
    </header>
  );
};

export default Header;
