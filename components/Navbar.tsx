"use client";

import React, { useState } from "react";
import Link from "next/link";
import SearchModal from "@/forms/SearchModal";
import UserDropdown from "./UserDropdown";
import Image from "next/image";
type UserType = {
  name?: string;
  email?: string;
};

export default function Navbar({ user }: { user: UserType | null }) {
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  return (
    <>
      <SearchModal
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
      />

      <nav className="flex items-center justify-between px-6 py-4 border-b border-zinc-800/60 bg-[#0a0a0a]/80 backdrop-blur-md sticky top-0 z-50">
        {/* Logo */}
        <div className="flex items-center gap-3">
          <div className="flex items-center">
            <Image
              src="/assets/icons/logo.svg"
              alt="Signalist Logo"
              width={140}   // adjust based on look
              height={40}
              className="object-contain"
            />
          </div>
        </div>

        {/* Links */}
        <div className="hidden md:flex items-center gap-6 text-zinc-400">
          <Link href="/" className="text-white">
            Dashboard
          </Link>

          <button
            onClick={() => setIsSearchOpen(true)}
            className="hover:text-zinc-200 transition-colors cursor-pointer"
          >
            Search
          </button>

          <Link
            href="/watchlist"
            className="hover:text-zinc-200 transition-colors"
          >
            Watchlist
          </Link>
        </div>

        {/* User */}
        <div>
          {user ? (
            <UserDropdown user={user} />
          ) : (
            <Link href="/sign-in">Sign In</Link>
          )}
        </div>
      </nav>
    </>
  );
}
