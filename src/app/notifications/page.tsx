"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { fetchNotifications, markNotificationRead, markAllNotificationsRead } from "@/lib/queries";
import { formatRelativeTime } from "@/lib/utils";
import { Bell, CheckCheck } from "lucide-react";

export default function NotificationsPage() {
  const queryClient = useQueryClient();
  const { data, isLoading } = useQuery({ queryKey: ["notifications"], queryFn: fetchNotifications });

  const markReadMut = useMutation({
    mutationFn: markNotificationRead,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["notifications"] }),
  });

  const markAllMut = useMutation({
    mutationFn: markAllNotificationsRead,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["notifications"] }),
  });

  const typeIcon: Record<string, string> = {
    booking_request: "📅", booking_accepted: "✅", booking_rejected: "❌",
    booking_cancelled: "🚫", new_message: "💬", payment_received: "💰",
    review_posted: "⭐", listing_alert: "🏠", maintenance_update: "🔧",
  };

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold text-white flex items-center gap-2">
          <Bell className="h-8 w-8 text-[#f97316]" /> Notifications
        </h1>
        {data?.results?.some((n) => !n.is_read) && (
          <button onClick={() => markAllMut.mutate()} className="text-sm text-[#f97316] hover:underline flex items-center gap-1">
            <CheckCheck className="h-4 w-4" /> Mark all read
          </button>
        )}
      </div>

      {isLoading ? (
        <div className="space-y-3">{Array.from({ length: 5 }).map((_, i) => <div key={i} className="h-16 dark-card animate-pulse" />)}</div>
      ) : data?.results?.length ? (
        <div className="space-y-2">
          {data.results.map((n) => (
            <div
              key={n.id}
              onClick={() => !n.is_read && markReadMut.mutate(n.id)}
              className="flex items-start gap-3 p-4 rounded-xl cursor-pointer transition"
              style={{
                background: n.is_read ? "linear-gradient(135deg, rgba(249,115,22,0.04), rgba(249,115,22,0.01))" : "rgba(249,115,22,0.1)",
                border: `1px solid ${n.is_read ? "rgba(249,115,22,0.1)" : "rgba(249,115,22,0.3)"}`,
              }}
            >
              <span className="text-xl">{typeIcon[n.notification_type] || "🔔"}</span>
              <div className="flex-1 min-w-0">
                <p className="font-medium text-sm text-white">{n.title}</p>
                <p className="text-sm text-[rgba(255,255,255,0.45)] truncate">{n.message}</p>
                <p className="text-xs text-[rgba(255,255,255,0.25)] mt-1">{formatRelativeTime(n.created_at)}</p>
              </div>
              {!n.is_read && <span className="w-2 h-2 rounded-full mt-2 shrink-0" style={{ background: "#f97316" }} />}
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-20">
          <Bell className="h-12 w-12 mx-auto mb-4 text-[rgba(255,255,255,0.15)]" />
          <p className="font-semibold text-[rgba(255,255,255,0.5)]">No notifications</p>
          <p className="text-sm text-[rgba(255,255,255,0.3)] mt-1">You&apos;re all caught up!</p>
        </div>
      )}
    </div>
  );
}
