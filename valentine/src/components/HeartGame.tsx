import { useState, useEffect, useCallback, useRef } from "react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";

const GAME_DURATION = 10;

interface FloatingHeart {
  id: number;
  x: number;
  y: number;
  size: number;
  speed: number;
  emoji: string;
}

const HEART_EMOJIS = ["💖", "💕", "💗", "💓", "❤️", "💘", "💝"];

export default function HeartGame() {
  const prefersReduced = useReducedMotion();
  const [gameState, setGameState] = useState<"idle" | "playing" | "done">("idle");
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(GAME_DURATION);
  const [hearts, setHearts] = useState<FloatingHeart[]>([]);
  const [pops, setPops] = useState<{ id: number; x: number; y: number }[]>([]);
  const nextId = useRef(0);
  const gameAreaRef = useRef<HTMLDivElement>(null);

  const spawnHeart = useCallback(() => {
    const id = nextId.current++;
    const emoji = HEART_EMOJIS[Math.floor(Math.random() * HEART_EMOJIS.length)];
    const heart: FloatingHeart = {
      id,
      x: 10 + Math.random() * 80, // percentage
      y: 105, // start below
      size: 28 + Math.random() * 20,
      speed: 0.4 + Math.random() * 0.6,
      emoji,
    };
    setHearts((prev) => [...prev, heart]);
  }, []);

  // Game timer
  useEffect(() => {
    if (gameState !== "playing") return;
    const timer = setInterval(() => {
      setTimeLeft((t) => {
        if (t <= 1) {
          setGameState("done");
          setHearts([]);
          return 0;
        }
        return t - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [gameState]);

  // Spawn hearts
  useEffect(() => {
    if (gameState !== "playing") return;
    const spawnRate = prefersReduced ? 800 : 500;
    const interval = setInterval(spawnHeart, spawnRate);
    return () => clearInterval(interval);
  }, [gameState, spawnHeart, prefersReduced]);

  // Animate hearts upward
  useEffect(() => {
    if (gameState !== "playing") return;
    const interval = setInterval(() => {
      setHearts((prev) =>
        prev
          .map((h) => ({ ...h, y: h.y - h.speed * 2 }))
          .filter((h) => h.y > -10)
      );
    }, 30);
    return () => clearInterval(interval);
  }, [gameState]);

  const catchHeart = (id: number, x: number, y: number) => {
    setScore((s) => s + 1);
    setHearts((prev) => prev.filter((h) => h.id !== id));
    const popId = Date.now() + Math.random();
    setPops((prev) => [...prev, { id: popId, x, y }]);
    setTimeout(() => setPops((prev) => prev.filter((p) => p.id !== popId)), 600);
  };

  const startGame = () => {
    setScore(0);
    setTimeLeft(GAME_DURATION);
    setHearts([]);
    nextId.current = 0;
    setGameState("playing");
  };

  const scrollToAsk = () => {
    document.getElementById("ask")?.scrollIntoView({ behavior: "smooth" });
  };

  const getResultMessage = () => {
    if (score >= 20) return "You're incredible! Every heart caught is my heart for you 💖";
    if (score >= 12) return "Amazing! You've got quick hands and my whole heart 💕";
    if (score >= 6) return "Not bad! But you've already caught the only heart that matters — mine 💗";
    return "It's okay, you don't need to catch hearts... you already have mine 💓";
  };

  return (
    <section
      id="game"
      className="min-h-screen flex flex-col items-center justify-center px-6 py-20"
    >
      <motion.h2
        className="text-3xl sm:text-4xl font-bold text-blush-800 mb-4 text-center"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.6 }}
      >
        Catch the Hearts 💕
      </motion.h2>

      <motion.p
        className="text-blush-500 mb-8 text-center"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ delay: 0.3 }}
      >
        Tap as many hearts as you can in {GAME_DURATION} seconds!
      </motion.p>

      {/* Game area */}
      <div
        ref={gameAreaRef}
        className="relative w-full max-w-sm bg-white/40 backdrop-blur-sm rounded-3xl shadow-xl overflow-hidden"
        style={{ height: 400 }}
      >
        {gameState === "idle" && (
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-4">
            <p className="text-5xl">💖</p>
            <motion.button
              onClick={startGame}
              className="bg-blush-500 hover:bg-blush-600 text-white font-semibold py-3 px-8 rounded-full
                         shadow-lg transition-all cursor-pointer focus:outline-none focus:ring-4 focus:ring-blush-300"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Play! 🎮
            </motion.button>
          </div>
        )}

        {gameState === "playing" && (
          <>
            {/* HUD */}
            <div className="absolute top-4 left-4 right-4 flex justify-between z-10">
              <div className="bg-white/80 backdrop-blur-sm rounded-full px-4 py-1.5 shadow-md">
                <span className="text-blush-700 font-semibold text-sm">💖 {score}</span>
              </div>
              <div className="bg-white/80 backdrop-blur-sm rounded-full px-4 py-1.5 shadow-md">
                <span className="text-blush-700 font-semibold text-sm">⏱ {timeLeft}s</span>
              </div>
            </div>

            {/* Hearts */}
            {hearts.map((h) => (
              <button
                key={h.id}
                onClick={() => catchHeart(h.id, h.x, h.y)}
                className="absolute cursor-pointer select-none transition-transform active:scale-125
                           focus:outline-none focus:ring-2 focus:ring-blush-300 focus:ring-offset-2 rounded-full"
                style={{
                  left: `${h.x}%`,
                  top: `${h.y}%`,
                  fontSize: h.size,
                  transform: "translate(-50%, -50%)",
                }}
                aria-label="Catch this heart"
              >
                {h.emoji}
              </button>
            ))}

            {/* Pop effects */}
            <AnimatePresence>
              {pops.map((p) => (
                <motion.div
                  key={p.id}
                  className="absolute pointer-events-none text-blush-500 font-bold text-sm"
                  style={{ left: `${p.x}%`, top: `${p.y}%` }}
                  initial={{ opacity: 1, scale: 1, y: 0 }}
                  animate={{ opacity: 0, scale: 1.5, y: -40 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.5 }}
                >
                  +1
                </motion.div>
              ))}
            </AnimatePresence>
          </>
        )}

        {gameState === "done" && (
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-4 p-6">
            <motion.p
              className="text-5xl"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", damping: 10 }}
            >
              🎉
            </motion.p>
            <motion.p
              className="text-2xl font-bold text-blush-700"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              You caught {score} hearts!
            </motion.p>
            <motion.p
              className="text-blush-500 text-center text-sm leading-relaxed"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6 }}
            >
              {getResultMessage()}
            </motion.p>
            <div className="flex gap-3 mt-2">
              <motion.button
                onClick={startGame}
                className="bg-white/70 hover:bg-white text-blush-600 font-semibold py-2.5 px-5 rounded-full
                           shadow-md transition-all cursor-pointer focus:outline-none focus:ring-4 focus:ring-blush-300"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.8 }}
              >
                Play again
              </motion.button>
              <motion.button
                onClick={scrollToAsk}
                className="bg-blush-500 hover:bg-blush-600 text-white font-semibold py-2.5 px-5 rounded-full
                           shadow-lg transition-all cursor-pointer focus:outline-none focus:ring-4 focus:ring-blush-300"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.9 }}
              >
                Continue 💘
              </motion.button>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
