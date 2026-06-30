import { motion } from "framer-motion";
import { useContext } from "react";
import { TaskContext } from "../TaskContext";
import { AuthContext } from "../AuthContext";
import { FocusContext } from "../FocusContext";
import AppLayout from "../components/AppLayout";
import ProgressRing from "../components/ProgressRing";
import PomodoroTimer from "../components/PomodoroTimer";
import { CheckSquare, AlertCircle, Flame, Clock, TrendingUp, ChevronRight } from "lucide-react";




const priorityStyle = {
  High: { background: "rgba(239,68,68,0.15)", color: "#f87171", border: "1px solid rgba(239,68,68,0.25)" },
  Medium: { background: "rgba(245,158,11,0.15)", color: "#fbbf24", border: "1px solid rgba(245,158,11,0.25)" },
  Low: { background: "rgba(74,222,128,0.15)", color: "#4ade80", border: "1px solid rgba(74,222,128,0.25)" },
};

const container = { hidden: {}, show: { transition: { staggerChildren: 0.07 } } };
const item = { hidden: { opacity: 0, y: 20 }, show: { opacity: 1, y: 0, transition: { duration: 0.4 } } };
const today = new Date().toLocaleDateString("en-US", { weekday: "long", year: "numeric", month: "long", day: "numeric" });

export default function Dashboard() {
  const { tasks } = useContext(TaskContext);
  const { focusMinutes } = useContext(FocusContext);
  const { currentUser } = useContext(AuthContext);
  const allTasks = [
  ...tasks["To Do"],
  ...tasks["In Progress"],
  ...tasks["Completed"]
  ];

  const totalTasks = allTasks.length;
  const completedTasks = tasks["Completed"].length;
  const inProgressTasks = tasks["In Progress"].length;

  const productivityScore =
  totalTasks > 0
    ? Math.round((completedTasks / totalTasks) * 100)
    : 0;

  const upcomingDeadlines = allTasks
  .filter(task => task.deadline)
  .slice(0, 3);
  return (
    <AppLayout>
      <motion.div variants={container} initial="hidden" animate="show" className="max-w-7xl mx-auto space-y-6">
        <motion.div variants={item} className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-white">
              Welcome back, Commander {currentUser?.displayName?.split(" ")[0] || ""}
            </h1>
            <p className="text-sm mt-0.5" style={{ color: "rgba(255,255,255,0.4)" }}>{today}</p>
          </div>
          <div className="glass-card rounded-xl px-4 py-2 flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-green-400" />
            <span className="text-xs" style={{ color: "rgba(255,255,255,0.6)" }}>All systems operational</span>
          </div>
        </motion.div>

        <motion.div variants={item} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="glass-card rounded-2xl p-5 flex flex-col items-center justify-center gap-3">
            <p className="text-xs font-medium uppercase tracking-wider" style={{ color: "rgba(255,255,255,0.4)" }}>Productivity Score</p>
            <ProgressRing
              value={productivityScore}
              label={`${productivityScore}%`}
              sublabel="score"
              size={110}
            />
            <p className="text-xs flex items-center gap-1 text-green-400">
              <TrendingUp className="w-3 h-3" /> {completedTasks} tasks completed
            </p>
          </div>
          <div className="glass-card rounded-2xl p-5 flex flex-col items-center justify-center gap-3">
            <p className="text-xs font-medium uppercase tracking-wider" style={{ color: "rgba(255,255,255,0.4)" }}>Current Streak</p>
            <div className="flex items-center gap-2"><Flame className="w-8 h-8 text-orange-400" />
              <span className="text-4xl font-black text-white">
                {completedTasks}
              </span></div>
            <p className="text-xs" style={{ color: "rgba(255,255,255,0.4)" }}>Productive Sessions</p>
          </div>
          <div className="glass-card rounded-2xl p-5 flex flex-col items-center justify-center gap-3">
            <p className="text-xs font-medium uppercase tracking-wider" style={{ color: "rgba(255,255,255,0.4)" }}>Focus Today</p>
            <div className="flex items-center gap-2"><Clock className="w-7 h-7 text-blue-400" />
            <span className="text-4xl font-black text-white">
              {(focusMinutes / 60).toFixed(1)}
            </span></div>
            <p className="text-xs" style={{ color: "rgba(255,255,255,0.4)" }}>hours focused</p>
          </div>
          <div className="glass-card rounded-2xl p-5 flex flex-col items-center justify-center gap-2">
            <p className="text-xs font-medium uppercase tracking-wider" style={{ color: "rgba(255,255,255,0.4)" }}>Pomodoro Timer</p>
            <PomodoroTimer />
          </div>
        </motion.div>

        <motion.div variants={item} className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          <div className="glass-card rounded-2xl p-5 lg:col-span-2">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <CheckSquare className="w-4 h-4 text-purple-400" />
                <h3 className="text-white font-semibold text-sm">Today's Tasks</h3>
                <span className="ml-1 px-2 py-0.5 rounded-full text-xs" style={{ background: "rgba(124,58,237,0.2)", border: "1px solid rgba(124,58,237,0.3)", color: "#c4b5fd" }}>
                  {tasks["To Do"].length} remaining
                </span>
              </div>
              <button className="text-xs flex items-center gap-1 transition-colors" style={{ color: "rgba(255,255,255,0.3)" }}>
                View all <ChevronRight className="w-3 h-3" />
              </button>
            </div>
            <div className="space-y-2">
              {tasks["To Do"].map((task, i) => (
                <motion.div key={task.title} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.06 }}
                  className="flex items-center gap-3 p-3 rounded-xl transition-all hover:bg-white/5"
                  style={{ opacity: 1 }}>
                  <div className="w-4 h-4 rounded-md flex items-center justify-center flex-shrink-0"
                    style={{
                      border: "2px solid rgba(255,255,255,0.2)",
                      background: "transparent"
                    }}>
                  </div>
                  <span
                      className="flex-1 text-sm"
                      style={{
                        color: "rgba(255,255,255,0.85)",
                        textDecoration: "none"
                      }}
                    >
                    {task.title}
                  </span>
                  <span className="px-2 py-0.5 rounded-md text-xs" style={priorityStyle[task.priority]}>{task.priority}</span>
                  <span className="text-xs px-2 py-0.5 rounded-md" style={{ background: "rgba(255,255,255,0.05)", color: "rgba(255,255,255,0.3)" }}>{task.category}</span>
                </motion.div>
              ))}
            </div>
          </div>

          <div className="glass-card rounded-2xl p-5">
            <div className="flex items-center gap-2 mb-4">
              <AlertCircle className="w-4 h-4 text-red-400" />
              <h3 className="text-white font-semibold text-sm">Upcoming Deadlines</h3>
            </div>
            <div className="space-y-3">
              {upcomingDeadlines.map((task, i) => (
                <motion.div
                  key={task.title}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: i * 0.1 }}
                  className="flex items-start gap-3 p-3 rounded-xl"
                  style={{
                    background: "rgba(255,255,255,0.03)",
                    border: "1px solid rgba(255,255,255,0.05)"
                  }}
                >
                  <div
                    className="text-lg font-black leading-none"
                    style={{
                      color:
                        i === 0
                          ? "#f87171"
                          : i === 1
                          ? "#fbbf24"
                          : "#4ade80"
                    }}
                  >
                    {i === 0 ? "1d" : i === 1 ? "3d" : "7d"}
                  </div>

                  <div>
                    <p
                      className="text-sm font-medium"
                      style={{ color: "rgba(255,255,255,0.8)" }}
                    >
                      {task.title}
                    </p>

                    <p
                      className="text-xs"
                      style={{ color: "rgba(255,255,255,0.3)" }}
                    >
                      {task.deadline}
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.div>

        <motion.div variants={item} className="glass-card rounded-2xl p-5">
          <div className="flex items-center gap-2 mb-5">
            <TrendingUp className="w-4 h-4 text-purple-400" />
            <h3 className="text-white font-semibold text-sm">NOVA Intelligence</h3>
            <span
              className="ml-auto text-xs"
              style={{ color: "rgba(255,255,255,0.3)" }}
            >
              Behavioral Analysis
            </span>
          </div>

          <div className="space-y-3">

            <div
              className="p-4 rounded-xl"
              style={{
                background: "rgba(239,68,68,0.08)",
                border: "1px solid rgba(239,68,68,0.15)"
              }}
            >
              <p className="text-sm text-red-400 font-medium">
                ⚠ Procrastination Detected
              </p>
              <p
                className="text-xs mt-1"
                style={{ color: "rgba(255,255,255,0.5)" }}
              >
                {tasks["To Do"].length > 5
                  ? "Pending workload increasing. High-priority tasks untouched."
                  : "Task completion rate looks healthy."}
              </p>
            </div>

            <div
              className="p-4 rounded-xl"
              style={{
                background: "rgba(74,222,128,0.08)",
                border: "1px solid rgba(74,222,128,0.15)"
              }}
            >
              <p className="text-sm text-green-400 font-medium">
                🔥 Productivity Trend
              </p>
              <p
                className="text-xs mt-1"
                style={{ color: "rgba(255,255,255,0.5)" }}
              >
                {completedTasks >= 3
                  ? "Strong completion momentum detected today."
                  : "Low completion activity. Productivity dip observed."}
              </p>
            </div>

            <div
              className="p-4 rounded-xl"
              style={{
                background: "rgba(56,189,248,0.08)",
                border: "1px solid rgba(56,189,248,0.15)"
              }}
            >
              <p className="text-sm text-blue-400 font-medium">
                🎯 Context Aware Suggestion
              </p>
              <p
                className="text-xs mt-1"
                style={{ color: "rgba(255,255,255,0.5)" }}
              >
                {focusMinutes < 30
                  ? "Low focus time today. Recommend entering Focus Mode."
                  : "Focus pattern stable. Maintain deep work sessions."}
              </p>
            </div>

          </div>
        </motion.div>
      </motion.div>
    </AppLayout>
  );
}
