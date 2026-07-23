export const lenisOptions = {
  lerp: 0.1,
  duration: 1.5,
  smoothWheel: true,
  wheelMultiplier: 1,
  touchMultiplier: 2,
  infinite: false,
  prevent: (node: Element) => {
    return (
      node.hasAttribute?.("data-lenis-prevent") ||
      node.classList?.contains("overflow-y-auto") ||
      node.tagName === "TEXTAREA"
    );
  },
};
