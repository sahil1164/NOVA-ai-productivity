import { useContext, useEffect, useState } from "react";
import { TaskContext } from "../TaskContext";
import { AuthContext } from "../AuthContext";
import { analyzeCalendarEvent } from "../gemini";
import { motion } from "framer-motion";
import AppLayout from "../components/AppLayout";
import { ChevronLeft, ChevronRight, Bell, BookOpen, Users, Flag } from "lucide-react";

const daysOfWeek = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

// const events = {
//   2: [{ title: "Study Group", type: "meeting" }],
//   5: [{ title: "Quiz 1", type: "assignment" }],
//   8: [{ title: "Team Sync", type: "meeting" }],
//   10: [{ title: "Project Draft", type: "deadline" }],
//   12: [{ title: "Office Hours", type: "meeting" }],
//   15: [{ title: "Midterm Exam", type: "deadline" }, { title: "Dentist", type: "reminder" }],
//   18: [{ title: "HW #4 Due", type: "assignment" }],
//   20: [{ title: "Interview", type: "meeting" }],
//   22: [{ title: "Lab Report", type: "assignment" }],
//   25: [{ title: "Today", type: "reminder" }],
//   28: [{ title: "Physics Exam", type: "deadline" }],
//   30: [{ title: "Portfolio Due", type: "deadline" }],
// };

const typeStyle = {
  deadline: { background: "rgba(239,68,68,0.25)", color: "#f87171" },
  meeting: { background: "rgba(56,189,248,0.25)", color: "#7dd3fc" },
  assignment: { background: "rgba(124,58,237,0.25)", color: "#c4b5fd" },
  reminder: { background: "rgba(74,222,128,0.25)", color: "#4ade80" },
};

const typeIcon = {
  deadline: Flag,
  meeting: Users,
  assignment: BookOpen,
  reminder: Bell,
};

const reminders = [
  { title: "Physics Midterm", date: "Jun 28", type: "deadline" },
  { title: "Project Proposal", date: "Jul 2", type: "assignment" },
  { title: "Team Offsite", date: "Jul 5", type: "meeting" },
  { title: "Internship Deadline", date: "Jul 10", type: "deadline" },
  { title: "Read Ch. 9-10", date: "Jul 12", type: "reminder" },
];

export default function Calendar() {
  const { tasks, importGoogleEvents } = useContext(TaskContext);
  const { accessToken } = useContext(AuthContext);
  console.log("TOKEN CHECK:", accessToken);
  const [googleEvents, setGoogleEvents] = useState([]);



useEffect(() => {
  if (!accessToken) return;

  const fetchCalendar = async () => {
    const response = await fetch(
      "https://www.googleapis.com/calendar/v3/calendars/primary/events",
      {
        headers: {
          Authorization: `Bearer ${accessToken}`
        }
      }
    );

    const data = await response.json();
    console.log("RAW GOOGLE DATA:", data);
    setGoogleEvents(data.items || []);
    
  };

  fetchCalendar();
}, [accessToken]);


useEffect(() => {
  if (googleEvents.length === 0) return;

  const processEvents = async () => {
    const formattedEvents = await Promise.all(
      googleEvents.map(async (event, index) => {
        const eventDate = new Date(
          event.start?.dateTime || event.start?.date
        );

        if (eventDate < new Date()) {
          return null;
        }
        try {
          const analysis =
            await analyzeCalendarEvent(
              event.summary || "Untitled Event"
            );

          if (!analysis.actionable) {
            return null;
          }

          return {
            id: Date.now() + index,
            title: event.summary || "Untitled Event",
            priority: analysis.priority || "Medium",

            deadline: event.start?.dateTime
              ? new Date(
                  event.start.dateTime
                ).toLocaleDateString("en-US", {
                  month: "short",
                  day: "numeric"
                })
              : new Date(
                  event.start?.date
                ).toLocaleDateString("en-US", {
                  month: "short",
                  day: "numeric"
                }),

            category:
              analysis.category || "Google Calendar",

            progress: 0,
            source: "google"
          };
        } catch (error) {
            console.log("Gemini analysis failed:", error);
            return null;
          }
      })
    );

    const validEvents = formattedEvents.filter(Boolean);
    importGoogleEvents(validEvents);
  };

  processEvents();
}, [googleEvents]);


  const [currentDate, setCurrentDate] = useState(new Date());

  const month = currentDate.getMonth();
  const year = currentDate.getFullYear();
  const today = new Date();
  const currentDay = today.getDate();
  const currentMonth = today.getMonth();
  const currentYear = today.getFullYear();
  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const cells = Array.from({ length: firstDay + daysInMonth }, (_, i) => i < firstDay ? null : i - firstDay + 1);
  const monthName = new Date(year, month).toLocaleString("default", { month: "long", year: "numeric" });


const events = {};

googleEvents.forEach((event) => {
  const dateString =
    event.start?.dateTime || event.start?.date;

  if (!dateString) return;

  const eventDate = new Date(dateString);

  if (
    eventDate.getMonth() !== month ||
    eventDate.getFullYear() !== year
  ) {
    return;
  }

  const day = eventDate.getDate();

  if (!events[day]) {
    events[day] = [];
  }

  events[day].push({
    title: event.summary,
    type: "meeting"
  });
});



  return (
    <AppLayout>
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-white">Smart Calendar</h1>
            <p className="text-sm mt-0.5" style={{ color: "rgba(255,255,255,0.4)" }}>Your mission timeline at a glance</p>
          </div>
          <div className="flex items-center gap-3 flex-wrap">
            {[{ label: "Deadline", color: "rgba(239,68,68,0.5)" }, { label: "Meeting", color: "rgba(56,189,248,0.5)" }, { label: "Assignment", color: "rgba(124,58,237,0.5)" }, { label: "Reminder", color: "rgba(74,222,128,0.5)" }].map(({ label, color }) => (
              <div key={label} className="hidden md:flex items-center gap-1.5">
                <div className="w-2.5 h-2.5 rounded-full" style={{ background: color }} />
                <span className="text-xs" style={{ color: "rgba(255,255,255,0.4)" }}>{label}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-5">
          <div className="glass-card rounded-2xl p-5 lg:col-span-3">
            <div className="flex items-center justify-between mb-5">
              <button
                onClick={() =>
                  setCurrentDate(
                    new Date(year, month - 1, 1)
                  )
                }
                className="w-8 h-8 ..."
              >
                <ChevronLeft />
              </button>
              <h2 className="text-white font-bold text-lg">{monthName}</h2>
              <button
                onClick={() =>
                  setCurrentDate(
                    new Date(year, month + 1, 1)
                  )
                }
                className="w-8 h-8 ..."
              >
                <ChevronRight />
              </button>
            </div>
            <div className="grid grid-cols-7 mb-2">
              {daysOfWeek.map(d => <div key={d} className="text-center text-xs font-medium py-2" style={{ color: "rgba(255,255,255,0.3)" }}>{d}</div>)}
            </div>
            <div className="grid grid-cols-7 gap-1">
              {cells.map((day, i) => {
                const dayEvents = day ? (events[day] || []) : [];
                const isToday =
                  day === currentDay &&
                  month === currentMonth &&
                  year === currentYear;
                return (
                  <motion.div key={i} whileHover={day ? { scale: 1.03 } : {}}
                    className="rounded-xl p-1.5 transition-all"
                    style={{
                      minHeight: "70px",
                      cursor: day ? "pointer" : "default",
                      background: isToday ? "rgba(124,58,237,0.15)" : "transparent",
                      border: isToday ? "1px solid rgba(124,58,237,0.4)" : "1px solid transparent",
                    }}>
                    {day && (
                      <>
                        <div className="text-xs font-semibold mb-1 w-6 h-6 flex items-center justify-center rounded-full"
                          style={{ background: isToday ? "#7C3AED" : "transparent", color: isToday ? "white" : "rgba(255,255,255,0.6)" }}>
                          {day}
                        </div>
                        <div className="space-y-0.5">
                          {dayEvents.slice(0, 2).map((ev, j) => {
                            const Icon = typeIcon[ev.type];
                            return (
                              <div key={j} className="text-xs px-1.5 py-0.5 rounded-md flex items-center gap-1 truncate" style={typeStyle[ev.type]}>
                                <Icon className="w-2.5 h-2.5 flex-shrink-0" />
                                <span className="truncate hidden sm:block">{ev.title}</span>
                              </div>
                            );
                          })}
                          {dayEvents.length > 2 && <div className="text-xs px-1" style={{ color: "rgba(255,255,255,0.3)" }}>+{dayEvents.length - 2}</div>}
                        </div>
                      </>
                    )}
                  </motion.div>
                );
              })}
            </div>
          </div>

          <div className="glass-card rounded-2xl p-5">
            <div className="flex items-center gap-2 mb-4">
              <Bell className="w-4 h-4 text-purple-400" />
              <h3 className="text-white font-semibold text-sm">Upcoming</h3>
            </div>
            <div className="space-y-3">
              {reminders.map((r, i) => {
                const Icon = typeIcon[r.type];
                return (
                  <motion.div key={r.title} initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.07 }}
                    className="flex items-start gap-3 p-3 rounded-xl transition-all cursor-pointer"
                    style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.06)" }}>
                    <div className="w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0" style={typeStyle[r.type]}>
                      <Icon className="w-3.5 h-3.5" />
                    </div>
                    <div>
                      <p className="text-xs font-medium leading-tight" style={{ color: "rgba(255,255,255,0.8)" }}>{r.title}</p>
                      <p className="text-xs mt-0.5" style={{ color: "rgba(255,255,255,0.3)" }}>{r.date}</p>
                    </div>
                  </motion.div>
                );
              })}
            </div>
            <div className="mt-5 pt-4" style={{ borderTop: "1px solid rgba(255,255,255,0.08)" }}>
              <button className="w-full text-xs text-center transition-colors" style={{ color: "#a78bfa" }}>View all events</button>
            </div>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
