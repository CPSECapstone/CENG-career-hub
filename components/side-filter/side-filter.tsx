"use client";

import { ChevronDown, MapPin, Search } from "lucide-react";
import { useState } from "react";
import "./side-filter.css";

type FilterOption = {
  label: string;
  count: number;
};

const industries: FilterOption[] = [
  { label: "Mechanical Engineering", count: 10 },
  { label: "Electrical Engineering", count: 10 },
  { label: "Computer Science", count: 10 },
  { label: "Aerospace Engineering", count: 10 },
  { label: "Computer Engineering", count: 10 },
  { label: "Civil Engineering", count: 10 },
  { label: "Industrial Engineering", count: 10 },
];

const datePosted: FilterOption[] = [
  { label: "All", count: 10 },
  { label: "Last Hour", count: 10 },
  { label: "Last 24 Hours", count: 10 },
  { label: "Last 7 Days", count: 10 },
  { label: "Last 30 Days", count: 10 },
];

const campusOptions: FilterOption[] = [
  { label: "On Campus", count: 10 },
  { label: "Off Campus", count: 10 },
];

function FilterList({ options }: { options: FilterOption[] }) {
  const [selected, setSelected] = useState<string[]>([]);

  const toggleOption = (label: string) => {
    setSelected((current) =>
      current.includes(label)
        ? current.filter((option) => option !== label)
        : [...current, label],
    );
  };

  return (
    <div className="side-filter-options">
      {options.map(({ label, count }) => (
        <label key={label}>
          <input
            type="checkbox"
            checked={selected.includes(label)}
            onChange={() => toggleOption(label)}
          />
          <span className="side-filter-checkbox" />
          <span>{label}</span>
          <b>
            {count}
          </b>
        </label>
      ))}
    </div>
  );
}

function CampusFilter() {
  const [selectedCampus, setSelectedCampus] = useState("");

  return (
    <div className="side-filter-options">
      {campusOptions.map(({ label, count }) => (
        <label key={label}>
          <input
            type="radio"
            name="campus"
            checked={selectedCampus === label}
            onChange={() => setSelectedCampus(label)}
          />
          <span className="side-filter-checkbox" />
          <span>{label}</span>
          <b>{count}</b>
        </label>
      ))}
    </div>
  );
}

/** Reusable filter sidebar for job and event listings. */
export default function SideFilter() {
  const [query, setQuery] = useState("");
  const [city, setCity] = useState("Choose city");
  const [showAllIndustries, setShowAllIndustries] = useState(false);

  return (
    <aside className="side-filter">
      <section>
        <h2>Search by Club</h2>
        <label className="side-filter-input">
          <Search aria-hidden="true" size={34} strokeWidth={2.25} />
          <input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search company name"
            aria-label="Search company name"
          />
        </label>
      </section>

      <section>
        <h2>Location</h2>
        <button
          className="side-filter-location"
          type="button"
          onClick={() => setCity(city === "Choose city" ? "San Luis Obispo" : "Choose city")}
          aria-label="Choose city"
        >
          <MapPin aria-hidden="true" size={36} strokeWidth={2.25} />
          <span>{city}</span>
          <ChevronDown className="ml-auto" aria-hidden="true" size={31} strokeWidth={2.5} />
        </button>
      </section>

      <section>
        <h2>Campus</h2>
        <CampusFilter />
      </section>

      <section>
        <h2>Industry</h2>
        <FilterList options={showAllIndustries ? industries : industries.slice(0, 5)} />
        <button
          className="side-filter-show-more"
          type="button"
          onClick={() => setShowAllIndustries((current) => !current)}
        >
          {showAllIndustries ? "Show Less" : "Show More"}
        </button>
      </section>

      <section>
        <h2>Date Posted</h2>
        <FilterList options={datePosted} />
      </section>
    </aside>
  );
}
