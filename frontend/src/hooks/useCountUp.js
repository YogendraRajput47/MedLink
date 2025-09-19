import { useEffect, useState, useRef } from "react";

export default function useCountUp(end, duration = 2000, threshold = 0.5) {
  const [count, setCount] = useState(0);
  const ref = useRef(null);

  useEffect(() => {
    let timer;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          // reset count each time section enters view
          setCount(0);
          let start = 0;
          const stepTime = Math.abs(Math.floor(duration / end));

          timer = setInterval(() => {
            start += 1;
            setCount(start);
            if (start >= end) clearInterval(timer);
          }, stepTime);
        } else {
          // reset if you want it to restart from 0 next time
          setCount(0);
          clearInterval(timer);
        }
      },
      { threshold }
    );

    if (ref.current) observer.observe(ref.current);

    return () => {
      clearInterval(timer);
      observer.disconnect();
    };
  }, [end, duration, threshold]);

  return { count, ref };
}
