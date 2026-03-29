"use client";

import { useQuery } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { Users, Heart, Loader2, ClipboardList, ArrowLeft } from "lucide-react";
import { fetchMyMatches, fetchQuestionnaireStatus } from "@/lib/queries";
import { useAuth } from "@/lib/auth";
import { RoommateMatch } from "@/types";

export default function MatchResultsPage() {
  const router = useRouter();
  const { user } = useAuth();

  const { data: statusData } = useQuery({
    queryKey: ["questionnaire-status"],
    queryFn: fetchQuestionnaireStatus,
    enabled: user?.role === "STUDENT",
  });

  const { data: matches, isLoading } = useQuery({
    queryKey: ["my-matches"],
    queryFn: () => fetchMyMatches(),
    enabled: user?.role === "STUDENT" && statusData?.completed === true,
  });

  if (user?.role !== "STUDENT") {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-white">Access Denied</h1>
          <p className="mt-2 text-[rgba(255,255,255,0.45)]">Only students can view roommate matches.</p>
        </div>
      </div>
    );
  }

  if (statusData && !statusData.completed) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4">
        <div className="dark-card p-8 max-w-md w-full text-center">
          <ClipboardList className="w-16 h-16 text-[#f97316] mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-white mb-2">Complete Your Questionnaire First</h1>
          <p className="text-[rgba(255,255,255,0.5)] mb-6">
            You need to answer the compatibility questions before we can match you with roommates.
          </p>
          <button
            onClick={() => router.push("/matching/questionnaire")}
            className="w-full dark-btn-primary !py-3"
          >
            Start Questionnaire
          </button>
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-[#f97316]" />
      </div>
    );
  }

  const getScoreColor = (pct: number) => {
    if (pct >= 80) return "text-green-400 border-green-800";
    if (pct >= 60) return "text-[#f97316] border-[rgba(249,115,22,0.3)]";
    if (pct >= 40) return "text-yellow-400 border-yellow-800";
    return "text-red-400 border-red-800";
  };

  const getScoreLabel = (pct: number) => {
    if (pct >= 80) return "Excellent Match";
    if (pct >= 60) return "Good Match";
    if (pct >= 40) return "Fair Match";
    return "Low Match";
  };

  const getPartnerInfo = (match: RoommateMatch) => {
    if (match.student_a === user?.id) {
      return { name: match.student_b_name, email: match.student_b_email, gender: match.student_b_gender };
    }
    return { name: match.student_a_name, email: match.student_a_email, gender: match.student_a_gender };
  };

  const categoryLabels: Record<string, string> = {
    lifestyle: "Lifestyle",
    cleanliness: "Cleanliness",
    schedule: "Schedule",
    social: "Social",
    study: "Study Habits",
  };

  return (
    <div className="min-h-screen py-8">
      <div className="max-w-3xl mx-auto px-4">
        <button
          onClick={() => router.push("/dashboard")}
          className="flex items-center gap-2 text-[rgba(255,255,255,0.45)] hover:text-white mb-6 transition"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Dashboard
        </button>

        <div className="mb-8 text-center">
          <Users className="w-10 h-10 text-[#f97316] mx-auto mb-3" />
          <h1 className="text-2xl font-bold text-white">Your Roommate Matches</h1>
          <p className="text-[rgba(255,255,255,0.45)] mt-1">
            Based on your compatibility questionnaire answers
          </p>
        </div>

        {!matches || matches.length === 0 ? (
          <div className="dark-card p-8 text-center">
            <Heart className="w-12 h-12 text-[rgba(255,255,255,0.15)] mx-auto mb-4" />
            <h2 className="text-lg font-semibold text-white mb-2">No Matches Yet</h2>
            <p className="text-[rgba(255,255,255,0.45)] mb-4">
              Matches are computed when you book a shared room. Once other students book the same room,
              you&apos;ll see your compatibility scores here.
            </p>
            <button
              onClick={() => router.push("/listings")}
              className="dark-btn-primary"
            >
              Browse Listings
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            {matches.map((match) => {
              const partner = getPartnerInfo(match);
              const pct = match.compatibility_percentage;
              return (
                <div key={match.id} className="dark-card p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h3 className="text-lg font-semibold text-white">{partner.name}</h3>
                      <p className="text-sm text-[rgba(255,255,255,0.4)]">{partner.email}</p>
                      <p className="text-xs text-[rgba(255,255,255,0.25)] mt-1">
                        {match.listing_title} • {match.residence_name}
                      </p>
                    </div>
                    <div className={`text-center px-4 py-2 rounded-xl border ${getScoreColor(pct)}`} style={{ background: "rgba(249,115,22,0.06)" }}>
                      <div className="text-2xl font-bold">{pct}%</div>
                      <div className="text-xs font-medium">{getScoreLabel(pct)}</div>
                    </div>
                  </div>

                  {/* Category breakdown */}
                  {match.breakdown && Object.keys(match.breakdown).length > 0 && (
                    <div className="mt-4 pt-4" style={{ borderTop: "1px solid rgba(249,115,22,0.12)" }}>
                      <h4 className="text-sm font-medium text-[rgba(255,255,255,0.5)] mb-3">Compatibility Breakdown</h4>
                      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                        {Object.entries(match.breakdown).map(([cat, score]) => {
                          const catPct = Math.round(Number(score) * 100);
                          return (
                            <div key={cat} className="text-center">
                              <div className="text-xs text-[rgba(255,255,255,0.4)] mb-1">{categoryLabels[cat] || cat}</div>
                              <div className="w-full rounded-full h-2 mb-1" style={{ background: "rgba(249,115,22,0.1)" }}>
                                <div
                                  className={`h-2 rounded-full transition-all ${
                                    catPct >= 70 ? "bg-green-500" : catPct >= 40 ? "bg-yellow-500" : "bg-red-400"
                                  }`}
                                  style={{ width: `${catPct}%` }}
                                />
                              </div>
                              <div className="text-xs font-medium text-[rgba(255,255,255,0.5)]">{catPct}%</div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
