import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { signInWithGoogle } from "../auth";
import { useContext } from "react";
import { AuthContext } from "../AuthContext";
import {
  Brain, Clock, CalendarDays, BarChart3, BookOpen, Target,
  ArrowRight, Star, Orbit, ChevronRight, Zap, Shield, Users
} from "lucide-react";
import CosmicBackground from "../components/CosmicBackground";

const features = [
  { icon: Brain, title: "AI Task Prioritization", desc: "NOVA intelligently ranks your tasks by urgency, impact, and your energy levels throughout the day.", color: "from-purple-500 to-violet-600" },
  { icon: Clock, title: "Smart Deadline Prediction", desc: "Machine learning models predict realistic completion times based on your personal productivity patterns.", color: "from-blue-500 to-cyan-500" },
  { icon: CalendarDays, title: "Calendar Integration", desc: "Seamlessly sync with Google Calendar, Outlook, and Apple Calendar for a unified command center.", color: "from-teal-500 to-green-500" },
  { icon: BarChart3, title: "Productivity Analytics", desc: "Deep insights into your work patterns, focus scores, and habit trends visualized beautifully.", color: "from-orange-500 to-amber-500" },
  { icon: BookOpen, title: "AI Study Planner", desc: "Spaced repetition schedules and optimal study blocks generated from your syllabi and deadlines.", color: "from-pink-500 to-rose-500" },
  { icon: Target, title: "Habit Tracking", desc: "Build momentum with streaks, reminders, and AI-powered habit stacking recommendations.", color: "from-indigo-500 to-purple-500" },
];

const pricing = [
  { name: "Free", price: "$0", period: "forever", desc: "Perfect for individuals getting started", features: ["Up to 50 tasks", "Basic AI suggestions", "1 calendar sync", "7-day analytics"], cta: "Get Started", highlight: false },
  { name: "Pro", price: "$12", period: "per month", desc: "For serious students and professionals", features: ["Unlimited tasks", "Advanced AI prioritization", "Unlimited calendar sync", "90-day analytics", "Focus mode", "Habit tracking"], cta: "Start Free Trial", highlight: true },
  { name: "Team", price: "$29", period: "per month", desc: "For teams and organizations", features: ["Everything in Pro", "Team dashboards", "Shared workspaces", "Admin controls", "Priority support", "Custom integrations"], cta: "Contact Sales", highlight: false },
];

const stats = [
  { value: "2.4M+", label: "Active Users" },
  { value: "98%", label: "Satisfaction Rate" },
  { value: "40%", label: "Productivity Boost" },
  { value: "150+", label: "Countries" },
];

function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const navigate = useNavigate();
  const { currentUser, logout, setAccessToken } = useContext(AuthContext);
  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", fn);
    return () => window.removeEventListener("scroll", fn);
  }, []);
  const handleLogin = async () => {
    const result = await signInWithGoogle();

    if (result) {
      localStorage.setItem("googleToken", result.accessToken);
      setAccessToken(result.accessToken);
      console.log("TOKEN AFTER LOGIN:", result.accessToken);
      setTimeout(() => {
        navigate("/dashboard");
      }, 2000);

      console.log(result);

      navigate("/dashboard");
    }
  };
  const handleLogout = async () => {
    await logout();
  };
  return (
    <motion.nav initial={{ y: -20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ duration: 0.5 }}
      className="fixed top-0 left-0 right-0 z-50 transition-all duration-300"
      style={scrolled ? { background: "rgba(11,15,25,0.9)", backdropFilter: "blur(12px)", borderBottom: "1px solid rgba(255,255,255,0.08)" } : {}}
    >
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center gap-8">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: "linear-gradient(135deg,#7C3AED,#38BDF8)" }}>
            <Orbit className="w-4 h-4 text-white" />
          </div>
          <span className="text-white font-bold text-lg tracking-tight">NOVA</span>
        </div>
        <div className="hidden md:flex items-center gap-1 ml-4">
          {["Home","Features","Pricing","About"].map(item => (
            <a key={item} href={`#${item.toLowerCase()}`}
              className="px-4 py-2 text-sm rounded-lg transition-all hover:bg-white/5"
              style={{ color: "rgba(255,255,255,0.6)" }}
            >{item}</a>
          ))}
        </div>
        <div className="ml-auto flex items-center gap-3">
          {currentUser ? (
            <>
              <span
                className="text-sm"
                style={{ color: "rgba(255,255,255,0.7)" }}
              >
                {currentUser.displayName.split(" ")[0]}
              </span>

              <Link to="/dashboard">
                <motion.button
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                  className="btn-primary px-5 py-2 rounded-xl text-sm font-semibold text-white"
                >
                  Dashboard
                </motion.button>
              </Link>

              <button
                onClick={handleLogout}
                className="px-4 py-2 text-sm rounded-xl"
                style={{
                  background: "rgba(255,255,255,0.05)",
                  border: "1px solid rgba(255,255,255,0.1)",
                  color: "rgba(255,255,255,0.7)"
                }}
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <button
                onClick={handleLogin}
                className="hidden md:block px-4 py-2 text-sm transition-colors"
                style={{ color: "rgba(255,255,255,0.7)" }}
              >
                Login
              </button>

              <motion.button
                onClick={handleLogin}
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                className="btn-primary px-5 py-2 rounded-xl text-sm font-semibold text-white"
              >
                Sign Up
              </motion.button>
            </>
          )}

        </div>
      </div>
    </motion.nav>
  );
}

export default function Landing() {
  return (
    <div className="min-h-screen text-white overflow-x-hidden" style={{ background: "#0B0F19" }}>
      <CosmicBackground />
      <div style={{ position: "relative", zIndex: 1 }}>
        <Navbar />

        {/* Hero */}
        <section id="home" className="relative min-h-screen flex items-center justify-center px-6 pt-20">
          <div className="max-w-5xl mx-auto text-center">
            <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, delay: 0.2 }}>
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-sm font-medium mb-8"
                style={{ background: "rgba(124,58,237,0.1)", border: "1px solid rgba(124,58,237,0.2)", color: "#c4b5fd" }}>
                <Zap className="w-3.5 h-3.5" /> Powered by Advanced AI
              </div>
            </motion.div>
            <motion.h1 initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, delay: 0.35 }}
              className="text-5xl md:text-7xl font-black leading-tight mb-6 tracking-tight">
              Organize Your{" "}
              <span className="gradient-text">Universe</span>
              {" "}with NOVA
            </motion.h1>
            <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, delay: 0.5 }}
              className="text-xl max-w-2xl mx-auto mb-10 leading-relaxed" style={{ color: "rgba(255,255,255,0.5)" }}>
              Your AI-powered productivity companion that manages tasks, deadlines, and schedules intelligently — so you can focus on what truly matters.
            </motion.p>
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, delay: 0.65 }}
              className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link to="/dashboard">
                <motion.button whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.96 }}
                  className="btn-primary flex items-center gap-2 px-8 py-3.5 rounded-xl text-base font-semibold text-white">
                  Get Started <ArrowRight className="w-4 h-4" />
                </motion.button>
              </Link>
              <Link to="/dashboard">
                <motion.button whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.96 }}
                  className="flex items-center gap-2 px-8 py-3.5 rounded-xl text-base font-semibold transition-all"
                  style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)", color: "rgba(255,255,255,0.8)" }}>
                  Try Demo <ChevronRight className="w-4 h-4" />
                </motion.button>
              </Link>
            </motion.div>
            <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, delay: 0.85 }}
              className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-20 max-w-3xl mx-auto">
              {stats.map(({ value, label }) => (
                <div key={label} className="text-center">
                  <div className="text-3xl font-black gradient-text">{value}</div>
                  <div className="text-sm mt-1" style={{ color: "rgba(255,255,255,0.4)" }}>{label}</div>
                </div>
              ))}
            </motion.div>
          </div>
          <motion.div initial={{ opacity: 0, y: 60, scale: 0.95 }} animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 1, delay: 1.1 }}
            className="absolute bottom-12 right-8 hidden xl:block glass-card rounded-2xl p-4 glow-purple"
            style={{ width: "256px", animation: "float 6s ease-in-out infinite" }}>
            <div className="flex items-center gap-2 mb-3">
              <div className="w-6 h-6 rounded-lg flex items-center justify-center" style={{ background: "linear-gradient(135deg,#7C3AED,#38BDF8)" }}>
                <Brain className="w-3 h-3 text-white" />
              </div>
              <span className="text-xs font-semibold text-white">NOVA AI</span>
              <span className="ml-auto text-xs text-green-400">Online</span>
            </div>
            <p className="text-xs leading-relaxed" style={{ color: "rgba(255,255,255,0.6)" }}>
              "You have 3 high-priority tasks due tomorrow. I recommend starting with the research report — your focus peaks at 9am."
            </p>
          </motion.div>
        </section>

        {/* Features */}
        <section id="features" className="py-28 px-6">
          <div className="max-w-7xl mx-auto">
            <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
              transition={{ duration: 0.6 }} className="text-center mb-16">
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-sm font-medium mb-5"
                style={{ background: "rgba(56,189,248,0.1)", border: "1px solid rgba(56,189,248,0.2)", color: "#7dd3fc" }}>
                <Star className="w-3.5 h-3.5" /> Everything you need
              </div>
              <h2 className="text-4xl md:text-5xl font-black mb-5 tracking-tight">
                Mission-critical <span className="gradient-text">features</span>
              </h2>
              <p className="text-lg max-w-xl mx-auto" style={{ color: "rgba(255,255,255,0.5)" }}>
                Built for the way you actually work — not the way productivity gurus say you should.
              </p>
            </motion.div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {features.map(({ icon: Icon, title, desc, color }, i) => (
                <motion.div key={title} initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }} transition={{ duration: 0.5, delay: i * 0.08 }}
                  whileHover={{ y: -5, scale: 1.01 }}
                  className="glass-card rounded-2xl p-6 cursor-pointer group transition-all duration-300">
                  <div className={`w-11 h-11 rounded-xl bg-gradient-to-br ${color} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                    <Icon className="w-5 h-5 text-white" />
                  </div>
                  <h3 className="text-white font-semibold text-lg mb-2">{title}</h3>
                  <p className="text-sm leading-relaxed" style={{ color: "rgba(255,255,255,0.5)" }}>{desc}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Pricing */}
        <section id="pricing" className="py-28 px-6">
          <div className="max-w-5xl mx-auto">
            <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
              className="text-center mb-16">
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-sm font-medium mb-5"
                style={{ background: "rgba(124,58,237,0.1)", border: "1px solid rgba(124,58,237,0.2)", color: "#c4b5fd" }}>
                <Shield className="w-3.5 h-3.5" /> Simple pricing
              </div>
              <h2 className="text-4xl md:text-5xl font-black mb-5 tracking-tight">
                Choose your <span className="gradient-text">orbit</span>
              </h2>
              <p className="text-lg max-w-xl mx-auto" style={{ color: "rgba(255,255,255,0.5)" }}>
                Start free. Upgrade when you're ready to unlock the full command center.
              </p>
            </motion.div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {pricing.map(({ name, price, period, desc, features: feats, cta, highlight }, i) => (
                <motion.div key={name} initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }} transition={{ duration: 0.5, delay: i * 0.1 }}
                  whileHover={{ y: -5 }}
                  className="rounded-2xl p-6 flex flex-col relative"
                  style={highlight
                    ? { background: "linear-gradient(to bottom, rgba(124,58,237,0.2), rgba(124,58,237,0.05))", border: "1px solid rgba(124,58,237,0.4)", boxShadow: "0 0 20px rgba(124,58,237,0.3)" }
                    : { background: "rgba(255,255,255,0.04)", backdropFilter: "blur(12px)", border: "1px solid rgba(255,255,255,0.08)" }
                  }>
                  {highlight && (
                    <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full text-xs font-bold text-white"
                      style={{ background: "linear-gradient(to right,#7C3AED,#38BDF8)" }}>
                      Most Popular
                    </div>
                  )}
                  <div className="mb-5">
                    <h3 className="text-white font-bold text-lg mb-1">{name}</h3>
                    <p className="text-sm" style={{ color: "rgba(255,255,255,0.4)" }}>{desc}</p>
                  </div>
                  <div className="mb-6">
                    <span className="text-4xl font-black text-white">{price}</span>
                    <span className="text-sm ml-2" style={{ color: "rgba(255,255,255,0.4)" }}>{period}</span>
                  </div>
                  <ul className="space-y-2.5 mb-8 flex-1">
                    {feats.map(f => (
                      <li key={f} className="flex items-center gap-2 text-sm" style={{ color: "rgba(255,255,255,0.7)" }}>
                        <div className="w-4 h-4 rounded-full flex items-center justify-center flex-shrink-0"
                          style={{ background: "rgba(124,58,237,0.2)", border: "1px solid rgba(124,58,237,0.3)" }}>
                          <div className="w-1.5 h-1.5 rounded-full bg-purple-400" />
                        </div>
                        {f}
                      </li>
                    ))}
                  </ul>
                  <Link to="/dashboard">
                    <motion.button whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }} className="w-full py-3 rounded-xl text-sm font-semibold transition-all"
                      style={highlight
                        ? { background: "linear-gradient(135deg,#7C3AED,#6D28D9)", border: "1px solid rgba(124,58,237,0.5)", color: "white" }
                        : { background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)", color: "rgba(255,255,255,0.8)" }
                      }>{cta}</motion.button>
                  </Link>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* About */}
        <section id="about" className="py-28 px-6">
          <div className="max-w-4xl mx-auto text-center">
            <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-sm font-medium mb-5"
                style={{ background: "rgba(45,212,191,0.1)", border: "1px solid rgba(45,212,191,0.2)", color: "#5eead4" }}>
                <Users className="w-3.5 h-3.5" /> Built for you
              </div>
              <h2 className="text-4xl md:text-5xl font-black mb-6 tracking-tight">
                Your AI <span className="gradient-text">mission control</span>
              </h2>
              <p className="text-lg leading-relaxed mb-10" style={{ color: "rgba(255,255,255,0.5)" }}>
                NOVA was born out of a simple frustration: productivity tools that felt like chores.
                We built the assistant we always wanted — one that adapts to you, learns your rhythms,
                and helps you operate at your best without the friction.
              </p>
              <Link to="/dashboard">
                <motion.button whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.96 }}
                  className="btn-primary inline-flex items-center gap-2 px-8 py-3.5 rounded-xl text-base font-semibold text-white">
                  Launch NOVA <Orbit className="w-4 h-4" />
                </motion.button>
              </Link>
            </motion.div>
          </div>
        </section>

        {/* Footer */}
        <footer className="py-12 px-6" style={{ borderTop: "1px solid rgba(255,255,255,0.08)" }}>
          <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2.5">
              <div className="w-7 h-7 rounded-lg flex items-center justify-center" style={{ background: "linear-gradient(135deg,#7C3AED,#38BDF8)" }}>
                <Orbit className="w-3.5 h-3.5 text-white" />
              </div>
              <span className="text-white font-bold tracking-tight">NOVA</span>
            </div>
            <p className="text-sm" style={{ color: "rgba(255,255,255,0.3)" }}>Your AI mission control center</p>
            <div className="flex items-center gap-6">
              {["Privacy","Terms","Contact"].map(l => (
                <a key={l} href="#" className="text-sm transition-colors" style={{ color: "rgba(255,255,255,0.3)" }}>{l}</a>
              ))}
            </div>
            <p className="text-xs" style={{ color: "rgba(255,255,255,0.2)" }}>© 2026 NOVA. All rights reserved.</p>
          </div>
        </footer>
      </div>
    </div>
  );
}
