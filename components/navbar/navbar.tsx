import "@/components/navbar/navbar.css";
import Link from "next/link";
import { Bell, BriefcaseBusiness, } from "lucide-react";

export default function Navbar() {
    return (
        <nav className="navbar">
            <Link className="logo" href="/">
                <BriefcaseBusiness size={22} strokeWidth={1.7} /> 
                <span>CENG Career Hub</span>
            </Link>
            <div className="nav-links">
                <Link href="/">Home</Link>
                <Link href="/jobs">Jobs</Link>
                <Link href="/events">Events</Link>
                <Link href="/chat">Chat</Link>
            </div>
            <div className="nav-links">
                <button>
                    <Bell size={17} />
                </button>
                {/* TODO: add logic for logged in vs. logged out user */}
                <Link href="/login">Login</Link>
                <Link className="profile-button" href="/student-profile">Profile</Link>
            </div>
        </nav>
    );
}