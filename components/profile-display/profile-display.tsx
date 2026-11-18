"use client";

import "@/components/profile-display/profile-display.css";

type ProfileDisplayProps = {
  name: string;
  subtitle: string;
  avatarUrl?: string;
  onEditProfile?: () => void;
};

/** A compact profile summary card for profile and dashboard pages. */
export default function ProfileDisplay({
  name,
  subtitle,
  avatarUrl,
  onEditProfile,
}: ProfileDisplayProps) {
  return (
    <section className="profile-display" aria-label={`${name}'s profile`}>
      <div
        className="profile-display-avatar"
        aria-hidden="true"
        style={
          avatarUrl
            ? { backgroundImage: `url("${avatarUrl}")` }
            : undefined
        }
      />

      <div className="profile-display-details">
        <h2>{name}</h2>
        <p>{subtitle}</p>
      </div>

      <button
        className="profile-display-edit-button"
        type="button"
        onClick={onEditProfile}
      >
        Edit Profile
      </button>
    </section>
  );
}
