import { useState, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { siteConfig } from "../config";

function getOrCreateSerial(): string {
  const key = "valentine-ticket-serial";
  let serial = localStorage.getItem(key);
  if (!serial) {
    serial = `VAL-${Math.random().toString(36).substring(2, 8).toUpperCase()}-2026`;
    localStorage.setItem(key, serial);
  }
  return serial;
}

function generateTicketCanvas(): Promise<Blob | null> {
  return new Promise((resolve) => {
    const canvas = document.createElement("canvas");
    const scale = 2;
    canvas.width = 600 * scale;
    canvas.height = 300 * scale;
    const ctx = canvas.getContext("2d");
    if (!ctx) return resolve(null);

    ctx.scale(scale, scale);

    // Background gradient
    const grad = ctx.createLinearGradient(0, 0, 600, 300);
    grad.addColorStop(0, "#fff5f7");
    grad.addColorStop(0.5, "#ffe0e6");
    grad.addColorStop(1, "#ffc2cf");
    ctx.fillStyle = grad;
    ctx.beginPath();
    ctx.roundRect(0, 0, 600, 300, 20);
    ctx.fill();

    // Border
    ctx.strokeStyle = "#ff94ab";
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.roundRect(10, 10, 580, 280, 15);
    ctx.stroke();

    // Dashed line
    ctx.setLineDash([8, 6]);
    ctx.strokeStyle = "#ffb8c9";
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.moveTo(420, 30);
    ctx.lineTo(420, 270);
    ctx.stroke();
    ctx.setLineDash([]);

    // Left side text
    ctx.fillStyle = "#821636";
    ctx.font = "bold 28px Poppins, sans-serif";
    ctx.textAlign = "center";
    ctx.fillText("💖 Valentine Ticket 💖", 210, 60);

    ctx.fillStyle = "#9c163a";
    ctx.font = "600 20px Poppins, sans-serif";
    ctx.fillText(siteConfig.herName, 210, 110);

    ctx.fillStyle = "#bd1a42";
    ctx.font = "italic 16px Poppins, sans-serif";
    ctx.fillText("Be My Valentine", 210, 145);

    ctx.fillStyle = "#e0234f";
    ctx.font = "500 18px Poppins, sans-serif";
    ctx.fillText(siteConfig.dates.valentinesDate, 210, 185);

    ctx.fillStyle = "#ff6b8a";
    ctx.font = "300 12px Poppins, sans-serif";
    ctx.fillText(`Made with love by ${siteConfig.yourName}`, 210, 230);

    // Right side — serial
    ctx.fillStyle = "#bd1a42";
    ctx.font = "bold 16px monospace";
    ctx.textAlign = "center";
    ctx.save();
    ctx.translate(510, 150);
    ctx.rotate(-Math.PI / 2);
    ctx.fillText(getOrCreateSerial(), 0, 0);
    ctx.restore();

    // Hearts
    ctx.font = "32px serif";
    ctx.textAlign = "center";
    ctx.fillText("💕", 510, 70);
    ctx.fillText("💗", 510, 260);

    canvas.toBlob(resolve, "image/png");
  });
}

export default function TheAsk() {
  const [answered, setAnswered] = useState(false);
  const [noDodges, setNoDodges] = useState(0);
  const [noGaveUp, setNoGaveUp] = useState(false);
  const [confettiHearts, setConfettiHearts] = useState<
    { id: number; x: number; y: number; size: number; rotation: number; emoji: string }[]
  >([]);
  const noBtnRef = useRef<HTMLButtonElement>(null);

  const triggerConfetti = useCallback(() => {
    const emojis = ["💖", "💕", "💗", "💓", "❤️", "💘", "💝", "✨", "🌸"];
    const particles = Array.from({ length: 60 }, (_, i) => ({
      id: i,
      x: 5 + Math.random() * 90,
      y: 5 + Math.random() * 90,
      size: 16 + Math.random() * 24,
      rotation: Math.random() * 360,
      emoji: emojis[Math.floor(Math.random() * emojis.length)],
    }));
    setConfettiHearts(particles);
  }, []);

  const handleYes = () => {
    setAnswered(true);
    triggerConfetti();
  };

  const dodgeNo = () => {
    if (noDodges >= 4) {
      setNoGaveUp(true);
      return;
    }
    setNoDodges((d) => d + 1);

    const btn = noBtnRef.current;
    if (!btn) return;

    // Move the button to a random spot within the viewport (clamped to safe zone)
    const vw = window.innerWidth;
    const vh = window.innerHeight;
    const btnW = btn.offsetWidth;
    const btnH = btn.offsetHeight;

    const newX = 20 + Math.random() * (vw - btnW - 40);
    const newY = 20 + Math.random() * (vh - btnH - 40);

    btn.style.position = "fixed";
    btn.style.left = `${newX}px`;
    btn.style.top = `${newY}px`;
    btn.style.zIndex = "100";
    btn.style.transition = "all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)";
  };

  const downloadTicket = async () => {
    const blob = await generateTicketCanvas();
    if (!blob) return;
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "valentine-ticket.png";
    a.click();
    URL.revokeObjectURL(url);
  };

  const shareMessage = async () => {
    const msg = siteConfig.shareMessageTemplate.replace("{url}", window.location.href);
    try {
      await navigator.clipboard.writeText(msg);
      alert("Copied to clipboard! 💖");
    } catch {
      // fallback
      prompt("Copy this message:", msg);
    }
  };

  return (
    <section
      id="ask"
      className="min-h-screen flex flex-col items-center justify-center px-6 py-20 relative"
    >
      {/* Confetti layer */}
      <AnimatePresence>
        {confettiHearts.map((c) => (
          <motion.div
            key={c.id}
            className="fixed pointer-events-none z-50"
            style={{ fontSize: c.size }}
            initial={{
              left: "50%",
              top: "50%",
              opacity: 1,
              scale: 0,
              rotate: 0,
            }}
            animate={{
              left: `${c.x}%`,
              top: `${c.y}%`,
              opacity: [1, 1, 0],
              scale: [0, 1.2, 0.8],
              rotate: c.rotation,
            }}
            transition={{ duration: 2 + Math.random(), ease: "easeOut" }}
          >
            {c.emoji}
          </motion.div>
        ))}
      </AnimatePresence>

      <AnimatePresence mode="wait">
        {!answered ? (
          <motion.div
            key="question"
            className="w-full max-w-sm"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.6 }}
          >
            <div className="bg-white/80 backdrop-blur-md rounded-3xl shadow-xl p-8 text-center relative overflow-hidden"
                 style={{ minHeight: 280 }}>
              <motion.p
                className="text-5xl mb-6"
                animate={{ scale: [1, 1.1, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                💖
              </motion.p>
              <h2 className="text-2xl sm:text-3xl font-bold text-blush-800 mb-8">
                Will you be my Valentine?
              </h2>

              <div className="flex flex-col items-center gap-4">
                <motion.button
                  onClick={handleYes}
                  className="bg-blush-500 hover:bg-blush-600 text-white font-semibold py-3 px-8 rounded-full
                             shadow-lg transition-all cursor-pointer z-10 relative
                             focus:outline-none focus:ring-4 focus:ring-blush-300"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  Yes 💘
                </motion.button>
              </div>

              {/* No button — lives in the outer card so it has room to dodge */}
              <div className="relative mt-4" style={{ minHeight: 60 }}>
                <button
                  ref={noBtnRef}
                  onClick={noGaveUp ? handleYes : undefined}
                  onMouseEnter={!noGaveUp ? dodgeNo : undefined}
                  onTouchStart={!noGaveUp ? dodgeNo : undefined}
                  className="bg-white/70 hover:bg-white text-blush-500 font-semibold py-2.5 px-6 rounded-full
                             shadow-md transition-all cursor-pointer
                             focus:outline-none focus:ring-4 focus:ring-blush-300"
                >
                  {noGaveUp ? "Okay okay… Yes? 💕" : "No 😅"}
                </button>
              </div>
            </div>
          </motion.div>
        ) : (
          <motion.div
            key="success"
            className="w-full max-w-sm"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ type: "spring", damping: 15, delay: 0.3 }}
          >
            <div className="bg-white/80 backdrop-blur-md rounded-3xl shadow-xl p-8 text-center">
              <motion.p
                className="text-6xl mb-4"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", damping: 8, delay: 0.5 }}
              >
                🎉
              </motion.p>
              <motion.h2
                className="text-3xl sm:text-4xl font-bold text-blush-700 mb-4"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.7 }}
              >
                Yay!! 💖
              </motion.h2>
              <motion.p
                className="text-blush-600 text-lg leading-relaxed mb-8"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1.0 }}
              >
                {siteConfig.successMessage}
              </motion.p>

              <motion.div
                className="flex flex-col gap-3"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1.3 }}
              >
                <button
                  onClick={downloadTicket}
                  className="bg-blush-500 hover:bg-blush-600 text-white font-semibold py-3 px-6 rounded-full
                             shadow-lg transition-all cursor-pointer
                             focus:outline-none focus:ring-4 focus:ring-blush-300"
                >
                  🎫 Save your Valentine Ticket
                </button>
                <button
                  onClick={shareMessage}
                  className="bg-white/70 hover:bg-white text-blush-600 font-semibold py-3 px-6 rounded-full
                             shadow-md transition-all cursor-pointer
                             focus:outline-none focus:ring-4 focus:ring-blush-300"
                >
                  📋 Share
                </button>
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
