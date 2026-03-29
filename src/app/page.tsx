import Link from "next/link";
import { Search, Shield, MessageSquare, Star, MapPin, Home, ArrowRight, CheckCircle } from "lucide-react";

export default function LandingPage() {
  return (
    <div className="min-h-screen" style={{ fontFamily: "'Sora', sans-serif", background: "#0f0a00" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Sora:wght@300;400;500;600;700;800&family=Playfair+Display:ital,wght@0,700;1,600&display=swap');

        :root {
          --orange-500: #f97316;
          --orange-400: #fb923c;
          --orange-300: #fdba74;
          --orange-600: #ea580c;
          --orange-900: #7c2d12;
          --dark: #0f0a00;
          --dark-card: #1a1106;
          --text-muted: #a16207;
        }

        * { box-sizing: border-box; margin: 0; padding: 0; }

        .noise-bg::after {
          content: '';
          position: absolute;
          inset: 0;
          background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.04'/%3E%3C/svg%3E");
          pointer-events: none;
          opacity: 0.4;
          z-index: 1;
        }

        @keyframes float {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-20px) rotate(3deg); }
        }
        @keyframes float2 {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-14px) rotate(-2deg); }
        }
        @keyframes pulse-ring {
          0% { transform: scale(0.9); opacity: 0.6; }
          100% { transform: scale(1.4); opacity: 0; }
        }
        @keyframes slide-up {
          from { opacity: 0; transform: translateY(32px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes glow {
          0%, 100% { box-shadow: 0 0 30px rgba(249,115,22,0.3); }
          50% { box-shadow: 0 0 60px rgba(249,115,22,0.6); }
        }

        .animate-float { animation: float 6s ease-in-out infinite; }
        .animate-float2 { animation: float2 8s ease-in-out infinite 1s; }
        .animate-slide-up { animation: slide-up 0.7s ease-out both; }
        .animate-slide-up-d1 { animation: slide-up 0.7s ease-out 0.1s both; }
        .animate-slide-up-d2 { animation: slide-up 0.7s ease-out 0.2s both; }
        .animate-slide-up-d3 { animation: slide-up 0.7s ease-out 0.3s both; }
        .animate-glow { animation: glow 3s ease-in-out infinite; }

        .hero-grid {
          background-image:
            linear-gradient(rgba(249,115,22,0.06) 1px, transparent 1px),
            linear-gradient(90deg, rgba(249,115,22,0.06) 1px, transparent 1px);
          background-size: 60px 60px;
        }

        .feature-card {
          background: linear-gradient(135deg, rgba(249,115,22,0.08), rgba(249,115,22,0.02));
          border: 1px solid rgba(249,115,22,0.15);
          transition: all 0.3s ease;
          position: relative;
          overflow: hidden;
        }
        .feature-card::before {
          content: '';
          position: absolute;
          top: 0; left: 0; right: 0;
          height: 1px;
          background: linear-gradient(90deg, transparent, rgba(249,115,22,0.5), transparent);
          opacity: 0;
          transition: opacity 0.3s;
        }
        .feature-card:hover {
          border-color: rgba(249,115,22,0.4);
          background: linear-gradient(135deg, rgba(249,115,22,0.14), rgba(249,115,22,0.04));
          transform: translateY(-4px);
        }
        .feature-card:hover::before { opacity: 1; }

        .step-line {
          position: absolute;
          top: 50%;
          left: calc(50% + 40px);
          width: calc(100% - 80px);
          height: 1px;
          background: linear-gradient(90deg, rgba(249,115,22,0.5), rgba(249,115,22,0.1));
        }

        .cta-btn-primary {
          background: linear-gradient(135deg, #f97316, #ea580c);
          color: white;
          border: none;
          transition: all 0.3s ease;
          position: relative;
          overflow: hidden;
        }
        .cta-btn-primary::after {
          content: '';
          position: absolute;
          inset: 0;
          background: linear-gradient(135deg, rgba(255,255,255,0.15), transparent);
          opacity: 0;
          transition: opacity 0.3s;
        }
        .cta-btn-primary:hover {
          transform: translateY(-2px);
          box-shadow: 0 12px 40px rgba(249,115,22,0.4);
        }
        .cta-btn-primary:hover::after { opacity: 1; }

        .cta-btn-outline {
          background: transparent;
          color: white;
          border: 1.5px solid rgba(249,115,22,0.5);
          transition: all 0.3s ease;
        }
        .cta-btn-outline:hover {
          border-color: #f97316;
          background: rgba(249,115,22,0.1);
          transform: translateY(-2px);
        }

        .stat-card {
          border: 1px solid rgba(249,115,22,0.15);
          background: rgba(249,115,22,0.05);
        }

        .badge {
          background: rgba(249,115,22,0.15);
          border: 1px solid rgba(249,115,22,0.3);
          color: #fb923c;
          font-size: 12px;
          letter-spacing: 0.08em;
          text-transform: uppercase;
          font-weight: 600;
        }

        .section-divider {
          height: 1px;
          background: linear-gradient(90deg, transparent, rgba(249,115,22,0.3), transparent);
          margin: 0 auto;
          max-width: 600px;
        }

        .orb {
          position: absolute;
          border-radius: 50%;
          filter: blur(80px);
          pointer-events: none;
        }

        .testimonial-card {
          background: linear-gradient(135deg, rgba(249,115,22,0.07), rgba(0,0,0,0));
          border: 1px solid rgba(249,115,22,0.12);
          transition: all 0.3s;
        }
        .testimonial-card:hover {
          border-color: rgba(249,115,22,0.3);
        }
      `}</style>

      {/* NAV */}
      <nav style={{
        position: "fixed", top: 0, left: 0, right: 0, zIndex: 100,
        background: "rgba(15,10,0,0.85)", backdropFilter: "blur(20px)",
        borderBottom: "1px solid rgba(249,115,22,0.12)",
        padding: "0 2rem", height: "64px",
        display: "flex", alignItems: "center", justifyContent: "space-between"
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          <div style={{
            width: 36, height: 36, borderRadius: 10,
            background: "linear-gradient(135deg, #f97316, #ea580c)",
            display: "flex", alignItems: "center", justifyContent: "center"
          }}>
            <Home size={18} color="white" />
          </div>
          <span style={{ color: "white", fontWeight: 800, fontSize: 20, letterSpacing: "-0.02em" }}>
            Res<span style={{ color: "#f97316" }}>Plug</span>
          </span>
        </div>
        <div style={{ display: "flex", gap: "1.5rem", alignItems: "center" }}>
          <Link href="/listings" style={{ color: "rgba(255,255,255,0.6)", textDecoration: "none", fontSize: 14, fontWeight: 500, transition: "color 0.2s" }}>Listings</Link>
          <Link href="/about" style={{ color: "rgba(255,255,255,0.6)", textDecoration: "none", fontSize: 14, fontWeight: 500 }}>About</Link>
          <Link href="/register" style={{
            padding: "8px 20px", borderRadius: 10,
            background: "linear-gradient(135deg, #f97316, #ea580c)",
            color: "white", textDecoration: "none", fontSize: 14, fontWeight: 600
          }}>Get Started</Link>
        </div>
      </nav>

      {/* HERO */}
      <section className="noise-bg hero-grid" style={{
        position: "relative", minHeight: "100vh",
        display: "flex", alignItems: "center",
        paddingTop: 80, overflow: "hidden",
        background: "#0f0a00"
      }}>
        {/* Orbs */}
        <div className="orb" style={{ width: 600, height: 600, background: "rgba(249,115,22,0.15)", top: -100, right: -100 }} />
        <div className="orb" style={{ width: 400, height: 400, background: "rgba(234,88,12,0.1)", bottom: -50, left: -100 }} />

        {/* Floating decorative shapes */}
        <div className="animate-float" style={{
          position: "absolute", right: "8%", top: "20%",
          width: 280, height: 280, borderRadius: 32,
          background: "linear-gradient(135deg, rgba(249,115,22,0.12), rgba(249,115,22,0.03))",
          border: "1px solid rgba(249,115,22,0.2)",
          display: "flex", alignItems: "center", justifyContent: "center",
          flexDirection: "column", gap: 16, padding: 32
        }}>
          <div style={{ width: "100%", height: 12, borderRadius: 6, background: "rgba(249,115,22,0.3)" }} />
          <div style={{ width: "80%", height: 12, borderRadius: 6, background: "rgba(249,115,22,0.2)" }} />
          <div style={{ width: "60%", height: 12, borderRadius: 6, background: "rgba(249,115,22,0.15)" }} />
          <div style={{ marginTop: 8, display: "flex", gap: 8 }}>
            {[1,2,3].map(i => (
              <div key={i} style={{ width: 36, height: 36, borderRadius: 8, background: "rgba(249,115,22,0.2)", border: "1px solid rgba(249,115,22,0.3)" }} />
            ))}
          </div>
          <div style={{ width: "100%", height: 36, borderRadius: 10, background: "linear-gradient(135deg, rgba(249,115,22,0.4), rgba(234,88,12,0.3))", border: "1px solid rgba(249,115,22,0.4)" }} />
        </div>

        <div className="animate-float2" style={{
          position: "absolute", right: "18%", bottom: "15%",
          width: 120, height: 120, borderRadius: "50%",
          background: "linear-gradient(135deg, rgba(249,115,22,0.15), transparent)",
          border: "1px solid rgba(249,115,22,0.25)"
        }} />

        <div style={{ maxWidth: 1280, margin: "0 auto", padding: "0 2rem", position: "relative", zIndex: 2 }}>
          <div className="animate-slide-up" style={{ marginBottom: 24 }}>
          
          </div>

          <h1 className="animate-slide-up-d1" style={{
            fontSize: "clamp(2.8rem, 6vw, 5rem)",
            fontWeight: 800,
            lineHeight: 1.05,
            letterSpacing: "-0.03em",
            color: "white",
            maxWidth: 700,
            marginBottom: 24
          }}>
            Find Your Perfect{" "}
            <span style={{
              fontFamily: "'Playfair Display', serif",
              fontStyle: "italic",
              background: "linear-gradient(135deg, #f97316, #fdba74)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
            }}>Student Home</span>
          </h1>

          <p className="animate-slide-up-d2" style={{
            fontSize: 18, color: "rgba(255,255,255,0.55)", maxWidth: 520,
            lineHeight: 1.7, marginBottom: 40, fontWeight: 400
          }}>
            ResPlug connects students with verified landlords across South Africa.
            Browse, compare, and book accommodation near your campus — safely and simply.
          </p>

          <div className="animate-slide-up-d3" style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
            <Link href="/listings" className="cta-btn-primary" style={{
              display: "inline-flex", alignItems: "center", gap: 8,
              padding: "14px 28px", borderRadius: 14,
              textDecoration: "none", fontSize: 15, fontWeight: 700
            }}>
              <Search size={18} />
              Browse Listings
              <ArrowRight size={16} />
            </Link>
            <Link href="/register" className="cta-btn-outline" style={{
              display: "inline-flex", alignItems: "center", gap: 8,
              padding: "14px 28px", borderRadius: 14,
              textDecoration: "none", fontSize: 15, fontWeight: 600
            }}>
              List Your Property
            </Link>
          </div>

          {/* Stats row */}
          <div style={{ display: "flex", gap: 24, marginTop: 60, flexWrap: "wrap" }}>
            {[
              { value: "12,000+", label: "Active Listings" },
              { value: "8 Cities", label: "Across SA" },
              { value: "95%", label: "Verified Landlords" },
            ].map((stat, i) => (
              <div key={i} className="stat-card animate-slide-up" style={{
                padding: "16px 24px", borderRadius: 14,
                animationDelay: `${0.4 + i * 0.1}s`
              }}>
                <div style={{ fontSize: 24, fontWeight: 800, color: "#f97316", letterSpacing: "-0.02em" }}>{stat.value}</div>
                <div style={{ fontSize: 13, color: "rgba(255,255,255,0.45)", marginTop: 2 }}>{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <div className="section-divider" />

      {/* FEATURES */}
      <section style={{ padding: "100px 2rem", background: "#0f0a00", position: "relative", overflow: "hidden" }}>
        <div className="orb" style={{ width: 500, height: 500, background: "rgba(249,115,22,0.08)", top: "50%", left: "50%", transform: "translate(-50%,-50%)" }} />

        <div style={{ maxWidth: 1280, margin: "0 auto", position: "relative", zIndex: 2 }}>
          <div style={{ textAlign: "center", marginBottom: 64 }}>
            <span className="badge" style={{ display: "inline-block", padding: "6px 14px", borderRadius: 100, marginBottom: 20 }}>
              Why ResPlug
            </span>
            <h2 style={{ fontSize: "clamp(2rem, 4vw, 3rem)", fontWeight: 800, color: "white", letterSpacing: "-0.03em", marginBottom: 16 }}>
              Built for Students,{" "}
              <span style={{ color: "#f97316" }}>by Students</span>
            </h2>
            <p style={{ color: "rgba(255,255,255,0.45)", maxWidth: 500, margin: "0 auto", lineHeight: 1.7 }}>
              Every feature designed around the challenges of finding student accommodation in South Africa.
            </p>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: 20 }}>
            {[
              { icon: Search, title: "Smart Search", desc: "Filter by price, location, room type, and amenities. Find exactly what you need, instantly." },
              { icon: Shield, title: "Verified Landlords", desc: "All landlords go through a rigorous verification process. Your safety is non-negotiable.", highlight: true },
              { icon: MessageSquare, title: "Direct Chat", desc: "Message landlords directly through our real-time chat. No middlemen, no delays." },
              { icon: Star, title: "Reviews & Ratings", desc: "Read honest reviews from fellow students before making your decision. Trust the community." },
              { icon: MapPin, title: "Near Your Campus", desc: "Search by distance from your university. Walking distance or a short commute — your call." },
              { icon: Home, title: "Easy Booking", desc: "Book your room in minutes. Track your booking status in real time, start to finish." },
            ].map((feature, i) => (
              <div key={i} className="feature-card" style={{
                borderRadius: 20, padding: 32,
                background: feature.highlight
                  ? "linear-gradient(135deg, rgba(249,115,22,0.15), rgba(249,115,22,0.05))"
                  : undefined,
                borderColor: feature.highlight ? "rgba(249,115,22,0.35)" : undefined
              }}>
                <div style={{
                  width: 48, height: 48, borderRadius: 14, marginBottom: 20,
                  background: feature.highlight
                    ? "linear-gradient(135deg, #f97316, #ea580c)"
                    : "rgba(249,115,22,0.12)",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  border: feature.highlight ? "none" : "1px solid rgba(249,115,22,0.2)"
                }}>
                  <feature.icon size={22} color={feature.highlight ? "white" : "#f97316"} />
                </div>
                <h3 style={{ color: "white", fontWeight: 700, fontSize: 17, marginBottom: 10 }}>
                  {feature.title}
                </h3>
                <p style={{ color: "rgba(255,255,255,0.45)", fontSize: 14, lineHeight: 1.7 }}>
                  {feature.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <div className="section-divider" />

      {/* HOW IT WORKS */}
      <section style={{ padding: "100px 2rem", background: "#0f0a00" }}>
        <div style={{ maxWidth: 1280, margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: 64 }}>
            <span className="badge" style={{ display: "inline-block", padding: "6px 14px", borderRadius: 100, marginBottom: 20 }}>
              The Process
            </span>
            <h2 style={{ fontSize: "clamp(2rem, 4vw, 3rem)", fontWeight: 800, color: "white", letterSpacing: "-0.03em" }}>
              Three steps to your new home
            </h2>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: 32, position: "relative" }}>
            {[
              {
                step: "01",
                title: "Search",
                desc: "Browse thousands of listings filtered by your university, budget, and preferences.",
                checks: ["Filter by location & price", "Sort by distance to campus", "Compare multiple options"]
              },
              {
                step: "02",
                title: "Connect",
                desc: "Chat directly with verified landlords, ask questions, and schedule viewings at your convenience.",
                checks: ["Real-time messaging", "Schedule viewings", "No spam or cold calls"]
              },
              {
                step: "03",
                title: "Book",
                desc: "Secure your room, pay your deposit safely, and get ready to move into your new space.",
                checks: ["Secure deposit payment", "Digital lease signing", "Move-in confirmation"]
              },
            ].map((item, i) => (
              <div key={i} style={{
                background: "linear-gradient(160deg, rgba(249,115,22,0.07), rgba(0,0,0,0))",
                border: "1px solid rgba(249,115,22,0.12)",
                borderRadius: 24, padding: 36,
                position: "relative"
              }}>
                <div style={{
                  fontSize: 72, fontWeight: 900, lineHeight: 1,
                  color: "rgba(249,115,22,0.08)", letterSpacing: "-0.04em",
                  marginBottom: 16,
                  fontFamily: "'Playfair Display', serif"
                }}>
                  {item.step}
                </div>
                <div style={{
                  width: 40, height: 40, borderRadius: 12,
                  background: "linear-gradient(135deg, #f97316, #ea580c)",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  fontSize: 16, fontWeight: 800, color: "white",
                  marginBottom: 20
                }}>
                  {i + 1}
                </div>
                <h3 style={{ color: "white", fontWeight: 800, fontSize: 22, marginBottom: 12, letterSpacing: "-0.02em" }}>
                  {item.title}
                </h3>
                <p style={{ color: "rgba(255,255,255,0.45)", fontSize: 14, lineHeight: 1.7, marginBottom: 24 }}>
                  {item.desc}
                </p>
                <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                  {item.checks.map((check, j) => (
                    <div key={j} style={{ display: "flex", alignItems: "center", gap: 10 }}>
                      <CheckCircle size={16} color="#f97316" />
                      <span style={{ color: "rgba(255,255,255,0.6)", fontSize: 13 }}>{check}</span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* TESTIMONIALS */}
      <section style={{ padding: "80px 2rem", background: "#0f0a00" }}>
        <div style={{ maxWidth: 1280, margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: 48 }}>
            <h2 style={{ fontSize: "clamp(1.8rem, 3vw, 2.5rem)", fontWeight: 800, color: "white", letterSpacing: "-0.03em" }}>
              Students love ResPlug
            </h2>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: 20 }}>
            {[
              { name: "Kelebogile M.", uni: "UP — Hatfield", text: "Found my place 2km from campus in 3 days. The verified landlord tag gave me real peace of mind.", stars: 5 },
              { name: "Ayanda T.", uni: "UCT — Observatory", text: "ResPlug made a stressful process so much easier. Chat with the landlord directly — no waiting!", stars: 5 },
              { name: "Sipho N.", uni: "Wits — Braamfontein", text: "Booked my room before the semester even started. Couldn't be happier with the whole experience.", stars: 5 },
            ].map((t, i) => (
              <div key={i} className="testimonial-card" style={{ padding: 28, borderRadius: 20 }}>
                <div style={{ display: "flex", gap: 4, marginBottom: 16 }}>
                  {Array(t.stars).fill(0).map((_, j) => (
                    <Star key={j} size={16} fill="#f97316" color="#f97316" />
                  ))}
                </div>
                <p style={{ color: "rgba(255,255,255,0.7)", fontSize: 14, lineHeight: 1.7, marginBottom: 20 }}>
                  "{t.text}"
                </p>
                <div style={{ borderTop: "1px solid rgba(249,115,22,0.12)", paddingTop: 16 }}>
                  <div style={{ color: "white", fontWeight: 700, fontSize: 14 }}>{t.name}</div>
                  <div style={{ color: "rgba(249,115,22,0.6)", fontSize: 12, marginTop: 2 }}>{t.uni}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section style={{ padding: "80px 2rem 100px" }}>
        <div style={{
          maxWidth: 900, margin: "0 auto",
          background: "linear-gradient(135deg, rgba(249,115,22,0.2), rgba(234,88,12,0.1))",
          border: "1px solid rgba(249,115,22,0.25)",
          borderRadius: 32, padding: "64px 48px", textAlign: "center",
          position: "relative", overflow: "hidden"
        }}>
          <div className="orb" style={{ width: 300, height: 300, background: "rgba(249,115,22,0.2)", top: "50%", left: "50%", transform: "translate(-50%,-50%)" }} />
          <div style={{ position: "relative", zIndex: 2 }}>
            <h2 style={{
              fontSize: "clamp(2rem, 4vw, 3.2rem)", fontWeight: 800, color: "white",
              letterSpacing: "-0.03em", marginBottom: 16, lineHeight: 1.1
            }}>
              Ready to find your<br />
              <span style={{
                fontFamily: "'Playfair Display', serif", fontStyle: "italic",
                background: "linear-gradient(135deg, #f97316, #fdba74)",
                WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent"
              }}>new home?</span>
            </h2>
            <p style={{ color: "rgba(255,255,255,0.5)", fontSize: 16, marginBottom: 36, maxWidth: 480, margin: "0 auto 36px" }}>
              Join thousands of students who found their perfect accommodation through ResPlug. It's free to start.
            </p>
            <div style={{ display: "flex", gap: 12, justifyContent: "center", flexWrap: "wrap" }}>
              <Link href="/register" className="cta-btn-primary animate-glow" style={{
                display: "inline-flex", alignItems: "center", gap: 8,
                padding: "16px 36px", borderRadius: 14,
                textDecoration: "none", fontSize: 16, fontWeight: 700
              }}>
                Get Started Free
                <ArrowRight size={18} />
              </Link>
              <Link href="/listings" className="cta-btn-outline" style={{
                display: "inline-flex", alignItems: "center", gap: 8,
                padding: "16px 36px", borderRadius: 14,
                textDecoration: "none", fontSize: 16, fontWeight: 600
              }}>
                Browse Listings
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer style={{
        borderTop: "1px solid rgba(249,115,22,0.12)",
        padding: "32px 2rem",
        display: "flex", alignItems: "center", justifyContent: "space-between",
        flexWrap: "wrap", gap: 16
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <div style={{
            width: 28, height: 28, borderRadius: 8,
            background: "linear-gradient(135deg, #f97316, #ea580c)",
            display: "flex", alignItems: "center", justifyContent: "center"
          }}>
            <Home size={14} color="white" />
          </div>
          <span style={{ color: "white", fontWeight: 800, fontSize: 16 }}>
            Res<span style={{ color: "#f97316" }}>Plug</span>
          </span>
        </div>
        <p style={{ color: "rgba(255,255,255,0.3)", fontSize: 13 }}>
          © 2025 ResPlug. Connecting students with homes across South Africa.
        </p>
        <div style={{ display: "flex", gap: 20 }}>
          {["Privacy", "Terms", "Contact"].map(l => (
            <Link key={l} href={`/${l.toLowerCase()}`} style={{ color: "rgba(255,255,255,0.35)", textDecoration: "none", fontSize: 13 }}>{l}</Link>
          ))}
        </div>
      </footer>
    </div>
  );
}