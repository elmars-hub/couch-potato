"use client";

import { Menu, X } from "lucide-react";
import { motion } from "framer-motion";

interface MobileMenuButtonProps {
  isOpen: boolean;
  onClick: () => void;
}

const MobileMenuButton = ({ isOpen, onClick }: MobileMenuButtonProps) => {
  return (
    <motion.button
      onClick={onClick}
      className="md:hidden p-2 text-white hover:bg-white/10 rounded-lg transition-colors relative z-50 cursor-pointer"
      aria-label={isOpen ? "Close menu" : "Open menu"}
      whileTap={{ scale: 0.9 }}
    >
      <div className="relative w-6 h-6">
        <motion.div
          initial={false}
          animate={{
            opacity: isOpen ? 0 : 1,
            rotate: isOpen ? 90 : 0,
            scale: isOpen ? 0 : 1,
          }}
          transition={{ duration: 0.3 }}
          className="absolute inset-0"
        >
          <Menu className="w-6 h-6" />
        </motion.div>

        <motion.div
          initial={false}
          animate={{
            opacity: isOpen ? 1 : 0,
            rotate: isOpen ? 0 : -90,
            scale: isOpen ? 1 : 0,
          }}
          transition={{ duration: 0.3 }}
          className="absolute inset-0"
        >
          <X className="w-6 h-6" />
        </motion.div>
      </div>
    </motion.button>
  );
};

export default MobileMenuButton;
