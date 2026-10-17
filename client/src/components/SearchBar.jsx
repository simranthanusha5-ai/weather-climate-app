import React, { useState } from "react";

// A reusable search input. The parent page decides what to DO
// with the searched city (fetch current weather, forecast, etc.)
const SearchBar = ({ onSearch, defaultValue = "" }) => {
  const [city, setCity] = useState(defaultValue);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!city.trim()) return;
    onSearch(city.trim());
  };

  return (
    <form className="search-bar" onSubmit={handleSubmit}>
      <input
        type="text"
        placeholder="Search location (e.g. Chennai)"
        value={city}
        onChange={(e) => setCity(e.target.value)}
      />
      <button type="submit">Search</button>
    </form>
  );
};

export default SearchBar;
