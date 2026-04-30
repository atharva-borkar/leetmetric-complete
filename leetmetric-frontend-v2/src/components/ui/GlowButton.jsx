import React from 'react';
import { motion } from 'framer-motion';

export default function GlowButton({ 
  children, 
  onClick, 
  variant = 'primary', 
  className = '', 
  type = 'button',
  disabled = false,
  loading = false,
  ...props 
}) {
  const baseStyles = "relative inline-flex items-center justify-center font-display font-medium rounded-full overflow-hidden transition-all duration-300 ease-out focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed";
  
  const variants = {
    primary: "px-phi-md py-phi-sm bg-cyan-electric/10 text-cyan-electric border border-cyan-electric/30 hover:bg-cyan-electric/20 hover:border-cyan-electric hover:shadow-glow",
    secondary: "px-phi-md py-phi-sm bg-surface-raised text-offwhite border border-white/10 hover:border-white/30 hover:bg-white/5",
    accent: "px-phi-md py-phi-sm bg-phosphor/10 text-phosphor border border-phosphor/30 hover:bg-phosphor/20 hover:border-phosphor hover:shadow-glow-green",
    ghost: "px-phi-sm py-2 text-lavender hover:text-cyan-electric hover:bg-cyan-electric/10",
  };

  return (
    <motion.button
      type={type}
      onClick={onClick}
      disabled={disabled || loading}
      className={`${baseStyles} ${variants[variant]} ${className}`}
      whileHover={{ scale: disabled ? 1 : 1.02 }}
      whileTap={{ scale: disabled ? 1 : 0.98 }}
      {...props}
    >
      {loading ? (
        <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-current" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
      ) : null}
      <span className="relative z-10 flex items-center justify-center gap-2">
        {children}
      </span>
    </motion.button>
  );
}
