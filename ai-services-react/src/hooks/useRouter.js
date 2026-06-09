import { useEffect, useState } from "react";

export function useRouter() {
  const [route, setRoute] = useState(() => window.location.pathname);

  useEffect(() => {
    const onPopState = () => setRoute(window.location.pathname);
    window.addEventListener("popstate", onPopState);
    return () => window.removeEventListener("popstate", onPopState);
  }, []);

  const navigate = (path) => {
    window.history.pushState({}, "", path);
    setRoute(path);
  };

  return {
    activePath: route === "/" ? "/" : route.replace(/\/$/, ""),
    navigate,
  };
}
