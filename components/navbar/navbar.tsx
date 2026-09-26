import Link from "next/link";
import { Bell, BriefcaseBusiness } from "lucide-react";

export default function Navbar() {
  return (
    <nav className="events-nav">
      <Link className="brand" href="/">
        <BriefcaseBusiness size={22} strokeWidth={1.7} />
        <span>CENG Career Hub</span>
      </Link>
      <div className="nav-links">
        <Link href="/"> Home </Link>
        <Link href="/jobs"> Jobs </Link>
        <Link className="active" href="/events">
          {" "}
          Events{" "}
        </Link>
        <Link href="/chat"> Chat </Link>
      </div>
      <div className="account-links">
        <button aria-label="Notifications">
          <Bell size={17} />
        </button>
        <Link href="/login"> Logout </Link>
        <Link className="profile-button" href="/student-profile">
          {" "}
          Profile{" "}
        </Link>
      </div>
    </nav>
  );
}
