"use client";

import Link from "next/link";
import { Bell, Bookmark, BriefcaseBusiness, ChevronDown, ChevronLeft, ChevronRight, Clock3, MapPin, Search, X } from "lucide-react";
import { useMemo, useState, type Dispatch, type SetStateAction } from "react";

const events = [
  { name: "Computer Science Career Night", org: "Cal Poly Computer Science Department", place: "Bldg. 14, Room 249", date: "Oct 16, 5:30 PM", posted: "12 min ago", about: "Meet employers and Cal Poly alumni, learn about current software roles, and build connections for internships and full-time opportunities.", category: "Career & Networking", campus: "On Campus", city: "San Luis Obispo", major: "Computer Science" },
  { name: "Software Engineering Alumni Panel", org: "Cal Poly Computer Science Department", place: "Bldg. 14, Room 250", date: "Oct 18, 6:00 PM", posted: "35 min ago", about: "Hear Cal Poly alumni share what their first years in software engineering were like and ask questions about career paths, interviews, and industry teams.", category: "Industry Panels", campus: "On Campus", city: "San Luis Obispo", major: "Computer Science" },
  { name: "AI and Machine Learning Workshop", org: "Cal Poly Computer Science Department", place: "Advanced Technology Labs", date: "Oct 21, 4:00 PM", posted: "1 hour ago", about: "A hands-on introduction to machine learning tools, model evaluation, and practical project ideas for Computer Science students.", category: "Workshops", campus: "On Campus", city: "San Luis Obispo", major: "Computer Science" },
  { name: "CS Internship Info Session", org: "Cal Poly Computer Science Department", place: "Downtown SLO Innovation Hub", date: "Oct 24, 5:00 PM", posted: "3 hours ago", about: "Learn how to prepare a strong internship application, connect with local technology companies, and plan your search timeline.", category: "Career & Networking", campus: "Off Campus", city: "San Luis Obispo", major: "Computer Science" },
  { name: "Hackathon Team Formation", org: "Cal Poly Computer Science Department", place: "Bldg. 14, Room 130", date: "Oct 26, 12:00 PM", posted: "Yesterday", about: "Find teammates, pitch project ideas, and connect with students interested in participating in the upcoming campus hackathon.", category: "Student Organizations", campus: "On Campus", city: "San Luis Obispo", major: "Computer Science" },
  { name: "Women in Computing Social", org: "Cal Poly Computer Science Department", place: "Kreuzberg Coffee Company", date: "Oct 28, 4:30 PM", posted: "2 days ago", about: "A casual opportunity to meet fellow students in computing, share experiences, and build community beyond the classroom.", category: "Student Organizations", campus: "Off Campus", city: "San Luis Obispo", major: "Computer Science" },
];
const categories = ["Career & Networking", "Workshops", "Industry Panels", "Student Organizations", "Research & Talks"];
const engineeringMajors = ["Aerospace Engineering", "Biomedical Engineering", "Civil Engineering", "Computer Engineering", "Computer Science", "Electrical Engineering", "Environmental Engineering", "General Engineering", "Industrial Engineering", "Manufacturing Engineering", "Materials Engineering", "Mechanical Engineering", "Software Engineering"];
const dateFilters = ["All", "Last Hour", "Last 24 Hours", "Last 7 Days", "Last 30 Days"];
const eventsPerPage = 4;
const sortOptions = ["Latest", "Oldest", "Event date: soonest", "Event date: latest", "Name: A-Z"] as const;

export default function Events() {
  const [term, setTerm] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [category, setCategory] = useState<string[]>([]);
  const [campus, setCampus] = useState<string[]>([]);
  const [location, setLocation] = useState("Select Location");
  const [major, setMajor] = useState("Select Category");
  const [appliedLocation, setAppliedLocation] = useState("Select Location");
  const [appliedMajor, setAppliedMajor] = useState("Select Category");
  const [openDropdown, setOpenDropdown] = useState<"location" | "major" | null>(null);
  const [sortBy, setSortBy] = useState<(typeof sortOptions)[number]>("Latest");
  const [sortOpen, setSortOpen] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<(typeof events)[number] | null>(null);
  const [page, setPage] = useState(1);
  // When this page receives the signed-in user's job/event dataset, this list
  // automatically limits the dropdown to locations that dataset contains.
  const availableCities = useMemo(() => [...new Set(events.map((event) => event.city))].sort(), []);
  const hasCampusEvents = events.some((event) => event.campus === "On Campus");
  const visibleEvents = useMemo(() => events.filter((event) => (event.name + event.org).toLowerCase().includes(searchTerm.toLowerCase()) && (category.length === 0 || category.includes(event.category)) && (campus.length === 0 || campus.includes(event.campus)) && (appliedLocation === "Select Location" || (appliedLocation === "Cal Poly SLO" ? event.campus === "On Campus" : event.city === appliedLocation)) && (appliedMajor === "Select Category" || event.major === appliedMajor)), [searchTerm, category, campus, appliedLocation, appliedMajor]);
  const sortedEvents = useMemo(() => [...visibleEvents].sort((first, second) => {
    if (sortBy === "Oldest") return events.indexOf(second) - events.indexOf(first);
    if (sortBy === "Event date: soonest") return new Date(`${first.date}, 2026`).getTime() - new Date(`${second.date}, 2026`).getTime();
    if (sortBy === "Event date: latest") return new Date(`${second.date}, 2026`).getTime() - new Date(`${first.date}, 2026`).getTime();
    if (sortBy === "Name: A-Z") return first.name.localeCompare(second.name);
    return events.indexOf(first) - events.indexOf(second);
  }), [visibleEvents, sortBy]);
  const paginatedEvents = useMemo(() => sortedEvents.slice((page - 1) * eventsPerPage, page * eventsPerPage), [page, sortedEvents]);
  const totalPages = Math.max(1, Math.ceil(visibleEvents.length / eventsPerPage));
  const toggleFilter = (name: string, setter: Dispatch<SetStateAction<string[]>>) => { setter((current) => current.includes(name) ? current.filter((item) => item !== name) : [...current, name]); setPage(1); };
  const runSearch = () => { setSearchTerm(term); setAppliedLocation(location); setAppliedMajor(major); setPage(1); };
  const clearSearch = () => { setTerm(""); setSearchTerm(""); setCategory([]); setCampus([]); setLocation("Select Location"); setMajor("Select Category"); setAppliedLocation("Select Location"); setAppliedMajor("Select Category"); setOpenDropdown(null); setPage(1); };

  return <main className="events-page"><div className="events-shell">
    <section className="events-hero">
      <nav className="events-nav">
        <Link className="brand" href="/"><BriefcaseBusiness size={22} strokeWidth={1.7} /><span>CENG Career Hub</span></Link>
        <div className="nav-links"><Link href="/">Home</Link><Link href="/jobs">Jobs</Link><Link className="active" href="/events">Events</Link><Link href="/chat">Chat</Link></div>
        <div className="account-links"><button aria-label="Notifications"><Bell size={17} /></button><Link href="/login">Logout</Link><Link className="profile-button" href="/student-profile">Profile</Link></div>
      </nav>
      <div className="hero-copy"><h1>Events</h1><div className="event-search" role="search">
        <input value={term} onChange={(e) => setTerm(e.target.value)} placeholder="Club or Event Name" aria-label="Club or Event Name" />
        <div className="select-control"><button className="dropdown-trigger" type="button" onClick={() => setOpenDropdown(openDropdown === "location" ? null : "location")}>{location}<ChevronDown size={17} /></button>{openDropdown === "location" && <div className="search-dropdown"><p>Campus</p>{hasCampusEvents && <button type="button" onClick={() => { setLocation("Cal Poly SLO"); setOpenDropdown(null); }}>Cal Poly SLO</button>}<p>California Cities</p>{availableCities.map((city) => <button key={city} type="button" onClick={() => { setLocation(city); setOpenDropdown(null); }}>{city}</button>)}</div>}</div>
        <div className="select-control"><button className="dropdown-trigger" type="button" onClick={() => setOpenDropdown(openDropdown === "major" ? null : "major")}>{major}<ChevronDown size={17} /></button>{openDropdown === "major" && <div className="search-dropdown major-dropdown"><p>Engineering Majors</p>{engineeringMajors.map((engineeringMajor) => <button key={engineeringMajor} type="button" onClick={() => { setMajor(engineeringMajor); setOpenDropdown(null); }}>{engineeringMajor}</button>)}</div>}</div><button className="hero-search" type="button" onClick={runSearch}><Search size={16} /> Search</button>
      </div><button className="clear-search" type="button" onClick={clearSearch}>Clear search</button></div>
    </section>
    <section className="events-content">
      <aside className="filters"><h2>Search by Club</h2><label className="filter-input"><Search size={17} /><input value={term} onChange={(e) => setTerm(e.target.value)} placeholder="Event title or Club" /></label><h3>Cal Poly SLO Campus</h3>
        <div className="checkbox-list campus-list">{["On Campus", "Off Campus"].map((item) => <label key={item}><input type="checkbox" checked={campus.includes(item)} onChange={() => toggleFilter(item, setCampus)} /><span>{item}</span><b>{events.filter((event) => event.campus === item).length}</b></label>)}</div><h3>Event Type</h3>
        <div className="checkbox-list">{categories.map((item) => <label key={item}><input type="checkbox" checked={category.includes(item)} onChange={() => toggleFilter(item, setCategory)} /><span>{item}</span><b>{events.filter((event) => event.category === item).length}</b></label>)}</div>
        <button className="show-more" type="button">Show More</button><h3 className="date-heading">Date Posted</h3><div className="checkbox-list">{dateFilters.map((item) => <label key={item}><input type="checkbox" /><span>{item}</span><b>10</b></label>)}</div>
      </aside>
      <div className="results"><div className="results-top"><p>Showing {visibleEvents.length ? `${(page - 1) * eventsPerPage + 1}-${Math.min(page * eventsPerPage, visibleEvents.length)}` : "0"} of {visibleEvents.length} results</p><div className="sort-wrapper"><button className="sort-button" type="button" onClick={() => setSortOpen(!sortOpen)}>Sort by {sortBy.toLowerCase()} <ChevronDown size={17} /></button>{sortOpen && <div className="sort-menu">{sortOptions.map((option) => <button key={option} className={sortBy === option ? "selected" : ""} type="button" onClick={() => { setSortBy(option); setSortOpen(false); setPage(1); }}>{option}</button>)}</div>}</div></div>
        <div className="cards">{paginatedEvents.map((event) => <article className="event-card" key={event.name}><button className="bookmark" type="button" aria-label={`Save ${event.name}`}><Bookmark size={19} /></button><span className="time-badge">{event.posted}</span><h2>{event.name}</h2><p className="organization">{event.org}</p><div className="card-footer"><div className="event-meta"><span><Clock3 size={19} />{event.date}</span><span><MapPin size={19} />{event.place}</span></div><button className="details-button" type="button" onClick={() => setSelectedEvent(event)}>Event Details</button></div></article>)}{!visibleEvents.length && <p className="empty-state">No events match those filters.</p>}</div>
        <nav className="pagination" aria-label="Pagination">{page > 1 && <button className="previous-button" type="button" onClick={() => setPage(page - 1)}><ChevronLeft size={17} /> Previous</button>}<div><button className={page === 1 ? "current" : ""} onClick={() => setPage(1)} type="button">1</button>{totalPages > 1 && <button className={page === 2 ? "current" : ""} onClick={() => setPage(2)} type="button">2</button>}</div>{page < totalPages && <button className="next-button" type="button" onClick={() => setPage(page + 1)}>Next <ChevronRight size={17} /></button>}</nav>
      </div>
    </section>
  </div>{selectedEvent && <div className="event-modal-backdrop" role="presentation" onMouseDown={() => setSelectedEvent(null)}><section className="event-modal" role="dialog" aria-modal="true" aria-labelledby="event-modal-title" onMouseDown={(event) => event.stopPropagation()}><button className="modal-close" type="button" onClick={() => setSelectedEvent(null)} aria-label="Close event details"><X size={20} /></button><span className="modal-label">Event details</span><h2 id="event-modal-title">{selectedEvent.name}</h2><p className="modal-organization">{selectedEvent.org}</p><div className="modal-info"><div><Clock3 size={19} /><span><b>Date &amp; time</b>{selectedEvent.date}</span></div><div><MapPin size={19} /><span><b>Location</b>{selectedEvent.place}, {selectedEvent.city}</span></div></div><div className="modal-about"><h3>About</h3><p>{selectedEvent.about}</p></div></section></div>}</main>;
}
