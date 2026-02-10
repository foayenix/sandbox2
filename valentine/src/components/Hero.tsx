import { motion } from "framer-motion";
import { siteConfig } from "../config";

export default function Hero() {
  const scrollToNext = () => {
    document.getElementById("timeline")?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section
      id="hero"
      className="relative min-h-screen flex flex-col items-center justify-center px-6 text-center"
    >
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="relative z-10"
      >
        <motion.h1
          className="text-4xl sm:text-5xl md:text-6xl font-bold text-blush-800 mb-4"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          Hey {siteConfig.herName}...
        </motion.h1>

        <motion.p
          className="text-lg sm:text-xl text-blush-600 mb-10 max-w-md mx-auto font-light"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.6 }}
        >
          {siteConfig.introLine}
        </motion.p>

        <motion.button
          onClick={scrollToNext}
          className="bg-blush-500 hover:bg-blush-600 text-white font-semibold py-3 px-10 rounded-full
                     shadow-lg hover:shadow-xl transition-all cursor-pointer
                     focus:outline-none focus:ring-4 focus:ring-blush-300"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 1.0 }}
        >
          Start
        </motion.button>
      </motion.div>

      {/* Scroll indicator */}
      <motion.div
        className="absolute bottom-8 z-10"
        animate={{ y: [0, 10, 0] }}
        transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
      >
        <span className="text-blush-400 text-2xl">↓</span>
      </motion.div>
    </section>
  );
}
