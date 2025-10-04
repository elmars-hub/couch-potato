/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Search, User, LogOut, Bell } from "lucide-react";
import { navLinks } from "./navbarLinks";
import { motion, AnimatePresence } from "framer-motion";

interface MobileMenuProps {
  isOpen: boolean;
  pathname: string;
  onClose: () => void;
  user: any;
  isLoading: boolean;
}

const MobileMenu = ({
  isOpen,
  pathname,
  onClose,
  user,
  isLoading,
}: MobileMenuProps) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop with fade animation */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 md:hidden"
            onClick={onClose}
          />

          {/* Mobile Menu with slide and bounce animation */}
          <motion.div
            initial={{ y: -400, opacity: 0 }}
            animate={{
              y: 0,
              opacity: 1,
              transition: {
                type: "spring",
                damping: 20,
                stiffness: 300,
                mass: 0.8,
              },
            }}
            exit={{
              y: -400,
              opacity: 0,
              transition: {
                duration: 0.3,
                ease: "easeInOut",
              },
            }}
            className="fixed left-0 right-0 top-[72px] z-40 md:hidden"
          >
            {/* Glassmorphism container */}
            <div className="mx-4 mt-2 rounded-2xl bg-gradient-to-br from-[#1a1a1a]/95 via-[#141414]/95 to-[#0a0a0a]/95 backdrop-blur-xl border border-white/10 shadow-2xl overflow-hidden">
              {/* Decorative gradient overlay */}
              <div className="absolute inset-0 bg-gradient-to-br from-red-600/5 via-transparent to-purple-600/5 pointer-events-none" />

              <div className="relative px-4 py-6 space-y-6">
                {/* User Info Section - Only show when authenticated */}
                {user && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{
                      opacity: 1,
                      y: 0,
                      transition: {
                        delay: 0.1,
                        duration: 0.3,
                      },
                    }}
                    className="flex items-center gap-3 p-4 bg-gradient-to-r from-red-600/20 to-red-800/20 rounded-xl border border-red-500/20"
                  >
                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-red-600 to-red-800 flex items-center justify-center">
                      <User className="w-6 h-6 text-white" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-white font-semibold text-sm truncate">
                        {user.email?.split("@")[0] || "User"}
                      </p>
                      <p className="text-gray-400 text-xs truncate">
                        {user.email}
                      </p>
                    </div>
                  </motion.div>
                )}

                {/* Mobile Nav Links */}
                <nav>
                  <ul className="space-y-2">
                    {navLinks.map((link, index) => (
                      <motion.li
                        key={link.name}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{
                          opacity: 1,
                          x: 0,
                          transition: {
                            delay: (user ? 0.2 : 0.1) + index * 0.1,
                            duration: 0.3,
                            ease: "easeOut",
                          },
                        }}
                        exit={{
                          opacity: 0,
                          x: -20,
                          transition: {
                            duration: 0.2,
                          },
                        }}
                      >
                        <Link
                          href={link.href}
                          onClick={onClose}
                          className={cn(
                            "flex items-center gap-3 px-4 py-3.5 rounded-xl text-base font-medium transition-all duration-200",
                            pathname === link.href
                              ? "bg-gradient-to-r from-red-600 to-red-700 text-white shadow-lg shadow-red-600/20"
                              : "text-gray-300 hover:bg-white/5 hover:text-white"
                          )}
                        >
                          <motion.span
                            animate={
                              pathname === link.href
                                ? {
                                    scale: [1, 1.2, 1],
                                    transition: {
                                      duration: 0.3,
                                    },
                                  }
                                : {}
                            }
                          >
                            {link.icon}
                          </motion.span>
                          {link.name}
                        </Link>
                      </motion.li>
                    ))}
                  </ul>
                </nav>

                {/* Divider */}
                <motion.div
                  initial={{ scaleX: 0 }}
                  animate={{
                    scaleX: 1,
                    transition: {
                      delay: user ? 0.5 : 0.4,
                      duration: 0.4,
                    },
                  }}
                  className="h-px bg-gradient-to-r from-transparent via-white/10 to-transparent origin-left"
                />

                {/* Mobile Actions */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{
                    opacity: 1,
                    y: 0,
                    transition: {
                      delay: user ? 0.6 : 0.5,
                      duration: 0.3,
                    },
                  }}
                  exit={{
                    opacity: 0,
                    y: 20,
                    transition: {
                      duration: 0.2,
                    },
                  }}
                  className="space-y-3"
                >
                  <Link href="/search" onClick={onClose}>
                    <motion.div whileTap={{ scale: 0.95 }}>
                      <Button
                        variant="outline"
                        className="w-full justify-start gap-3 border-white/20 hover:bg-white/10 text-white hover:border-white/30 transition-all rounded-xl py-6"
                      >
                        <Search className="w-5 h-5" />
                        Search Movies & Shows
                      </Button>
                    </motion.div>
                  </Link>

                  {user ? (
                    <>
                      <Link href="/watchlist" onClick={onClose}>
                        <motion.div whileTap={{ scale: 0.95 }}>
                          <Button
                            variant="outline"
                            className="w-full justify-start gap-3 border-white/20 hover:bg-white/10 text-white hover:border-white/30 transition-all rounded-xl py-6"
                          >
                            <Bell className="w-5 h-5" />
                            My Watchlist
                          </Button>
                        </motion.div>
                      </Link>

                      <Link href="/profile" onClick={onClose}>
                        <motion.div whileTap={{ scale: 0.95 }}>
                          <Button
                            variant="outline"
                            className="w-full justify-start gap-3 border-white/20 hover:bg-white/10 text-white hover:border-white/30 transition-all rounded-xl py-6"
                          >
                            <User className="w-5 h-5" />
                            Profile
                          </Button>
                        </motion.div>
                      </Link>

                      <motion.div whileTap={{ scale: 0.95 }}>
                        <Button
                          onClick={() => {
                            onClose();
                            // Add your logout logic here
                            // Example: signOut()
                          }}
                          className="w-full justify-start gap-3 bg-red-600/20 hover:bg-red-600/30 text-red-500 border border-red-500/30 hover:border-red-500/50 transition-all rounded-xl py-6"
                        >
                          <LogOut className="w-5 h-5" />
                          Log Out
                        </Button>
                      </motion.div>
                    </>
                  ) : (
                    <>
                      <Link href="/signup" onClick={onClose}>
                        <motion.div whileTap={{ scale: 0.95 }}>
                          <Button className="w-full bg-gradient-to-r from-red-600 to-red-700 text-white font-semibold hover:from-red-700 hover:to-red-800 shadow-lg shadow-red-600/20 transition-all rounded-xl py-6">
                            Sign Up
                          </Button>
                        </motion.div>
                      </Link>

                      <Link href="/login" onClick={onClose}>
                        <motion.div whileTap={{ scale: 0.95 }}>
                          <Button
                            variant="outline"
                            className="w-full border-2 border-white/20 hover:bg-white/10 text-white hover:border-white/30 transition-all rounded-xl py-6"
                          >
                            Login
                          </Button>
                        </motion.div>
                      </Link>
                    </>
                  )}
                </motion.div>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default MobileMenu;
