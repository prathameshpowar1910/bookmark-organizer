'use client';

import { motion } from 'framer-motion';

const AnimatedHeader = () => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <h1 className="text-4xl font-bold text-center mb-8">BookkMarrker</h1>
      <p className="text-xl text-center mb-12">Effortlessly organize your Chrome bookmarks</p>
    </motion.div>
  );
};

export default AnimatedHeader;