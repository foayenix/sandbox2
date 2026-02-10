import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { siteConfig } from "../config";

export default function Reasons() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [direction, setDirection] = useState(1);
  const [reason7Revealed, setReason7Revealed] = useState(false);
  const total = siteConfig.reasons14.length;

  const goNext = () => {
    if (currentIndex < total - 1) {
      setDirection(1);
      setCurrentIndex((i) => i + 1);
      setReason7Revealed(false);
    }
  };

  const goBack = () => {
    if (currentIndex > 0) {
      setDirection(-1);
      setCurrentIndex((i) => i - 1);
      setReason7Revealed(false);
    }
  };

  const scrollToGame = () => {
    document.getElementById("game")?.scrollIntoView({ behavior: "smooth" });
  };

  const isCheekyCard = currentIndex === 6; // reason #7 (0-indexed)
  const isLast = currentIndex === total - 1;

  const variants = {
    enter: (dir: number) => ({
      x: dir > 0 ? 300 : -300,
      opacity: 0,
      scale: 0.8,
      rotateY: dir > 0 ? 15 : -15,
    }),
    center: {
      x: 0,
      opacity: 1,
      scale: 1,
      rotateY: 0,
    },
    exit: (dir: number) => ({
      x: dir > 0 ? -300 : 300,
      opacity: 0,
      scale: 0.8,
      rotateY: dir > 0 ? -15 : 15,
    }),
  };

  return (
    <section
      id="reasons"
      className="min-h-screen flex flex-col items-center justify-center px-6 py-20"
    >
      <motion.h2
        className="text-3xl sm:text-4xl font-bold text-blush-800 mb-4 text-center"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.6 }}
      >
        14 Reasons Why You Should
        <br />
        Pick Me as Your Valentine
      </motion.h2>

      <motion.p
        className="text-blush-500 mb-10 text-center"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ delay: 0.3 }}
      >
        Swipe through each one 💕
      </motion.p>

      {/* Card area */}
      <div className="relative w-full max-w-md" style={{ minHeight: 260 }}>
        <AnimatePresence mode="wait" custom={direction}>
          <motion.div
            key={currentIndex}
            custom={direction}
            variants={variants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{
              x: { type: "spring", stiffness: 300, damping: 30 },
              opacity: { duration: 0.25 },
              scale: { duration: 0.3 },
              rotateY: { duration: 0.3 },
            }}
            className="w-full"
          >
            <div className="bg-white/80 backdrop-blur-md rounded-3xl shadow-xl p-8 text-center">
              {/* Number badge */}
              <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-blush-500 text-white font-bold text-lg mb-5 shadow-md">
                {currentIndex + 1}
              </div>

              {/* Reason text */}
              {isCheekyCard && !reason7Revealed ? (
                <div>
                  <p className="text-xl text-blush-800 leading-relaxed blur-md select-none">
                    {siteConfig.reasons14[currentIndex]}
                  </p>
                  <button
                    onClick={() => setReason7Revealed(true)}
                    className="mt-4 text-blush-500 hover:text-blush-700 font-medium text-sm
                               underline underline-offset-4 transition-colors cursor-pointer"
                  >
                    Tap to reveal 😏
                  </button>
                </div>
              ) : (
                <motion.p
                  className="text-xl text-blush-800 leading-relaxed"
                  initial={isCheekyCard ? { filter: "blur(12px)" } : {}}
                  animate={{ filter: "blur(0px)" }}
                  transition={{ duration: 0.5 }}
                >
                  {siteConfig.reasons14[currentIndex]}
                </motion.p>
              )}
            </div>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Progress indicator */}
      <div className="flex items-center gap-1.5 mt-6 mb-4">
        {Array.from({ length: total }, (_, i) => (
          <div
            key={i}
            className={`h-2 rounded-full transition-all duration-300 ${
              i === currentIndex
                ? "w-6 bg-blush-500"
                : i < currentIndex
                ? "w-2 bg-blush-400"
                : "w-2 bg-blush-200"
            }`}
          />
        ))}
      </div>

      <p className="text-sm text-blush-400 mb-6">
        {currentIndex + 1} / {total}
      </p>

      {/* Navigation */}
      <div className="flex items-center gap-4">
        <motion.button
          onClick={goBack}
          disabled={currentIndex === 0}
          className="bg-white/70 hover:bg-white text-blush-600 font-semibold py-2.5 px-6 rounded-full
                     shadow-md disabled:opacity-30 disabled:cursor-not-allowed transition-all cursor-pointer
                     focus:outline-none focus:ring-4 focus:ring-blush-300"
          whileHover={currentIndex > 0 ? { scale: 1.05 } : {}}
          whileTap={currentIndex > 0 ? { scale: 0.95 } : {}}
        >
          ← Back
        </motion.button>

        {isLast ? (
          <motion.button
            onClick={scrollToGame}
            className="bg-blush-500 hover:bg-blush-600 text-white font-semibold py-2.5 px-6 rounded-full
                       shadow-lg hover:shadow-xl transition-all cursor-pointer
                       focus:outline-none focus:ring-4 focus:ring-blush-300"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            animate={{ scale: [1, 1.05, 1] }}
            transition={{ duration: 1.5, repeat: Infinity }}
          >
            Okay… continue 💘
          </motion.button>
        ) : (
          <motion.button
            onClick={goNext}
            className="bg-blush-500 hover:bg-blush-600 text-white font-semibold py-2.5 px-6 rounded-full
                       shadow-lg hover:shadow-xl transition-all cursor-pointer
                       focus:outline-none focus:ring-4 focus:ring-blush-300"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Next →
          </motion.button>
        )}
      </div>
    </section>
  );
}
