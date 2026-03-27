"use client";

import { motion } from "framer-motion";
import { TextSelect, Brain, Heart, AudioLines, Headphones } from "lucide-react";
import { useState, useEffect } from "react";

const HeroAnimation = () => {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  const glowCircles = (
    <>
      <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-indigo-500/20 rounded-full blur-3xl animate-pulse" />
      <div className="absolute bottom-1/4 right-1/4 w-48 h-48 bg-purple-600/20 rounded-full blur-3xl animate-pulse delay-1000" />
    </>
  );

  const ringStyles = [
    "absolute inset-0 border-2 border-indigo-500/30 rounded-full animate-spin-slow",
    "absolute inset-2 border-2 border-purple-500/30 rounded-full animate-spin-reverse",
    "absolute inset-4 border-2 border-indigo-500/20 rounded-full animate-spin-slower",
  ];

  const orbitingNodes = Array.from({ length: 8 }, (_, i) => {
    const angle = (i * Math.PI * 2) / 8;
    const x = 50 + Math.cos(angle) * 35;
    const y = 50 + Math.sin(angle) * 35;

    const icons = [
      <TextSelect key="text-select" className="w-5 h-5 text-white" />,
      <Brain key="brain" className="w-5 h-5 text-white" />,
      <Heart key="heart" className="w-5 h-5 text-white" />,
    ];

    return (
      <motion.div
        key={`node-${i}`}
        className="absolute"
        style={{
          left: `${x}%`,
          top: `${y}%`,
          transform: "translate(-50%, -50%)",
        }}
        animate={{ scale: [1, 1.1, 1], opacity: [0.8, 1, 0.8] }}
        transition={{
          duration: 2,
          delay: i * 0.2,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      >
        <div className="relative">
          <div className="absolute inset-0 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-full blur-xl opacity-60" />
          <div className="relative w-13 h-13 bg-white rounded-2xl flex items-center justify-center">
            <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl flex items-center justify-center">
              {icons[i % 3]}
            </div>
          </div>
          <motion.div
            className="absolute w-2 h-2 bg-gradient-to-br from-indigo-400 to-purple-400 rounded-full"
            animate={{ rotate: 360 }}
            transition={{
              duration: 3,
              repeat: Infinity,
              ease: "linear",
              delay: i * 0.3,
            }}
            style={{ transformOrigin: "20px 20px" }}
          />
        </div>
      </motion.div>
    );
  });

  // Generate deterministic positions based on index instead of Math.random()
  const generateParticles = () => {
    if (!isClient) return null;

    return Array.from({ length: 20 }, (_, i) => {
      // Use deterministic values based on index instead of Math.random()
      const seed = i * 137.508; // Golden angle approximation for good distribution
      const x = Math.sin(seed) * 200;
      const y = Math.cos(seed) * 200;
      const targetX = Math.sin(seed + 1) * 200;
      const targetY = Math.cos(seed + 1) * 200;

      return (
        <motion.div
          key={`particle-${i}`}
          className="absolute w-1 h-1 bg-gradient-to-br from-indigo-400 to-purple-400 rounded-full"
          initial={{
            x: x,
            y: y,
            opacity: 0,
          }}
          animate={{
            x: targetX,
            y: targetY,
            opacity: [0, 1, 0],
          }}
          transition={{
            duration: 5 + (i % 5), // Varying duration based on index
            repeat: Infinity,
            delay: i * 0.25, // Staggered delay
            ease: "linear",
          }}
        />
      );
    });
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: 50 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 2 }}
      className="relative w-full h-[32rem] flex items-center justify-center overflow-hidden"
    >
      {glowCircles}

      {/* Central Rings */}
      <motion.div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
        animate={{ rotate: [0, 360] }}
        transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
      >
        <div className="absolute inset-0 w-32 h-32 -translate-x-1/2 -translate-y-1/2 left-1/2 top-1/2">
          {ringStyles.map((cls, idx) => (
            <div key={idx} className={cls} />
          ))}
        </div>
      </motion.div>

      {/* Central Core */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
        <motion.div
          animate={{ scale: [1, 1.05, 1] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
        >
          <div className="absolute inset-0 w-24 h-24 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-full blur-1xl opacity-20" />
          <div className="relative w-24 h-24 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-full p-[2px]">
            <div className="w-full h-full bg-purple rounded-full flex items-center justify-center">
              <div className="relative">
                <Headphones className="w-10 h-10 text-white" />
                <motion.div
                  className="absolute -inset-2"
                  animate={{ opacity: [0, 1, 0], scale: [0.8, 1.2, 0.8] }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    ease: "easeOut",
                  }}
                >
                  <AudioLines className="w-14 h-14 text-white/30" />
                </motion.div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Orbiting Nodes */}
      {orbitingNodes}

      {/* Floating Particles - Only render on client */}
      {generateParticles()}
    </motion.div>
  );
};

export default HeroAnimation;
