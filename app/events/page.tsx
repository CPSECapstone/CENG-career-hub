"use client";

import Link from "next/link";
import {
  Bell,
  Bookmark,
  BriefcaseBusiness,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Clock3,
  MapPin,
  Search,
  X,
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

function formatDate(value: string | null) {
  if (!value) return "date not listed";

  return new Date(value).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

const categories = [
  "job",
  "internship",
  "co-op",
  "scholarship",
  "research",
  "competition",
  "recruiting_event",
  "club_event",
  "other",
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
    <main className="events-page">
      <div className="events-shell">
        <section className="events-hero">
          <nav className="events-nav">
            <Link className="brand" href="/">
              <BriefcaseBusiness size={22} strokeWidth={1.7} />
              <span>CENG Career Hub</span>
            </Link>

            <div className="nav-links">
              <Link href="/">Home</Link>
              <Link href="/jobs">Jobs</Link>
              <Link className="active" href="/events">
                Events
              </Link>
              <Link href="/chat">Chat</Link>
            </div>

            <div className="account-links">
              <button aria-label="Notifications">
                <Bell size={17} />
              </button>
              <Link href="/login">Logout</Link>
              <Link className="profile-button" href="/student-profile">
                Profile
              </Link>
            </div>
          </nav>

          <div className="hero-copy">
            <h1>Events</h1>

            <div className="event-search" role="search">
              <input
                value={term}
                onChange={(event) => setTerm(event.target.value)}
                placeholder="Club or Event Name"
                aria-label="Club or Event Name"
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
                >
                  {location}
                  <ChevronDown size={17} />
                </button>

                {openDropdown === "location" && (
                  <div className="search-dropdown">
                    <p>Campus</p>

                    {hasCampusEvents && (
                      <button
                        type="button"
                        onClick={() => {
                          setLocation("Cal Poly SLO");
                          setOpenDropdown(null);
                        }}
                      >
                        Cal Poly SLO
                      </button>
                    )}

                    <p>California Cities</p>

                    {availableCities.map((city) => (
                      <button
                        key={city}
                        type="button"
                        onClick={() => {
                          setLocation(city);
                          setOpenDropdown(null);
                        }}
                      >
                        {city}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              <div className="select-control">
                <button
                  className="dropdown-trigger"
                  type="button"
                  onClick={() =>
                    setOpenDropdown(openDropdown === "major" ? null : "major")
                  }
                >
                  {major}
                  <ChevronDown size={17} />
                </button>

                {openDropdown === "major" && (
                  <div className="search-dropdown major-dropdown">
                    <p>Engineering Majors</p>

                    {engineeringMajors.map((engineeringMajor) => (
                      <button
                        key={engineeringMajor}
                        type="button"
                        onClick={() => {
                          setMajor(engineeringMajor);
                          setOpenDropdown(null);
                        }}
                      >
                        {engineeringMajor}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              <button className="hero-search" type="button" onClick={runSearch}>
                <Search size={16} />
                Search
              </button>
            </div>

            <button
              className="clear-search"
              type="button"
              onClick={clearSearch}
            >
              Clear search
            </button>
          </div>
        </section>

        <section className="events-content">
          <aside className="filters">
            <h2>Search by Club</h2>

            <label className="filter-input">
              <Search size={17} />
              <input
                value={term}
                onChange={(event) => setTerm(event.target.value)}
                placeholder="Event title or Club"
              />
            </label>

            <h3>Cal Poly SLO Campus</h3>

            <div className="checkbox-list campus-list">
              {["On Campus", "Off Campus"].map((item) => (
                <label key={item}>
                  <input
                    type="checkbox"
                    checked={campus.includes(item)}
                    onChange={() => toggleFilter(item, setCampus)}
                  />
                  <span>{item}</span>
                  <b>
                    {events.filter((event) => event.campus === item).length}
                  </b>
                </label>
              ))}
            </div>

            <h3>Event Type</h3>

            <div className="checkbox-list">
              {categories.map((item) => (
                <label key={item}>
                  <input
                    type="checkbox"
                    checked={category.includes(item)}
                    onChange={() => toggleFilter(item, setCategory)}
                  />
                  <span>{item.replaceAll("_", " ")}</span>
                  <b>
                    {events.filter((event) => event.category === item).length}
                  </b>
                </label>
              ))}
            </div>

            <button className="show-more" type="button">
              Show More
            </button>

            <h3 className="date-heading">Date Posted</h3>

            <div className="checkbox-list">
              {dateFilters.map((item) => (
                <label key={item}>
                  <input type="checkbox" />
                  <span>{item}</span>
                  <b>10</b>
                </label>
              ))}
            </div>
          </aside>

          <div className="results">
            <div className="results-top">
              <p>
                Showing{" "}
                {visibleEvents.length
                  ? `${(page - 1) * eventsPerPage + 1}-${Math.min(
                      page * eventsPerPage,
                      visibleEvents.length,
                    )}`
                  : "0"}{" "}
                of {visibleEvents.length} results
              </p>

              <div className="sort-wrapper">
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

            {loadError && <p className="empty-state">{loadError}</p>}

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
                <p className="empty-state">No events match those filters.</p>
              )}
            </div>

            <nav className="pagination" aria-label="Pagination">
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
        </section>
      </div>

      {selectedEvent && (
        <div
          className="event-modal-backdrop"
          role="presentation"
          onMouseDown={() => setSelectedEvent(null)}
        >
          <section
            className="event-modal"
            role="dialog"
            aria-modal="true"
            aria-labelledby="event-modal-title"
            onMouseDown={(event) => event.stopPropagation()}
          >
            <button
              className="modal-close"
              type="button"
              onClick={() => setSelectedEvent(null)}
              aria-label="Close event details"
            >
              <X size={20} />
            </button>

            <span className="modal-label">Event details</span>

            <h2 id="event-modal-title">{selectedEvent.name}</h2>

            <p className="modal-organization">{selectedEvent.org}</p>

            <div className="modal-info">
              <div>
                <Clock3 size={19} />
                <span>
                  <b>Date &amp; time</b>
                  {selectedEvent.date}
                </span>
              </div>

              <div>
                <MapPin size={19} />
                <span>
                  <b>Location</b>
                  {selectedEvent.place}
                </span>
              </div>
            </div>

            <div className="modal-about">
              <h3>About</h3>
              <p>{selectedEvent.about}</p>
            </div>

            {selectedEvent.applicationUrl && (
              <a
                className="details-button"
                href={selectedEvent.applicationUrl}
                target="_blank"
                rel="noreferrer"
              >
                apply here
              </a>
            )}
          </section>
        </div>
      )}
    </main>
  );
}
