import { useEffect, useLayoutEffect, useRef, useState } from "react";

export function isRunningOnServer() {
  return typeof window === "undefined";
}

export const useServerLayoutEffect = isRunningOnServer()
  ? useEffect
  : useLayoutEffect;

let hasHydrated = false;
export function useIsHydrated() {
  const [isHydrated, setIsHydrated] = useState(hasHydrated);

  useEffect(() => {
    hasHydrated = true;
    setIsHydrated(true);
  }, []);

  return isHydrated;
}

export function useDebounce<T extends Array<any>>(
  fn: (...arg: T) => unknown,
  time: number
) {
  const timeoutId = useRef<number>();

  const debouncedFn = (...args: T) => {
    window.clearTimeout(timeoutId.current);
    timeoutId.current = window.setTimeout(() => {
      fn(...args);
    }, time);
  };
  return debouncedFn;
}
