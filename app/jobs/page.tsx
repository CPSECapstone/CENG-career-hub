"use client";
import Navbar from "@/components/navbar/navbar";
import SearchBar from "@/components/search-bar/search-bar";
import { useState } from "react";
import { ChevronDown } from "lucide-react";

const sortOptions = [
  "Latest",
  "Oldest",
  "Event date: soonest",
  "Event date: latest",
  "Name: A-Z",
] as const;

export default function Jobs() {
  const [sortOpen, setSortOpen] = useState(false);
  const [sortBy, setSortBy] = useState<(typeof sortOptions)[number]>("Latest");
  const [page, setPage] = useState(1);

  return (
    <div>
      <div className="cover-photo">
        <Navbar />
        <div className="page-header">
          <h1>Jobs</h1>
        </div>
        <div className="flex justify-center">
          <SearchBar />
        </div>
      </div>
      {/* filter menu go here */}
      <div>
        <div className="flex items-start justify-between mt-8 ml-2 mr-2 mb-4">
          <p className="text-dark-gray text-md">Showing __ of __ results</p>
          <div className="relative z-1">
            <button
              className="sort-button"
              type="button"
              onClick={() => setSortOpen(!sortOpen)}
            >
              Sort by {sortBy.toLowerCase()}
              <ChevronDown size={17} />
            </button>
            {sortOpen && (
            <div className="sort-menu">
              {sortOptions.map((option) => (
                <button
                  key={option}
                  className={sortBy === option ? "selected" : ""}
                  type="button"
                  onClick={() => {
                    setSortBy(option);
                    setSortOpen(false);
                    setPage(1);
                  }}
                >
                  {option}
                </button>
              ))}
            </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
