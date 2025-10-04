import { useEffect } from 'react';

export function useRechartsResizeFix() {
  useEffect(() => {
    const fire = () => window.dispatchEvent(new Event('resize'));
    const t1 = setTimeout(fire, 100);
    const t2 = setTimeout(fire, 400);
    const t3 = setTimeout(fire, 1000);
    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
    };
  }, []);
}

