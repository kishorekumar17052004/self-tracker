import { useState, useEffect } from "react";

const PREFIX = "selftracker:";

/**
 * Generic localStorage-backed useState. Reads the initial value once,
 * then keeps localStorage in sync on every change.
 */
export default function useLocalStorage(key, defaultValue) {
  const fullKey = `${PREFIX}${key}`;

  const [value, setValue] = useState(() => {
    try {
      const stored = window.localStorage.getItem(fullKey);
      return stored !== null ? JSON.parse(stored) : defaultValue;
    } catch (err) {
      console.warn(`Could not read localStorage key "${fullKey}"`, err);
      return defaultValue;
    }
  });

  useEffect(() => {
    try {
      window.localStorage.setItem(fullKey, JSON.stringify(value));
    } catch (err) {
      console.warn(`Could not write localStorage key "${fullKey}"`, err);
    }
  }, [fullKey, value]);

  return [value, setValue];
}
