import { useEffect, useState } from "react";
import { BiSearchAlt } from "react-icons/bi";

const SearchBar = ({ onSearch }) => {
  const [query, setQuery] = useState("");

  // Live-Search
  useEffect(() => {
    if (query.trim() === "") return;

    // 🔍 Instant Search Trigger
    onSearch(query);

    // ✅ Optional: Debounce Variant
    /*
    const timeout = setTimeout(() => {
      onSearch(query);
    }, 300);
    return () => clearTimeout(timeout);
    */
  }, [query, onSearch]);

  return (
    <div className="navbar-center">
      <BiSearchAlt className="search-icon" />
      <input
        type="text"
        placeholder="Search for something..."
        className="search-input"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
      />
    </div>
  );
};

export default SearchBar;
