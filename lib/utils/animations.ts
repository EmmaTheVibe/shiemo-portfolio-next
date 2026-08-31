import { gsap } from "gsap";

type StaggeredRevealOptions = {
  selector: string;
  x?: number;
  y?: number;
  scale?: number;
  duration?: number;
  stagger?: number;
  threshold?: number;
  rootMargin?: string;
};

export function animateStaggeredItems(
  section: HTMLElement,
  {
    selector,
    x = 0,
    y = 0,
    scale = 1,
    duration = 0.7,
    stagger = 0.1,
    threshold = 0.15,
    rootMargin = "0px 0px -80px 0px",
  }: StaggeredRevealOptions,
) {
  const items = gsap.utils.toArray<HTMLElement>(selector, section);
  const prefersReducedMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)",
  );
  let observer: IntersectionObserver | undefined;
  const queuedItems = new Set<HTMLElement>();
  let animationFrame = 0;

  function flushQueuedItems() {
    animationFrame = 0;
    const batch = items.filter((item) => queuedItems.has(item));
    queuedItems.clear();

    gsap.to(batch, {
      autoAlpha: 1,
      x: 0,
      y: 0,
      scale: 1,
      duration,
      ease: "power3.out",
      stagger,
      onComplete: () => {
        gsap.set(batch, { clearProps: "transform,willChange" });
      },
    });
  }

  const ctx = gsap.context(() => {
    if (!items.length) return;

    if (prefersReducedMotion.matches) {
      gsap.set(items, {
        autoAlpha: 1,
        x: 0,
        y: 0,
        scale: 1,
        clearProps: "transform,willChange",
      });
      return;
    }

    gsap.set(items, { autoAlpha: 0, x, y, scale, willChange: "transform" });

    observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue;
          const item = entry.target as HTMLElement;
          queuedItems.add(item);
          observer?.unobserve(item);
        }
        if (queuedItems.size && !animationFrame) {
          animationFrame = requestAnimationFrame(flushQueuedItems);
        }
      },
      { threshold, rootMargin },
    );

    items.forEach((item) => observer?.observe(item));
  }, section);

  return () => {
    if (animationFrame) cancelAnimationFrame(animationFrame);
    observer?.disconnect();
    ctx.revert();
  };
}

export function animateProjectCards(section: HTMLElement) {
  return animateStaggeredItems(section, {
    selector: ".card-wrapper",
    y: 36,
    duration: 0.75,
    stagger: 0.12,
  });
}
