// Coordinates are percentages of the original artwork, independent of the camera crop.
export const SCENES = {
  meadow: {
    ground: [
      [
        [1, 47],
        [16, 46],
        [17, 36],
        [21, 36],
        [22, 45],
        [34, 45],
        [37, 41],
        [46, 41],
        [47, 34],
        [51, 34],
        [52, 40],
        [59, 40],
        [61, 45],
        [72, 45],
        [70, 35],
        [71, 26],
        [75, 30],
        [79, 46],
        [79, 59],
        [77, 61],
        [79, 74],
        [75, 80],
        [69, 84],
        [64, 84],
        [60, 94],
        [55, 92],
        [54, 99],
        [48, 99],
        [47, 91],
        [39, 86],
        [31, 82],
        [23, 80],
        [18, 77],
        [14, 80],
        [10, 75],
        [6, 65],
        [3, 57],
        [1, 55],
      ],
      [
        [76, 48],
        [94, 48],
        [94, 56],
        [76, 56],
      ],
      [
        [91, 44],
        [99, 43],
        [99, 69],
        [96, 68],
        [92, 61],
        [90, 55],
      ],
    ],
    actors: [
      {
        key: 'merchant',
        kind: 'shop',
        name: 'Bác Thảo · Cửa hàng',
        art: 'elder',
        x: 19,
        y: 48,
        badge: 'shop',
      },
      { key: 'notice', kind: 'missions', name: 'Bảng nhiệm vụ', art: 'board', x: 53, y: 41.7, badge: '!' },
      { key: 'wild-a', kind: 'battle', name: 'Lam Ly hoang dã', art: 'brook', x: 70, y: 73, badge: 'Lv.1' },
      { key: 'wild-b', kind: 'battle', name: 'Hỏa Kỳ hoang dã', art: 'cinder', x: 30, y: 69, badge: 'Lv.1' },
    ],
  },
  forest: {
    ground: [
      [
        [1, 43],
        [16, 43],
        [19, 34],
        [24, 27],
        [36, 32],
        [39, 42],
        [54, 42],
        [59, 49],
        [62, 56],
        [75, 56],
        [79, 45],
        [88, 40],
        [93, 45],
        [99, 45],
        [99, 54],
        [89, 55],
        [80, 63],
        [77, 76],
        [69, 77],
        [63, 71],
        [59, 67],
        [51, 67],
        [48, 80],
        [44, 87],
        [42, 99],
        [36, 99],
        [35, 86],
        [38, 74],
        [39, 64],
        [33, 58],
        [24, 55],
        [17, 55],
        [11, 62],
        [4, 61],
        [1, 57],
      ],
      [
        [44, 56],
        [62, 55],
        [66, 65],
        [47, 68],
      ],
    ],
    actors: [
      { key: 'elder', kind: 'rest', name: 'Người dẫn đường', art: 'elder', x: 25, y: 42, badge: '…' },
      { key: 'wild-a', kind: 'battle', name: 'Mộc Miêu hoang dã', art: 'sprig', x: 62, y: 61, badge: 'Lv.2' },
      { key: 'wild-b', kind: 'battle', name: 'Lam Ly hoang dã', art: 'brook', x: 38, y: 78, badge: 'Lv.2' },
    ],
  },
  highlands: {
    ground: [
      [
        [1, 36],
        [10, 33],
        [17, 30],
        [18, 24],
        [22, 24],
        [22, 34],
        [28, 34],
        [31, 45],
        [40, 47],
        [50, 45],
        [57, 47],
        [62, 52],
        [70, 51],
        [74, 57],
        [78, 61],
        [85, 65],
        [99, 66],
        [99, 77],
        [88, 75],
        [79, 72],
        [76, 81],
        [71, 85],
        [67, 78],
        [59, 78],
        [57, 87],
        [53, 96],
        [48, 96],
        [48, 86],
        [38, 85],
        [30, 79],
        [25, 77],
        [19, 83],
        [14, 80],
        [11, 72],
        [12, 63],
        [20, 56],
        [26, 54],
        [27, 49],
        [23, 39],
        [16, 40],
        [7, 44],
        [1, 44],
      ],
    ],
    actors: [
      { key: 'boss', kind: 'boss', name: 'Tinh Hồ · Thủ lĩnh', art: 'astra', x: 66, y: 65, badge: '★ BOSS' },
      { key: 'wild-a', kind: 'battle', name: 'Hỏa Kỳ hoang dã', art: 'cinder', x: 30, y: 72, badge: 'Lv.4' },
      { key: 'wild-b', kind: 'battle', name: 'Mộc Miêu hoang dã', art: 'sprig', x: 34, y: 50, badge: 'Lv.4' },
    ],
  },
};
export const ASPECT = 896 / 500;
export const distance = (a, b) => Math.hypot(a[0] - b[0], (a[1] - b[1]) / ASPECT);
function inside(x, y, polygon) {
  let hit = false;
  for (let i = 0, j = polygon.length - 1; i < polygon.length; j = i++) {
    const [a, b] = polygon[i],
      [c, d] = polygon[j];
    if (b > y !== d > y && x < ((c - a) * (y - b)) / (d - b) + a) hit = !hit;
  }
  return hit;
}
export const walkable = (area, x, y) => SCENES[area].ground.some((poly) => inside(x, y, poly));
const COLS = 76,
  ROWS = 43,
  gridCache = new Map();
const point = (i) => [(((i % COLS) + 0.5) * 100) / COLS, ((Math.floor(i / COLS) + 0.5) * 100) / ROWS];
function grid(area) {
  if (!gridCache.has(area))
    gridCache.set(
      area,
      Uint8Array.from({ length: COLS * ROWS }, (_, i) => +walkable(area, ...point(i))),
    );
  return gridCache.get(area);
}
function nearest(g, p) {
  let index = -1,
    min = Infinity;
  for (let i = 0; i < g.length; i++)
    if (g[i]) {
      const d = distance(point(i), p);
      if (d < min) {
        min = d;
        index = i;
      }
    }
  return index;
}
// Route around buildings, trees and water, not in a straight line through the scenery.
export function findPath(area, from, to) {
  const g = grid(area),
    start = nearest(g, from),
    end = nearest(g, to);
  if (end < 0 || distance(point(end), to) > 5.5) return [];
  const prev = new Int32Array(g.length).fill(-1),
    queue = [start];
  prev[start] = start;
  for (let k = 0; k < queue.length && prev[end] === -1; k++) {
    const i = queue[k],
      col = i % COLS;
    for (const [dx, dy] of [
      [-1, 0],
      [1, 0],
      [0, -1],
      [0, 1],
      [1, 1],
      [1, -1],
      [-1, 1],
      [-1, -1],
    ]) {
      const j = i + dx + dy * COLS;
      if (col + dx < 0 || col + dx >= COLS || !g[j] || prev[j] !== -1) continue;
      if (dx && dy && (!g[i + dx] || !g[i + dy * COLS])) continue;
      prev[j] = i;
      queue.push(j);
    }
  }
  if (prev[end] === -1) return [];
  const path = [];
  for (let i = end; i !== start; i = prev[i]) path.push(point(i));
  path.reverse();
  path.push(walkable(area, ...to) ? to : point(end));
  return path;
}
