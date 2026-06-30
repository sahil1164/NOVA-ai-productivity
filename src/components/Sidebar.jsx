import { Link, useLocation, useNavigate } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "../AuthContext";
import { motion, AnimatePresence } from "framer-motion";
import {
  LayoutDashboard, CheckSquare, Calendar, MessageSquare,
  BarChart3, Timer, Settings, X, Orbit, Navigation
} from "lucide-react";

const navItems = [
  { icon: LayoutDashboard, label: "Dashboard", path: "/dashboard" },
  { icon: CheckSquare, label: "Tasks", path: "/tasks" },
  { icon: Navigation, label: "Trajectory", path: "/trajectory" },
  { icon: Calendar, label: "Calendar", path: "/calendar" },
  { icon: MessageSquare, label: "AI Assistant", path: "/ai-assistant" },
  { icon: BarChart3, label: "Analytics", path: "/analytics" },
  { icon: Timer, label: "Focus Mode", path: "/focus" },
];

function NavContent({ onClose }) {
  const location = useLocation();
  const navigate = useNavigate();
  const { currentUser, logout } = useContext(AuthContext);
  const handleLogout = async () => {
    await logout();
    navigate("/");
  };
  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center gap-3 px-6 py-5" style={{ borderBottom: "1px solid rgba(255,255,255,0.08)" }}>
        <div className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0"
          style={{ background: "linear-gradient(135deg,#7C3AED,#38BDF8)" }}>
          <Orbit className="w-4 h-4 text-white" />
        </div>
        <span className="text-white font-bold text-lg tracking-tight">NOVA</span>
        {onClose && (
          <button onClick={onClose} className="ml-auto text-white/40 hover:text-white transition-colors lg:hidden">
            <X className="w-5 h-5" />
          </button>
        )}
      </div>

      <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
        {navItems.map(({ icon: Icon, label, path }) => {
          const active = location.pathname === path;
          return (
            <Link key={path} to={path}>
              <motion.div whileHover={{ x: 4 }} whileTap={{ scale: 0.98 }}
                className="flex items-center gap-3 px-3 py-2.5 rounded-xl cursor-pointer transition-all"
                style={{
                  background: active ? "rgba(124,58,237,0.2)" : "transparent",
                  border: active ? "1px solid rgba(124,58,237,0.3)" : "1px solid transparent",
                  color: active ? "white" : "rgba(255,255,255,0.5)",
                }}
              >
                <Icon className="w-4 h-4 flex-shrink-0" style={{ color: active ? "#a78bfa" : undefined }} />
                <span className="text-sm font-medium">{label}</span>
                {active && <div className="ml-auto w-1.5 h-1.5 rounded-full bg-purple-400" />}
              </motion.div>
            </Link>
          );
        })}
      </nav>

      <div className="px-4 py-4" style={{ borderTop: "1px solid rgba(255,255,255,0.08)" }}>
        <div className="glass-card rounded-xl p-3 flex items-center gap-3">
          <div className="w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-bold flex-shrink-0"
            style={{ background: "linear-gradient(135deg,#7C3AED,#38BDF8)" }}>
            {currentUser?.displayName
              ?.split(" ")
              .map((word) => word[0])
              .join("") || "CX"}
          </div>
          <div className="min-w-0">
            <p className="text-white text-xs font-semibold truncate">
              Commander {currentUser?.displayName?.split(" ")[0] || "X"}
            </p>
            <p className="text-xs truncate" style={{ color: "rgba(255,255,255,0.4)" }}>Pro Plan</p>
          </div>
          <div className="ml-auto w-2 h-2 rounded-full bg-green-400 flex-shrink-0" />
        </div>
        <button
          onClick={handleLogout}
          className="mt-3 w-full text-xs py-2 rounded-lg transition-all"
          style={{
            background: "rgba(255,255,255,0.05)",
            border: "1px solid rgba(255,255,255,0.08)",
            color: "rgba(255,255,255,0.7)"
          }}
        >
          Logout
        </button>
      </div>
    </div>
  );
}

export default function Sidebar({ open, onClose }) {
  return (
    <>
      <div className="hidden lg:flex flex-col flex-shrink-0 h-screen sticky top-0"
        style={{ width: "240px", background: "rgba(9,13,22,0.95)", borderRight: "1px solid rgba(255,255,255,0.08)" }}>
        <NavContent />
      </div>

      <AnimatePresence>
        {open && (
          <>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="fixed inset-0 z-40 lg:hidden"
              style={{ background: "rgba(0,0,0,0.6)" }}
              onClick={onClose}
            />
            <motion.div initial={{ x: -280 }} animate={{ x: 0 }} exit={{ x: -280 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              className="fixed left-0 top-0 h-full z-50 lg:hidden"
              style={{ width: "240px", background: "rgba(9,13,22,0.98)", borderRight: "1px solid rgba(255,255,255,0.08)" }}
            >
              <NavContent onClose={onClose} />
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
