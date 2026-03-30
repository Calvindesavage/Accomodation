"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useMutation, useQuery } from "@tanstack/react-query";
import { ClipboardList, CheckCircle2, ChevronRight, ChevronLeft, Loader2 } from "lucide-react";
import { fetchQuestions, submitAnswers, fetchMyAnswers } from "@/lib/queries";
import { useAuth } from "@/lib/auth";

export default function QuestionnairePage() {
  const router = useRouter();
  const { user } = useAuth();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<number, string>>({});
  const [submitted, setSubmitted] = useState(false);

  const { data: questions, isLoading: loadingQuestions } = useQuery({
    queryKey: ["compatibility-questions"],
    queryFn: fetchQuestions,
    enabled: user?.role === "STUDENT",
  });

  const { data: existingAnswers } = useQuery({
    queryKey: ["my-answers"],
    queryFn: fetchMyAnswers,
    enabled: user?.role === "STUDENT",
  });

  useEffect(() => {
    if (existingAnswers?.answers) {
      const map: Record<number, string> = {};
      existingAnswers.answers.forEach((a) => {
        map[a.question] = a.answer;
      });
      setAnswers(map);
      if (existingAnswers.completed) {
        setSubmitted(true);
      }
    }
  }, [existingAnswers]);

  const submitMutation = useMutation({
    mutationFn: submitAnswers,
    onSuccess: (data) => {
      if (data.completed) {
        setSubmitted(true);
      }
    },
  });

  if (user?.role !== "STUDENT") {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-white">Access Denied</h1>
          <p className="mt-2 text-[rgba(255,255,255,0.45)]">Only students can complete the compatibility questionnaire.</p>
        </div>
      </div>
    );
  }

  if (loadingQuestions) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-[#f97316]" />
      </div>
    );
  }

  if (submitted) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4">
        <div className="dark-card p-8 max-w-md w-full text-center">
          <CheckCircle2 className="w-16 h-16 text-green-400 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-white mb-2">Questionnaire Complete!</h1>
          <p className="text-[rgba(255,255,255,0.5)] mb-6">
            Your answers have been saved. We&apos;ll use them to find your ideal roommate match
            when you book a shared room.
          </p>
          <div className="space-y-3">
            <button
              onClick={() => router.push("/matching/results")}
              className="w-full dark-btn-primary !py-3"
            >
              View My Matches
            </button>
            <button
              onClick={() => {
                setSubmitted(false);
                setCurrentIndex(0);
              }}
              className="w-full dark-btn-outline !py-3"
            >
              Update My Answers
            </button>
            <button
              onClick={() => router.push("/dashboard")}
              className="w-full py-3 text-[rgba(255,255,255,0.4)] hover:text-white transition"
            >
              Back to Dashboard
            </button>
          </div>
        </div>
      </div>
    );
  }

  const questionList = questions || [];
  const currentQuestion = questionList[currentIndex];
  const totalQuestions = questionList.length;
  const allAnswered = questionList.every((q) => answers[q.id]);
  const progress = totalQuestions > 0 ? Math.round((Object.keys(answers).length / totalQuestions) * 100) : 0;

  const handleSelect = (option: string) => {
    setAnswers((prev) => ({ ...prev, [currentQuestion.id]: option }));
  };

  const handleNext = () => {
    if (currentIndex < totalQuestions - 1) {
      setCurrentIndex(currentIndex + 1);
    }
  };

  const handlePrev = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
    }
  };

  const handleSubmit = () => {
    const formatted = Object.entries(answers).map(([questionId, answer]) => ({
      question: questionId,
      answer,
    }));
    submitMutation.mutate(formatted);
  };

  if (!currentQuestion) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-[rgba(255,255,255,0.4)]">No questions available yet. Please try again later.</p>
      </div>
    );
  }

  const categoryColors: Record<string, string> = {
    lifestyle: "bg-purple-900/40 text-purple-400",
    cleanliness: "bg-green-900/40 text-green-400",
    schedule: "bg-blue-900/40 text-blue-400",
    social: "bg-orange-900/40 text-orange-400",
    study: "bg-yellow-900/40 text-yellow-400",
  };

  return (
    <div className="min-h-screen py-8">
      <div className="max-w-2xl mx-auto px-4">
        <div className="mb-8 text-center">
          <ClipboardList className="w-10 h-10 text-[#f97316] mx-auto mb-3" />
          <h1 className="text-2xl font-bold text-white">Roommate Compatibility</h1>
          <p className="text-[rgba(255,255,255,0.45)] mt-1">
            Answer these questions to help us find your ideal roommate
          </p>
        </div>

        {/* Progress bar */}
        <div className="mb-6">
          <div className="flex justify-between text-sm text-[rgba(255,255,255,0.4)] mb-2">
            <span>Question {currentIndex + 1} of {totalQuestions}</span>
            <span>{progress}% complete</span>
          </div>
          <div className="w-full rounded-full h-2" style={{ background: "rgba(249,115,22,0.1)" }}>
            <div
              className="h-2 rounded-full transition-all duration-300"
              style={{ width: `${progress}%`, background: "#f97316" }}
            />
          </div>
        </div>

        {/* Question card */}
        <div className="dark-card p-8">
          <div className="mb-6">
            <span className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${categoryColors[currentQuestion.category] || "bg-[rgba(255,255,255,0.1)] text-[rgba(255,255,255,0.5)]"}`}>
              {currentQuestion.category}
            </span>
          </div>

          <h2 className="text-xl font-semibold text-white mb-6">{currentQuestion.text}</h2>

          <div className="space-y-3">
            {currentQuestion.options.map((option) => (
              <button
                key={option}
                onClick={() => handleSelect(option)}
                className="w-full text-left px-5 py-4 rounded-xl transition-all"
                style={{
                  border: `2px solid ${answers[currentQuestion.id] === option ? "#f97316" : "rgba(249,115,22,0.12)"}`,
                  background: answers[currentQuestion.id] === option ? "rgba(249,115,22,0.1)" : "transparent",
                }}
              >
                <div className="flex items-center gap-3">
                  <div
                    className="w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0"
                    style={{
                      border: `2px solid ${answers[currentQuestion.id] === option ? "#f97316" : "rgba(255,255,255,0.2)"}`,
                      background: answers[currentQuestion.id] === option ? "#f97316" : "transparent",
                    }}
                  >
                    {answers[currentQuestion.id] === option && (
                      <div className="w-2 h-2 rounded-full bg-white" />
                    )}
                  </div>
                  <span className={`font-medium ${answers[currentQuestion.id] === option ? "text-[#f97316]" : "text-[rgba(255,255,255,0.7)]"}`}>{option}</span>
                </div>
              </button>
            ))}
          </div>

          {/* Navigation */}
          <div className="flex justify-between mt-8">
            <button
              onClick={handlePrev}
              disabled={currentIndex === 0}
              className="flex items-center gap-2 px-5 py-2.5 text-[rgba(255,255,255,0.5)] hover:text-white disabled:opacity-30 disabled:cursor-not-allowed transition"
            >
              <ChevronLeft className="w-4 h-4" />
              Previous
            </button>

            {currentIndex < totalQuestions - 1 ? (
              <button
                onClick={handleNext}
                disabled={!answers[currentQuestion.id]}
                className="dark-btn-primary flex items-center gap-2"
              >
                Next
                <ChevronRight className="w-4 h-4" />
              </button>
            ) : (
              <button
                onClick={handleSubmit}
                disabled={!allAnswered || submitMutation.isPending}
                className="flex items-center gap-2 px-6 py-2.5 text-white rounded-xl disabled:opacity-50 disabled:cursor-not-allowed transition" style={{ background: "linear-gradient(135deg, #22c55e, #16a34a)" }}
              >
                {submitMutation.isPending ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <CheckCircle2 className="w-4 h-4" />
                )}
                Submit Answers
              </button>
            )}
          </div>
        </div>

        {/* Question dots */}
        <div className="flex justify-center gap-2 mt-6 flex-wrap">
          {questionList.map((q, i) => (
            <button
              key={q.id}
              onClick={() => setCurrentIndex(i)}
              className={`w-3 h-3 rounded-full transition-all ${
                i === currentIndex
                  ? "scale-125"
                  : ""
              }`}
              style={{
                background: i === currentIndex ? "#f97316" : answers[q.id] ? "rgba(249,115,22,0.5)" : "rgba(255,255,255,0.15)",
              }}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
