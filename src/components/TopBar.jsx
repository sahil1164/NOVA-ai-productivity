import { useState, useContext, useEffect } from "react";
import { AuthContext } from "../AuthContext";
import { TaskContext } from "../TaskContext";
import { motion } from "framer-motion";
import { Search, Bell, Menu } from "lucide-react";


export default function TopBar({ onMenuClick }) {
  const [focused, setFocused] = useState(false);
  const { currentUser } = useContext(AuthContext);
  const { tasks } = useContext(TaskContext);
  const [notifications, setNotifications] = useState([
    {
      id: 1,
      message: "🚀 NOVA systems online.",
      type: "info"
    }
  ]);

  const [showNotifications, setShowNotifications] = useState(false);

  const [unread, setUnread] = useState(true);
  const [popup, setPopup] = useState(null);
  const [lastAlert, setLastAlert] = useState("");
  const [activityAlertSent, setActivityAlertSent] = useState(false);


  const triggerNotification = (message, type) => {
    if (lastAlert === message) return;

    setLastAlert(message);

    const newNotification = {
      id: Date.now(),
      message,
      type
    };

    setNotifications((prev) => [
      ...prev.slice(-4),
      newNotification
    ]);

    setPopup(newNotification);

    setUnread(true);

    setTimeout(() => {
      setPopup(null);
    }, 4000);
  };

  useEffect(() => {
    const allTasks = Object.values(tasks).flat();

    const highPriorityTasks = allTasks.filter(
      (task) =>
        task.priority === "High" &&
        task.progress !== 100
    );

    if (highPriorityTasks.length >= 4) {
      const timer = setTimeout(() => {
        triggerNotification(
          `🔥 Heavy workload detected. ${highPriorityTasks.length} high priority missions pending.`,
          "workload"
        );
      }, 3000);

      return () => clearTimeout(timer);
    }

  }, [tasks]);

  useEffect(() => {
    const timer = setTimeout(() => {
      const hour = new Date().getHours();

      if (hour >= 6 && hour < 12) {
        triggerNotification(
          "☀ Peak focus hours detected. Start deep work now.",
          "time"
        );
      }

      else if (hour >= 12 && hour < 17) {
        triggerNotification(
          "⚡ Afternoon energy dip detected. Finish lighter tasks first.",
          "time"
        );
      }

      else if (hour >= 17 && hour < 22) {
        triggerNotification(
          "🌆 Evening detected. Wrap up pending important work.",
          "time"
        );
      }

      else {
        triggerNotification(
          "🌙 Late hours detected. Shift non-urgent work to tomorrow.",
          "time"
        );
      }

    }, 8000);

    return () => clearTimeout(timer);

  }, []);


  useEffect(() => {
    const timer = setTimeout(() => {
      const todoTasks = tasks["To Do"] || [];

      const stuckTasks = todoTasks.filter(
        (task) => task.priority === "High"
      );

      if (stuckTasks.length >= 2) {
        triggerNotification(
          "⚠ Procrastination pattern detected. High priority tasks remain untouched.",
          "behavior"
        );
      }

    }, 13000);

    return () => clearTimeout(timer);

  }, [tasks]);


  useEffect(() => {
    let timer;

    const resetTimer = () => {
      clearTimeout(timer);

      timer = setTimeout(() => {
        const allTasks = Object.values(tasks).flat();

        const pendingTasks = allTasks.filter(
          (task) => task.progress !== 100
        );

        if (pendingTasks.length > 0 && !activityAlertSent) {
          triggerNotification(
            "🛰 Inactivity detected. Resume your pending missions.",
            "activity"
          );

          setActivityAlertSent(true);
        }

      }, 20000);  
    };

    window.addEventListener("mousemove", resetTimer);
    window.addEventListener("keydown", resetTimer);

    resetTimer();

    return () => {
      clearTimeout(timer);

      window.removeEventListener("mousemove", resetTimer);
      window.removeEventListener("keydown", resetTimer);
    };

  }, [tasks]);

  return (
    <div className="flex items-center gap-4 px-6 py-4 sticky top-0 z-30"
      style={{ borderBottom: "1px solid rgba(255,255,255,0.08)", background: "rgba(9,13,22,0.8)", backdropFilter: "blur(12px)" }}>
      <button onClick={onMenuClick} className="lg:hidden transition-colors"
        style={{ color: "rgba(255,255,255,0.5)" }}>
        <Menu className="w-5 h-5" />
      </button>

      <div className="relative flex-shrink-0" style={{ width: focused ? "300px" : "220px", transition: "width 0.2s" }}>
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4" style={{ color: "rgba(255,255,255,0.3)" }} />
        <input
          type="search"
          placeholder="Search anything..."
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          className="w-full text-sm text-white outline-none transition-all rounded-xl pl-9 pr-4 py-2"
          style={{
            background: "rgba(255,255,255,0.05)",
            border: focused ? "1px solid rgba(124,58,237,0.5)" : "1px solid rgba(255,255,255,0.1)",
            color: "white",
          }}
        />
      </div>

      <div className="ml-auto flex items-center gap-3 relative">
        <motion.button
          onClick={() => {
            setShowNotifications(!showNotifications);
            setUnread(false);
          }}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="relative w-9 h-9 flex items-center justify-center rounded-xl transition-all"
          style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)", color: "rgba(255,255,255,0.6)" }}
        >
          <Bell className="w-4 h-4" />
          {unread && (
            <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-purple-400" />
          )}
        </motion.button>
        {showNotifications && (
          <div
            className="absolute right-20 top-16 w-80 rounded-2xl p-4 z-50"
            style={{
              background: "rgba(15,20,30,0.98)",
              border: "1px solid rgba(255,255,255,0.08)",
              backdropFilter: "blur(12px)"
            }}
          >
            <h3
              className="mb-3 text-sm font-semibold"
              style={{ color: "#c4b5fd" }}
            >
              NOVA Alerts
            </h3>

            <div className="space-y-2">

              {notifications.map((note) => (
                <div
                  key={note.id}
                  className="rounded-xl p-3 text-sm"
                  style={{
                    background: "rgba(255,255,255,0.04)",
                    color: "rgba(255,255,255,0.75)"
                  }}
                >
                  {note.message}
                </div>
              ))}

            </div>
          </div>
        )}

        <motion.div whileHover={{ scale: 1.05 }}
          className="w-9 h-9 rounded-full flex items-center justify-center text-white text-xs font-bold cursor-pointer glow-purple"
          style={{ background: "linear-gradient(135deg,#7C3AED,#38BDF8)" }}
        >
          {currentUser?.displayName
            ?.split(" ")
            .map((word) => word[0])
            .join("") || "CX"}
        </motion.div>
      </div>
      {popup && (
        <div
          className="absolute top-20 right-0 w-80 rounded-2xl p-4 z-[100]"
          style={{
            background: "rgba(15,20,30,0.98)",
            border: "1px solid rgba(124,58,237,0.3)",
            backdropFilter: "blur(12px)",
            boxShadow: "0 0 20px rgba(124,58,237,0.25)"
          }}
        >
          <p
            className="text-sm font-semibold"
            style={{ color: "#c4b5fd" }}
          >
            🔔 NOVA Alert
          </p>

          <p
            className="text-sm mt-2"
            style={{ color: "rgba(255,255,255,0.75)" }}
          >
            {popup.message}
          </p>
        </div>
      )}
    </div>
  );
}
