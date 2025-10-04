"use client";

import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import NavbarLogo from "./navbarlogo";
import NavbarLinks from "./navbarLinks";
import NavbarActions from "./navbarActions";
import MobileMenuButton from "./menuButton";
import MobileMenu from "./mobileMenu";
import { useAuth } from "@/lib/auth-context";

// Match the hero carousel max width
const MAX_CONTENT_WIDTH = "max-w-[1800px]";

const Navbar = () => {
  const pathname = usePathname();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const { user, isLoading } = useAuth();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Close mobile menu when route changes
  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [pathname]);

  // Prevent body scroll when mobile menu is open
  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isMobileMenuOpen]);

  return (
    <>
      <nav
        className={cn(
          "fixed top-0 left-0 right-0 z-50 px-6 md:px-10 lg:px-16 py-4 md:py-6 transition-all duration-300",
          isScrolled
            ? "bg-[#141414]/95 backdrop-blur-md shadow-lg"
            : "bg-gradient-to-b from-black/70 to-transparent"
        )}
      >
        <div
          className={cn(
            MAX_CONTENT_WIDTH,
            "mx-auto flex items-center justify-between"
          )}
        >
          <NavbarLogo />
          <NavbarLinks pathname={pathname} />
          <NavbarActions user={user} isLoading={isLoading} />
          <MobileMenuButton
            isOpen={isMobileMenuOpen}
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          />
        </div>
      </nav>

      <MobileMenu
        isOpen={isMobileMenuOpen}
        pathname={pathname}
        onClose={() => setIsMobileMenuOpen(false)}
        user={user}
        isLoading={isLoading}
      />
    </>
  );
};

export default Navbar;
