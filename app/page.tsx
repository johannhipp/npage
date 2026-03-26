"use client";

import CircularGallery from "@/components/CircularGallery";

const galleryItems = [
  { image: "/images/photo0.jpg", text: "" },
  { image: "/images/photo3.jpg", text: "" },
  { image: "/images/L1100431.jpg", text: "" },
  { image: "/images/L1090728.jpg", text: "" },
  { image: "/images/L1100236.jpg", text: "" },
];

export default function Home() {
  return (
    <div className="min-h-screen md:h-screen md:overflow-hidden">
      <div className="px-4 pt-24 md:pt-16">
        <header className="text-center">
          <p className="mx-auto max-w-xl text-gray-500">
            still trying to figure all of this out. love ultrarunning, trad climbing and alpine
            mountaineering. authenticity is all that matters.
          </p>
        </header>
      </div>

      <div className="relative mt-3 h-[300px] sm:h-[400px] md:h-[500px] lg:h-[600px]">
        <CircularGallery items={galleryItems} bend={2} />
      </div>
    </div>
  );
}
