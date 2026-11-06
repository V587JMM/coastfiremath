import { useEffect, useState } from 'react';
import { ageLabel, type Result } from '~/lib/calculator';

export function viewResult() {
  const node = document.getElementById('coast-result');
  if (!node) return;
  node.focus({ preventScroll: true });
  node.scrollIntoView({
    block: 'start',
    behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'instant' : 'smooth',
  });
}

export function MobileResultLink({ result, age }: { result: Result | null; age: number }) {
  const [visible, setVisible] = useState(false);
  const valid = result !== null;
  useEffect(() => {
    const summary = document.querySelector<HTMLElement>(valid ? '.summary' : '.error-panel');
    const editing = [
      document.getElementById('starting-point'),
      document.getElementById('goal-planner'),
    ].filter((node): node is HTMLElement => node !== null);
    if (!summary || typeof IntersectionObserver === 'undefined') return;
    const goalAnswer = document.querySelector('.goal-answer');
    // Keep the planner estimate clear of the fixed dock and its touch target.
    const dockClearance = 100;
    const check = () => {
      const answer = goalAnswer?.getBoundingClientRect();
      const wouldCoverAnswer =
        answer && answer.top < window.innerHeight && answer.bottom > window.innerHeight - dockClearance;
      setVisible(
        !wouldCoverAnswer &&
          summary.getBoundingClientRect().bottom <= 0 &&
          editing.some((node) => {
            const rect = node.getBoundingClientRect();
            return rect.bottom > 0 && rect.top < window.innerHeight;
          }),
      );
    };
    const observer = new IntersectionObserver(check, { threshold: [0, 1] });
    observer.observe(summary);
    for (const node of editing) observer.observe(node);
    const clearanceObserver = new IntersectionObserver(check, {
      rootMargin: `0px 0px -${dockClearance}px 0px`,
      threshold: [0, 1],
    });
    if (goalAnswer) {
      observer.observe(goalAnswer);
      clearanceObserver.observe(goalAnswer);
    }
    check();
    return () => {
      observer.disconnect();
      clearanceObserver.disconnect();
    };
  }, [valid]);
  if (!visible) return null;
  const estimate =
    result === null
      ? 'Check your inputs'
      : result.coastMonth === null
        ? 'Not reached by retirement'
        : result.retirementOnly
          ? `Retirement at ${ageLabel(result.coastMonth!, age)} · Coast: 0 yr`
          : result.coastMonth === 0
            ? 'Already coasting'
            : `Age ${ageLabel(result.coastMonth, age)}`;
  return (
    <aside className="mobile-result-link" aria-label="Updated calculation">
      <div>
        <span>
          {result === null
            ? 'Result unavailable'
            : result.retirementOnly
              ? 'Estimated retirement milestone'
              : 'Estimated Coast milestone'}
        </span>
        <strong>{estimate}</strong>
      </div>
      <button type="button" onClick={viewResult}>
        {result === null ? 'View issues ↑' : 'View result ↑'}
      </button>
    </aside>
  );
}
