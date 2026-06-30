import { useState, useContext } from "react";
import { motion } from "framer-motion";
import AppLayout from "../components/AppLayout";
import { Plus, GripVertical, Sparkles, Calendar, Tag, Trash2, Pencil } from "lucide-react";
import {parseTask, handleDelay} from "../gemini";
import { TaskContext } from "../TaskContext";
import {DndContext, useDraggable, useDroppable} from "@dnd-kit/core";


const initialTasks = {
  "To Do": [
    { id: 1, title: "Literature review for thesis", priority: "High", deadline: "Jun 28", category: "Study", progress: 0 },
    { id: 2, title: "Design system updates", priority: "Medium", deadline: "Jul 1", category: "Work", progress: 0 },
    { id: 3, title: "Morning run routine", priority: "Low", deadline: "Daily", category: "Personal", progress: 0 },
    { id: 4, title: "Code review for backend API", priority: "High", deadline: "Jun 27", category: "Work", progress: 0 },
  ],
  "In Progress": [
    { id: 5, title: "Machine learning project", priority: "High", deadline: "Jul 5", category: "Study", progress: 45 },
    { id: 6, title: "Client presentation slides", priority: "Medium", deadline: "Jun 29", category: "Work", progress: 70 },
    { id: 7, title: "Read Clean Code book", priority: "Low", deadline: "Jul 15", category: "Personal", progress: 30 },
  ],
  "Completed": [
    { id: 8, title: "Weekly team standup", priority: "Low", deadline: "Jun 25", category: "Work", progress: 100 },
    { id: 9, title: "Statistics assignment", priority: "High", deadline: "Jun 24", category: "Study", progress: 100 },
    { id: 10, title: "Update LinkedIn profile", priority: "Medium", deadline: "Jun 23", category: "Personal", progress: 100 },
  ],
};

const priorityStyle = {
  High: { background: "rgba(239,68,68,0.15)", color: "#f87171", border: "1px solid rgba(239,68,68,0.25)" },
  Medium: { background: "rgba(245,158,11,0.15)", color: "#fbbf24", border: "1px solid rgba(245,158,11,0.25)" },
  Low: { background: "rgba(74,222,128,0.15)", color: "#4ade80", border: "1px solid rgba(74,222,128,0.25)" },
};

const catStyle = {
  Study: { background: "rgba(124,58,237,0.15)", color: "#c4b5fd" },
  Work: { background: "rgba(56,189,248,0.15)", color: "#7dd3fc" },
  Personal: { background: "rgba(45,212,191,0.15)", color: "#5eead4" },
};

const colBorder = {
  "To Do": "rgba(255,255,255,0.1)",
  "In Progress": "rgba(245,158,11,0.3)",
  "Completed": "rgba(74,222,128,0.3)",
};

const colHeaderColor = {
  "To Do": "rgba(255,255,255,0.6)",
  "In Progress": "#fbbf24",
  "Completed": "#4ade80",
};

function DraggableTask({ task, children }) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform
  } = useDraggable({
    id: task.id
  });
  console.log("TASK", task.id, "TRANSFORM:", transform);

  const style = transform
    ? {
        transform: `translate3d(${transform.x}px, ${transform.y}px, 0)`,
        zIndex: 1000,
        opacity: 0.85
      }
    : undefined;

  return children({
    setNodeRef,
    listeners,
    attributes,
    style
  });
}

function DroppableColumn({ id, children }) {
  const { setNodeRef } = useDroppable({
    id
  });

  return <div ref={setNodeRef}>{children}</div>;
}


function getDeadlineStatus(deadline) {
  if (!deadline || deadline === "No deadline") return null;

  const today = new Date();

  const taskDate = Date.parse(deadline);

  if (isNaN(taskDate)) return null;

  const date = new Date(taskDate);

  // overdue
  if (taskDate < today) {
    return "overdue";
  }

  const diff =
    (taskDate - today) / (1000 * 60 * 60 * 24);

  // within 1 day
  if (diff <= 1) {
    return "urgent";
  }

  return null;
}

export default function Tasks() {
  const { tasks, setTasks } = useContext(TaskContext);
  const [newTask, setNewTask] = useState("");
  const [aiLoading, setAiLoading] = useState(false);
  const [editingTask, setEditingTask] = useState(null);
  const [editingColumn, setEditingColumn] = useState(null);
  const [delayInput, setDelayInput] = useState("");
  const [delayResponse, setDelayResponse] = useState("");
  const [showDelayBox, setShowDelayBox] = useState(false);
  const handleAddTask = async () => {
    if (newTask === "") return;

    try {
      const aiTask = await parseTask(newTask);

      const taskToAdd = {
        id: Date.now(),
        title: aiTask.title,
        priority: aiTask.priority,
        deadline: aiTask.deadline,
        category: aiTask.category,
        progress: 0
      };

      setTasks({
        ...tasks,
        "To Do": [...tasks["To Do"], taskToAdd]
      });

    } catch (error) {
      console.log(error);

      // fallback if Gemini fails
      const taskToAdd = {
        id: Date.now(),
        title: newTask,
        priority: "Medium",
        deadline: "No deadline",
        category: "Work",
        progress: 0
      };

      setTasks({
        ...tasks,
        "To Do": [...tasks["To Do"], taskToAdd]
      });

      alert("⚡ AI unavailable. Task added using manual mode.");
    }

    setNewTask("");
  };

  const handleDeleteTask = (taskId, column) => {
    const updatedTasks = {
      ...tasks,
      [column]: tasks[column].filter((task) => task.id !== taskId)
    };

    setTasks(updatedTasks);
  };

  const handleEditSave = () => {
    const updatedTasks = {
      ...tasks,
      [editingColumn]: tasks[editingColumn].map((task) =>
        task.id === editingTask.id ? editingTask : task
      )
    };

    setTasks(updatedTasks);
    setEditingTask(null);
  };

  const moveTask = (taskId, from, to) => {
    const taskToMove = tasks[from].find(
      (task) => task.id === taskId
    );

    if (!taskToMove) return;

    const updatedTasks = {
      ...tasks,

      [from]: tasks[from].filter(
        (task) => task.id !== taskId
      ),

      [to]: [
        ...tasks[to],
        to === "Completed"
          ? { ...taskToMove, progress: 100 }
          : taskToMove
      ]
    };

    setTasks(updatedTasks);
  };

  const handleDragEnd = (event) => {
    const { active, over } = event;
    if (!over) return;

    const taskId = active.id;
    const targetColumn = over.id;

    let sourceColumn = null;
    let draggedTask = null;

    for (const col in tasks) {
      const found = tasks[col].find(
        (task) => task.id === taskId
      );

      if (found) {
        sourceColumn = col;
        draggedTask = found;
        break;
      }
    }

    if (!sourceColumn || sourceColumn === targetColumn)
      return;

    const updatedTasks = {
      ...tasks,

      [sourceColumn]: tasks[sourceColumn].filter(
        (task) => task.id !== taskId
      ),

      [targetColumn]: [
        ...tasks[targetColumn],

        targetColumn === "Completed"
          ? { ...draggedTask, progress: 100 }
          : draggedTask
      ]
    };

    setTasks(updatedTasks);
  };

  const handleDelaySimulation = async () => {
    if (!delayInput) return;

    try {
      setAiLoading(true);

      const result = await handleDelay(
        tasks,
        delayInput
      );

      setDelayResponse(result);
      setShowDelayBox(false);
      setDelayInput("");

    } catch (error) {
      console.log(error);
      alert("NOVA servers are under heavy load. Retry in a few moments.");
    } finally {
      setAiLoading(false);
    }
  };

  return (
    <AppLayout>
      <DndContext onDragEnd={handleDragEnd}>
      <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-2xl font-bold text-white">Task Management</h1>
              <p className="text-sm mt-0.5" style={{ color: "rgba(255,255,255,0.4)" }}>Drag and drop to organize your mission</p>
            </div>
            <div
              className="flex items-center overflow-hidden rounded-2xl"
              style={{
                background: "rgba(255,255,255,0.06)",
                border: "1px solid rgba(255,255,255,0.08)",
                backdropFilter: "blur(12px)"
              }}
            >
              <input
                type="text"
                placeholder="Enter Task..."
                value={newTask}
                onChange={(e) => setNewTask(e.target.value)}
                className="px-4 py-3 bg-transparent text-white outline-none w-80"
              />

              <motion.button
                onClick={handleAddTask}
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                className="btn-primary px-5 py-3 flex items-center gap-2 text-white font-medium"
              >
                <Plus className="w-4 h-4" />
                Add
              </motion.button>
            </div>
            </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5 pb-24">
            {["To Do", "In Progress", "Completed"].map((col) => {
              const colTasks = tasks[col];

              return (
                <DroppableColumn key={col} id={col}>
                  <motion.div key={col} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}
                    className="rounded-2xl flex flex-col"
                    style={{ background: "rgba(255,255,255,0.04)", backdropFilter: "blur(12px)", border: `1px solid ${colBorder[col]}`, minHeight: "500px" }}>
                    <div className="flex items-center justify-between px-4 py-4" style={{ borderBottom: "1px solid rgba(255,255,255,0.08)" }}>
                      <div className="flex items-center gap-2">
                        <h3 className="font-semibold text-sm" style={{ color: colHeaderColor[col] }}>{col}</h3>
                        <span className="px-2 py-0.5 rounded-full text-xs font-medium" style={{ background: "rgba(255,255,255,0.08)", color: "rgba(255,255,255,0.4)" }}>
                          {colTasks.length}
                        </span>
                      </div>
                      <button className="w-6 h-6 flex items-center justify-center rounded-lg transition-all hover:bg-white/10" style={{ color: "rgba(255,255,255,0.3)" }}>
                        <Plus className="w-3.5 h-3.5" />
                      </button>
                    </div>
                    <div className="p-3 space-y-3 flex-1">
                      {colTasks.map((task, i) => {
                        const deadlineStatus = getDeadlineStatus(task.deadline);
                        return(
                        <DraggableTask key={task.id} task={task}>
                          {({ setNodeRef, listeners, attributes, style }) => (
                            <motion.div key={task.id} ref={setNodeRef} initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}
                              transition={{ delay: i * 0.05 }} whileHover={{ y: -4, scale: 1.02 }}
                              className="rounded-xl p-4 group transition-all duration-200"
                              style={{ ...style, background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)" }}>
                              <div className="flex items-start gap-2 mb-3">
                                <div
                                  {...listeners}
                                  {...attributes}
                                  className="cursor-grab active:cursor-grabbing flex-shrink-0"
                                >
                                  <GripVertical
                                    className="w-4 h-4 mt-0.5"
                                    style={{
                                      color: "rgba(255,255,255,0.15)"
                                    }}
                                  />
                                </div>
                                <p className="text-sm font-medium leading-snug flex-1"
                                  style={{ color: col === "Completed" ? "rgba(255,255,255,0.4)" : "rgba(255,255,255,0.85)", textDecoration: col === "Completed" ? "line-through" : "none" }}>
                                  {task.title}
                                </p>
                                {task.source === "google" && (
                                  <div
                                    className="mt-1 px-2 py-0.5 rounded-md text-xs inline-block"
                                    style={{
                                      background: "rgba(56,189,248,0.12)",
                                      color: "#38bdf8"
                                    }}
                                  >
                                    📅 Imported from Calendar
                                  </div>
                                )}
                                <button
                                  onClick={() => {
                                    setEditingTask(task);
                                    setEditingColumn(col);
                                  }}
                                  className="hover:scale-110 transition-all"
                                  style={{ color: "#7dd3fc" }}
                                >
                                  <Pencil className="w-4 h-4" />
                                </button>
                                <button
                                  onClick={() => handleDeleteTask(task.id, col)}
                                  className="hover:scale-110 transition-all"
                                  style={{ color: "#f87171" }}
                                >
                                  <Trash2 className="w-4 h-4" />
                                </button>
                              </div>
                              <div className="flex items-center gap-1.5 flex-wrap ml-6">
                                <span className="px-2 py-0.5 rounded-md text-xs font-medium" style={priorityStyle[task.priority]}>{task.priority}</span>
                                <span className="px-2 py-0.5 rounded-md text-xs font-medium flex items-center gap-1"
                                  style={catStyle[task.category] || { background: "rgba(255,255,255,0.1)", color: "rgba(255,255,255,0.4)" }}>
                                  <Tag className="w-2.5 h-2.5" />{task.category}
                                </span>
                                <span className="px-2 py-0.5 rounded-md text-xs flex items-center gap-1"
                                  style={{ background: "rgba(255,255,255,0.05)", color: "rgba(255,255,255,0.3)" }}>
                                  <Calendar className="w-2.5 h-2.5" />{task.deadline}
                                </span>
                                {deadlineStatus === "urgent" && col !== "Completed" && (
                                  <span
                                    className="px-2 py-0.5 rounded-md text-xs font-semibold"
                                    style={{
                                      background: "rgba(245,158,11,0.15)",
                                      color: "#f59e0b"
                                    }}
                                  >
                                    ⚠ Due Soon
                                  </span>
                                )}

                                {deadlineStatus === "overdue" && col !== "Completed" && (
                                  <span
                                    className="px-2 py-0.5 rounded-md text-xs font-semibold"
                                    style={{
                                      background: "rgba(239,68,68,0.15)",
                                      color: "#ef4444"
                                    }}
                                  >
                                    🚨 Overdue
                                  </span>
                                )}
                              </div>
                              {task.progress > 0 && (
                                <div className="mt-3 ml-6">
                                  <div className="flex items-center justify-between mb-1">
                                    <span className="text-xs" style={{ color: "rgba(255,255,255,0.3)" }}>Progress</span>
                                    <span className="text-xs font-medium" style={{ color: "rgba(255,255,255,0.5)" }}>{task.progress}%</span>
                                  </div>
                                  <div className="h-1.5 rounded-full overflow-hidden" style={{ background: "rgba(255,255,255,0.08)" }}>
                                    <motion.div initial={{ width: 0 }} animate={{ width: `${task.progress}%` }}
                                      transition={{ duration: 0.8, delay: i * 0.05 }}
                                      className="h-full rounded-full"
                                      style={{ background: "linear-gradient(to right,#7C3AED,#38BDF8)" }}
                                    />
                                  </div>
                                </div>
                              )}
                              {col === "To Do" && (
                                <button
                                  onClick={() => moveTask(task.id, "To Do", "In Progress")}
                                  className="mt-3 ml-6 px-4 py-2 rounded-xl text-xs font-semibold transition-all hover:scale-105"
                                  style={{
                                    background: "rgba(124,58,237,0.15)",
                                    border: "1px solid rgba(124,58,237,0.35)",
                                    color: "#c4b5fd",
                                    backdropFilter: "blur(10px)"
                                  }}
                                >
                                  🚀 Launch Mission
                                </button>
                              )}

                              {col === "In Progress" && (
                                <button
                                  onClick={() => moveTask(task.id, "In Progress", "Completed")}
                                  className="mt-3 ml-6 px-4 py-2 rounded-lg text-xs font-semibold transition-all hover:scale-105"
                                  style={{
                                    background: "linear-gradient(135deg, #06B6D4, #2563EB)",
                                    boxShadow: "0 0 12px rgba(56,189,248,0.35)",
                                    color: "white"
                                  }}
                                >
                                  ✓ ACCOMPLISHED
                                </button>
                              )}
                            </motion.div>
                          )}
                          </DraggableTask>
                        )
                      })}
                    </div>
                  </motion.div>
                </DroppableColumn>
              );
            })}
        </div>
        {editingTask && (
          <div
            className="fixed inset-0 flex items-center justify-center z-50"
            style={{ background: "rgba(0,0,0,0.6)" }}
          >
            <div
              className="w-96 rounded-2xl p-6"
              style={{
                background: "#111827",
                border: "1px solid rgba(255,255,255,0.1)"
              }}
            >
              <h2 className="text-white text-lg font-bold mb-4">
                Edit Task
              </h2>

              {/* Title */}
              <input
                value={editingTask.title}
                onChange={(e) =>
                  setEditingTask({
                    ...editingTask,
                    title: e.target.value
                  })
                }
                className="w-full mb-3 px-3 py-2 rounded-lg bg-transparent text-white"
                style={{
                  border: "1px solid rgba(255,255,255,0.1)"
                }}
              />

              {/* Priority */}
              <input
                value={editingTask.priority}
                onChange={(e) =>
                  setEditingTask({
                    ...editingTask,
                    priority: e.target.value
                  })
                }
                className="w-full mb-3 px-3 py-2 rounded-lg bg-transparent text-white"
                style={{
                  border: "1px solid rgba(255,255,255,0.1)"
                }}
              />

              {/* Deadline */}
              <input
                value={editingTask.deadline}
                onChange={(e) =>
                  setEditingTask({
                    ...editingTask,
                    deadline: e.target.value
                  })
                }
                className="w-full mb-3 px-3 py-2 rounded-lg bg-transparent text-white"
                style={{
                  border: "1px solid rgba(255,255,255,0.1)"
                }}
              />

              {/* Category */}
              <input
                value={editingTask.category}
                onChange={(e) =>
                  setEditingTask({
                    ...editingTask,
                    category: e.target.value
                  })
                }
                className="w-full mb-4 px-3 py-2 rounded-lg bg-transparent text-white"
                style={{
                  border: "1px solid rgba(255,255,255,0.1)"
                }}
              />

              <div className="flex justify-end gap-3">
                <button
                  onClick={() => setEditingTask(null)}
                  className="px-4 py-2 text-sm"
                  style={{ color: "gray" }}
                >
                  Cancel
                </button>

                <button
                  onClick={handleEditSave}
                  className="px-4 py-2 rounded-lg text-white"
                  style={{
                    background:
                      "linear-gradient(to right,#7C3AED,#38BDF8)"
                  }}
                >
                  Save
                </button>
              </div>
            </div>
          </div>
        )}
        {showDelayBox && (
          <div
            className="fixed inset-0 flex items-center justify-center z-50"
            style={{ background: "rgba(0,0,0,0.6)" }}
          >
            <div
              className="w-96 rounded-2xl p-6"
              style={{
                background: "#111827",
                border: "1px solid rgba(255,255,255,0.1)"
              }}
            >
              <h2 className="text-white text-lg font-bold mb-4">
                What delayed you?
              </h2>

              <input
                value={delayInput}
                onChange={(e) => setDelayInput(e.target.value)}
                placeholder="Meeting ran 2 hours late..."
                className="w-full mb-4 px-3 py-3 rounded-lg bg-transparent text-white"
                style={{
                  border: "1px solid rgba(255,255,255,0.1)"
                }}
              />

              <div className="flex justify-end gap-3">
               <div className="flex justify-end gap-3">

                <button
                  onClick={() => {
                    setShowDelayBox(false);
                    setDelayInput("");
                  }}
                  className="px-4 py-2 text-sm rounded-lg"
                  style={{
                    color: "rgba(255,255,255,0.6)",
                    border: "1px solid rgba(255,255,255,0.1)"
                  }}
                >
                  Cancel
                </button>

                <button
                  onClick={handleDelaySimulation}
                  disabled={aiLoading}
                  className="px-4 py-2 rounded-lg text-white"
                  style={{
                    background: "linear-gradient(to right,#F59E0B,#EF4444)",
                    opacity: aiLoading ? 0.7 : 1
                  }}
                >
                  {aiLoading ? "NOVA is recalculating..." : "Recalculate"}
                </button>

              </div>
              </div>
            </div>
          </div>
        )}
        {delayResponse && (
          <div
            className="fixed left-8 bottom-8 w-96 rounded-2xl p-5 z-40"
            style={{
              background: "rgba(15,20,30,0.95)",
              border: "1px solid rgba(255,255,255,0.1)"
            }}
          >
            <h3 className="text-white font-bold mb-3">
              NOVA Recovery Plan
            </h3>

            <p
              className="text-sm whitespace-pre-line"
              style={{ color: "rgba(255,255,255,0.7)" }}
            >
              {delayResponse}
            </p>

            <button
              onClick={() => setDelayResponse("")}
              className="mt-4 text-orange-400"
            >
              Close
            </button>
          </div>
        )}
        <div className="fixed bottom-8 right-8 flex gap-3 z-40">

          <motion.button
            onClick={() => setShowDelayBox(true)}
            whileHover={{ scale: 1.08 }}
            whileTap={{ scale: 0.95 }}
            className="px-5 py-3 rounded-2xl text-white text-sm font-semibold"
            style={{
              background: "linear-gradient(to right,#F59E0B,#EF4444)",
              boxShadow: "0 0 20px rgba(245,158,11,0.4)"
            }}
          >
            ⏳ I Got Delayed
          </motion.button>
        </div>
      </div>
      </DndContext>
    </AppLayout>
  );
}
