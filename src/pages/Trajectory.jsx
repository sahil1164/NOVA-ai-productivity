import { useState, useContext, useEffect } from "react";
import AppLayout from "../components/AppLayout";
import { TaskContext } from "../TaskContext";
import { generateSchedule } from "../gemini";

import {
  Clock3,
  Rocket,
  Target,
  Brain,
  FileText,
  Coffee,
  Phone,
  Dumbbell
} from "lucide-react";

export default function Trajectory() {
  const { tasks } = useContext(TaskContext);
  const taskSignature = JSON.stringify(tasks);
  const [error, setError] = useState("");

  const [plan, setPlan] = useState("");
  const [loading, setLoading] = useState(false);
  const [lastUpdated, setLastUpdated] = useState("");

  const planItems = plan
    ? plan.split("\n").map((line) => {
        const parts = line.split(" - ");
        return {
          time: parts[0] || "",
          task: parts[1] || "Task"
        };
      })
    : [];

    const allTasks = Object.values(tasks).flat();

    const tasksPlanned = planItems.length;

    const highPriorityCount = allTasks.filter(
    (task) => task.priority === "High"
    ).length;

    const totalFocusHours = planItems.filter(
    (item) =>
        !item.task.toLowerCase().includes("break") &&
        !item.task.toLowerCase().includes("lunch")
    ).length;

    const aiConfidence =
    allTasks.length <= 5
        ? 96
        : allTasks.length <= 8
        ? 91
        : 84;


  useEffect(() => {
    if (Object.keys(tasks).length === 0) return;
    
    const savedPlan =
        localStorage.getItem("novaPlan");

    const savedSignature =
        localStorage.getItem("novaTaskSignature");

    const savedTime =
        localStorage.getItem("novaLastUpdated");

    // same tasks → don't regenerate
    if (
        savedPlan &&
        savedSignature === taskSignature
    ) {
        console.log("LOADED FROM LOCALSTORAGE");

        setPlan(savedPlan);

        if (savedTime) {
        setLastUpdated(savedTime + " (cached)");
        }

        return;
    }

    const autoGenerate = async () => {
        try {
        setError("");
        setLoading(true);

        const result =
            await generateSchedule(tasks);

        setPlan(result);

        const time =
            new Date().toLocaleTimeString();

        setLastUpdated(time);

        // save locally
        localStorage.setItem(
            "novaPlan",
            result
        );

        localStorage.setItem(
            "novaTaskSignature",
            taskSignature
        );

        localStorage.setItem(
            "novaLastUpdated",
            time
        );

        } 
        catch (error) {
            console.log(error);

            // autonomous fallback planner
            const allTasks = Object.values(tasks)
                .flat()

                // remove completed tasks
                .filter((task) => task.progress !== 100)

                // sort by priority
                .sort((a, b) => {
                const rank = {
                    High: 3,
                    Medium: 2,
                    Low: 1
                };

                return rank[b.priority] - rank[a.priority];
                });

            // create local schedule
            const fallbackPlan = allTasks
                .map((task, index) => {
                const hour = 9 + index * 2;

                const displayHour =
                    hour > 12 ? hour - 12 : hour;

                const suffix =
                    hour >= 12 ? "PM" : "AM";

                return `${displayHour}:00 ${suffix} - ${task.title}`;
                })
                .join("\n");

            // still render trajectory page
            setPlan(fallbackPlan);

            setError(
                "⚡ Cloud AI busy. NOVA autonomous planning mode activated."
            );
        } 
        finally {
        setLoading(false);
        }
    };

    autoGenerate();

    }, [taskSignature]);


  const getIcon = (task) => {
    const t = task.toLowerCase();

    if (t.includes("break")) return <Coffee color="#60A5FA" />;
    if (t.includes("call")) return <Phone color="#4ADE80" />;
    if (t.includes("gym")) return <Dumbbell color="#4ADE80" />;

    return <FileText color="#C084FC" />;
  };

  const getTag = (task) => {
    const t = task.toLowerCase();

    if (t.includes("break")) return "Break";
    if (t.includes("call")) return "Personal";
    if (t.includes("gym")) return "Personal";

    return "High Priority";
  };

  const getTagStyle = (task) => {
    const t = task.toLowerCase();

    if (t.includes("break")) {
      return {
        background: "rgba(59,130,246,0.12)",
        color: "#60A5FA"
      };
    }

    if (t.includes("call") || t.includes("gym")) {
      return {
        background: "rgba(34,197,94,0.12)",
        color: "#4ADE80"
      };
    }

    return {
      background: "rgba(239,68,68,0.12)",
      color: "#f87171"
    };
  };

  const getCardStyle = (task) => {
    const t = task.toLowerCase();

    if (t.includes("break")) {
      return {
        background: "rgba(59,130,246,0.04)"
      };
    }

    if (t.includes("call") || t.includes("gym")) {
      return {
        background: "rgba(34,197,94,0.04)"
      };
    }

    return {
      background: "rgba(168,85,247,0.04)"
    };
  };

  return (
    <AppLayout>
      <div className="max-w-7xl mx-auto">

        {/* HEADER */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-white">
            Trajectory
          </h1>

          <p
            className="mt-2"
            style={{ color: "rgba(255,255,255,0.5)" }}
          >
            AI optimized path for your day
          </p>

          <div
            className="mt-4 px-4 py-2 rounded-xl inline-block"
            style={{
              background: "rgba(255,255,255,0.04)",
              border: "1px solid rgba(255,255,255,0.08)"
            }}
          >
            <span style={{ color: "#4ADE80" }}>
               ● Last Updated {lastUpdated || "Calculating..."}
            </span>
          </div>
        </div>
        {error && (
            <div
                className="rounded-2xl p-5 mb-6"
                style={{
                background: "rgba(239,68,68,0.08)",
                border: "1px solid rgba(239,68,68,0.2)"
                }}
            >
                <p style={{ color: "#f87171" }}>
                ⚠ {error}
                </p>
            </div>
            )}

        {/* LOADING */}
        {loading ? (
          <div
            className="rounded-2xl p-6"
            style={{
              background: "rgba(255,255,255,0.04)",
              border: "1px solid rgba(255,255,255,0.08)"
            }}
          >
            <p style={{ color: "#a78bfa" }}>
              🚀 NOVA is calculating trajectory...
            </p>
          </div>
        ) : (
          <>
            {/* TIMELINE SECTION */}
            <div className="space-y-5">

              {planItems.map((item, i) => (
                <div key={i} className="flex gap-6 items-start">

                  {/* LEFT SIDE TIMELINE */}
                  <div className="flex items-start gap-4 w-52">

                    <div className="flex flex-col items-center">

                      <div
                        className="w-4 h-4 rounded-full"
                        style={{
                          background: "#A855F7",
                          boxShadow: "0 0 10px #A855F7"
                        }}
                      />

                      {i !== planItems.length - 1 && (
                        <div
                          className="w-0.5 h-24"
                          style={{
                            background: "rgba(168,85,247,0.4)"
                          }}
                        />
                      )}
                    </div>

                    <div>
                      <p className="text-white text-xl font-bold">
                        {item.time}
                      </p>

                      <p
                        className="text-xs mt-1"
                        style={{
                          color: "rgba(255,255,255,0.4)"
                        }}
                      >
                        Scheduled
                      </p>
                    </div>
                  </div>

                  {/* TASK CARD */}
                  <div
                    className="flex items-center gap-5 flex-1 rounded-2xl py-4 px-5"
                    style={{
                      ...getCardStyle(item.task),
                      border: "1px solid rgba(255,255,255,0.08)"
                    }}
                  >
                    {/* ICON */}
                    <div
                      className="w-14 h-14 rounded-xl flex items-center justify-center"
                      style={{
                        background: "rgba(124,58,237,0.15)"
                      }}
                    >
                      {getIcon(item.task)}
                    </div>

                    {/* TASK TEXT */}
                    <div className="flex-1">
                      <h3 className="text-white font-semibold text-lg">
                        {item.task}
                      </h3>

                      <p
                        className="text-sm mt-1"
                        style={{
                          color: "rgba(255,255,255,0.4)"
                        }}
                      >
                        Scheduled by NOVA AI
                      </p>
                    </div>

                    {/* TAG */}
                    <div
                      className="px-4 py-2 rounded-xl text-sm font-medium"
                      style={getTagStyle(item.task)}
                    >
                      {getTag(item.task)}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* BOTTOM STATS BAR */}
            <div
              className="mt-10 rounded-2xl p-6 grid grid-cols-4 gap-6"
              style={{
                background: "rgba(255,255,255,0.04)",
                border: "1px solid rgba(255,255,255,0.08)"
              }}
            >

              <div className="flex items-center gap-4">
                <Clock3 size={36} color="#A855F7" />
                <div>
                  <p className="text-2xl text-white font-bold">
                    {totalFocusHours}h 
                  </p>
                  <p style={{ color: "rgba(255,255,255,0.4)" }}>
                    Focus Time
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <Rocket size={36} color="#60A5FA" />
                <div>
                  <p className="text-2xl text-white font-bold">
                    {tasksPlanned} 
                  </p>
                  <p style={{ color: "rgba(255,255,255,0.4)" }}>
                    Tasks Planned
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <Target size={36} color="#F59E0B" />
                <div>
                  <p className="text-2xl text-white font-bold">
                    {highPriorityCount} 
                  </p>
                  <p style={{ color: "rgba(255,255,255,0.4)" }}>
                    High Priority
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <Brain size={36} color="#D946EF" />
                <div>
                  <p className="text-2xl text-white font-bold">
                    {aiConfidence}%
                  </p>
                  <p style={{ color: "rgba(255,255,255,0.4)" }}>
                    AI Confidence
                  </p>
                </div>
              </div>

            </div>
          </>
        )}

      </div>
    </AppLayout>
  );
}