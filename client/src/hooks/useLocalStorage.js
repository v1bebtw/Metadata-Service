import { useEffect, useState } from 'react';

export function useLocalStorage(key, initialValue) {
  const [value, setValue] = useState(initialValue);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(key);
      if (raw) {
        const parsed = JSON.parse(raw);
        if (Array.isArray(parsed) || (parsed && typeof parsed === 'object')) {
          setValue(parsed);
        }
      }
    } catch {
      setValue(initialValue);
    }
    setReady(true);
  }, [key]);

  useEffect(() => {
    if (!ready) return;
    localStorage.setItem(key, JSON.stringify(value));
  }, [key, value, ready]);

  return [value, setValue];
}
