"use client";

import { useEffect, useMemo, useState } from "react";
import {
  Bookmark,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Clock3,
  MapPin,
} from "lucide-react";

import Navbar from "@/components/navbar/navbar";
import SearchBar, {
  type SearchFilters,
} from "@/components/search-bar/search-bar";
import SideFilter, {
  type SidebarFilters,
} from "@/components/side-filter/side-filter";
import DetailsOverlay from "@/components/details-overlay/details-overlay";
import { createClient } from "@/lib/supabase/client";

type PageType = "jobs" | "events";

type Opportunity = {
  id: number;
  title: string;
  description: string | null;
  category: string | null;
  deadline: string | null;
  event_date: string | null;
  location: string | null;
  majors: string[] | null;
  major_source: string | null;
  application_url: string | null;
  created_at: string;
};

type SortOption =
  | "Latest"
  | "Oldest"
  | "Date: soonest"
  | "Date: latest"
  | "Name: A-Z";

const listingsPerPage = 10;

const sortOptions: SortOption[] = [
  "Latest",
  "Oldest",
  "Date: soonest",
  "Date: latest",
  "Name: A-Z",
];

const emptySearchFilters: SearchFilters = {
  query: "",
  location: "",
  category: "",
};

const emptySidebarFilters: SidebarFilters = {
  query: "",
  location: "",
  majors: [],
  categories: [],
  datePosted: "All",
};

function formatDate(value: string | null) {
  if (!value) return "date not listed";

  const date = /^\d{4}-\d{2}-\d{2}$/.test(value)
    ? new Date(`${value}T00:00:00`)
    : new Date(value);

  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

function getTodayInCalifornia() {
  const parts = new Intl.DateTimeFormat("en-US", {
    timeZone: "America/Los_Angeles",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).formatToParts(new Date());

  const part = (name: string) =>
    parts.find((item) => item.type === name)?.value || "";

  return `${part("year")}-${part("month")}-${part("day")}`;
}

function isStillVisible(
  opportunity: Opportunity,
  page: PageType,
) {
  const relevantDate =
    page === "jobs"
      ? opportunity.deadline
      : opportunity.event_date;

  if (!relevantDate) return true;

  return relevantDate.slice(0, 10) >= getTodayInCalifornia();
}

function formatCategory(category: string | null) {
  if (!category) return "Other";

  const knownLabels: Record<string, string> = {
    job: "Job",
    internship: "Internship",
    co_op: "Co-Op",
    research: "Research",
    event: "Event",
    recruiting_event: "Recruiting Event",
    club_event: "Club Event",
    scholarship: "Scholarship",
    competition: "Competition",
    other: "Other",
  };

  return (
    knownLabels[category] ||
    category
      .replace(/_/g, " ")
      .replace(/\b\w/g, (letter) => letter.toUpperCase())
  );
}

function getListingDate(
  opportunity: Opportunity,
  page: PageType,
) {
  return page === "jobs"
    ? opportunity.deadline
    : opportunity.event_date;
}

function matchesDatePosted(createdAt: string, filter: string) {
  if (filter === "All") return true;

  const postedAt = new Date(createdAt).getTime();

  if (Number.isNaN(postedAt)) return false;

  const age = Date.now() - postedAt;

  if (age < 0) return false;

  const hour = 60 * 60 * 1000;
  const day = 24 * hour;

  switch (filter) {
    case "Last Hour":
      return age <= hour;
    case "Last 24 Hours":
      return age <= day;
    case "Last 7 Days":
      return age <= 7 * day;
    case "Last 30 Days":
      return age <= 30 * day;
    default:
      return true;
  }
}

function isGenericTitle(title: string | null) {
  const cleaned = (title || "").trim().toLowerCase();

  return (
    !cleaned ||
    cleaned === "email opportunity" ||
    cleaned === "email announcement" ||
    cleaned === "opportunity"
  );
}

function getDisplayTitle(opportunity: Opportunity) {
  const title = opportunity.title?.trim();

  if (!isGenericTitle(title)) {
    return title;
  }

  const description = opportunity.description?.trim();

  if (!description) {
    return "Opportunity details unavailable";
  }

  // Take the first sentence or line as a possible descriptive title.
  const firstPart = description
    .replace(/\[image:[^\]]*\]/gi, "")
    .trim()
    .split(/\n|(?<=[.!?])\s+/)[0]
    .trim();

  if (!firstPart) {
    return "Opportunity details unavailable";
  }

  // Keep long sentences from taking over the card.
  return firstPart.length > 90
    ? `${firstPart.slice(0, 87).trim()}...`
    : firstPart;
}

function isUnrelatedEmail(opportunity: Opportunity) {
  const text =
    `${opportunity.title || ""} ${opportunity.description || ""}`
      .toLowerCase();

  return (
    text.includes("recovery phone was changed") ||
    text.includes("security alert") ||
    text.includes("folder shared with you")
  );
}

export default function OpportunityListings({
  page,
}: {
  page: PageType;
}) {
  const isJobs = page === "jobs";

  const [opportunities, setOpportunities] = useState<Opportunity[]>([]);
  const [loadError, setLoadError] = useState("");
  const [loading, setLoading] = useState(true);

  const [searchFilters, setSearchFilters] =
    useState<SearchFilters>(emptySearchFilters);

  const [sidebarFilters, setSidebarFilters] =
    useState<SidebarFilters>(emptySidebarFilters);

  const [sortBy, setSortBy] = useState<SortOption>("Latest");
  const [sortOpen, setSortOpen] = useState(false);
  const [selected, setSelected] = useState<Opportunity | null>(null);
  const [pageNumber, setPageNumber] = useState(1);

  useEffect(() => {
    let active = true;

    async function loadOpportunities() {
      setLoading(true);
      setLoadError("");

      const supabase = createClient();

      let query = supabase
        .from("opportunities")
        .select(
          "id, title, description, category, deadline, event_date, location, majors, major_source, application_url, created_at",
        )
        .eq("is_active", true);

      if (page === "jobs") {
        query = query.in("category", [
          "job",
          "internship",
          "co_op",
          "research",
        ]);
      } else {
        query = query.or(
          "category.is.null,category.not.in.(job,internship,co_op,research)",
        );
      }

      const { data, error } = await query.order("created_at", {
        ascending: false,
      });

      if (!active) return;

      if (error) {
        console.error(error);
        setLoadError("Couldn't load opportunities right now.");
        setLoading(false);
        return;
      }

      const visible = ((data || []) as Opportunity[]).filter(
        (opportunity) =>
            isStillVisible(opportunity, page) &&
            !isUnrelatedEmail(opportunity),
        );

      setOpportunities(visible);
      setLoading(false);
    }

    loadOpportunities();

    return () => {
      active = false;
    };
  }, [page]);

  /*
   * These lists come from the active, unexpired opportunities
   * currently loaded for this page.
   */
  const availableLocations = useMemo(() => {
    return [
      ...new Set(
        opportunities
          .map((opportunity) => opportunity.location?.trim())
          .filter((location): location is string => Boolean(location)),
      ),
    ].sort((a, b) => a.localeCompare(b));
  }, [opportunities]);

  const availableCategories = useMemo(() => {
    return [
      ...new Set(
        opportunities.map((opportunity) =>
          formatCategory(opportunity.category),
        ),
      ),
    ].sort((a, b) => a.localeCompare(b));
  }, [opportunities]);

  const majorOptions = useMemo(() => {
    const counts = new Map<string, number>();

    opportunities.forEach((opportunity) => {
      const uniqueMajors = new Set(opportunity.majors || []);

      uniqueMajors.forEach((major) => {
        const cleanedMajor = major.trim();

        if (!cleanedMajor) return;

        counts.set(
          cleanedMajor,
          (counts.get(cleanedMajor) || 0) + 1,
        );
      });
    });

    return [...counts.entries()]
      .map(([label, count]) => ({ label, count }))
      .sort((a, b) => a.label.localeCompare(b.label));
  }, [opportunities]);

  const categoryOptions = useMemo(() => {
    const counts = new Map<string, number>();

    opportunities.forEach((opportunity) => {
      const label = formatCategory(opportunity.category);

      counts.set(label, (counts.get(label) || 0) + 1);
    });

    return [...counts.entries()]
      .map(([label, count]) => ({ label, count }))
      .sort((a, b) => a.label.localeCompare(b.label));
  }, [opportunities]);

  const datePostedOptions = useMemo(() => {
    const labels = [
      "All",
      "Last Hour",
      "Last 24 Hours",
      "Last 7 Days",
      "Last 30 Days",
    ];

    return labels
      .map((label) => ({
        label,
        count: opportunities.filter((opportunity) =>
          matchesDatePosted(opportunity.created_at, label),
        ).length,
      }))
      .filter((option) => option.label === "All" || option.count > 0);
  }, [opportunities]);

  const filteredOpportunities = useMemo(() => {
    return opportunities.filter((opportunity) => {
      const title = opportunity.title.toLowerCase();
      const location = opportunity.location || "";
      const category = formatCategory(opportunity.category);
      const majors = opportunity.majors || [];

      const searchQuery = searchFilters.query.trim().toLowerCase();
      const sidebarQuery = sidebarFilters.query.trim().toLowerCase();

      return (
        (!searchQuery || title.includes(searchQuery)) &&
        (!sidebarQuery || title.includes(sidebarQuery)) &&
        (!searchFilters.location ||
          location === searchFilters.location) &&
        (!sidebarFilters.location ||
          location === sidebarFilters.location) &&
        (!searchFilters.category ||
          category === searchFilters.category) &&
        (sidebarFilters.categories.length === 0 ||
          sidebarFilters.categories.includes(category)) &&
        (sidebarFilters.majors.length === 0 ||
          sidebarFilters.majors.some((major) =>
            majors.includes(major),
          )) &&
        matchesDatePosted(
          opportunity.created_at,
          sidebarFilters.datePosted,
        )
      );
    });
  }, [opportunities, searchFilters, sidebarFilters]);

  const sortedOpportunities = useMemo(() => {
    return [...filteredOpportunities].sort((first, second) => {
      if (sortBy === "Name: A-Z") {
        return first.title.localeCompare(second.title);
      }

      if (sortBy === "Oldest") {
        return (
          new Date(first.created_at).getTime() -
          new Date(second.created_at).getTime()
        );
      }

      if (sortBy === "Date: soonest" || sortBy === "Date: latest") {
        const firstDate = getListingDate(first, page);
        const secondDate = getListingDate(second, page);

        // Listings with no relevant date appear last.
        if (!firstDate && !secondDate) return 0;
        if (!firstDate) return 1;
        if (!secondDate) return -1;

        const comparison = firstDate.localeCompare(secondDate);

        return sortBy === "Date: soonest"
          ? comparison
          : -comparison;
      }

      return (
        new Date(second.created_at).getTime() -
        new Date(first.created_at).getTime()
      );
    });
  }, [filteredOpportunities, sortBy, page]);

  const totalPages = Math.max(
    1,
    Math.ceil(sortedOpportunities.length / listingsPerPage),
  );

  const paginatedOpportunities = sortedOpportunities.slice(
    (pageNumber - 1) * listingsPerPage,
    pageNumber * listingsPerPage,
  );

  const pageNumbers = Array.from(
    { length: totalPages },
    (_, index) => index + 1,
  );

  const handleSearch = (filters: SearchFilters) => {
    setSearchFilters(filters);
    setPageNumber(1);
  };

  const handleSidebarChange = (filters: SidebarFilters) => {
    setSidebarFilters(filters);
    setPageNumber(1);
  };

  return (
    <div>
      <div className="cover-photo">
        <Navbar />

        <div className="page-header">
          <h1>{isJobs ? "Jobs" : "Events"}</h1>
        </div>

        <div className="flex justify-center">
          <SearchBar
            locations={availableLocations}
            categories={availableCategories}
            onSearch={handleSearch}
            placeholder={
              isJobs ? "Job Title or Company" : "Club or Event Name"
            }
          />
        </div>
      </div>

      <div className="events-content">
        <SideFilter
          page={page}
          locations={availableLocations}
          majors={majorOptions}
          categories={categoryOptions}
          datePostedOptions={datePostedOptions}
          filters={sidebarFilters}
          onChange={handleSidebarChange}
        />

        <div className="events-results">
          <div className="flex items-start justify-between mt-8 ml-2 mr-2 mb-4">
            <p className="text-dark-gray text-md">
              Showing{" "}
              {sortedOpportunities.length
                ? `${(pageNumber - 1) * listingsPerPage + 1}-${Math.min(
                    pageNumber * listingsPerPage,
                    sortedOpportunities.length,
                  )}`
                : "0"}{" "}
              of {sortedOpportunities.length} results
            </p>

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
                        setPageNumber(1);
                      }}
                    >
                      {option}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          {loading && <p>Loading opportunities...</p>}

          {loadError && (
            <p className="text-gray">{loadError}</p>
          )}

          <div className="cards">
            {paginatedOpportunities.map((opportunity) => {
              const displayedDate =
                page === "jobs"
                  ? opportunity.deadline
                    ? `deadline: ${formatDate(opportunity.deadline)}`
                    : "deadline not listed"
                  : opportunity.event_date
                    ? `event date: ${formatDate(opportunity.event_date)}`
                    : opportunity.deadline
                      ? `deadline: ${formatDate(opportunity.deadline)}`
                      : "date not listed";

              return (
                <article className="card-data" key={opportunity.id}>
                  <button
                    className="bookmark"
                    type="button"
                    aria-label={`Save ${opportunity.title}`}
                  >
                    <Bookmark size={19} />
                  </button>

                  <span className="time-badge">
                    posted {formatDate(opportunity.created_at)}
                  </span>

                  <h2>{getDisplayTitle(opportunity)}</h2>

                  {opportunity.majors &&
                    opportunity.majors.length > 0 && (
                      <p>
                        Majors mentioned:{" "}
                        {opportunity.majors.join(", ")}
                        {" "}(eligibility unconfirmed)
                      </p>
                    )}

                  <div className="card-footer">
                    <div className="footer-info">
                      <span>
                        <Clock3 size={19} />
                        {displayedDate}
                      </span>

                      <span>
                        <MapPin size={19} />
                        {opportunity.location || "location not listed"}
                      </span>
                    </div>

                    <button
                      className="details-button"
                      type="button"
                      onClick={() => setSelected(opportunity)}
                    >
                      {isJobs ? "Job Details" : "Event Details"}
                    </button>
                  </div>
                </article>
              );
            })}

            {!loading &&
              !loadError &&
              sortedOpportunities.length === 0 && (
                <p className="text-dark-gray">
                  No opportunities match those filters.
                </p>
              )}
          </div>

          {selected && (
            <DetailsOverlay
                title={getDisplayTitle(selected)}
                type={selected.category || "other"}
                description={selected.description || "No description was provided."}
                applicationUrl={selected.application_url}
                onClose={() => setSelected(null)}
            />
            )}

          <nav className="pagination mb-4" aria-label="Pagination">
            {pageNumber > 1 && (
              <button
                className="previous-button"
                type="button"
                onClick={() => setPageNumber(pageNumber - 1)}
              >
                <ChevronLeft size={17} />
                Previous
              </button>
            )}

            <div>
              {pageNumbers.map((number) => (
                <button
                  key={number}
                  className={pageNumber === number ? "current" : ""}
                  type="button"
                  onClick={() => setPageNumber(number)}
                >
                  {number}
                </button>
              ))}
            </div>

            {pageNumber < totalPages && (
              <button
                className="next-button"
                type="button"
                onClick={() => setPageNumber(pageNumber + 1)}
              >
                Next
                <ChevronRight size={17} />
              </button>
            )}
          </nav>
        </div>
      </div>
    </div>
  );
}