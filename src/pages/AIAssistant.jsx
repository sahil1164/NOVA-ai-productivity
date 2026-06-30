import { useState, useRef, useEffect, useContext } from "react";
import { motion, AnimatePresence } from "framer-motion";
import AppLayout from "../components/AppLayout";
import { Send, Mic, Orbit, Sparkles } from "lucide-react";
import { TaskContext } from "../TaskContext";
import { askNova } from "../gemini";

const initialMessages = [
  { id: 1, role: "ai", text: "Hello, Commander. I'm NOVA, your AI productivity assistant. I can help prioritize tasks, build schedules, and optimize productivity. How can I help you today?", time: "Now" },
];

const prompts = ["Plan my day", "Prioritize my tasks", "Build a study schedule", "What should I focus on today?", "How productive was I this week?"];

function TypingIndicator() {
  return (
    <div className="flex items-end gap-3">
      <div className="w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: "linear-gradient(135deg,#7C3AED,#38BDF8)" }}>
        <Orbit className="w-4 h-4 text-white" />
      </div>
      <div className="glass-card rounded-2xl rounded-bl-sm px-4 py-3">
        <div className="flex items-center gap-1.5">
          {[0, 1, 2].map(i => (
            <motion.div key={i} animate={{ y: [0, -5, 0] }} transition={{ duration: 0.6, repeat: Infinity, delay: i * 0.15 }}
              className="w-2 h-2 rounded-full bg-purple-400" />
          ))}
        </div>
      </div>
    </div>
  );
}

export default function AIAssistant() {
  const { tasks } = useContext(TaskContext);
  const [messages, setMessages] = useState(initialMessages);
  const [input, setInput] = useState("");
  const [typing, setTyping] = useState(false);
  const bottomRef = useRef(null);

  useEffect(() => { bottomRef.current?.scrollIntoView({ behavior: "smooth" }); }, [messages, typing]);

  const send = async (text) => {
  if (!text.trim()) return;

  const now = new Date().toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit"
  });

  setMessages(prev => [
    ...prev,
    {
      id: Date.now(),
      role: "user",
      text,
      time: now
    }
  ]);

  setInput("");
  setTyping(true);

  try {
    const aiResponse = await askNova(text, tasks);

    setMessages(prev => [
      ...prev,
      {
        id: Date.now() + 1,
        role: "ai",
        text: aiResponse,
        time: now
      }
    ]);
  } catch (error) {
    setMessages(prev => [
      ...prev,
      {
        id: Date.now() + 1,
        role: "ai",
        text: "Sorry, I ran into an issue. Please try again.",
        time: now
      }
    ]);

    console.log(error);
  }

  setTyping(false);
  };

  return (
    <AppLayout>
      <div className="max-w-4xl mx-auto flex flex-col" style={{ height: "calc(100vh - 160px)" }}>
        <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}
          className="glass-card rounded-2xl px-5 py-4 mb-4 flex items-center gap-3">
          <div className="relative">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: "linear-gradient(135deg,#7C3AED,#38BDF8)" }}>
              <Orbit className="w-5 h-5 text-white" />
            </div>
            <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full bg-green-400" style={{ border: "2px solid #0B0F19" }} />
          </div>
          <div>
            <h2 className="text-white font-bold text-base">NOVA AI Assistant</h2>
            <p className="text-xs flex items-center gap-1 text-green-400">
              <span className="w-1.5 h-1.5 rounded-full bg-green-400 inline-block" /> Online — ready to help
            </p>
          </div>
          <div className="ml-auto flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-purple-400" />
            <span className="text-xs" style={{ color: "rgba(255,255,255,0.3)" }}>Gemini powered</span>
          </div>
        </motion.div>

        <div className="flex-1 overflow-y-auto space-y-4 pb-4 pr-1">
          <AnimatePresence initial={false}>
            {messages.map(msg => (
              <motion.div key={msg.id} initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}
                className="flex items-end gap-3" style={{ flexDirection: msg.role === "user" ? "row-reverse" : "row" }}>
                {msg.role === "ai"
                  ? <div className="w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: "linear-gradient(135deg,#7C3AED,#38BDF8)" }}><Orbit className="w-4 h-4 text-white" /></div>
                  : <div className="w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-bold flex-shrink-0" style={{ background: "linear-gradient(135deg,#7C3AED,#38BDF8)" }}>CX</div>
                }
                <div className="max-w-[75%] flex flex-col gap-1" style={{ alignItems: msg.role === "user" ? "flex-end" : "flex-start" }}>
                  <div className="px-4 py-3 rounded-2xl text-sm leading-relaxed whitespace-pre-line"
                    style={msg.role === "user"
                      ? { background: "linear-gradient(135deg,#7C3AED,#6D28D9)", color: "white", borderRadius: "16px 16px 4px 16px", border: "1px solid rgba(124,58,237,0.3)" }
                      : { background: "rgba(255,255,255,0.04)", backdropFilter: "blur(12px)", border: "1px solid rgba(255,255,255,0.08)", color: "rgba(255,255,255,0.85)", borderRadius: "16px 16px 16px 4px" }
                    }>{msg.text}</div>
                  <span className="text-xs px-1" style={{ color: "rgba(255,255,255,0.2)" }}>{msg.time}</span>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
          {typing && <TypingIndicator />}
          <div ref={bottomRef} />
        </div>

        <div className="flex gap-2 flex-wrap mb-3">
          {prompts.map(p => (
            <motion.button key={p} whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }} onClick={() => send(p)}
              className="px-3 py-1.5 rounded-lg text-xs transition-all"
              style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)", color: "rgba(255,255,255,0.5)" }}>
              {p}
            </motion.button>
          ))}
        </div>

        <div className="glass-card rounded-2xl flex items-center gap-3 px-4 py-3">
          <input type="text" value={input} onChange={e => setInput(e.target.value)}
            onKeyDown={e => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); send(input); } }}
            placeholder="Ask NOVA anything about your productivity..."
            className="flex-1 bg-transparent text-sm outline-none"
            style={{ color: "rgba(255,255,255,0.85)" }}
          />
          <button className="w-8 h-8 flex items-center justify-center rounded-lg transition-all" style={{ color: "rgba(255,255,255,0.3)" }}>
            <Mic className="w-4 h-4" />
          </button>
          <motion.button whileHover={{ scale: 1.08 }} whileTap={{ scale: 0.92 }} onClick={() => send(input)}
            disabled={!input.trim()}
            className="w-9 h-9 flex items-center justify-center rounded-xl text-white transition-all"
            style={{ background: "linear-gradient(135deg,#7C3AED,#38BDF8)", opacity: input.trim() ? 1 : 0.3 }}>
            <Send className="w-4 h-4" />
          </motion.button>
        </div>
      </div>
    </AppLayout>
  );
}
