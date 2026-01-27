"use client";

import Link from "next/link";

interface ContentCredentialsProps {
  lastUpdated: string;
  author?: string;
  reviewedBy?: string;
  compact?: boolean;
}

/**
 * ContentCredentials component for E-E-A-T signals
 * Displays last updated date, author, and reviewer info
 */
export function ContentCredentials({
  lastUpdated,
  author = "Resonance Editorial Team",
  reviewedBy,
  compact = false
}: ContentCredentialsProps) {
  if (compact) {
    return (
      <div className="flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
        <span>Updated: {lastUpdated}</span>
        <span className="text-border">•</span>
        <span>By {author}</span>
        {reviewedBy && (
          <>
            <span className="text-border">•</span>
            <span>Reviewed by {reviewedBy}</span>
          </>
        )}
        <span className="text-border">•</span>
        <Link href="/about/methodology" className="text-primary hover:underline">
          Our methodology
        </Link>
      </div>
    );
  }

  return (
    <div className="rounded-xl border border-border bg-card/50 p-4 text-sm">
      <div className="flex flex-wrap gap-x-6 gap-y-2 text-muted-foreground">
        <div>
          <span className="font-medium text-card-foreground">Last updated:</span> {lastUpdated}
        </div>
        <div>
          <span className="font-medium text-card-foreground">Written by:</span> {author}
        </div>
        {reviewedBy && (
          <div>
            <span className="font-medium text-card-foreground">Reviewed by:</span> {reviewedBy}
          </div>
        )}
      </div>
      <p className="mt-2 text-xs text-muted-foreground">
        Our content follows evidence-based guidelines.{" "}
        <Link href="/about/methodology" className="text-primary hover:underline">
          Learn about our methodology →
        </Link>
      </p>
    </div>
  );
}
