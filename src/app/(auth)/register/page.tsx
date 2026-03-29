"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/lib/auth";
import { UserPlus } from "lucide-react";

export default function RegisterPage() {
  const { register } = useAuth();
  const router = useRouter();
  const [form, setForm] = useState({
    email: "",
    first_name: "",
    last_name: "",
    role: "STUDENT" as "STUDENT" | "LANDLORD",
    gender: "" as "MALE" | "FEMALE" | "",
    phone: "",
    password: "",
    password_confirm: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (form.password !== form.password_confirm) {
      setError("Passwords do not match.");
      return;
    }
    setLoading(true);
    try {
      await register(form);
      router.push("/dashboard");
    } catch (err: unknown) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const axiosErr = err as any;
      if (axiosErr?.response?.data) {
        const data = axiosErr.response.data;
        if (typeof data === "string") {
          setError(data);
        } else if (typeof data === "object") {
          const messages = Object.entries(data)
            .map(([key, val]) => {
              const v = Array.isArray(val) ? val.join(" ") : String(val);
              return `${key}: ${v}`;
            })
            .join("\n");
          setError(messages);
        } else {
          setError("Registration failed.");
        }
      } else {
        const msg = err instanceof Error ? err.message : "Registration failed.";
        setError(msg);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">
        <div className="dark-card p-8">
          <div className="text-center mb-8">
            <div className="w-14 h-14 rounded-2xl mx-auto mb-4 flex items-center justify-center" style={{ background: "linear-gradient(135deg, #f97316, #ea580c)" }}>
              <UserPlus className="h-7 w-7 text-white" />
            </div>
            <h1 className="text-2xl font-bold text-white">Create Account</h1>
            <p className="text-[rgba(255,255,255,0.45)] text-sm mt-1">Join ResPlug today</p>
          </div>
          {error && (
            <div className="text-sm p-3 rounded-lg mb-4 whitespace-pre-wrap" style={{ background: "rgba(239,68,68,0.15)", border: "1px solid rgba(239,68,68,0.3)", color: "#fca5a5" }}>{error}</div>
          )}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="dark-label">First Name</label>
                <input name="first_name" value={form.first_name} onChange={handleChange} required className="dark-input" />
              </div>
              <div>
                <label className="dark-label">Last Name</label>
                <input name="last_name" value={form.last_name} onChange={handleChange} required className="dark-input" />
              </div>
            </div>
            <div>
              <label className="dark-label">Email</label>
              <input type="email" name="email" value={form.email} onChange={handleChange} required
                className="dark-input" placeholder="you@university.ac.za" />
            </div>
            <div>
              <label className="dark-label">I am a</label>
              <select name="role" value={form.role} onChange={handleChange} className="dark-input">
                <option value="STUDENT">Student</option>
                <option value="LANDLORD">Landlord</option>
              </select>
            </div>
            <div>
              <label className="dark-label">Gender</label>
              <select name="gender" value={form.gender} onChange={handleChange} required className="dark-input">
                <option value="">Select gender</option>
                <option value="MALE">Male</option>
                <option value="FEMALE">Female</option>
              </select>
            </div>
            <div>
              <label className="dark-label">Phone (optional)</label>
              <input name="phone" value={form.phone} onChange={handleChange}
                className="dark-input" placeholder="0XX XXX XXXX" />
            </div>
            <div>
              <label className="dark-label">Password</label>
              <input type="password" name="password" value={form.password} onChange={handleChange} required minLength={8}
                className="dark-input" />
            </div>
            <div>
              <label className="dark-label">Confirm Password</label>
              <input type="password" name="password_confirm" value={form.password_confirm} onChange={handleChange} required
                className="dark-input" />
            </div>
            <button type="submit" disabled={loading} className="w-full dark-btn-primary !py-3">
              {loading ? "Creating account..." : "Create Account"}
            </button>
          </form>
          <p className="text-center text-sm text-[rgba(255,255,255,0.4)] mt-6">
            Already have an account?{" "}
            <Link href="/login" className="text-[#f97316] font-medium hover:underline">Sign In</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
