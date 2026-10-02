/**
 * One shared IntersectionObserver for every reveal on the page.
 * Fires once per element at 12% visibility with a -12% bottom margin (spec 00), then stops watching it.
 */

type Callback = () => void;

const callbacks = new WeakMap<Element, Callback>();
let observer: IntersectionObserver | null = null;

function getObserver(): IntersectionObserver {
  observer ??= new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        if (!entry.isIntersecting) continue;
        const cb = callbacks.get(entry.target);
        observer?.unobserve(entry.target);
        callbacks.delete(entry.target);
        cb?.();
      }
    },
    { rootMargin: "0px 0px -12% 0px", threshold: 0.12 },
  );
  return observer;
}

/** Call `onEnter` once when `el` enters the viewport. Returns a cleanup function. */
export function observeOnce(el: Element, onEnter: Callback): () => void {
  callbacks.set(el, onEnter);
  getObserver().observe(el);
  return () => {
    callbacks.delete(el);
    observer?.unobserve(el);
  };
}
