import { createContext, useState, useEffect } from "react";

export const FocusContext = createContext();

export function FocusProvider({ children }) {
  const [focusMinutes, setFocusMinutes] = useState(() => {
    return Number(localStorage.getItem("focusMinutes")) || 0;
  });

  useEffect(() => {
    localStorage.setItem("focusMinutes", focusMinutes);
  }, [focusMinutes]);

  return (
    <FocusContext.Provider
      value={{ focusMinutes, setFocusMinutes }}
    >
      {children}
    </FocusContext.Provider>
  );
}