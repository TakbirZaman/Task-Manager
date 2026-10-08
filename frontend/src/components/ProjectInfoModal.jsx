// frontend/src/components/ProjectInfoModal.jsx

import { useEffect, useRef } from 'react';

const REPO_URL = 'https://github.com/TakbirZaman/Task-Manager';
const LIVE_URL = 'https://task-manager-takbirzamans-projects.vercel.app/';

const SECTIONS = [
  {
    title: 'Languages',
    items: ['JavaScript (JSX)', 'SQL', 'CSS'],
  },
  {
    title: 'Tools & Stack',
    items: [
      'React 19 + Vite',
      'Tailwind CSS v4',
      'Node.js + Express',
      'PostgreSQL',
      'JWT + bcrypt',
      'Docker + Vercel',
    ],
  },
];

const LINKS = [
  { label: 'GitHub repository', sub: 'Source code & history', href: REPO_URL },
  { label: 'Live demo', sub: 'Deployed on Vercel', href: LIVE_URL },
];

export default function ProjectInfoModal({ open, onClose }) {
  const closeRef = useRef(null);

  useEffect(() => {
    if (!open) return;

    closeRef.current?.focus();
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    function onKeyDown(e) {
      if (e.key === 'Escape') onClose();
    }
    window.addEventListener('keydown', onKeyDown);

    return () => {
      document.body.style.overflow = prevOverflow;
      window.removeEventListener('keydown', onKeyDown);
    };
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center px-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="project-info-title"
    >
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-void/80 backdrop-blur-sm animate-scale-in"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Panel */}
      <div className="glass-strong relative max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-2xl p-7 shadow-2xl shadow-black/40 animate-fade-in-up">
        <button
          ref={closeRef}
          onClick={onClose}
          aria-label="Close"
          className="absolute right-4 top-4 flex h-8 w-8 items-center justify-center rounded-lg border border-mist/50 text-ghost transition-all duration-200 hover:border-rose/50 hover:text-rose"
        >
          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        <div className="mb-1 flex h-10 w-10 items-center justify-center rounded-xl bg-aurora-gradient shadow-lg shadow-aurora/25">
          <svg className="h-5 w-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
          </svg>
        </div>

        <h2 id="project-info-title" className="mt-3 font-display text-xl font-bold text-gradient">
          Taskflow
        </h2>
        <p className="mt-1 text-sm leading-relaxed text-silver">
          Full-stack task manager with JWT auth, per-user task privacy, filters, stats and CSV export.
        </p>

        <div className="mt-6 grid grid-cols-1 gap-5 sm:grid-cols-2">
          {SECTIONS.map((section) => (
            <div key={section.title}>
              <h3 className="mb-2 text-[11px] font-semibold uppercase tracking-wider text-ghost">
                {section.title}
              </h3>
              <ul className="space-y-1.5">
                {section.items.map((item) => (
                  <li key={item} className="flex items-center gap-2 text-sm text-cloud">
                    <span className="h-1 w-1 shrink-0 rounded-full bg-aurora-light" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-6 border-t border-mist/30 pt-5">
          <h3 className="mb-2 text-[11px] font-semibold uppercase tracking-wider text-ghost">Links</h3>
          <div className="space-y-2">
            {LINKS.map((link) => (
              <a
                key={link.href}
                href={link.href}
                target="_blank"
                rel="noreferrer noopener"
                className="group flex items-center justify-between rounded-lg border border-mist/40 bg-deep/60 px-4 py-2.5 transition-all duration-200 hover:border-aurora/40 hover:bg-deep"
              >
                <span className="text-sm font-medium text-snow">{link.label}</span>
                <span className="flex items-center gap-2 text-xs text-ghost">
                  {link.sub}
                  <svg
                    className="h-3.5 w-3.5 transition-transform duration-200 group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2}
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" d="M7 17L17 7M9 7h8v8" />
                  </svg>
                </span>
              </a>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
