import dayjs from "dayjs";
import React, { useEffect, useState } from "react";

interface TimeProps {
  children(time: number): React.ReactNode;
  time: number;
}

const Time: React.FC<TimeProps> = ({ children, time }) => {
  const [timeRemaining, setTimeRemaining] = useState<number>(0);

  useEffect(() => {
    const interval = setInterval(() => {
      const currentTime = dayjs().unix();
      const remaining = time - currentTime;

      if (remaining <= 0) {
        clearInterval(interval);
      }

      setTimeRemaining(remaining);
    }, 1000);

    return () => {
      clearInterval(interval);
    };
  }, [time]);

  return <React.Fragment>{children(timeRemaining)}</React.Fragment>;
};

export default Time;
