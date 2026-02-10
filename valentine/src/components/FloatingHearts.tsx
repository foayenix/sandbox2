import { useEffect, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";

interface Heart {
  id: number;
  x: number;
  size: number;
  duration: number;
  delay: number;
  opacity: number;
}

export default function FloatingHearts() {
  const prefersReduced = useReducedMotion();
  const [hearts, setHearts] = useState<Heart[]>([]);

  useEffect(() => {
    const count = prefersReduced ? 6 : 18;
    const generated: Heart[] = Array.from({ length: count }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      size: 14 + Math.random() * 22,
      duration: 8 + Math.random() * 12,
      delay: Math.random() * 8,
      opacity: 0.08 + Math.random() * 0.12,
    }));
    setHearts(generated);
  }, [prefersReduced]);

  if (prefersReduced) {
    return (
      <div className="fixed inset-0 pointer-events-none z-0" aria-hidden="true">
        {hearts.map((h) => (
          <div
            key={h.id}
            className="absolute text-blush-300"
            style={{
              left: `${h.x}%`,
              top: `${(h.id / hearts.length) * 100}%`,
              fontSize: h.size,
              opacity: h.opacity,
            }}
          >
            ♥
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden" aria-hidden="true">
      {hearts.map((h) => (
        <motion.div
          key={h.id}
          className="absolute text-blush-300"
          style={{
            left: `${h.x}%`,
            fontSize: h.size,
          }}
          initial={{ y: "110vh", opacity: 0, rotate: -20 }}
          animate={{
            y: "-10vh",
            opacity: [0, h.opacity, h.opacity, 0],
            rotate: [-20, 20, -20],
          }}
          transition={{
            duration: h.duration,
            delay: h.delay,
            repeat: Infinity,
            ease: "linear",
          }}
        >
          ♥
        </motion.div>
      ))}
    </div>
  );
}
