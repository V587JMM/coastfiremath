import { Link } from '@tanstack/react-router';
import type { ReactNode } from 'react';
export function Article({
  title,
  intro,
  updated = 'November 5, 2026',
  children,
}: {
  title: string;
  intro: string;
  updated?: string;
  children: ReactNode;
}) {
  return (
    <article className="article">
      <Link to="/" className="back-link">
        ← Back to calculator
      </Link>
      <h1>{title}</h1>
      <p className="article-intro">{intro}</p>
      <div className="article-body">{children}</div>
      <p className="review-date">
        Updated {updated} · <Link to="/editorial-policy/">Our methodology</Link>
      </p>
    </article>
  );
}
