import { motion } from "framer-motion";
import "./card.css";

export default function AnimatedCard() {
  return (
    <motion.div
      className="card"
      animate={{
        backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"],
      }}
      transition={{
        duration: 10,
        repeat: Infinity,
        ease: "linear",
      }}
    >
      {/* glowing bubbles */}
      <motion.span
        className="bubble bubble-1"
        animate={{ y: [0, -30, 0] }}
        transition={{ duration: 6, repeat: Infinity }}
      />
      <motion.span
        className="bubble bubble-2"
        animate={{ y: [0, 40, 0] }}
        transition={{ duration: 8, repeat: Infinity }}
      />

      <div className="content">
        <h4>Today Progress</h4>
        <h1>78%</h1>
        <p>🔥 You’re doing great</p>
      </div>
    </motion.div>
  );
}