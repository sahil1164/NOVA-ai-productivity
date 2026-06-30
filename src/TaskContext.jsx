import { createContext, useState, useEffect, useContext } from "react";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { db } from "./firebase";
import { AuthContext } from "./AuthContext";

export const TaskContext = createContext();

const initialTasks = {
  "To Do": [],
  "In Progress": [],
  "Completed": [],
};

export function TaskProvider({ children }) {
  const { currentUser } = useContext(AuthContext);
  const [tasks, setTasks] = useState(initialTasks);
  const [loading, setLoading] = useState(true);
  const [hasLoaded, setHasLoaded] = useState(false);
  console.log("TaskContext user:", currentUser?.email);

  useEffect(() => {
    const loadTasks = async () => {
      if (!currentUser) {
        setTasks(initialTasks);
        setLoading(false);
        setHasLoaded(false);
        return;
      }
      setHasLoaded(false);      
      setTasks(initialTasks); 
      setLoading(true);
      console.log("LOADING DB FOR:", currentUser.email);

      const docRef = doc(db, "users", currentUser.uid);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        setTasks(docSnap.data().tasks);
      } else {
        await setDoc(docRef, {
          tasks: initialTasks
        });
        setTasks(initialTasks);
      }

      setHasLoaded(true);
      setLoading(false);
    };

    loadTasks();
  }, [currentUser]);

  useEffect(() => {
    const saveTasks = async () => {
      if (!currentUser || loading || !hasLoaded) return;
      console.log("SAVING TO FIRESTORE:", currentUser.email, tasks);

      await setDoc(doc(db, "users", currentUser.uid), {
        tasks
      });
    };

    saveTasks();
  }, [tasks, currentUser, loading, hasLoaded]);

  const importGoogleEvents = (events) => {
    setTasks((prev) => ({
      ...prev,

      "To Do": [
        ...prev["To Do"],

        ...events.filter(
          (newEvent) =>
            !prev["To Do"].some(
              (task) => task.title === newEvent.title
            )
        )
      ]
    }));
  };

  return (
    <TaskContext.Provider value={{ tasks, setTasks, importGoogleEvents }}>
      {!loading && children}
    </TaskContext.Provider>
  );
}