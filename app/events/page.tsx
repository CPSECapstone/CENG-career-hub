"use client";
import Navbar from "@/components/navbar/navbar";
import SearchBar from "@/components/search-bar/search-bar";
import {
  Bookmark,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Clock3,
  MapPin,
} from "lucide-react";
import {
  useEffect,
  useMemo,
  useState,
  type Dispatch,
  type SetStateAction,
} from "react";
import { createClient } from "@/lib/supabase/client";

type Event = {
  id: number;
  name: string;
  org: string;
  place: string;
  date: string;
  eventDate: string;
  posted: string;
  about: string;
  category: string;
  campus: string;
  city: string;
  major: string;
  applicationUrl: string | null;
};
const categories = [
  "Job",
  "Internship",
  "Co-Op",
  "Scholarship",
  "Research",
  "Competition",
  "Recruiting Event",
  "Club Event",
  "Other",
];
const engineeringMajors = [
  "Aerospace Engineering",
  "Biomedical Engineering",
  "Civil Engineering",
  "Computer Engineering",
  "Computer Science",
  "Electrical Engineering",
  "Environmental Engineering",
  "General Engineering",
  "Industrial Engineering",
  "Manufacturing Engineering",
  "Materials Engineering",
  "Mechanical Engineering",
  "Software Engineering",
];
const dateFilters = [
  "All",
  "Last Hour",
  "Last 24 Hours",
  "Last 7 Days",
  "Last 30 Days",
];
const eventsPerPage = 10;
const sortOptions = [
  "Latest",
  "Oldest",
  "Event date: soonest",
  "Event date: latest",
  "Name: A-Z",
] as const;

function formatDate(value: string | null) {
  if (!value) return "date not listed";

  return new Date(value).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

export default function Events() {
  const [events, setEvents] = useState<Event[]>([]);
  const [loadError, setLoadError] = useState("");
  const [term, setTerm] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [category, setCategory] = useState<string[]>([]);
  const [campus, setCampus] = useState<string[]>([]);
  const [location, setLocation] = useState("Select Location");
  const [major, setMajor] = useState("Select Category");
  const [appliedLocation, setAppliedLocation] = useState("Select Location");
  const [appliedMajor, setAppliedMajor] = useState("Select Category");
  const [openDropdown, setOpenDropdown] = useState<"location" | "major" | null>(
    null,
  );
  const [sortBy, setSortBy] = useState<(typeof sortOptions)[number]>("Latest");
  const [sortOpen, setSortOpen] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  const [page, setPage] = useState(1);

  useEffect(() => {
    async function loadOpportunities() {
      const supabase = createClient();

      const { data, error } = await supabase
        .from("opportunities")
        .select(
          "id, title, description, category, deadline, location, application_url, created_at",
        )
        .eq("is_active", true)
        .order("created_at", { ascending: false });

      if (error) {
        console.error(error);
        setLoadError("couldn't load opportunities right now");
        return;
      }

      const formattedEvents = data.map((opportunity) => {
        const location = opportunity.location || "location not listed";

        return {
          id: opportunity.id,
          name: opportunity.title,
          org: "ceng career hub",
          place: location,
          date: opportunity.deadline
            ? `deadline: ${formatDate(opportunity.deadline)}`
            : "deadline not listed",
          eventDate: opportunity.deadline || opportunity.created_at,
          posted: `posted ${formatDate(opportunity.created_at)}`,
          about: opportunity.description || "no description was provided",
          category: opportunity.category,
          campus: location.toLowerCase().includes("cal poly")
            ? "On Campus"
            : "Off Campus",
          city: location,
          major: "General Engineering",
          applicationUrl: opportunity.application_url,
        };
      });

      setEvents(formattedEvents);
    }

    loadOpportunities();
  }, []);

  const availableCities = useMemo(
    () => [...new Set(events.map((event) => event.city))].sort(),
    [events],
  );

  const hasCampusEvents = events.some((event) => event.campus === "On Campus");

  const visibleEvents = useMemo(
    () =>
      events.filter(
        (event) =>
          (event.name + event.org)
            .toLowerCase()
            .includes(searchTerm.toLowerCase()) &&
          (category.length === 0 || category.includes(event.category)) &&
          (campus.length === 0 || campus.includes(event.campus)) &&
          (appliedLocation === "Select Location" ||
            (appliedLocation === "Cal Poly SLO"
              ? event.campus === "On Campus"
              : event.city === appliedLocation)) &&
          (appliedMajor === "Select Category" || event.major === appliedMajor),
      ),
    [events, searchTerm, category, campus, appliedLocation, appliedMajor],
  );

  const sortedEvents = useMemo(
    () =>
      [...visibleEvents].sort((first, second) => {
        if (sortBy === "Oldest") {
          return events.indexOf(second) - events.indexOf(first);
        }

        if (sortBy === "Event date: soonest") {
          return (
            new Date(first.eventDate).getTime() -
            new Date(second.eventDate).getTime()
          );
        }

        if (sortBy === "Event date: latest") {
          return (
            new Date(second.eventDate).getTime() -
            new Date(first.eventDate).getTime()
          );
        }

        if (sortBy === "Name: A-Z") {
          return first.name.localeCompare(second.name);
        }

        return events.indexOf(first) - events.indexOf(second);
      }),
    [visibleEvents, sortBy, events],
  );

  const paginatedEvents = useMemo(
    () => sortedEvents.slice((page - 1) * eventsPerPage, page * eventsPerPage),
    [page, sortedEvents],
  );

  const totalPages = Math.max(
    1,
    Math.ceil(visibleEvents.length / eventsPerPage),
  );

  const pageNumbers = Array.from(
    { length: totalPages },
    (_, index) => index + 1,
  );

  const toggleFilter = (
    name: string,
    setter: Dispatch<SetStateAction<string[]>>,
  ) => {
    setter((current) =>
      current.includes(name)
        ? current.filter((item) => item !== name)
        : [...current, name],
    );

    setPage(1);
  };

  const runSearch = () => {
    setSearchTerm(term);
    setAppliedLocation(location);
    setAppliedMajor(major);
    setPage(1);
  };

  const clearSearch = () => {
    setTerm("");
    setSearchTerm("");
    setCategory([]);
    setCampus([]);
    setLocation("Select Location");
    setMajor("Select Category");
    setAppliedLocation("Select Location");
    setAppliedMajor("Select Category");
    setOpenDropdown(null);
    setPage(1);
  };

  return (
    <div>
      {/* page header */}
      <div className="cover-photo">
        <Navbar />
        <div className="page-header">
          <h1>Events</h1>
        </div>
        <div className="flex justify-center">
          <SearchBar
            locations={availableCities}
            categories={categories}
            onSearch={runSearch}
          />
        </div>
      </div>
      {/* filter menu go here */}
      <div>
        {/* displays # of results and sort-by button */}
        <div className="flex items-start justify-between mt-8 ml-2 mr-2 mb-4">
          <p className="text-dark-gray text-md">
            Showing{" "}
            {visibleEvents.length
              ? `${(page - 1) * eventsPerPage + 1}-${Math.min(page * eventsPerPage, visibleEvents.length)}`
              : "0"}{" "}
            of {visibleEvents.length} results
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
        {loadError && <p className="text-gray">{loadError}</p>}
        {/* event cards 
            TODO: add details overlay */}
        <div className="cards">
          {paginatedEvents.map((event) => (
            <article className="event-card" key={event.id}>
              <button
                className="bookmark"
                type="button"
                aria-label={`Save ${event.name}`}
              >
                <Bookmark size={19} />
              </button>

              <span className="time-badge">{event.posted}</span>

              <h2>{event.name}</h2>

              <p className="organization">{event.org}</p>

              <div className="card-footer">
                <div className="event-meta">
                  <span>
                    <Clock3 size={19} />
                    {event.date}
                  </span>

                  <span>
                    <MapPin size={19} />
                    {event.place}
                  </span>
                </div>

                <button
                  className="details-button"
                  type="button"
                  onClick={() => setSelectedEvent(event)}
                >
                  Event Details
                </button>
              </div>
            </article>
          ))}

          {!loadError && !visibleEvents.length && (
            <p className="text-dark-gray">No events match those filters.</p>
          )}
        </div>

        {/* page footer */}
        <nav className="pagination mb-4" aria-label="Pagination">
          {page > 1 && (
            <button
              className="previous-button"
              type="button"
              onClick={() => setPage(page - 1)}
            >
              <ChevronLeft size={17} />
              Previous
            </button>
          )}

          <div>
            {pageNumbers.map((pageNumber) => (
              <button
                key={pageNumber}
                className={page === pageNumber ? "current" : ""}
                onClick={() => setPage(pageNumber)}
                type="button"
              >
                {pageNumber}
              </button>
            ))}
          </div>

          {page < totalPages && (
            <button
              className="next-button"
              type="button"
              onClick={() => setPage(page + 1)}
            >
              Next
              <ChevronRight size={17} />
            </button>
          )}
        </nav>
      </div>
    </div>
  );
}
