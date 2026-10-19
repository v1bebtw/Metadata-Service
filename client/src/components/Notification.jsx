import { useEffect } from 'react';

function Notification({ message, onClose }) {
  useEffect(() => {
    if (!message) return undefined;
    const timer = setTimeout(onClose, 2200);
    return () => clearTimeout(timer);
  }, [message, onClose]);

  if (!message) return null;

  return <div className="notice">{message}</div>;
}

export default Notification;
