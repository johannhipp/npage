"use client";

import { useState, useRef, useEffect } from "react";
import { usePostHog } from "posthog-js/react";

interface Track {
  id: string;
  name: string;
  audioSrc: string;
}

const tracks: Track[] = [
  { id: "1", name: "r7tK3g2e xQ1h nP9s wM4b", audioSrc: "/api/audio/k8x2p.mp3" },
  { id: "2", name: "j5Lm8yF2 vX6nR3", audioSrc: "/api/audio/m4qz7.mp3" },
  { id: "3", name: "x7k 2mQ9f", audioSrc: "/api/audio/j9tn3.mp3" },
  { id: "4", name: "h2Qp6wT4c", audioSrc: "/api/audio/w6rf1.mp3" },
  { id: "5", name: "b9Kz3mN1 y7Xt", audioSrc: "/api/audio/v3hy8.mp3" },
];

export default function ListeningbarPage() {
  const posthog = usePostHog();
  const [isMinimized, setIsMinimized] = useState(false);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const [selectedTrack, setSelectedTrack] = useState<Track | null>(tracks[0] || null);
  const [isPlaying, setIsPlaying] = useState(false);
  const windowRef = useRef<HTMLDivElement>(null);
  const audioRef = useRef<HTMLAudioElement>(null);
  const [isMobile, setIsMobile] = useState(false);

  // Notepad window state
  const [notepadPosition, setNotepadPosition] = useState({ x: 0, y: 0 });
  const [isNotepadDragging, setIsNotepadDragging] = useState(false);
  const [notepadDragOffset, setNotepadDragOffset] = useState({ x: 0, y: 0 });
  const [isNotepadMinimized, setIsNotepadMinimized] = useState(false);

  useEffect(() => {
    // Check if mobile
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    checkMobile();
    window.addEventListener("resize", checkMobile);

    // Center main window on mount (desktop only)
    if (windowRef.current && window.innerWidth >= 768) {
      const windowWidth = 259;
      const windowHeight = isMinimized ? 24 : 518;
      setPosition({
        x: (window.innerWidth - windowWidth) / 2 - 150,
        y: (window.innerHeight - windowHeight) / 2,
      });
    }
    // Position notepad window to the right (desktop only)
    if (window.innerWidth >= 768) {
      setNotepadPosition({
        x: (window.innerWidth - 280) / 2 + 150,
        y: (window.innerHeight - 200) / 2,
      });
    }

    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  // Handle play/pause
  useEffect(() => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.play();
      } else {
        audioRef.current.pause();
      }
    }
  }, [isPlaying]);

  // Handle track change
  useEffect(() => {
    if (audioRef.current && selectedTrack) {
      audioRef.current.src = selectedTrack.audioSrc;
      if (isPlaying) {
        audioRef.current.play();
      }
    }
  }, [selectedTrack]);

  // Handle track end - play next
  const handleTrackEnd = () => {
    const currentIndex = tracks.findIndex(t => t.id === selectedTrack?.id);
    if (currentIndex < tracks.length - 1) {
      setSelectedTrack(tracks[currentIndex + 1]);
    } else {
      setIsPlaying(false);
    }
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    if (windowRef.current && !isMobile) {
      setIsDragging(true);
      setDragOffset({
        x: e.clientX - position.x,
        y: e.clientY - position.y,
      });
    }
  };

  const handleNotepadMouseDown = (e: React.MouseEvent) => {
    if (!isMobile) {
      setIsNotepadDragging(true);
      setNotepadDragOffset({
        x: e.clientX - notepadPosition.x,
        y: e.clientY - notepadPosition.y,
      });
    }
  };

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (isDragging) {
        setPosition({
          x: e.clientX - dragOffset.x,
          y: e.clientY - dragOffset.y,
        });
      }
      if (isNotepadDragging) {
        setNotepadPosition({
          x: e.clientX - notepadDragOffset.x,
          y: e.clientY - notepadDragOffset.y,
        });
      }
    };

    const handleMouseUp = () => {
      setIsDragging(false);
      setIsNotepadDragging(false);
    };

    if (isDragging || isNotepadDragging) {
      document.addEventListener("mousemove", handleMouseMove);
      document.addEventListener("mouseup", handleMouseUp);
    }

    return () => {
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
    };
  }, [isDragging, dragOffset, isNotepadDragging, notepadDragOffset]);

  const playTrack = (track: Track) => {
    setSelectedTrack(track);
    setIsPlaying(true);
    posthog.capture("track_played", { track_id: track.id, track_name: track.name });
  };

  const togglePlayPause = () => {
    if (!selectedTrack) {
      setSelectedTrack(tracks[0]);
      setIsPlaying(true);
      posthog.capture("track_played", { track_id: tracks[0].id, track_name: tracks[0].name });
    } else {
      setIsPlaying(!isPlaying);
    }
  };

  const playPrevious = () => {
    const currentIndex = tracks.findIndex(t => t.id === selectedTrack?.id);
    if (currentIndex > 0) {
      setSelectedTrack(tracks[currentIndex - 1]);
      setIsPlaying(true);
      posthog.capture("track_played", { track_id: tracks[currentIndex - 1].id, track_name: tracks[currentIndex - 1].name });
    }
  };

  const playNext = () => {
    const currentIndex = tracks.findIndex(t => t.id === selectedTrack?.id);
    if (currentIndex < tracks.length - 1) {
      setSelectedTrack(tracks[currentIndex + 1]);
      setIsPlaying(true);
      posthog.capture("track_played", { track_id: tracks[currentIndex + 1].id, track_name: tracks[currentIndex + 1].name });
    }
  };

  return (
    <div
      className={`relative w-screen min-h-screen ${isMobile ? "overflow-y-auto" : "overflow-hidden"}`}
      style={{
        background: "#336699",
      }}
    >
      {/* Hidden audio element */}
      <audio
        ref={audioRef}
        onEnded={handleTrackEnd}
        src={selectedTrack?.audioSrc}
      />

      {/* Mobile layout container */}
      {isMobile ? (
        <div className="flex flex-col items-center gap-4 p-4 h-screen">
          {/* Notepad Window - on top for mobile */}
          <div
            className="w-[calc(100%-16px)] max-w-[320px]"
            style={{
              border: "1px solid #000",
              boxShadow: "1px 1px 0 #000",
            }}
          >
            {/* Title Bar */}
            <div
              className="h-[24px] flex items-center px-[4px] select-none relative"
              style={{
                background: "linear-gradient(to bottom, #fff 0%, #c0c0c0 10%, #c0c0c0 90%, #808080 100%)",
                borderBottom: "1px solid #000",
              }}
            >
              {/* Horizontal stripes pattern */}
              <div
                className="absolute inset-0 pointer-events-none"
                style={{
                  background: "repeating-linear-gradient(to bottom, transparent 0px, transparent 1px, rgba(255,255,255,0.4) 1px, rgba(255,255,255,0.4) 2px)",
                }}
              />

              {/* Close Box */}
              <button
                className="relative z-10 w-[13px] h-[11px] flex items-center justify-center hover:invert"
                style={{
                  background: "#c0c0c0",
                  border: "1px solid #000",
                  boxShadow: "inset 1px 1px 0 #fff, inset -1px -1px 0 #808080",
                }}
              />

              {/* Title */}
              <span className="relative z-10 flex-1 text-center text-black text-[11px] font-bold pointer-events-none" style={{ fontFamily: "Chicago, system-ui, sans-serif" }}>
                Hey Weserstr :)
              </span>

              {/* Window Controls (right side) */}
              <div className="relative z-10 flex gap-[2px]">
                <button
                  className="w-[13px] h-[11px] flex items-center justify-center hover:invert"
                  style={{
                    background: "#c0c0c0",
                    border: "1px solid #000",
                    boxShadow: "inset 1px 1px 0 #fff, inset -1px -1px 0 #808080",
                  }}
                >
                  <div className="w-[7px] h-[1px]" style={{ background: "#000" }} />
                </button>
                <button
                  className="w-[13px] h-[11px] flex items-center justify-center hover:invert"
                  style={{
                    background: "#c0c0c0",
                    border: "1px solid #000",
                    boxShadow: "inset 1px 1px 0 #fff, inset -1px -1px 0 #808080",
                  }}
                >
                  <div className="w-[7px] h-[7px]" style={{ border: "1px solid #000" }} />
                </button>
              </div>
            </div>

            {/* Text Content Area */}
            <div
              className="p-1"
              style={{
                background: "#c0c0c0",
              }}
            >
              <div
                className="w-full p-2"
                style={{
                  background: "#fff",
                  border: "1px solid #000",
                  boxShadow: "inset 1px 1px 0 #808080, inset -1px -1px 0 #fff",
                  fontFamily: "Monaco, monospace",
                  fontSize: "12px",
                  lineHeight: "1.4",
                  whiteSpace: "pre-wrap",
                }}
              >
{`Hey, we're trying something new. Music should be fun, explorative and intensively inclusive. A place to call home, even if you just turned up.

We're setting up shop in April! And yes, Berlin is going to get another collective ;)`}
              </div>
            </div>
          </div>

          {/* Music Player Window - below for mobile */}
          <div
            ref={windowRef}
            className="w-[calc(100%-16px)] max-w-[320px] flex-1 flex flex-col min-h-0"
            style={{
              border: "1px solid #000",
              boxShadow: "1px 1px 0 #000",
            }}
          >
            {/* Title Bar */}
            <div
              className="h-[24px] flex items-center px-[4px] select-none relative"
              style={{
                background: "linear-gradient(to bottom, #fff 0%, #c0c0c0 10%, #c0c0c0 90%, #808080 100%)",
                borderBottom: "1px solid #000",
              }}
            >
              {/* Horizontal stripes pattern */}
              <div
                className="absolute inset-0 pointer-events-none"
                style={{
                  background: "repeating-linear-gradient(to bottom, transparent 0px, transparent 1px, rgba(255,255,255,0.4) 1px, rgba(255,255,255,0.4) 2px)",
                }}
              />

              {/* Close Box */}
              <button
                onClick={() => window.history.back()}
                className="relative z-10 w-[13px] h-[11px] flex items-center justify-center hover:invert"
                style={{
                  background: "#c0c0c0",
                  border: "1px solid #000",
                  boxShadow: "inset 1px 1px 0 #fff, inset -1px -1px 0 #808080",
                }}
              />

              {/* Title */}
              <span className="relative z-10 flex-1 text-center text-black text-[11px] font-bold pointer-events-none" style={{ fontFamily: "Chicago, system-ui, sans-serif" }}>
                listeningbar
              </span>

              {/* Window Controls (right side) */}
              <div className="relative z-10 flex gap-[2px]">
                <button
                  className="w-[13px] h-[11px] flex items-center justify-center hover:invert"
                  style={{
                    background: "#c0c0c0",
                    border: "1px solid #000",
                    boxShadow: "inset 1px 1px 0 #fff, inset -1px -1px 0 #808080",
                  }}
                >
                  <div className="w-[7px] h-[1px]" style={{ background: "#000" }} />
                </button>
                <button
                  className="w-[13px] h-[11px] flex items-center justify-center hover:invert"
                  style={{
                    background: "#c0c0c0",
                    border: "1px solid #000",
                    boxShadow: "inset 1px 1px 0 #fff, inset -1px -1px 0 #808080",
                  }}
                >
                  <div className="w-[7px] h-[7px]" style={{ border: "1px solid #000" }} />
                </button>
              </div>
            </div>

            {/* Content Area */}
            <div
              className="flex-1 flex flex-col min-h-0"
              style={{
                background: "#c0c0c0",
              }}
            >
              {/* Track List */}
              <div
                className="m-2 flex-1 overflow-y-auto min-h-0"
                style={{
                  background: "#fff",
                  border: "1px solid #000",
                  boxShadow: "inset 1px 1px 0 #808080, inset -1px -1px 0 #fff",
                }}
              >
                {tracks.map((track, index) => (
                  <div
                    key={track.id}
                    onClick={() => playTrack(track)}
                    className="flex items-center px-2 py-1 cursor-pointer select-none"
                    style={{
                      background: selectedTrack?.id === track.id ? "#000080" : "transparent",
                      color: selectedTrack?.id === track.id ? "#fff" : "#000",
                      fontFamily: "Geneva, system-ui, sans-serif",
                      fontSize: "11px",
                      borderBottom: index < tracks.length - 1 ? "1px solid #c0c0c0" : "none",
                    }}
                  >
                    <span className="mr-2">{selectedTrack?.id === track.id && isPlaying ? "▶" : "♪"}</span>
                    <div className="flex-1 truncate">
                      <div
                        className="font-bold truncate"
                        style={{
                          filter: track.id === "3" ? "blur(4px)" : "none",
                          userSelect: track.id === "3" ? "none" : "auto",
                        }}
                      >
                        {track.name}
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Player Controls */}
              <div
                className="mx-2 mb-2 p-2"
                style={{
                  background: "#c0c0c0",
                  border: "1px solid #000",
                  boxShadow: "inset 1px 1px 0 #fff, inset -1px -1px 0 #808080",
                }}
              >
                {/* Now Playing Info */}
                <div
                  className="mb-2 px-2 py-1 text-center truncate"
                  style={{
                    background: "#fff",
                    border: "1px solid #808080",
                    fontFamily: "Geneva, system-ui, sans-serif",
                    fontSize: "10px",
                  }}
                >
                  <span style={{ filter: selectedTrack?.id === "3" ? "blur(4px)" : "none" }}>
                    {selectedTrack ? selectedTrack.name : "No track selected"}
                  </span>
                </div>

                {/* Control Buttons */}
                <div className="flex justify-center gap-1">
                  {/* Previous */}
                  <button
                    className="w-8 h-6 flex items-center justify-center text-[10px]"
                    style={{
                      background: "#c0c0c0",
                      border: "1px solid #000",
                      boxShadow: "inset 1px 1px 0 #fff, inset -1px -1px 0 #808080",
                      fontFamily: "Geneva, system-ui, sans-serif",
                    }}
                    onClick={playPrevious}
                  >
                    ◀◀
                  </button>

                  {/* Play/Pause */}
                  <button
                    className="w-10 h-6 flex items-center justify-center text-[10px]"
                    style={{
                      background: "#c0c0c0",
                      border: "1px solid #000",
                      boxShadow: isPlaying
                        ? "inset 1px 1px 0 #808080, inset -1px -1px 0 #fff"
                        : "inset 1px 1px 0 #fff, inset -1px -1px 0 #808080",
                      fontFamily: "Geneva, system-ui, sans-serif",
                    }}
                    onClick={togglePlayPause}
                  >
                    {isPlaying ? "❚❚" : "▶"}
                  </button>

                  {/* Next */}
                  <button
                    className="w-8 h-6 flex items-center justify-center text-[10px]"
                    style={{
                      background: "#c0c0c0",
                      border: "1px solid #000",
                      boxShadow: "inset 1px 1px 0 #fff, inset -1px -1px 0 #808080",
                      fontFamily: "Geneva, system-ui, sans-serif",
                    }}
                    onClick={playNext}
                  >
                    ▶▶
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <>
          {/* Desktop: Mac OS 8 Window */}
          <div
            ref={windowRef}
            className={`absolute w-[259px] ${
              isMinimized ? "h-[24px]" : "h-[518px]"
            }`}
            style={{
              left: position.x,
              top: position.y,
              border: "1px solid #000",
              boxShadow: "1px 1px 0 #000",
              transition: isDragging ? "none" : "height 0.3s",
            }}
          >
        {/* Title Bar */}
        <div
          className="h-[24px] flex items-center px-[4px] select-none relative"
          style={{
            background: "linear-gradient(to bottom, #fff 0%, #c0c0c0 10%, #c0c0c0 90%, #808080 100%)",
            borderBottom: "1px solid #000",
            cursor: isDragging ? "grabbing" : "grab",
          }}
          onMouseDown={handleMouseDown}
        >
          {/* Horizontal stripes pattern */}
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              background: "repeating-linear-gradient(to bottom, transparent 0px, transparent 1px, rgba(255,255,255,0.4) 1px, rgba(255,255,255,0.4) 2px)",
            }}
          />

          {/* Close Box */}
          <button
            onClick={() => window.history.back()}
            className="relative z-10 w-[13px] h-[11px] flex items-center justify-center hover:invert"
            style={{
              background: "#c0c0c0",
              border: "1px solid #000",
              boxShadow: "inset 1px 1px 0 #fff, inset -1px -1px 0 #808080",
            }}
          />

          {/* Title */}
          <span className="relative z-10 flex-1 text-center text-black text-[11px] font-bold pointer-events-none" style={{ fontFamily: "Chicago, system-ui, sans-serif" }}>
            listeningbar
          </span>

          {/* Window Controls (right side) */}
          <div className="relative z-10 flex gap-[2px]">
            {/* Collapse Box */}
            <button
              onClick={() => setIsMinimized(!isMinimized)}
              className="w-[13px] h-[11px] flex items-center justify-center hover:invert"
              style={{
                background: "#c0c0c0",
                border: "1px solid #000",
                boxShadow: "inset 1px 1px 0 #fff, inset -1px -1px 0 #808080",
              }}
            >
              <div
                className="w-[7px] h-[1px]"
                style={{ background: "#000" }}
              />
            </button>
            {/* Zoom Box */}
            <button
              className="w-[13px] h-[11px] flex items-center justify-center hover:invert"
              style={{
                background: "#c0c0c0",
                border: "1px solid #000",
                boxShadow: "inset 1px 1px 0 #fff, inset -1px -1px 0 #808080",
              }}
            >
              <div
                className="w-[7px] h-[7px]"
                style={{ border: "1px solid #000" }}
              />
            </button>
          </div>
        </div>

        {/* Content Area */}
        {!isMinimized && (
          <div
            className="h-[calc(100%-24px)] flex flex-col"
            style={{
              background: "#c0c0c0",
            }}
          >
            {/* Track List */}
            <div
              className="flex-1 m-2 overflow-y-auto"
              style={{
                background: "#fff",
                border: "1px solid #000",
                boxShadow: "inset 1px 1px 0 #808080, inset -1px -1px 0 #fff",
              }}
            >
              {tracks.map((track, index) => (
                <div
                  key={track.id}
                  onClick={() => playTrack(track)}
                  className="flex items-center px-2 py-1 cursor-pointer select-none"
                  style={{
                    background: selectedTrack?.id === track.id ? "#000080" : "transparent",
                    color: selectedTrack?.id === track.id ? "#fff" : "#000",
                    fontFamily: "Geneva, system-ui, sans-serif",
                    fontSize: "11px",
                    borderBottom: index < tracks.length - 1 ? "1px solid #c0c0c0" : "none",
                  }}
                >
                  <span className="mr-2">{selectedTrack?.id === track.id && isPlaying ? "▶" : "♪"}</span>
                  <div className="flex-1 truncate">
                    <div
                      className="font-bold truncate"
                      style={{
                        filter: track.id === "3" ? "blur(4px)" : "none",
                        userSelect: track.id === "3" ? "none" : "auto",
                      }}
                    >
                      {track.name}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Player Controls */}
            <div
              className="mx-2 mb-2 p-2"
              style={{
                background: "#c0c0c0",
                border: "1px solid #000",
                boxShadow: "inset 1px 1px 0 #fff, inset -1px -1px 0 #808080",
              }}
            >
              {/* Now Playing Info */}
              <div
                className="mb-2 px-2 py-1 text-center truncate"
                style={{
                  background: "#fff",
                  border: "1px solid #808080",
                  fontFamily: "Geneva, system-ui, sans-serif",
                  fontSize: "10px",
                }}
              >
                <span style={{ filter: selectedTrack?.id === "3" ? "blur(4px)" : "none" }}>
                  {selectedTrack ? selectedTrack.name : "No track selected"}
                </span>
              </div>

              {/* Control Buttons */}
              <div className="flex justify-center gap-1">
                {/* Previous */}
                <button
                  className="w-8 h-6 flex items-center justify-center text-[10px]"
                  style={{
                    background: "#c0c0c0",
                    border: "1px solid #000",
                    boxShadow: "inset 1px 1px 0 #fff, inset -1px -1px 0 #808080",
                    fontFamily: "Geneva, system-ui, sans-serif",
                  }}
                  onClick={playPrevious}
                >
                  ◀◀
                </button>

                {/* Play/Pause */}
                <button
                  className="w-10 h-6 flex items-center justify-center text-[10px]"
                  style={{
                    background: "#c0c0c0",
                    border: "1px solid #000",
                    boxShadow: isPlaying
                      ? "inset 1px 1px 0 #808080, inset -1px -1px 0 #fff"
                      : "inset 1px 1px 0 #fff, inset -1px -1px 0 #808080",
                    fontFamily: "Geneva, system-ui, sans-serif",
                  }}
                  onClick={togglePlayPause}
                >
                  {isPlaying ? "❚❚" : "▶"}
                </button>

                {/* Next */}
                <button
                  className="w-8 h-6 flex items-center justify-center text-[10px]"
                  style={{
                    background: "#c0c0c0",
                    border: "1px solid #000",
                    boxShadow: "inset 1px 1px 0 #fff, inset -1px -1px 0 #808080",
                    fontFamily: "Geneva, system-ui, sans-serif",
                  }}
                  onClick={playNext}
                >
                  ▶▶
                </button>
              </div>
            </div>

          </div>
        )}
      </div>

      {/* Desktop: SimpleText/Notepad Window */}
      <div
        className={`absolute w-[280px] ${
          isNotepadMinimized ? "h-[24px]" : "h-[200px]"
        }`}
        style={{
          left: notepadPosition.x,
          top: notepadPosition.y,
          border: "1px solid #000",
          boxShadow: "1px 1px 0 #000",
          transition: isNotepadDragging ? "none" : "height 0.3s",
        }}
      >
        {/* Title Bar */}
        <div
          className="h-[24px] flex items-center px-[4px] select-none relative"
          style={{
            background: "linear-gradient(to bottom, #fff 0%, #c0c0c0 10%, #c0c0c0 90%, #808080 100%)",
            borderBottom: "1px solid #000",
            cursor: isNotepadDragging ? "grabbing" : "grab",
          }}
          onMouseDown={handleNotepadMouseDown}
        >
          {/* Horizontal stripes pattern */}
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              background: "repeating-linear-gradient(to bottom, transparent 0px, transparent 1px, rgba(255,255,255,0.4) 1px, rgba(255,255,255,0.4) 2px)",
            }}
          />

          {/* Close Box */}
          <button
            className="relative z-10 w-[13px] h-[11px] flex items-center justify-center hover:invert"
            style={{
              background: "#c0c0c0",
              border: "1px solid #000",
              boxShadow: "inset 1px 1px 0 #fff, inset -1px -1px 0 #808080",
            }}
          />

          {/* Title */}
          <span className="relative z-10 flex-1 text-center text-black text-[11px] font-bold pointer-events-none" style={{ fontFamily: "Chicago, system-ui, sans-serif" }}>
            Hey Weserstr :)
          </span>

          {/* Window Controls (right side) */}
          <div className="relative z-10 flex gap-[2px]">
            {/* Collapse Box */}
            <button
              onClick={() => setIsNotepadMinimized(!isNotepadMinimized)}
              className="w-[13px] h-[11px] flex items-center justify-center hover:invert"
              style={{
                background: "#c0c0c0",
                border: "1px solid #000",
                boxShadow: "inset 1px 1px 0 #fff, inset -1px -1px 0 #808080",
              }}
            >
              <div
                className="w-[7px] h-[1px]"
                style={{ background: "#000" }}
              />
            </button>
            {/* Zoom Box */}
            <button
              className="w-[13px] h-[11px] flex items-center justify-center hover:invert"
              style={{
                background: "#c0c0c0",
                border: "1px solid #000",
                boxShadow: "inset 1px 1px 0 #fff, inset -1px -1px 0 #808080",
              }}
            >
              <div
                className="w-[7px] h-[7px]"
                style={{ border: "1px solid #000" }}
              />
            </button>
          </div>
        </div>

        {/* Text Content Area */}
        {!isNotepadMinimized && (
          <div
            className="h-[calc(100%-24px)] p-1"
            style={{
              background: "#c0c0c0",
            }}
          >
            <div
              className="w-full h-full p-2 overflow-auto"
              style={{
                background: "#fff",
                border: "1px solid #000",
                boxShadow: "inset 1px 1px 0 #808080, inset -1px -1px 0 #fff",
                fontFamily: "Monaco, monospace",
                fontSize: "12px",
                lineHeight: "1.4",
                whiteSpace: "pre-wrap",
              }}
            >
{`Hey, we're trying something new. Music should be fun, explorative and intensively inclusive. A place to call home, even if you just turned up.

We're setting up shop in April! And yes, Berlin is going to get another collective ;)`}
            </div>
          </div>
        )}
      </div>
        </>
      )}
    </div>
  );
}
