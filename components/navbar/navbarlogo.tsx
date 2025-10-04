"use client";

import Link from "next/link";
import { Film } from "lucide-react";
import { motion } from "framer-motion";

const NavbarLogo = () => {
  return (
    <Link href="/" className="flex items-center gap-2 group">
      <motion.div
        className="w-10 h-10 rounded-lg bg-gradient-to-br from-red-600 to-red-800 flex items-center justify-center shadow-lg"
        whileHover={{ scale: 1.1, rotate: 5 }}
        whileTap={{ scale: 0.95 }}
        transition={{ type: "spring", stiffness: 400, damping: 17 }}
      >
        <Film className="w-6 h-6 text-white" />
      </motion.div>

      <motion.span
        className="text-xl md:text-2xl font-bold bg-gradient-to-r from-red-600 to-red-500 bg-clip-text text-transparent"
        whileHover={{ scale: 1.05 }}
        transition={{ type: "spring", stiffness: 400, damping: 17 }}
      >
        Couch Potato
      </motion.span>
    </Link>
  );
};

export default NavbarLogo;
