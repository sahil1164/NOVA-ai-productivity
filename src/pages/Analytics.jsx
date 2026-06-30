import { motion } from "framer-motion";
import AppLayout from "../components/AppLayout";
import { useContext } from "react";
import { TaskContext } from "../TaskContext";
import { Sparkles, TrendingUp, CheckCircle2, Clock, Flame } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line } from "recharts";

const weeklyData = [
  { day: "Mon", tasks: 8, focus: 5.2, score: 72 }, { day: "Tue", tasks: 12, focus: 6.8, score: 80 },
  { day: "Wed", tasks: 6, focus: 4.1, score: 65 }, { day: "Thu", tasks: 14, focus: 7.3, score: 88 },
  { day: "Fri", tasks: 10, focus: 6.0, score: 78 }, { day: "Sat", tasks: 5, focus: 3.5, score: 60 },
  { day: "Sun", tasks: 9, focus: 6.5, score: 76 },
];

const habits = [
  { name: "Morning Workout", days: [true,true,true,false,true,true,true] },
  { name: "Deep Reading", days: [true,false,true,true,true,false,true] },
  { name: "Meditation", days: [true,true,true,true,false,true,true] },
  { name: "No Social Media", days: [false,true,true,false,true,true,true] },
  { name: "8hrs Sleep", days: [true,true,false,true,true,true,false] },
];

const daysShort = ["M","T","W","T","F","S","S"];



const tt = { contentStyle: { background: "#1a1f35", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "12px", color: "white", fontSize: "12px" }, cursor: { fill: "rgba(255,255,255,0.03)" } };

const container = { hidden: {}, show: { transition: { staggerChildren: 0.07 } } };
const item = { hidden: { opacity: 0, y: 20 }, show: { opacity: 1, y: 0, transition: { duration: 0.4 } } };

export default function Analytics() {
  const { tasks } = useContext(TaskContext);
  const totalTasks =
    tasks["To Do"].length +
    tasks["In Progress"].length +
    tasks["Completed"].length;

  const completedTasks =
    tasks["Completed"].length;

  const activeTasks =
    tasks["To Do"].length +
    tasks["In Progress"].length;

  const completionRate =
    totalTasks > 0
      ? Math.round((completedTasks / totalTasks) * 100)
      : 0;

  const highPriority =
    [...tasks["To Do"], ...tasks["In Progress"]]
      .filter((task) => task.priority === "High")
      .length;

  const statCards = [
    {
      label: "Total Missions",
      value: totalTasks,
      sub: "Across all boards",
      icon: CheckCircle2,
      color: "text-purple-400"
    },

    {
      label: "Completed Missions",
      value: completedTasks,
      sub: "Successfully finished",
      icon: Flame,
      color: "text-green-400"
    },

    {
      label: "Active Missions",
      value: activeTasks,
      sub: "Currently ongoing",
      icon: Clock,
      color: "text-blue-400"
    },

    {
      label: "Completion Rate",
      value: `${completionRate}%`,
      sub: "Overall efficiency",
      icon: TrendingUp,
      color: "text-orange-400"
    }
  ];

  const pieData = [
    {
      name: "Completed",
      value: tasks["Completed"].length,
      color: "#7C3AED"
    },

    {
      name: "In Progress",
      value: tasks["In Progress"].length,
      color: "#38BDF8"
    },

    {
      name: "To Do",
      value: tasks["To Do"].length,
      color: "rgba(255,255,255,0.15)"
    }
  ];

  const insights = [
    `You currently have ${highPriority} high priority missions pending.`,

    `Your completion rate is ${completionRate}%, keep pushing momentum.`,

    completedTasks > activeTasks
      ? "Excellent progress. You are clearing tasks efficiently."
      : "You have more pending work than completed tasks. Focus mode recommended."
  ];

  return (
    <AppLayout>
      <motion.div variants={container} initial="hidden" animate="show" className="max-w-7xl mx-auto space-y-6">
        <motion.div variants={item}>
          <h1 className="text-2xl font-bold text-white">Analytics</h1>
          <p className="text-sm mt-0.5" style={{ color: "rgba(255,255,255,0.4)" }}>Your productivity universe, visualized</p>
        </motion.div>

        <motion.div variants={item} className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {statCards.map(({ label, value, sub, icon: Icon, color }) => (
            <div key={label} className="glass-card rounded-2xl p-4">
              <div className="flex items-center justify-between mb-3">
                <p className="text-xs font-medium" style={{ color: "rgba(255,255,255,0.4)" }}>{label}</p>
                <Icon className={`w-4 h-4 ${color}`} />
              </div>
              <p className="text-2xl font-black text-white mb-0.5">{value}</p>
              <p className="text-xs" style={{ color: "rgba(255,255,255,0.3)" }}>{sub}</p>
            </div>
          ))}
        </motion.div>

        <motion.div variants={item} className="grid grid-cols-1 lg:grid-cols-3 gap-5">
          <div className="glass-card rounded-2xl p-5 lg:col-span-2">
            <div className="flex items-center gap-2 mb-4">
              <TrendingUp className="w-4 h-4 text-purple-400" />
              <h3 className="text-white font-semibold text-sm">Weekly Productivity Score</h3>
            </div>
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={weeklyData} barSize={28}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                <XAxis dataKey="day" tick={{ fill: "rgba(255,255,255,0.4)", fontSize: 12 }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fill: "rgba(255,255,255,0.3)", fontSize: 11 }} axisLine={false} tickLine={false} domain={[0, 100]} />
                <Tooltip {...tt} />
                <Bar dataKey="score" radius={[6,6,0,0]}>
                  {weeklyData.map((_, i) => <Cell key={i} fill={i === 3 ? "#7C3AED" : "rgba(124,58,237,0.45)"} />)}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div className="glass-card rounded-2xl p-5">
            <div className="flex items-center gap-2 mb-4">
              <CheckCircle2 className="w-4 h-4 text-blue-400" />
              <h3 className="text-white font-semibold text-sm">Task Breakdown</h3>
            </div>
            <ResponsiveContainer width="100%" height={160}>
              <PieChart>
                <Pie data={pieData} innerRadius={50} outerRadius={75} paddingAngle={3} dataKey="value">
                  {pieData.map((entry, i) => <Cell key={i} fill={entry.color} />)}
                </Pie>
                <Tooltip {...tt} />
              </PieChart>
            </ResponsiveContainer>
            <div className="space-y-2 mt-2">
              {pieData.map(({ name, value, color }) => (
                <div key={name} className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-2.5 h-2.5 rounded-full" style={{ background: color }} />
                    <span className="text-xs" style={{ color: "rgba(255,255,255,0.5)" }}>{name}</span>
                  </div>
                  <span className="text-xs font-semibold text-white">{value}</span>
                </div>
              ))}
            </div>
          </div>
        </motion.div>

        <motion.div variants={item} className="glass-card rounded-2xl p-5">
          <div className="flex items-center gap-2 mb-4">
            <Clock className="w-4 h-4 text-blue-400" />
            <h3 className="text-white font-semibold text-sm">Daily Focus Hours</h3>
          </div>
          <ResponsiveContainer width="100%" height={160}>
            <LineChart data={weeklyData}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
              <XAxis dataKey="day" tick={{ fill: "rgba(255,255,255,0.4)", fontSize: 12 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: "rgba(255,255,255,0.3)", fontSize: 11 }} axisLine={false} tickLine={false} />
              <Tooltip {...tt} />
              <Line type="monotone" dataKey="focus" stroke="#38BDF8" strokeWidth={2.5} dot={{ fill: "#38BDF8", strokeWidth: 0, r: 4 }} activeDot={{ r: 6, fill: "#38BDF8" }} />
            </LineChart>
          </ResponsiveContainer>
        </motion.div>

        <motion.div variants={item} className="grid grid-cols-1 lg:grid-cols-2 gap-5">
          <div className="glass-card rounded-2xl p-5">
            <div className="flex items-center gap-2 mb-4">
              <Flame className="w-4 h-4 text-orange-400" />
              <h3 className="text-white font-semibold text-sm">Habit Streak Tracker</h3>
            </div>
            <div className="space-y-3">
              {habits.map(({ name, days }) => (
                <div key={name} className="flex items-center gap-3">
                  <span className="text-xs w-36 flex-shrink-0" style={{ color: "rgba(255,255,255,0.5)" }}>{name}</span>
                  <div className="flex items-center gap-1.5">
                    {days.map((done, i) => (
                      <motion.div key={i} initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: i * 0.04 }}
                        className="w-7 h-7 rounded-lg flex items-center justify-center text-xs font-bold"
                        style={done
                          ? { background: "linear-gradient(135deg,#7C3AED,#38BDF8)", color: "white" }
                          : { background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)", color: "rgba(255,255,255,0.15)" }
                        }>{daysShort[i]}</motion.div>
                    ))}
                  </div>
                  <span className="text-xs ml-auto" style={{ color: "rgba(255,255,255,0.3)" }}>{days.filter(Boolean).length}/7</span>
                </div>
              ))}
            </div>
          </div>

          <div className="glass-card rounded-2xl p-5" style={{ border: "1px solid rgba(124,58,237,0.15)" }}>
            <div className="flex items-center gap-2 mb-4">
              <div className="w-7 h-7 rounded-lg flex items-center justify-center" style={{ background: "linear-gradient(135deg,#7C3AED,#38BDF8)" }}>
                <Sparkles className="w-3.5 h-3.5 text-white" />
              </div>
              <h3 className="text-white font-semibold text-sm">AI Weekly Insights</h3>
              <span className="ml-auto text-xs px-2 py-0.5 rounded-full" style={{ color: "#a78bfa", background: "rgba(124,58,237,0.1)", border: "1px solid rgba(124,58,237,0.2)" }}>
                Generated by NOVA
              </span>
            </div>
            <div className="space-y-3">
              {insights.map((insight, i) => (
                <motion.div key={i} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.1 }}
                  className="flex items-start gap-3 p-3 rounded-xl" style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.06)" }}>
                  <div className="w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5"
                    style={{ background: "rgba(124,58,237,0.2)", border: "1px solid rgba(124,58,237,0.3)" }}>
                    <span className="text-xs font-bold" style={{ color: "#a78bfa" }}>{i + 1}</span>
                  </div>
                  <p className="text-xs leading-relaxed" style={{ color: "rgba(255,255,255,0.6)" }}>{insight}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AppLayout>
  );
}
