import { useEffect } from "react";

/** Adds `is-visible` to every `.reveal` element as it scrolls into view. */
export function useReveal() {
  useEffect(() => {
    const nodes = Array.from(document.querySelectorAll<HTMLElement>(".reveal"));
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            io.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.15 },
    );
    nodes.forEach((n) => io.observe(n));
    return () => io.disconnect();
  }, []);
}
