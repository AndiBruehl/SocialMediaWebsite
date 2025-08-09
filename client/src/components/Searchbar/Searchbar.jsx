// src/components/SearchBar/SearchBar.jsx
import { useEffect, useMemo, useRef, useState } from "react";
import { BiSearchAlt } from "react-icons/bi";

/**
 * SearchBar Component
 *
 * Props:
 * - onSearch: function(query: string) => void  (required)
 * - delay: number (optional, default 300ms) - debounce time
 * - minLength: number (optional, default 1) - minimum characters before triggering search
 * - placeholder: string (optional)
 * - className: string (optional)
 */
export default function SearchBar({
  onSearch,
  delay = 300,
  minLength = 1,
  placeholder = "Search for something...",
  className = "",
}) {
  const [query, setQuery] = useState("");
  const timer = useRef(null);

  const safeOnSearch = useMemo(() => onSearch || (() => {}), [onSearch]);

  // Debounced live search
  useEffect(() => {
    const q = query.trim();

    if (timer.current) clearTimeout(timer.current);

    if (q === "") {
      safeOnSearch("");
      return;
    }
    if (q.length < minLength) return;

    timer.current = setTimeout(() => {
      safeOnSearch(q);
    }, Math.max(0, delay));

    return () => timer.current && clearTimeout(timer.current);
  }, [query, delay, minLength, safeOnSearch]);

  // Enter = sofort suchen
  const handleSubmit = (e) => {
    e.preventDefault();
    const q = query.trim();
    if (!q || q.length < minLength) {
      safeOnSearch("");
      return;
    }
    safeOnSearch(q);
  };

  const handleClear = () => {
    setQuery("");
    safeOnSearch("");
  };

  return (
    <form
      onSubmit={handleSubmit}
      className={`navbar-center ${className}`}
      role="search"
    >
      <div className="relative w-full">
        <BiSearchAlt
          className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"
          aria-hidden="true"
        />
        <input
          type="search"
          placeholder={placeholder}
          className="w-full pl-12 pr-8 border rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          aria-label="Search"
        />

        {query && (
          <button
            type="button"
            onClick={handleClear}
            aria-label="Clear search"
            title="Clear"
            className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-300 hover:text-gray-100"
          >
            ×
          </button>
        )}
      </div>
    </form>
  );
}
