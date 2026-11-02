import { useEffect } from 'react';

function Notification({ message, tone = 'ok', onClose }) {
  useEffect(() => {
    if (!message) return undefined;
    const timer = setTimeout(onClose, tone === 'error' ? 4000 : 2200);
    return () => clearTimeout(timer);
  }, [message, tone, onClose]);

  if (!message) return null;

  return (
    <div className={tone === 'error' ? 'notice notice-error' : 'notice'}>
      {message}
    </div>
  );
}

export default Notification;
