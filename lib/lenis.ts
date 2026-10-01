// Tiny shared handle to the app's single Lenis smooth-scroll instance, so overlays
// (e.g. the project detail modal) can pause page scrolling while they're open. Lenis
// hijacks the wheel, so `body { overflow: hidden }` alone does NOT stop the background.

type LenisLike = { stop: () => void; start: () => void };

let instance: LenisLike | null = null;

export const setLenis = (l: LenisLike | null) => {
    instance = l;
};

export const getLenis = () => instance;
