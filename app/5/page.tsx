"use client";

import { useEffect, useRef, useState } from "react";
import { SplitText } from "@/components/ui/split-text";

const galleryItems = [
  { image: "/images/photo0.jpg", alt: "Photo 0" },
  { image: "/images/photo2.jpg", alt: "Photo 2" },
  { image: "/images/photo3.jpg", alt: "Photo 3" },
  { image: "/images/L1100431.jpg", alt: "Photo 4" },
  { image: "/images/L1090728.jpg", alt: "Photo 5" },
  { image: "/images/L1100236.jpg", alt: "Photo 6" },
];

export default function Layout5() {
  const [mounted, setMounted] = useState(false);
  const [rotation, setRotation] = useState(0);
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const animationRef = useRef<number>(0);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    const animate = () => {
      setRotation((prev) => (prev + 0.2) % 360);
      animationRef.current = requestAnimationFrame(animate);
    };
    animationRef.current = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animationRef.current);
  }, []);

  return (
    <div className="min-h-screen">
      <div className="px-4 pt-16 md:pt-6">
        <header className="text-center">
          <SplitText
            as="h1"
            text="Johann Hipp"
            className="font-[family-name:var(--font-noto-serif)] font-extrabold text-4xl text-gray-900 tracking-tight sm:text-5xl md:text-6xl"
          />
          <p className="mx-auto mt-6 max-w-xl text-gray-500">
            still trying to figure all of this out. love ultrarunning, trad climbing and alpine
            mountaineering. authenticity is all that matters.
          </p>
        </header>
      </div>

      <div className="relative mx-auto mt-12 h-[500px] max-w-4xl">
        <div className="absolute left-1/2 top-1/2 h-32 w-32 -translate-x-1/2 -translate-y-1/2 rounded-full bg-gray-100 shadow-inner" />

        {galleryItems.map((item, index) => {
          const angle = rotation + (index * 360) / galleryItems.length;
          const radius = 180;
          const rad = (angle * Math.PI) / 180;
          const x = Math.cos(rad) * radius;
          const y = Math.sin(rad) * radius * 0.5;
          const scale = hoveredIndex === index ? 1.2 : 0.9 + (Math.sin(rad) + 1) * 0.1;
          const zIndex = Math.round((Math.sin(rad) + 1) * 10) + 1;

          return (
            <div
              key={item.image}
              className="absolute left-1/2 top-1/2 aspect-[4/3] w-36 overflow-hidden rounded-lg bg-gray-100 shadow-lg transition-transform duration-150 ease-out hover:shadow-xl sm:w-44"
              style={{
                transform: mounted
                  ? `translate(calc(-50% + ${x}px), calc(-50% + ${y}px)) scale(${scale})`
                  : "translate(-50%, -50%) scale(0)",
                opacity: mounted ? 1 : 0,
                zIndex: hoveredIndex === index ? 100 : zIndex,
                transitionDelay: `${index * 0.1}s`,
              }}
              onMouseEnter={() => setHoveredIndex(index)}
              onMouseLeave={() => setHoveredIndex(null)}
            >
              <img
                src={item.image}
                alt={item.alt}
                className="h-full w-full object-cover"
              />
            </div>
          );
        })}
      </div>
    </div>
  );
}
