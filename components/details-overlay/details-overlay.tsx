"use client";

import { X, type LucideIcon } from "lucide-react";
import { useEffect } from "react";
import "./details-overlay.css";

export type Detail = {
  label: string;
  value: string;
  icon?: LucideIcon;
};

type DetailsOverlayProps = {
  title: string;
  subtitle?: string;
  type: string;
  details?: Detail[];
  description?: string;
  onClose: () => void;
  applicationUrl?: string | null;
};

function removeLinks(text: string) {
  return text
    // Remove URLs enclosed in angle brackets.
    .replace(/<https?:\/\/[^>]+>/gi, "")
    // Remove other URLs.
    .replace(/https?:\/\/[^\s<>"']+/gi, "")
    // Clean up extra spaces left behind.
    .replace(/[ \t]{2,}/g, " ")
    .trim();
}

/** A reusable details dialog for job, event, and other listing cards. */
export default function DetailsOverlay({
  title,
  subtitle,
  type,
  details,
  description,
  onClose,
  applicationUrl,
}: DetailsOverlayProps) {
  useEffect(() => {
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };

    window.addEventListener("keydown", closeOnEscape);
    return () => window.removeEventListener("keydown", closeOnEscape);
  }, [onClose]);

  if (!title || !type) return null;

  return (
    <div
      className="details-overlay-backdrop"
      role="presentation"
      onMouseDown={onClose}
    >
      <section
        className="details-overlay"
        role="dialog"
        aria-modal="true"
        aria-labelledby="details-overlay-title"
        onMouseDown={(event) => event.stopPropagation()}
      >
        <button
          className="details-overlay-close"
          type="button"
          onClick={onClose}
          aria-label={`Close ${type.toLowerCase()} details`}
        >
          <X size={20} />
        </button>
        <span className="details-overlay-label">{type} details</span>
        <h2 id="details-overlay-title">{title}</h2>
        {subtitle && <p className="details-overlay-subtitle">{subtitle}</p>}
        <div className="details-overlay-info">
          {details?.map(({ label, value, icon: Icon }) => (
            <div key={label}>
              {Icon && <Icon size={19} />}
              <span>
                <b>{label}</b>
                {value}
              </span>
            </div>
          ))}
        </div>
        {description && (
          <div className="details-overlay-description">
            <h3>About</h3>
            <p>{removeLinks(description)}</p>
          </div>
        )}
        {applicationUrl && (
          <a
            className="details-overlay-apply"
            href={applicationUrl}
            target="_blank"
            rel="noopener noreferrer"
          >
            View opportunity
          </a>
        )}
      </section>
    </div>
  );
}
