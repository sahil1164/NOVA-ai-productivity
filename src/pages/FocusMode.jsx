import { useState, useEffect, useCallback, useRef, useContext } from "react";
import { collection, getDocs, query, orderBy } from "firebase/firestore";
import { db } from "../firebase";
import { FocusContext } from "../FocusContext";
import { logActivity } from "../activityLogger";
import { AuthContext } from "../AuthContext";
import { motion, AnimatePresence } from "framer-motion";
import AppLayout from "../components/AppLayout";
import { Play, Pause, RotateCcw, SkipForward, Music, Volume2, VolumeX, Zap, CheckCircle2 } from "lucide-react";

const MODES = [
  { label: "Focus", duration: 25 * 60, color: "#7C3AED" },
  { label: "Short Break", duration: 5 * 60  , color: "#38BDF8" },
  { label: "Long Break", duration: 15 * 60 , color: "#2DD4BF" },
];

const SOUNDS = ["Deep Space", "Rain", "White Noise", "Forest", "Ocean Waves"];


export default function FocusMode() {
  const [modeIdx, setModeIdx] = useState(0);
  const [seconds, setSeconds] = useState(MODES[0].duration);
  const [running, setRunning] = useState(false);
  const [muted, setMuted] = useState(false);
  const [sound, setSound] = useState(0);
  const [sessions, setSessions] = useState(0);
  const [customFocusMinutes, setCustomFocusMinutes] = useState(1);
  const [sessionComplete, setSessionComplete] = useState(false);
  const [sessionLog, setSessionLog] = useState([]);
  const sessionSavedRef = useRef(false);
  const { focusMinutes, setFocusMinutes } = useContext(FocusContext);
  const { currentUser } = useContext(AuthContext);


  useEffect(() => {
    const loadSessionLogs = async () => {
      if (!currentUser) return;

      const q = query(
        collection(db, "users", currentUser.uid, "activityLog"),
        orderBy("createdAt", "desc")
      );

      const snap = await getDocs(q);

      const logs = [];

      snap.forEach((doc) => {
        const data = doc.data();

        logs.push({
          label: "Focus Session",
          duration: data.message.replace("Completed ", ""),
          done: true,
        });
      });

      setSessionLog(logs.slice(0, 5)); // only latest 5
    };

    loadSessionLogs();
  }, [currentUser]);

  const mode =
    modeIdx === 0
      ? { ...MODES[0], duration: customFocusMinutes * 60 }
      : MODES[modeIdx];

  useEffect(() => {
    if (!running) return;

    const id = setInterval(() => {
      setSeconds(s => {
        if (s <= 1 && !sessionSavedRef.current) {
          sessionSavedRef.current = true;
          setRunning(false);
          setSessions(n => n + 1);
          // if (mode.label === "Focus") {
          //   setFocusMinutes(
          //     (prev) => prev + customFocusMinutes
          //   );
          // }
          setSessionComplete(true);
          if (currentUser && mode.label === "Focus") {
            console.log("TRYING TO SAVE ACTIVITY");
            logActivity(
              currentUser.uid,
              "focus_complete",
              `Completed ${customFocusMinutes} minute focus session`
            );
          }
          if (mode.label === "Focus") {
            setModeIdx(1);   // switch to Short Break
          }

          else if (mode.label === "Short Break") {
            setModeIdx(0);   // switch back to Focus
          }

          setSessionLog((prev) => [
            {
              label: mode.label,
              duration: `${Math.floor(mode.duration / 60)}m`,
              done: true
            },
            ...prev.slice(0, 4)
          ]);
          return 0;
        }
        return s - 1;
      });
    }, 1000);
    return () => clearInterval(id);
  }, [running]);

  const reset = useCallback(() => { setSeconds(mode.duration); setRunning(false); }, [mode]);
  const skip = useCallback(() => { sessionSavedRef.current = false; setModeIdx(i => (i + 1) % MODES.length); }, []);

  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  const progress = (seconds / mode.duration) * 100;
  const SIZE = 280;
  const SW = 10;
  const r = (SIZE - SW) / 2;
  const circ = 2 * Math.PI * r;
  const offset = circ - (progress / 100) * circ;

  return (
    <AppLayout>
      <div className="max-w-5xl mx-auto">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-white">Focus Mode</h1>
          <p className="text-sm mt-0.5" style={{ color: "rgba(255,255,255,0.4)" }}>Deep work command center — eliminate distractions</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Timer */}
          <div className="lg:col-span-2 glass-card rounded-2xl p-8 flex flex-col items-center">
            {/* Mode tabs */}
            {modeIdx === 0 && !running && (
              <div className="flex items-center gap-4 mb-6">
                <button
                  onClick={() => {
                    const newVal = Math.max(5, customFocusMinutes - 5);
                    setCustomFocusMinutes(newVal);

                    if (!running) {
                      setSeconds(newVal * 60);
                    }
                  }}
                  className="px-3 py-1 rounded-lg"
                  style={{
                    background: "rgba(255,255,255,0.05)",
                    color: "white"
                  }}
                >
                  −
                </button>

                <span
                  className="text-sm font-medium"
                  style={{ color: "rgba(255,255,255,0.7)" }}
                >
                  {customFocusMinutes} min
                </span>

                <button
                  onClick={() => {
                    const newVal = Math.min(120, customFocusMinutes + 5);
                    setCustomFocusMinutes(newVal);

                    if (!running) {
                      setSeconds(newVal * 60);
                    }
                  }}
                  className="px-3 py-1 rounded-lg"
                  style={{
                    background: "rgba(255,255,255,0.05)",
                    color: "white"
                  }}
                >
                  +
                </button>
              </div>
            )}
            <div className="flex items-center gap-2 mb-8 p-1 rounded-xl" style={{ background: "rgba(255,255,255,0.05)" }}>
              {MODES.map((m, i) => (
                <button
                  key={m.label}
                  onClick={() => {
                    if (running) return;   // block switching while timer active
                    setModeIdx(i);
                    if (i === 0) {
                      setSeconds(customFocusMinutes * 60);
                    } else {
                      setSeconds(MODES[i].duration);
                    }
                  }}
                  className="px-4 py-2 rounded-lg text-sm font-medium transition-all"
                  style={modeIdx === i
                    ? { background: m.color, color: "white", boxShadow: `0 0 15px ${m.color}50` }
                    : { color: "rgba(255,255,255,0.5)" }
                  }>{m.label}</button>
              ))}
            </div>

            {/* Ring */}
            <div className="relative mb-8">
              <svg width={SIZE} height={SIZE} style={{ transform: "rotate(-90deg)" }}>
                <defs>
                  <linearGradient id="focusGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor={mode.color} />
                    <stop offset="100%" stopColor="#38BDF8" />
                  </linearGradient>
                </defs>
                <circle cx={SIZE/2} cy={SIZE/2} r={r} fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth={SW} />
                <AnimatePresence>
                  <motion.circle
                    key={modeIdx}
                    cx={SIZE/2} cy={SIZE/2} r={r} fill="none"
                    stroke="url(#focusGrad)" strokeWidth={SW} strokeLinecap="round"
                    strokeDasharray={circ} strokeDashoffset={offset}
                    style={{ transition: "stroke-dashoffset 0.5s ease" }}
                    initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                  />
                </AnimatePresence>
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-6xl font-black text-white tabular-nums tracking-tight">
                  {String(mins).padStart(2, "0")}:{String(secs).padStart(2, "0")}
                </span>
                <span className="text-sm mt-2 font-medium" style={{ color: mode.color }}>{mode.label}</span>
                <span className="text-xs mt-1" style={{ color: "rgba(255,255,255,0.3)" }}>Session {sessions + 1}</span>
              </div>
            </div>

            {/* Controls */}
            <div className="flex items-center gap-4">
              <motion.button whileTap={{ scale: 0.9 }} onClick={reset}
                className="w-12 h-12 flex items-center justify-center rounded-2xl transition-all"
                style={{ background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.1)", color: "rgba(255,255,255,0.5)" }}>
                <RotateCcw className="w-5 h-5" />
              </motion.button>
              <motion.button whileHover={{ scale: 1.06 }} whileTap={{ scale: 0.94 }} 
                onClick={() => {
                  sessionSavedRef.current = false;
                  setRunning(r => !r);
                }}
                className="w-20 h-20 flex items-center justify-center rounded-full text-white transition-all"
                style={{ background: `linear-gradient(135deg,${mode.color},#38BDF8)`, boxShadow: `0 0 40px ${mode.color}60` }}>
                {running ? <Pause className="w-8 h-8" /> : <Play className="w-8 h-8 ml-1" />}
              </motion.button>
              <motion.button whileTap={{ scale: 0.9 }} onClick={skip}
                className="w-12 h-12 flex items-center justify-center rounded-2xl transition-all"
                style={{ background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.1)", color: "rgba(255,255,255,0.5)" }}>
                <SkipForward className="w-5 h-5" />
              </motion.button>
            </div>

            {/* Ambient sound */}
            <div className="mt-8 w-full">
              <div className="flex items-center gap-2 mb-3">
                <Music className="w-4 h-4" style={{ color: "rgba(255,255,255,0.4)" }} />
                <span className="text-xs font-medium" style={{ color: "rgba(255,255,255,0.4)" }}>Ambient Sound</span>
                <button onClick={() => setMuted(m => !m)} className="ml-auto transition-colors"
                  style={{ color: "rgba(255,255,255,0.4)" }}>
                  {muted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
                </button>
              </div>
              <div className="flex gap-2 flex-wrap">
                {SOUNDS.map((s, i) => (
                  <button key={s} onClick={() => setSound(i)}
                    className="px-3 py-1.5 rounded-lg text-xs font-medium transition-all"
                    style={sound === i
                      ? { background: "rgba(124,58,237,0.3)", border: "1px solid rgba(124,58,237,0.5)", color: "#c4b5fd" }
                      : { background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)", color: "rgba(255,255,255,0.4)" }
                    }>{s}</button>
                ))}
              </div>
            </div>
          </div>

          {/* Right panel */}
          <div className="space-y-4">
            {/* Stats */}
            <div className="glass-card rounded-2xl p-5">
              <div className="flex items-center gap-2 mb-4">
                <Zap className="w-4 h-4 text-yellow-400" />
                <h3 className="text-white font-semibold text-sm">Today's Focus</h3>
              </div>
              <div className="grid grid-cols-2 gap-3">
                {[
                  { label: "Sessions", value: `${sessions}`, sub: "completed" },
                  { label: "Focus Time", value: `${focusMinutes}m`, sub: "total" },
                  { label: "Mode", value: `${mode.label}`, sub: "active" },
                  {
                    label: "Status",
                    value: running ? "Live" : "Paused",
                    sub: "session"
                  },
                ].map(({ label, value, sub }) => (
                  <div key={label} className="p-3 rounded-xl text-center" style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.06)" }}>
                    <p className="text-lg font-black text-white">{value}</p>
                    <p className="text-xs" style={{ color: "rgba(255,255,255,0.4)" }}>{label}</p>
                    <p className="text-xs" style={{ color: "rgba(255,255,255,0.25)" }}>{sub}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Session log */}
            <div className="glass-card rounded-2xl p-5">
              <div className="flex items-center gap-2 mb-4">
                <CheckCircle2 className="w-4 h-4 text-green-400" />
                <h3 className="text-white font-semibold text-sm">Session Log</h3>
              </div>
              <div className="space-y-2">
                {sessionLog.map((s, i) => (
                  <div key={i} className="flex items-center gap-3 p-2.5 rounded-xl transition-all"
                    style={{ background: "rgba(255,255,255,0.03)", opacity: s.done ? 1 : 0.5 }}>
                    <div className="w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0"
                      style={s.done
                        ? { background: "rgba(74,222,128,0.2)", border: "1px solid rgba(74,222,128,0.3)" }
                        : { background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)" }
                      }>
                      {s.done && <div className="w-2 h-2 rounded-full bg-green-400" />}
                    </div>
                    <span className="flex-1 text-xs" style={{ color: "rgba(255,255,255,0.7)", textDecoration: s.done ? "none" : "none" }}>{s.label}</span>
                    <span className="text-xs" style={{ color: "rgba(255,255,255,0.3)" }}>{s.duration}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
      {sessionComplete && (
        <div
          className="fixed inset-0 flex items-center justify-center z-50"
          style={{ background: "rgba(0,0,0,0.6)" }}
        >
          <div
            className="w-96 rounded-2xl p-6 text-center"
            style={{
              background: "#111827",
              border: "1px solid rgba(255,255,255,0.1)"
            }}
          >
            <h2
              className="text-xl font-bold mb-3"
              style={{ color: "#c4b5fd" }}
            >
              🎯 Session Complete
            </h2>

            <p
              className="text-sm mb-5"
              style={{ color: "rgba(255,255,255,0.7)" }}
            >
              {mode.label === "Focus"
                ? "Focus complete. NOVA switched you to Short Break."
                : "Break complete. NOVA switched you back to Focus Mode."
              }
            </p>

            <button
              onClick={() => setSessionComplete(false)}
              className="px-5 py-2 rounded-xl text-white"
              style={{
                background:
                  "linear-gradient(to right,#7C3AED,#38BDF8)"
              }}
            >
              Continue
            </button>
          </div>
        </div>
      )}
    </AppLayout>
  );
}
