import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import Landing from "./pages/Landing";
import Dashboard from "./pages/Dashboard";
import Tasks from "./pages/Tasks";
import Calendar from "./pages/Calendar";
import AIAssistant from "./pages/AIAssistant";
import Analytics from "./pages/Analytics";
import FocusMode from "./pages/FocusMode";
import Trajectory from "./pages/Trajectory";

const pageVariants = {
  initial: { opacity: 0, y: 10 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.3 } },
  exit: { opacity: 0, y: -10, transition: { duration: 0.2 } },
};

function Page({ children }) {
  return (
    <motion.div variants={pageVariants} initial="initial" animate="animate" exit="exit">
      {children}
    </motion.div>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AnimatePresence mode="wait">
        <Routes>
          <Route path="/" element={<Page><Landing /></Page>} />
          <Route path="/dashboard" element={<Page><Dashboard /></Page>} />
          <Route path="/tasks" element={<Page><Tasks /></Page>} />
          <Route path="/calendar" element={<Page><Calendar /></Page>} />
          <Route path="/ai-assistant" element={<Page><AIAssistant /></Page>} />
          <Route path="/analytics" element={<Page><Analytics /></Page>} />
          <Route path="/focus" element={<Page><FocusMode /></Page>} />
          <Route path="/settings" element={<Navigate to="/dashboard" replace />} />
          <Route path="*" element={<Navigate to="/" replace />} />
          <Route path="/trajectory" element={<Trajectory />} />
        </Routes>
      </AnimatePresence>
    </BrowserRouter>
  );
}
