"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { fetchBookings, acceptBooking, rejectBooking, cancelBooking } from "@/lib/queries";
import { useAuth } from "@/lib/auth";
import { formatPrice, formatDate } from "@/lib/utils";
import { Calendar, Check, X, Ban } from "lucide-react";

export default function BookingsPage() {
  const { user, isAuthenticated, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !isAuthenticated) router.push("/login");
  }, [loading, isAuthenticated, router]);
  const queryClient = useQueryClient();
  const { data, isLoading } = useQuery({ queryKey: ["bookings"], queryFn: fetchBookings });

  const acceptMut = useMutation({ mutationFn: acceptBooking, onSuccess: () => queryClient.invalidateQueries({ queryKey: ["bookings"] }) });
  const rejectMut = useMutation({ mutationFn: (id: number) => rejectBooking(id, "Not available"), onSuccess: () => queryClient.invalidateQueries({ queryKey: ["bookings"] }) });
  const cancelMut = useMutation({ mutationFn: cancelBooking, onSuccess: () => queryClient.invalidateQueries({ queryKey: ["bookings"] }) });

  const statusColor: Record<string, string> = {
    pending: "bg-yellow-900/40 text-yellow-400",
    accepted: "bg-green-900/40 text-green-400",
    rejected: "bg-red-900/40 text-red-400",
    cancelled: "bg-[rgba(255,255,255,0.1)] text-[rgba(255,255,255,0.5)]",
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-3xl font-bold text-white mb-2 flex items-center gap-2">
        <Calendar className="h-8 w-8 text-[#f97316]" /> Bookings
      </h1>
      <p className="text-[rgba(255,255,255,0.45)] mb-8">{user?.role === "LANDLORD" ? "Manage booking requests" : "Your booking history"}</p>

      {isLoading ? (
        <div className="space-y-4">{Array.from({ length: 3 }).map((_, i) => <div key={i} className="h-24 dark-card animate-pulse" />)}</div>
      ) : data?.results?.length ? (
        <div className="space-y-4">
          {data.results.map((b) => (
            <div key={b.id} className="dark-card p-5 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div className="flex-1">
                <h3 className="font-semibold text-white">{b.listing_title}</h3>
                <p className="text-sm text-[rgba(255,255,255,0.4)]">{b.residence_name}</p>
                <div className="flex items-center gap-3 mt-2 text-sm">
                  <span className="text-[rgba(255,255,255,0.5)]">Move-in: {formatDate(b.move_in_date)}</span>
                  <span className="font-medium text-[#f97316]">{formatPrice(b.listing_price)}/mo</span>
                </div>
                {user?.role === "LANDLORD" && <p className="text-xs text-[rgba(255,255,255,0.3)] mt-1">From: {b.student_name} ({b.student_email})</p>}
                {b.message && <p className="text-sm text-[rgba(255,255,255,0.4)] mt-1 italic">&ldquo;{b.message}&rdquo;</p>}
              </div>
              <div className="flex items-center gap-2 shrink-0">
                <span className={`text-xs font-medium px-3 py-1 rounded-full ${statusColor[b.status]}`}>{b.status}</span>
                {b.status === "pending" && user?.role === "LANDLORD" && (
                  <>
                    <button onClick={() => acceptMut.mutate(b.id)} className="p-2 rounded-lg transition" style={{ background: "rgba(34,197,94,0.15)", color: "#4ade80" }} title="Accept"><Check className="h-4 w-4" /></button>
                    <button onClick={() => rejectMut.mutate(b.id)} className="p-2 rounded-lg transition" style={{ background: "rgba(239,68,68,0.15)", color: "#f87171" }} title="Reject"><X className="h-4 w-4" /></button>
                  </>
                )}
                {(b.status === "pending" || b.status === "accepted") && user?.role === "STUDENT" && (
                  <button onClick={() => cancelMut.mutate(b.id)} className="p-2 rounded-lg transition" style={{ background: "rgba(255,255,255,0.08)", color: "rgba(255,255,255,0.5)" }} title="Cancel"><Ban className="h-4 w-4" /></button>
                )}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-20">
          <Calendar className="h-12 w-12 mx-auto mb-4 text-[rgba(255,255,255,0.15)]" />
          <p className="font-semibold text-[rgba(255,255,255,0.5)]">No bookings yet</p>
        </div>
      )}
    </div>
  );
}
