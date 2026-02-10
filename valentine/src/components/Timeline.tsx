import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { siteConfig } from "../config";

function parseDDMMYYYY(dateStr: string): Date {
  const [dd, mm, yyyy] = dateStr.split("/").map(Number);
  return new Date(yyyy, mm - 1, dd);
}

function getDaysDiff(target: Date): number {
  const now = new Date();
  const todayMidnight = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const targetMidnight = new Date(target.getFullYear(), target.getMonth(), target.getDate());
  return Math.round((targetMidnight.getTime() - todayMidnight.getTime()) / (1000 * 60 * 60 * 24));
}

export default function Timeline() {
  const [flipped, setFlipped] = useState(false);
  const [countdownText, setCountdownText] = useState("");

  const valentinesDate = parseDDMMYYYY(siteConfig.dates.valentinesDate);

  useEffect(() => {
    const update = () => {
      const diff = getDaysDiff(valentinesDate);
      if (diff > 0) {
        setCountdownText(`${diff} day${diff !== 1 ? "s" : ""} until Valentine's Day 💘`);
      } else if (diff === 0) {
        setCountdownText("It's Valentine's Day! 💖");
      } else {
        const absDiff = Math.abs(diff);
        setCountdownText(`${absDiff} day${absDiff !== 1 ? "s" : ""} since Valentine's 2026 💕`);
      }
    };
    update();
    const interval = setInterval(update, 60000);
    return () => clearInterval(interval);
  }, []);

  return (
    <section
      id="timeline"
      className="min-h-screen flex flex-col items-center justify-center px-6 py-20"
    >
      <motion.h2
        className="text-3xl sm:text-4xl font-bold text-blush-800 mb-10 text-center"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.6 }}
      >
        Our Little Timeline
      </motion.h2>

      {/* Flip card */}
      <motion.div
        className="w-full max-w-sm perspective-[1000px] cursor-pointer mb-8"
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-80px" }}
        transition={{ duration: 0.6, delay: 0.2 }}
        onClick={() => setFlipped(!flipped)}
        onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); setFlipped(!flipped); } }}
        tabIndex={0}
        role="button"
        aria-label={flipped ? "Show timeline dates" : "Show love note"}
      >
        <div className={`flip-card-inner relative w-full ${flipped ? "flipped" : ""}`} style={{ minHeight: 280 }}>
          {/* Front */}
          <div className="flip-card-front absolute inset-0 bg-white/80 backdrop-blur-md rounded-3xl shadow-xl p-8 flex flex-col items-center justify-center gap-4">
            <div className="text-4xl mb-2">💑</div>
            <div className="space-y-3 text-center">
              <div className="flex items-center gap-3 justify-center">
                <span className="w-3 h-3 rounded-full bg-blush-400 inline-block shrink-0" />
                <span className="text-blush-700 font-medium">
                  Our official day: {siteConfig.dates.officialDate}
                </span>
              </div>
              <div className="flex items-center gap-3 justify-center">
                <span className="w-3 h-3 rounded-full bg-blush-500 inline-block shrink-0" />
                <span className="text-blush-700 font-medium">
                  Valentine's: {siteConfig.dates.valentinesDate}
                </span>
              </div>
              <p className="text-sm text-blush-400 italic mt-2">
                Time is confusing when I'm thinking about you 😅
              </p>
            </div>
            <button
              className="mt-4 text-sm text-blush-500 hover:text-blush-700 font-medium
                         transition-colors underline underline-offset-4"
              onClick={(e) => { e.stopPropagation(); setFlipped(true); }}
            >
              💌 Tap for a memory
            </button>
          </div>

          {/* Back */}
          <div className="flip-card-back absolute inset-0 bg-gradient-to-br from-blush-500 to-blush-600 rounded-3xl shadow-xl p-8 flex flex-col items-center justify-center">
            <div className="text-4xl mb-4">💌</div>
            <p className="text-white text-center text-lg leading-relaxed font-light">
              {siteConfig.loveNote}
            </p>
            <button
              className="mt-6 text-sm text-white/80 hover:text-white font-medium
                         transition-colors underline underline-offset-4"
              onClick={(e) => { e.stopPropagation(); setFlipped(false); }}
            >
              ← Flip back
            </button>
          </div>
        </div>
      </motion.div>

      {/* Countdown widget */}
      <motion.div
        className="bg-white/60 backdrop-blur-sm rounded-2xl px-8 py-4 shadow-lg"
        initial={{ opacity: 0, scale: 0.9 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true, margin: "-60px" }}
        transition={{ duration: 0.5, delay: 0.4 }}
      >
        <p className="text-blush-700 font-semibold text-lg text-center">
          {countdownText}
        </p>
      </motion.div>

      {/* Scroll cue */}
      <motion.div
        className="mt-12"
        animate={{ y: [0, 8, 0] }}
        transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
      >
        <span className="text-blush-400 text-xl">↓</span>
      </motion.div>
    </section>
  );
}
