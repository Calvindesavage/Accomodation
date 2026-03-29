"use client";

import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { fetchConversations, fetchConversation, sendMessage } from "@/lib/queries";
import { useAuth } from "@/lib/auth";
import { formatRelativeTime } from "@/lib/utils";
import { MessageSquare, Send } from "lucide-react";

export default function MessagesPage() {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const [activeId, setActiveId] = useState<number | null>(null);
  const [newMsg, setNewMsg] = useState("");

  const { data: convos, isLoading } = useQuery({ queryKey: ["conversations"], queryFn: fetchConversations });
  const { data: activeConvo } = useQuery({
    queryKey: ["conversation", activeId],
    queryFn: () => fetchConversation(activeId!),
    enabled: !!activeId,
    refetchInterval: 5000,
  });

  const sendMut = useMutation({
    mutationFn: () => sendMessage(activeId!, newMsg),
    onSuccess: () => { setNewMsg(""); queryClient.invalidateQueries({ queryKey: ["conversation", activeId] }); queryClient.invalidateQueries({ queryKey: ["conversations"] }); },
  });

  const otherParticipant = (participants: { id: number; full_name: string }[]) =>
    participants.find((p) => p.id !== user?.id);

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-3xl font-bold text-white mb-6 flex items-center gap-2">
        <MessageSquare className="h-8 w-8 text-[#f97316]" /> Messages
      </h1>
      <div className="dark-card overflow-hidden flex" style={{ height: "70vh" }}>
        {/* Sidebar */}
        <div className="w-80 overflow-y-auto shrink-0" style={{ borderRight: "1px solid rgba(249,115,22,0.12)" }}>
          {isLoading ? (
            <div className="p-4 space-y-3">{Array.from({ length: 4 }).map((_, i) => <div key={i} className="h-16 rounded-lg animate-pulse" style={{ background: "rgba(249,115,22,0.06)" }} />)}</div>
          ) : convos?.results?.length ? (
            convos.results.map((c) => {
              const other = otherParticipant(c.participants);
              return (
                <button key={c.id} onClick={() => setActiveId(c.id)}
                  className={`w-full text-left px-4 py-3 transition ${activeId === c.id ? "" : "hover:bg-[rgba(249,115,22,0.05)]"}`}
                  style={{ borderBottom: "1px solid rgba(249,115,22,0.08)", background: activeId === c.id ? "rgba(249,115,22,0.1)" : undefined }}>
                  <div className="flex items-center justify-between">
                    <span className="font-medium text-sm text-white truncate">{other?.full_name || "User"}</span>
                    {c.unread_count > 0 && <span className="text-white text-xs rounded-full h-5 w-5 flex items-center justify-center" style={{ background: "#f97316" }}>{c.unread_count}</span>}
                  </div>
                  {c.last_message && (
                    <p className="text-xs text-[rgba(255,255,255,0.4)] truncate mt-0.5">{c.last_message.content}</p>
                  )}
                  <p className="text-xs text-[rgba(255,255,255,0.25)] mt-0.5">{formatRelativeTime(c.updated_at)}</p>
                </button>
              );
            })
          ) : (
            <div className="p-6 text-center text-[rgba(255,255,255,0.3)] text-sm">No conversations yet</div>
          )}
        </div>

        {/* Chat */}
        <div className="flex-1 flex flex-col">
          {activeConvo ? (
            <>
              <div className="px-6 py-4" style={{ borderBottom: "1px solid rgba(249,115,22,0.12)", background: "rgba(249,115,22,0.04)" }}>
                <span className="font-semibold text-white">{otherParticipant(activeConvo.participants)?.full_name || "Chat"}</span>
              </div>
              <div className="flex-1 overflow-y-auto px-6 py-4 space-y-3">
                {activeConvo.messages?.map((m) => (
                  <div key={m.id} className={`flex ${m.sender === user?.id ? "justify-end" : "justify-start"}`}>
                    <div className={`max-w-xs px-4 py-2 rounded-2xl text-sm ${m.sender === user?.id ? "text-white" : "text-[rgba(255,255,255,0.8)]"}`}
                      style={{ background: m.sender === user?.id ? "linear-gradient(135deg, #f97316, #ea580c)" : "rgba(249,115,22,0.1)", border: m.sender === user?.id ? "none" : "1px solid rgba(249,115,22,0.15)" }}>
                      {m.content}
                      <p className={`text-xs mt-1 ${m.sender === user?.id ? "text-[rgba(255,255,255,0.6)]" : "text-[rgba(255,255,255,0.3)]"}`}>{formatRelativeTime(m.created_at)}</p>
                    </div>
                  </div>
                ))}
              </div>
              <div className="px-4 py-3 flex gap-2" style={{ borderTop: "1px solid rgba(249,115,22,0.12)" }}>
                <input value={newMsg} onChange={(e) => setNewMsg(e.target.value)}
                  onKeyDown={(e) => { if (e.key === "Enter" && newMsg.trim()) sendMut.mutate(); }}
                  placeholder="Type a message..." className="dark-input flex-1 !py-2" />
                <button onClick={() => { if (newMsg.trim()) sendMut.mutate(); }}
                  disabled={!newMsg.trim() || sendMut.isPending}
                  className="dark-btn-primary !p-2 !rounded-xl">
                  <Send className="h-5 w-5" />
                </button>
              </div>
            </>
          ) : (
            <div className="flex-1 flex items-center justify-center">
              <div className="text-center">
                <MessageSquare className="h-12 w-12 mx-auto mb-3 text-[rgba(255,255,255,0.15)]" />
                <p className="text-[rgba(255,255,255,0.35)]">Select a conversation to start chatting</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
