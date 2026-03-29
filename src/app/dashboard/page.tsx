"use client";

import { useAuth } from "@/lib/auth";
import { useQuery } from "@tanstack/react-query";
import { fetchBookings, fetchMyListings, fetchMyResidences } from "@/lib/queries";
import Link from "next/link";
import { LayoutDashboard, Home, Bed, Calendar, Plus, Users } from "lucide-react";
import { formatPrice, formatDate } from "@/lib/utils";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function DashboardPage() {
  const { user, isAuthenticated, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !isAuthenticated) router.push("/login");
  }, [loading, isAuthenticated, router]);

  const { data: bookings } = useQuery({
    queryKey: ["bookings"],
    queryFn: fetchBookings,
    enabled: isAuthenticated,
  });

  const { data: myListings } = useQuery({
    queryKey: ["myListings"],
    queryFn: fetchMyListings,
    enabled: isAuthenticated && user?.role === "LANDLORD",
  });

  const { data: myResidences } = useQuery({
    queryKey: ["myResidences"],
    queryFn: fetchMyResidences,
    enabled: isAuthenticated && user?.role === "LANDLORD",
  });

  if (loading) {
    return <div className="max-w-7xl mx-auto px-4 py-12"><div className="animate-pulse h-8 rounded w-1/4" style={{ background: "rgba(249,115,22,0.1)" }} /></div>;
  }

  if (!user) return null;

  const pendingBookings = bookings?.results?.filter((b) => b.status === "pending") || [];
  const acceptedBookings = bookings?.results?.filter((b) => b.status === "accepted") || [];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-white flex items-center gap-2">
            <LayoutDashboard className="h-8 w-8 text-[#f97316]" />
            Dashboard
          </h1>
          <p className="text-[rgba(255,255,255,0.45)] mt-1">Welcome back, {user.first_name}!</p>
        </div>
        <span className="dark-badge">{user.role}</span>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <div className="dark-card p-5">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg" style={{ background: "rgba(249,115,22,0.15)" }}><Calendar className="h-5 w-5 text-[#f97316]" /></div>
            <div>
              <p className="text-2xl font-bold text-white">{pendingBookings.length}</p>
              <p className="text-xs text-[rgba(255,255,255,0.4)]">Pending Bookings</p>
            </div>
          </div>
        </div>
        <div className="dark-card p-5">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg" style={{ background: "rgba(34,197,94,0.15)" }}><Users className="h-5 w-5 text-green-400" /></div>
            <div>
              <p className="text-2xl font-bold text-white">{acceptedBookings.length}</p>
              <p className="text-xs text-[rgba(255,255,255,0.4)]">Active Bookings</p>
            </div>
          </div>
        </div>
        {user.role === "LANDLORD" && (
          <>
            <div className="dark-card p-5">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg" style={{ background: "rgba(168,85,247,0.15)" }}><Home className="h-5 w-5 text-purple-400" /></div>
                <div>
                  <p className="text-2xl font-bold text-white">{myResidences?.length || 0}</p>
                  <p className="text-xs text-[rgba(255,255,255,0.4)]">Residences</p>
                </div>
              </div>
            </div>
            <div className="dark-card p-5">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg" style={{ background: "rgba(249,115,22,0.15)" }}><Bed className="h-5 w-5 text-[#f97316]" /></div>
                <div>
                  <p className="text-2xl font-bold text-white">{myListings?.length || 0}</p>
                  <p className="text-xs text-[rgba(255,255,255,0.4)]">Listings</p>
                </div>
              </div>
            </div>
          </>
        )}
      </div>

      {/* Recent Bookings */}
      <div className="dark-card p-6 mb-8">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-white">Recent Bookings</h2>
          <Link href="/bookings" className="text-[#f97316] text-sm hover:underline">View all</Link>
        </div>
        {bookings?.results?.length ? (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead><tr className="text-left text-[rgba(255,255,255,0.4)]" style={{ borderBottom: "1px solid rgba(249,115,22,0.12)" }}>
                <th className="pb-3 font-medium">Listing</th>
                <th className="pb-3 font-medium">Date</th>
                <th className="pb-3 font-medium">Status</th>
                <th className="pb-3 font-medium">Price</th>
              </tr></thead>
              <tbody>
                {bookings.results.slice(0, 5).map((b) => (
                  <tr key={b.id} style={{ borderBottom: "1px solid rgba(249,115,22,0.08)" }} className="last:border-0">
                    <td className="py-3 font-medium text-white">{b.listing_title}</td>
                    <td className="py-3 text-[rgba(255,255,255,0.45)]">{formatDate(b.move_in_date)}</td>
                    <td className="py-3">
                      <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${
                        b.status === "accepted" ? "bg-green-900/40 text-green-400" :
                        b.status === "pending" ? "bg-yellow-900/40 text-yellow-400" :
                        b.status === "rejected" ? "bg-red-900/40 text-red-400" :
                        "bg-[rgba(255,255,255,0.1)] text-[rgba(255,255,255,0.5)]"
                      }`}>{b.status}</span>
                    </td>
                    <td className="py-3 text-[#f97316] font-medium">{formatPrice(b.listing_price)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p className="text-[rgba(255,255,255,0.3)] text-sm">No bookings yet.</p>
        )}
      </div>

      {/* Landlord: Quick Actions */}
      {user.role === "LANDLORD" && (
        <div className="grid sm:grid-cols-3 gap-4">
          <Link href="/residences/manage" className="dark-card p-6 flex items-center gap-4 transition-all hover:-translate-y-1">
            <Home className="h-8 w-8 text-purple-400" />
            <div>
              <p className="font-semibold text-white">My Properties</p>
              <p className="text-sm text-[rgba(255,255,255,0.4)]">Manage residences & listings</p>
            </div>
          </Link>
          <Link href="/residences/new" className="dark-card p-6 flex items-center gap-4 transition-all hover:-translate-y-1">
            <Plus className="h-8 w-8 text-[#f97316]" />
            <div>
              <p className="font-semibold text-white">Add New Property</p>
              <p className="text-sm text-[rgba(255,255,255,0.4)]">Create with virtual tour</p>
            </div>
          </Link>
          <Link href="/listings/new" className="dark-card p-6 flex items-center gap-4 transition-all hover:-translate-y-1">
            <Bed className="h-8 w-8 text-[#f97316]" />
            <div>
              <p className="font-semibold text-white">Add New Listing</p>
              <p className="text-sm text-[rgba(255,255,255,0.4)]">Create a room listing</p>
            </div>
          </Link>
        </div>
      )}
    </div>
  );
}
