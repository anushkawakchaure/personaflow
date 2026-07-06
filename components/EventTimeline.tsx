"use client";

import { SessionEvent } from "@/types/session";
import { motion, AnimatePresence } from "framer-motion";
import { useState, useRef, useEffect } from "react";

interface EventTimelineProps {
  events: SessionEvent[];
}

export default function EventTimeline({ events }: EventTimelineProps) {
  const [visibleCount, setVisibleCount] = useState(events.length);
  const [isPlaying, setIsPlaying] = useState(false);
  const [speed, setSpeed] = useState(1);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  // Reset when events change
  useEffect(() => {
    setVisibleCount(events.length);
    setIsPlaying(false);
    if (intervalRef.current) clearInterval(intervalRef.current);
  }, [events]);

  const handlePlay = () => {
    if (isPlaying) {
      // Pause
      setIsPlaying(false);
      if (intervalRef.current) clearInterval(intervalRef.current);
      return;
    }
    // Start replay from beginning
    setVisibleCount(0);
    setIsPlaying(true);
    let step = 0;
    intervalRef.current = setInterval(() => {
      step++;
      setVisibleCount(step);
      if (step >= events.length) {
        clearInterval(intervalRef.current!);
        setIsPlaying(false);
      }
    }, 1000 / speed);
  };

  const handleSpeedChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSpeed(parseFloat(e.target.value));
    // Restart if playing
    if (isPlaying) {
      // Stop current and restart with new speed
      if (intervalRef.current) clearInterval(intervalRef.current);
      setIsPlaying(false);
      setTimeout(() => handlePlay(), 100);
    }
  };

  const visibleEvents = events.slice(0, visibleCount);

  return (
    <div className="bg-surface rounded-xl p-4 border border-border">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-sm font-medium text-text-primary">Customer Journey</h3>
        <div className="flex items-center gap-3">
          <button
            onClick={handlePlay}
            className="px-3 py-1 text-xs bg-accent rounded-md hover:bg-accent-dim transition-colors"
          >
            {isPlaying ? "⏸ Pause" : "▶ Play"}
          </button>
          <div className="flex items-center gap-1">
            <span className="text-2xs text-text-secondary">Speed</span>
            <input
              type="range"
              min="0.5"
              max="3"
              step="0.5"
              value={speed}
              onChange={handleSpeedChange}
              className="w-16 h-1 bg-surface-hover rounded-lg appearance-none cursor-pointer accent-accent"
            />
            <span className="text-2xs text-text-secondary">{speed}x</span>
          </div>
        </div>
      </div>

      <div className="space-y-3 min-h-[100px]">
        <AnimatePresence>
          {visibleEvents.map((event, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="flex items-start gap-3 relative"
            >
              {idx < visibleEvents.length - 1 && (
                <div className="absolute left-3 top-6 bottom-0 w-px bg-border-subtle" />
              )}
              <div className="w-6 h-6 rounded-full bg-surface-hover flex items-center justify-center flex-shrink-0">
                <span className="text-2xs text-text-secondary">{idx + 1}</span>
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-text-primary">{event.type.replace("_", " ")}</span>
                  <span className="text-2xs text-text-tertiary">
                    {new Date(event.timestamp).toLocaleString()}
                  </span>
                </div>
                {event.label && (
                  <div className="text-2xs text-text-secondary mt-0.5">"{event.label}"</div>
                )}
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
        {visibleEvents.length === 0 && (
          <div className="text-text-secondary text-sm text-center py-4">
            Press Play to see the journey
          </div>
        )}
      </div>
    </div>
  );
}
