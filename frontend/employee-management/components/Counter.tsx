import { useState, useEffect } from 'react';

export default function Counter({ title, value, color, textColor }: { title: string, value: number, color: string, textColor: string }) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    const duration = 2000; // 2 seconds
    const steps = 60;
    const increment = value / steps;
    const stepDuration = duration / steps;

    let currentStep = 0;
    const timer = setInterval(() => {
      currentStep++;
      if (currentStep <= steps) {
        setCount(Math.min(Math.ceil(increment * currentStep), value));
      } else {
        setCount(value);
        clearInterval(timer);
      }
    }, stepDuration);

    return () => clearInterval(timer);
  }, [value]);

  return (
    <div className={`w-full h-36  rounded-2xl overflow-hidden hover:shadow-2xl transition-all duration-300 p-6 ${color}`}>
      <h1 className={`text-2xl ${textColor}`}>{title}</h1>
      <p className={`text-3xl  ${textColor}`}>{count.toLocaleString()}</p>
    </div>
  );
}