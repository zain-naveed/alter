import { useEffect, useCallback } from "react";

export default function useDebounce(
  effect: any,
  dependencies: string[],
  delay: number
) {
  // eslint-disable-next-line
  const callback = useCallback(effect, dependencies);
  useEffect(() => {
    const timeout = setTimeout(callback, delay);
    return () => clearTimeout(timeout);
  }, [callback, delay]);
}
