/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Search, Bell, User, LogOut } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import { useAuth } from "@/lib/auth-context";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";

interface NavbarActionsProps {
  user: any;
  isLoading: boolean;
}

const NavbarActions = ({ user, isLoading }: NavbarActionsProps) => {
  const [showUserMenu, setShowUserMenu] = useState(false);

  const { signOut } = useAuth();

  if (isLoading) {
    return (
      <div className="hidden md:flex items-center gap-3">
        <div className="w-8 h-8 rounded-full bg-gray-700 animate-pulse" />
      </div>
    );
  }

  return (
    <div className="hidden md:flex items-center gap-3">
      <Link href="/search">
        <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.95 }}>
          <Button
            variant="ghost"
            size="icon"
            className="text-white hover:text-white hover:bg-white/10 cursor-pointer rounded-full transition-all"
          >
            <Search className="w-5 h-5" />
          </Button>
        </motion.div>
      </Link>

      {user && (
        <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.95 }}>
          <Button
            variant="ghost"
            size="icon"
            className="text-white hover:text-white hover:bg-white/10 cursor-pointer rounded-full transition-all relative"
          >
            <Bell className="w-5 h-5" />
            <motion.span
              className="absolute top-1 right-1 w-2 h-2 bg-red-600 rounded-full"
              animate={{
                scale: [1, 1.2, 1],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            />
          </Button>
        </motion.div>
      )}

      {user ? (
        <div className="relative">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setShowUserMenu(!showUserMenu)}
            className="flex items-center gap-2 px-3 py-2 rounded-lg bg-white/10 hover:bg-white/20 transition-all border border-white/20"
          >
            <div className="w-8 h-8 rounded-full cursor-pointer bg-gradient-to-br from-red-600 to-red-800 flex items-center justify-center">
              <Avatar className="">
                <AvatarImage src="https://github.com/shadcn.png" />
                <AvatarFallback>U</AvatarFallback>
              </Avatar>
            </div>
            {/* <span className="text-white font-medium text-sm max-w-[100px] truncate">
              {user.email?.split("@")[0] || "User"}
            </span> */}
          </motion.button>

          <AnimatePresence>
            {showUserMenu && (
              <>
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="fixed inset-0 z-40"
                  onClick={() => setShowUserMenu(false)}
                />
                <motion.div
                  initial={{ opacity: 0, y: -10, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -10, scale: 0.95 }}
                  transition={{ duration: 0.2 }}
                  className="absolute right-0 top-full mt-2 w-56 bg-[#141414]/98 backdrop-blur-xl border border-white/10 rounded-xl shadow-2xl overflow-hidden z-50"
                >
                  <div className="p-3 border-b border-white/10">
                    <p className="text-white font-medium text-sm truncate">
                      {user.name}
                    </p>
                    <p className="text-gray-400 text-xs mt-1">
                      Manage your account
                    </p>
                  </div>
                  <div className="p-2">
                    <Link href="/profile">
                      <Button
                        onClick={() => setShowUserMenu(false)}
                        className="w-full flex items-center cursor-pointer justify-start gap-3 px-3 py-2 text-white hover:bg-white/10 rounded-lg transition-colors text-sm"
                      >
                        <User className="w-4 h-4" />
                        Profile
                      </Button>
                    </Link>
                    <Link href="/watchlist">
                      <Button
                        onClick={() => setShowUserMenu(false)}
                        className="w-full flex items-center cursor-pointer justify-start gap-3 px-3 py-2 text-white hover:bg-white/10 rounded-lg transition-colors text-sm"
                      >
                        <Bell className="w-4 h-4" />
                        My Watchlist
                      </Button>
                    </Link>
                  </div>
                  <div className="p-2 border-t border-white/10">
                    <Button
                      onClick={() => {
                        setShowUserMenu(false);
                        signOut();
                      }}
                      className="w-full flex items-center cursor-pointer justify-start gap-3 px-3 py-2 text-red-500 hover:bg-red-500/10 rounded-lg transition-colors text-sm font-medium"
                    >
                      <LogOut className="w-4 h-4" />
                      Log Out
                    </Button>
                  </div>
                </motion.div>
              </>
            )}
          </AnimatePresence>
        </div>
      ) : (
        <>
          <Link href="/signup">
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              transition={{ type: "spring", stiffness: 400, damping: 17 }}
            >
              <Button className="bg-red-600 cursor-pointer text-white font-semibold hover:bg-red-700 rounded-md shadow-lg transition-all">
                Sign Up
              </Button>
            </motion.div>
          </Link>

          <Link href="/login">
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              transition={{ type: "spring", stiffness: 400, damping: 17 }}
            >
              <Button
                variant="outline"
                className="border-2 border-white/20 cursor-pointer hover:bg-white/10 text-white font-semibold rounded-md transition-all"
              >
                Login
              </Button>
            </motion.div>
          </Link>
        </>
      )}
    </div>
  );
};

export default NavbarActions;
