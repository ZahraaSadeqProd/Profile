// Chapter lengths (in viewport heights) drive both the HTML sections and the camera.
export const CHAPTERS = [
  { id: "hero", vh: 150 },
  { id: "shoulder", vh: 70 },
  { id: "sappers", vh: 200 },
  { id: "raytheon", vh: 200 },
  { id: "nesvia", vh: 240 },
  { id: "swazona", vh: 240 },
  { id: "finale", vh: 220 },
] as const;

export type ChapterId = (typeof CHAPTERS)[number]["id"];

const TOTAL = CHAPTERS.reduce((s, c) => s + c.vh, 0);
const SCROLLABLE = TOTAL - 100;

export const STORY_VH = TOTAL;

const ranges: Record<string, [number, number]> = {};
{
  let acc = 0;
  for (const c of CHAPTERS) {
    ranges[c.id] = [acc / SCROLLABLE, Math.min(1, (acc + c.vh) / SCROLLABLE)];
    acc += c.vh;
  }
}
export const range = (id: ChapterId) => ranges[id];

/** 0..1 progress through one chapter, given overall story progress. */
export function local(p: number, id: ChapterId) {
  const [a, b] = ranges[id];
  return Math.min(1, Math.max(0, (p - a) / (b - a)));
}

/** Shared, mutable scroll state written by the page and read inside the render loop. */
export const story = { target: 0, p: 0, open: 0, active: true, reduced: false };
