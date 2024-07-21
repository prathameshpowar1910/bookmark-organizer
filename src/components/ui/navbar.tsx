"use client";

import React from "react";
import { motion } from "framer-motion";
import { SignInButton, SignedIn, SignedOut, UserButton } from '@clerk/nextjs'
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/component/theme-toggle";

const NavBar = () => {
  return (
    <nav className="border-b w-full backdrop-blur-sm bg-background/80 z-50 fixed top-0 left-0 right-0">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <Link href="/" className="text-2xl font-bold text-foreground">
              BookkMarrker
            </Link>
          </div>
          <div className="hidden md:block">
            <div className="ml-10 flex items-baseline space-x-4">
              {["BookMarks", "File-Upload"].map((item, index) => (
                <motion.div key={item} whileHover={{ scale: 1.05 }}>
                  <Link
                    href={`/${item.toLowerCase()}`}
                    className="text-muted-foreground hover:text-foreground px-3 py-2 rounded-md text-sm font-medium transition-colors"
                  >
                    {item}
                  </Link>
                </motion.div>
              ))}
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <ThemeToggle />
            <SignedOut>
              <SignInButton mode="modal">
                <Button variant="outline">Sign In</Button>
              </SignInButton>
            </SignedOut>
            <SignedIn>
              <UserButton afterSignOutUrl="/" />
            </SignedIn>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default NavBar;