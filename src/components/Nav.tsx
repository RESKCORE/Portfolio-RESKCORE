import { useEffect, useState } from 'react';
import { Triangle } from 'lucide-react';

export function Nav() {
  const [time, setTime] = useState(new Date());
  const [blink, setBlink] = useState(true);

  useEffect(() => {
    const timer = setInterval(() => {
      setTime(new Date());
      setBlink((b) => !b);
    }, 500);
    return () => clearInterval(timer);
  }, []);

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('en-US', {
      hour12: false,
      hour: '2-digit',
      minute: '2-digit',
      timeZone: 'Asia/Kolkata',
    }).split(':');
  };

  const [hours, minutes] = formatTime(time);

  return (
    <nav className="fixed top-0 left-0 w-full z-40 text-[var(--fg)] pointer-events-none">
      <div className="container flex justify-between items-center py-4 sm:py-6">
        <div className="text-left">
          <p className="type-mono m-0 text-[var(--fg)] text-[10px] sm:text-[11px] whitespace-nowrap tracking-wider">
            {hours} <span style={{ opacity: blink ? 1 : 0 }}>:</span> {minutes} IST
          </p>
        </div>
        <div className="text-right flex justify-end items-center">
          <p className="type-mono m-0 flex items-center justify-end gap-1.5 sm:gap-2 text-[var(--fg)] text-[10px] sm:text-[11px] whitespace-nowrap tracking-wider">
            <Triangle className="w-2.5 h-2.5 sm:w-3 sm:h-3 fill-current flex-shrink-0" /> [Vijayawada, IN]
          </p>
        </div>
      </div>
    </nav>
  );
}
