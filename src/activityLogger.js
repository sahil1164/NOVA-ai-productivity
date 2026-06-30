import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { db } from "./firebase";

export async function logActivity(uid, type, message) {
  if (!uid) return;

  console.log("LOG FUNCTION STARTED");

  try {
    await addDoc(
      collection(db, "users", uid, "activityLog"),
      {
        type,
        message,
        createdAt: serverTimestamp(),
      }
    );

    console.log("ACTIVITY SAVED SUCCESSFULLY");
  } catch (err) {
    console.error("Activity log failed:", err);
  }
}