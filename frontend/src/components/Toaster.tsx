import { useState } from "react";

export function Toaster() {
  const [toasts, setToasts] = useState<string[]>([]);

  function addToast(message: string) {
    setToasts(prev => [...prev, message]);
    setTimeout(() => setToasts(prev => prev.slice(1)), 3000);
  }

  (window as any).toast = addToast;

  return (
    <div className="fixed top-4 right-4 flex flex-col gap-2">
      {toasts.map((msg, i) => (
        <div key={i} className="bg-green-600 text-white px-4 py-2 rounded shadow">
          {msg}
        </div>
      ))}
    </div>
  );
}
