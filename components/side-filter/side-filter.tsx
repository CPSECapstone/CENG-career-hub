"use client";

import { Search } from "lucide-react";
import { useState } from "react";
import "./side-filter.css";

export type FilterOption = {
  label: string;
  count: number;
};

export type SidebarFilters = {
  query: string;
  location: string;
  majors: string[];
  categories: string[];
  datePosted: string;
};

type SideFilterProps = {
  page: "events" | "jobs";
  locations: string[];
  majors: FilterOption[];
  categories: FilterOption[];
  datePostedOptions: FilterOption[];
  filters: SidebarFilters;
  onChange: (filters: SidebarFilters) => void;
};

type FilterListProps = {
  options: FilterOption[];
  selected: string[];
  onToggle: (label: string) => void;
};

function FilterList({
  options,
  selected,
  onToggle,
}: FilterListProps) {
  if (options.length === 0) {
    return <p>No options available yet.</p>;
  }

  return (
    <div className="side-filter-options">
      {options.map(({ label, count }) => (
        <label key={label}>
          <input
            type="checkbox"
            checked={selected.includes(label)}
            onChange={() => onToggle(label)}
          />

          <span className="side-filter-checkbox" />
          <span>{label}</span>
          <b>{count}</b>
        </label>
      ))}
    </div>
  );
}

export default function SideFilter({
  page,
  locations,
  majors,
  categories,
  datePostedOptions,
  filters,
  onChange,
}: SideFilterProps) {
  const [showAllMajors, setShowAllMajors] = useState(false);

  const isEvents = page === "events";

  const updateFilters = (changes: Partial<SidebarFilters>) => {
    onChange({
      ...filters,
      ...changes,
    });
  };

  const toggleOption = (
    field: "majors" | "categories",
    label: string,
  ) => {
    const current = filters[field];

    const updated = current.includes(label)
      ? current.filter((item) => item !== label)
      : [...current, label];

    updateFilters({ [field]: updated });
  };

  const clearFilters = () => {
    onChange({
      query: "",
      location: "",
      majors: [],
      categories: [],
      datePosted: "All",
    });
  };

  const hasFilters =
    filters.query ||
    filters.location ||
    filters.majors.length > 0 ||
    filters.categories.length > 0 ||
    filters.datePosted !== "All";

  return (
    <aside className="side-filter">
      <section>
        <h2>
          {isEvents ? "Search by Event" : "Search by Job Title"}
        </h2>

        <label className="side-filter-input">
          <Search aria-hidden="true" size={16} />

          <input
            value={filters.query}
            onChange={(event) =>
              updateFilters({ query: event.target.value })
            }
            placeholder={
              isEvents ? "Event title" : "Job title"
            }
            aria-label={
              isEvents ? "Event title" : "Job title"
            }
          />
        </label>
      </section>

      <section>
        <h2>Location</h2>

        <select
          className="side-filter-location"
          value={filters.location}
          onChange={(event) =>
            updateFilters({ location: event.target.value })
          }
          aria-label="Choose location"
        >
          <option value="">All locations</option>

          {locations.map((location) => (
            <option key={location} value={location}>
              {location}
            </option>
          ))}
        </select>
      </section>

      <section>
        <h2>Major</h2>

        <FilterList
          options={showAllMajors ? majors : majors.slice(0, 5)}
          selected={filters.majors}
          onToggle={(label) => toggleOption("majors", label)}
        />

        {majors.length > 5 && (
          <button
            className="side-filter-show-more"
            type="button"
            onClick={() => setShowAllMajors((current) => !current)}
          >
            {showAllMajors ? "Show Less" : "Show More"}
          </button>
        )}
      </section>

      <section>
        <h2>{isEvents ? "Opportunity Type" : "Job Type"}</h2>

        <FilterList
          options={categories}
          selected={filters.categories}
          onToggle={(label) => toggleOption("categories", label)}
        />
      </section>

      <section>
        <h2>Date Posted</h2>

        <div className="side-filter-options">
          {datePostedOptions.map(({ label, count }) => (
            <label key={label}>
              <input
                type="radio"
                name={`date-posted-${page}`}
                checked={filters.datePosted === label}
                onChange={() => updateFilters({ datePosted: label })}
              />

              <span className="side-filter-checkbox" />
              <span>{label}</span>
              <b>{count}</b>
            </label>
          ))}
        </div>
      </section>

      {hasFilters && (
        <button
          className="side-filter-show-more"
          type="button"
          onClick={clearFilters}
        >
          Clear sidebar filters
        </button>
      )}
    </aside>
  );
}
