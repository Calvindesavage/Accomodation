"use client";

import Link from "next/link";
import { useAuth } from "@/lib/auth";
import { useQuery } from "@tanstack/react-query";
import { fetchUnreadCount } from "@/lib/queries";
import {
  Home,
  Search,
  Heart,
  MessageSquare,
  Bell,
  LayoutDashboard,
  LogOut,
  Menu,
  X,
  User,
} from "lucide-react";
import { useState } from "react";

const navLink = "text-[rgba(255,255,255,0.55)] hover:text-white flex items-center gap-1.5 text-sm font-medium transition-colors";

export default function Navbar() {
  const { user, logout, isAuthenticated } = useAuth();
  const [mobileOpen, setMobileOpen] = useState(false);

  const { data: unreadCount } = useQuery({
    queryKey: ["unreadCount"],
    queryFn: fetchUnreadCount,
    enabled: isAuthenticated,
    refetchInterval: 30000,
  });

  return (
    <nav className="sticky top-0 z-50" style={{ background: "rgba(15,10,0,0.85)", backdropFilter: "blur(20px)", borderBottom: "1px solid rgba(249,115,22,0.12)" }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link href="/" className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-[10px] flex items-center justify-center" style={{ background: "linear-gradient(135deg, #f97316, #ea580c)" }}>
                <Home className="h-[18px] w-[18px] text-white" />
              </div>
              <span className="text-xl font-extrabold text-white tracking-tight">
                Res<span className="text-[#f97316]">Plug</span>
              </span>
            </Link>
            <div className="hidden md:flex ml-10 gap-6">
              <Link href="/listings" className={navLink}>
                <Search className="h-4 w-4" />
                Browse
              </Link>
              {isAuthenticated && (
                <>
                  <Link href="/dashboard" className={navLink}>
                    <LayoutDashboard className="h-4 w-4" />
                    Dashboard
                  </Link>
                  {user?.role === "LANDLORD" && (
                    <Link href="/residences/manage" className={navLink}>
                      <Home className="h-4 w-4" />
                      My Properties
                    </Link>
                  )}
                  <Link href="/favorites" className={navLink}>
                    <Heart className="h-4 w-4" />
                    Favorites
                  </Link>
                  <Link href="/messages" className={navLink}>
                    <MessageSquare className="h-4 w-4" />
                    Messages
                  </Link>
                  <Link href="/bookings" className={navLink}>
                    Bookings
                  </Link>
                </>
              )}
            </div>
          </div>

          <div className="hidden md:flex items-center gap-4">
            {isAuthenticated ? (
              <>
                <Link href="/notifications" className="relative p-2 text-[rgba(255,255,255,0.5)] hover:text-white transition-colors">
                  <Bell className="h-5 w-5" />
                  {unreadCount ? (
                    <span className="absolute -top-0.5 -right-0.5 text-white text-xs rounded-full h-4 w-4 flex items-center justify-center" style={{ background: "#f97316" }}>
                      {unreadCount > 9 ? "9+" : unreadCount}
                    </span>
                  ) : null}
                </Link>
                <div className="flex items-center gap-2 text-sm">
                  <User className="h-4 w-4 text-[rgba(255,255,255,0.5)]" />
                  <span className="text-white">{user?.first_name}</span>
                  <span className="dark-badge">{user?.role}</span>
                </div>
                <button
                  onClick={logout}
                  className="text-[rgba(255,255,255,0.4)] hover:text-red-400 p-2 transition-colors"
                >
                  <LogOut className="h-5 w-5" />
                </button>
              </>
            ) : (
              <div className="flex gap-2 items-center">
                <Link
                  href="/login"
                  className="px-4 py-2 text-sm font-medium text-[rgba(255,255,255,0.6)] hover:text-white transition-colors"
                >
                  Login
                </Link>
                <Link
                  href="/register"
                  className="dark-btn-primary !px-5 !py-2 !text-sm"
                >
                  Sign Up
                </Link>
              </div>
            )}
          </div>

          <button
            className="md:hidden p-2 text-[rgba(255,255,255,0.6)]"
            onClick={() => setMobileOpen(!mobileOpen)}
          >
            {mobileOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
      </div>

      {mobileOpen && (
        <div className="md:hidden px-4 py-4 space-y-3" style={{ background: "rgba(15,10,0,0.95)", borderTop: "1px solid rgba(249,115,22,0.12)" }}>
          <Link href="/listings" className="block text-[rgba(255,255,255,0.7)] font-medium" onClick={() => setMobileOpen(false)}>
            Browse Listings
          </Link>
          {isAuthenticated ? (
            <>
              <Link href="/dashboard" className="block text-[rgba(255,255,255,0.7)]" onClick={() => setMobileOpen(false)}>Dashboard</Link>
              {user?.role === "LANDLORD" && (
                <Link href="/residences/manage" className="block text-[rgba(255,255,255,0.7)]" onClick={() => setMobileOpen(false)}>My Properties</Link>
              )}
              <Link href="/bookings" className="block text-[rgba(255,255,255,0.7)]" onClick={() => setMobileOpen(false)}>Bookings</Link>
              <Link href="/messages" className="block text-[rgba(255,255,255,0.7)]" onClick={() => setMobileOpen(false)}>Messages</Link>
              <Link href="/favorites" className="block text-[rgba(255,255,255,0.7)]" onClick={() => setMobileOpen(false)}>Favorites</Link>
              <Link href="/notifications" className="block text-[rgba(255,255,255,0.7)]" onClick={() => setMobileOpen(false)}>
                Notifications {unreadCount ? `(${unreadCount})` : ""}
              </Link>
              <button onClick={() => { logout(); setMobileOpen(false); }} className="text-red-400 font-medium">
                Logout
              </button>
            </>
          ) : (
            <>
              <Link href="/login" className="block text-[rgba(255,255,255,0.7)]" onClick={() => setMobileOpen(false)}>Login</Link>
              <Link href="/register" className="block text-[#f97316] font-medium" onClick={() => setMobileOpen(false)}>Sign Up</Link>
            </>
          )}
        </div>
      )}
    </nav>
  );
}
