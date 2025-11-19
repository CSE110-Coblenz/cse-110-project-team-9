import { vi } from "vitest";

vi.stubGlobal("document", {
  createElement: (tag: string) => {
    if (tag === "video") {
      return {
        style: {},
        load: () => {},
        play: () => {},
        pause: () => {},
        setAttribute: () => {},
      };
    }
    if (tag === "canvas") {
      return {
        getContext: () => ({
          font: "",
          fillStyle: "",
          measureText: () => ({ width: 0 }),
          fillRect: () => {},
          drawImage: () => {},
        }),
      };
    }
    return {};
  },
});

vi.stubGlobal("window", {});