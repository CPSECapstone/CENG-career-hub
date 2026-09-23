"use client";

import Link from "next/link";
import { Bell, Bookmark, BriefcaseBusiness, ChevronDown, ChevronRight, Clock3, MapPin, Search } from "lucide-react";
import { useMemo, useState, type Dispatch, type SetStateAction } from "react";

const events = [
  { name: "Computer Science Career Night", org: "Cal Poly Computer Science Department", place: "Bldg. 14, Room 249", date: "Oct 16, 5:30 PM", category: "Career & Networking", campus: "On Campus", city: "San Luis Obispo", major: "Computer Science" },
  { name: "Software Engineering Alumni Panel", org: "Cal Poly Computer Science Department", place: "Bldg. 14, Room 250", date: "Oct 18, 6:00 PM", category: "Industry Panels", campus: "On Campus", city: "San Luis Obispo", major: "Computer Science" },
  { name: "AI and Machine Learning Workshop", org: "Cal Poly Computer Science Department", place: "Advanced Technology Labs", date: "Oct 21, 4:00 PM", category: "Workshops", campus: "On Campus", city: "San Luis Obispo", major: "Computer Science" },
  { name: "CS Internship Info Session", org: "Cal Poly Computer Science Department", place: "Downtown SLO Innovation Hub", date: "Oct 24, 5:00 PM", category: "Career & Networking", campus: "Off Campus", city: "San Luis Obispo", major: "Computer Science" },
  { name: "Hackathon Team Formation", org: "Cal Poly Computer Science Department", place: "Bldg. 14, Room 130", date: "Oct 26, 12:00 PM", category: "Student Organizations", campus: "On Campus", city: "San Luis Obispo", major: "Computer Science" },
  { name: "Women in Computing Social", org: "Cal Poly Computer Science Department", place: "Kreuzberg Coffee Company", date: "Oct 28, 4:30 PM", category: "Student Organizations", campus: "Off Campus", city: "San Luis Obispo", major: "Computer Science" },
];
const categories = ["Career & Networking", "Workshops", "Industry Panels", "Student Organizations", "Research & Talks"];
const engineeringMajors = ["Aerospace Engineering", "Biomedical Engineering", "Civil Engineering", "Computer Engineering", "Computer Science", "Electrical Engineering", "Environmental Engineering", "General Engineering", "Industrial Engineering", "Manufacturing Engineering", "Materials Engineering", "Mechanical Engineering", "Software Engineering"];
const dateFilters = ["All", "Last Hour", "Last 24 Hours", "Last 7 Days", "Last 30 Days"];
const eventsPerPage = 4;

export default function Events() {
  const [term, setTerm] = useState("");
  const [category, setCategory] = useState<string[]>([]);
  const [campus, setCampus] = useState<string[]>([]);
  const [location, setLocation] = useState("Select Location");
  const [major, setMajor] = useState("Select Category");
  const [page, setPage] = useState(1);
  // When this page receives the signed-in user's job/event dataset, this list
  // automatically limits the dropdown to locations that dataset contains.
  const availableCities = useMemo(() => [...new Set(events.map((event) => event.city))].sort(), []);
  const hasCampusEvents = events.some((event) => event.campus === "On Campus");
  const visibleEvents = useMemo(() => events.filter((event) => (event.name + event.org).toLowerCase().includes(term.toLowerCase()) && (category.length === 0 || category.includes(event.category)) && (campus.length === 0 || campus.includes(event.campus)) && (location === "Select Location" || (location === "Cal Poly SLO" ? event.campus === "On Campus" : event.city === location)) && (major === "Select Category" || event.major === major)), [term, category, campus, location, major]);
  const paginatedEvents = useMemo(() => visibleEvents.slice((page - 1) * eventsPerPage, page * eventsPerPage), [page, visibleEvents]);
  const totalPages = Math.max(1, Math.ceil(visibleEvents.length / eventsPerPage));
  const toggleFilter = (name: string, setter: Dispatch<SetStateAction<string[]>>) => { setter((current) => current.includes(name) ? current.filter((item) => item !== name) : [...current, name]); setPage(1); };
  const clearSearch = () => { setTerm(""); setCategory([]); setCampus([]); setLocation("Select Location"); setMajor("Select Category"); setPage(1); };

  return <main className="events-page"><div className="events-shell">
    <section className="events-hero">
      <nav className="events-nav">
        <Link className="brand" href="/"><BriefcaseBusiness size={22} strokeWidth={1.7} /><span>CENG Career Hub</span></Link>
        <div className="nav-links"><Link href="/">Home</Link><Link href="/jobs">Jobs</Link><Link className="active" href="/events">Events</Link><Link href="/chat">Chat</Link></div>
        <div className="account-links"><button aria-label="Notifications"><Bell size={17} /></button><Link href="/login">Logout</Link><Link className="profile-button" href="/student-profile">Profile</Link></div>
      </nav>
      <div className="hero-copy"><h1>Events</h1><div className="event-search" role="search">
        <input value={term} onChange={(e) => setTerm(e.target.value)} placeholder="Club or Event Name" aria-label="Club or Event Name" />
        <label className="select-control"><select aria-label="Location" value={location} onChange={(event) => { setLocation(event.target.value); setPage(1); }}><option>Select Location</option>{hasCampusEvents && <optgroup label="Campus"><option>Cal Poly SLO</option></optgroup>}<optgroup label="California Cities">{availableCities.map((city) => <option key={city}>{city}</option>)}</optgroup></select><ChevronDown size={17} /></label><label className="select-control"><select aria-label="Engineering major" value={major} onChange={(event) => { setMajor(event.target.value); setPage(1); }}><option>Select Category</option><optgroup label="Engineering Majors">{engineeringMajors.map((engineeringMajor) => <option key={engineeringMajor}>{engineeringMajor}</option>)}</optgroup></select><ChevronDown size={17} /></label><button className="hero-search" type="button"><Search size={16} /> Search</button>
      </div><button className="clear-search" type="button" onClick={clearSearch}>Clear search</button></div>
    </section>
    <section className="events-content">
      <aside className="filters"><h2>Search by Club</h2><label className="filter-input"><Search size={17} /><input value={term} onChange={(e) => setTerm(e.target.value)} placeholder="Event title or Club" /></label><h3>Cal Poly SLO Campus</h3>
        <div className="checkbox-list campus-list">{["On Campus", "Off Campus"].map((item) => <label key={item}><input type="checkbox" checked={campus.includes(item)} onChange={() => toggleFilter(item, setCampus)} /><span>{item}</span><b>{events.filter((event) => event.campus === item).length}</b></label>)}</div><h3>Event Type</h3>
        <div className="checkbox-list">{categories.map((item) => <label key={item}><input type="checkbox" checked={category.includes(item)} onChange={() => toggleFilter(item, setCategory)} /><span>{item}</span><b>{events.filter((event) => event.category === item).length}</b></label>)}</div>
        <button className="show-more" type="button">Show More</button><h3 className="date-heading">Date Posted</h3><div className="checkbox-list">{dateFilters.map((item) => <label key={item}><input type="checkbox" /><span>{item}</span><b>10</b></label>)}</div>
      </aside>
      <div className="results"><div className="results-top"><p>Showing {visibleEvents.length ? `${(page - 1) * eventsPerPage + 1}-${Math.min(page * eventsPerPage, visibleEvents.length)}` : "0"} of {visibleEvents.length} results</p><button className="sort-button" type="button">Sort by latest <ChevronDown size={17} /></button></div>
        <div className="cards">{paginatedEvents.map((event) => <article className="event-card" key={event.name}><button className="bookmark" type="button" aria-label={`Save ${event.name}`}><Bookmark size={19} /></button><span className="time-badge">20 min ago</span><h2>{event.name}</h2><p className="organization">{event.org}</p><div className="card-footer"><div className="event-meta"><span><Clock3 size={19} />{event.date}</span><span><MapPin size={19} />{event.place}</span></div><button className="details-button" type="button">Event Details</button></div></article>)}{!visibleEvents.length && <p className="empty-state">No events match those filters.</p>}</div>
        <nav className="pagination" aria-label="Pagination"><div><button className={page === 1 ? "current" : ""} onClick={() => setPage(1)} type="button">1</button>{totalPages > 1 && <button className={page === 2 ? "current" : ""} onClick={() => setPage(2)} type="button">2</button>}</div>{page < totalPages && <button className="next-button" type="button" onClick={() => setPage(page + 1)}>Next <ChevronRight size={17} /></button>}</nav>
      </div>
    </section>
  </div></main>;
}
