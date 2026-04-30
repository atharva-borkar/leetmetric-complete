import React from 'react';
import { motion } from 'framer-motion';

export default function GlassCard({ 
  children, 
  className = '', 
  raised = false,
  animated = false,
  delay = 0,
  ...props 
}) {
  const baseClasses = raised ? 'glass-panel-raised' : 'glass-panel';
  const combinedClasses = `${baseClasses} p-phi-md sm:p-phi-lg ${className}`;

  if (animated) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: delay, ease: [0.22, 1, 0.36, 1] }}
        className={combinedClasses}
        {...props}
      >
        {children}
      </motion.div>
    );
  }

  return (
    <div className={combinedClasses} {...props}>
      {children}
    </div>
  );
}
