import { useMatches } from "react-router";
import { useMemo } from "react";

export function useMatchesData(id: string) {
  const matches = useMatches();

  const route = useMemo(
    () => matches.find((route) => route.id === id),
    [id, matches]
  ); // only recompute if id or matches change on every render

  return route?.data;
}
