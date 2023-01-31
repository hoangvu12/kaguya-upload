import React, { useEffect, useState } from "react";
import ReactDOM from "react-dom";

interface PortalProps {
  children: React.ReactNode;
  selector?: string;
  retryInterval?: number;
}

const Portal: React.FC<PortalProps> = ({
  children,
  selector = "body",
  retryInterval,
}) => {
  const [el, setEl] = useState(null);

  useEffect(() => {
    const element = document.querySelector(selector);
    setEl(element);

    if (!element) {
      if (!retryInterval) return;

      const timeout = setTimeout(() => {
        const element = document.querySelector(selector);

        if (!element) return;

        clearTimeout(timeout);

        setEl(element);
      }, retryInterval);
    }
  }, [retryInterval, selector]);

  return el ? ReactDOM.createPortal(children, el) : null;
};

export default React.memo(Portal);
