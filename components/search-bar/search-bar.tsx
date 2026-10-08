"use client";

import { ChevronDown, Search } from "lucide-react";
import { useState } from "react";
import "./search-bar.css";

export type SearchFilters = {
  query: string;
  location: string;
  category: string;
};

type SearchBarProps = {
  locations?: string[];
  categories?: string[];
  onSearch?: (filters: SearchFilters) => void;
};

/** Reusable search bar for job and opportunity listings. */
export default function SearchBar({
  locations = [],
  categories = [],
  onSearch,
}: SearchBarProps) {
  const [query, setQuery] = useState("");
  const [location, setLocation] = useState("");
  const [category, setCategory] = useState("");
  const [openDropdown, setOpenDropdown] = useState<
    "location" | "category" | null
  >(null);

  const selectLocation = (option: string) => {
    setLocation(option);
    setOpenDropdown(null);
  };

  const selectCategory = (option: string) => {
    setCategory(option);
    setOpenDropdown(null);
  };

  const submitSearch = () => {
    onSearch?.({ query, location, category });
  };

  return (
    <div className="search-bar" role="search">
      <input
        value={query}
        onChange={(event) => setQuery(event.target.value)}
        onKeyDown={(event) => {
          if (event.key === "Enter") submitSearch();
        }}
        placeholder="Job Title or Company"
        aria-label="Job title or company"
      />

      <div className="select-control">
        <button
          className="dropdown-trigger"
          type="button"
          onClick={() =>
            setOpenDropdown(
              openDropdown === "location" ? null : "location",
            )
          }
          aria-expanded={openDropdown === "location"}
        >
          {location || "Select Location"}
          <ChevronDown size={17} />
        </button>
        {openDropdown === "location" && (
          <div className="search-dropdown">
            {locations.length ? (
              locations.map((option) => (
                <button
                  key={option}
                  type="button"
                  onClick={() => selectLocation(option)}
                >
                  {option}
                </button>
              ))
            ) : (
              <p>Locations will appear here.</p>
            )}
          </div>
        )}
      </div>

      <div className="select-control">
        <button
          className="dropdown-trigger"
          type="button"
          onClick={() =>
            setOpenDropdown(
              openDropdown === "category" ? null : "category",
            )
          }
          aria-expanded={openDropdown === "category"}
        >
          {category || "Select Category"}
          <ChevronDown size={17} />
        </button>
        {openDropdown === "category" && (
          <div className="search-dropdown major-dropdown">
            {categories.length ? (
              categories.map((option) => (
                <button
                  key={option}
                  type="button"
                  onClick={() => selectCategory(option)}
                >
                  {option}
                </button>
              ))
            ) : (
              <p>Categories will appear here.</p>
            )}
          </div>
        )}
      </div>

      <button className="search-button" type="button" onClick={submitSearch}>
        <Search size={16} /> Search
      </button>
    </div>
  );
}
