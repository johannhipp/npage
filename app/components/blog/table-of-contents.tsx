'use client';

import { useEffect, useState } from 'react';
import { cn } from '@/lib/utils';

type Heading = {
  id: string;
  text: string;
  level: number;
};

export function TableOfContents({ headings }: { headings: Heading[] }) {
  const [activeId, setActiveId] = useState<string>('');

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveId(entry.target.id);
          }
        });
      },
      { rootMargin: '-80px 0px -80% 0px' },
    );

    headings.forEach(({ id }) => {
      const element = document.getElementById(id);
      if (element) observer.observe(element);
    });

    return () => observer.disconnect();
  }, [headings]);

  if (headings.length === 0) return null;

  return (
    <nav className="absolute right-full mr-8 top-0 hidden w-56 xl:block">
      <ul className="space-y-2 text-sm leading-7">
        {headings.map(({ id, text, level }) => (
          <li key={id} className={cn(level === 3 && 'pl-4')}>
            <a
              href={`#${id}`}
              className={cn(
                "group relative inline-flex w-fit items-center select-none transition-colors before:pointer-events-none before:absolute before:left-0 before:top-[1.5em] before:h-[0.05em] before:w-full before:bg-current before:content-[''] before:origin-left before:scale-x-0 before:transition-transform before:duration-300 before:ease-[cubic-bezier(0.4,0,0.2,1)] hover:before:origin-right hover:before:scale-x-100",
                activeId === id
                  ? 'text-foreground'
                  : 'text-muted-foreground hover:text-foreground',
              )}
            >
              <span>{text}</span>
              <svg
                className="ml-[0.3em] size-[0.55em] translate-y-1 opacity-0 transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100 motion-reduce:transition-none"
                fill="none"
                viewBox="0 0 10 10"
                xmlns="http://www.w3.org/2000/svg"
                aria-hidden="true"
              >
                <path
                  d="M1.004 9.166 9.337.833m0 0v8.333m0-8.333H1.004"
                  stroke="currentColor"
                  strokeWidth="1.25"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
}
