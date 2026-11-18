// Petoria's rules are independent of the DOM, clock and storage.
export const SAVE_KEY = 'petoria.adventure.v1';
export const SPECIES = {
  sprig: {
    no: '001',
    name: 'Mộc Miêu',
    element: 'Mộc',
    icon: 'leaf',
    color: 'mint',
    skill: 'Lá xoáy',
    hp: 80,
    mp: 30,
    atk: 12,
  },
  cinder: {
    no: '002',
    name: 'Hỏa Kỳ',
    element: 'Hỏa',
    icon: 'flame',
    color: 'coral',
    skill: 'Tàn lửa',
    hp: 74,
    mp: 28,
    atk: 14,
  },
  brook: {
    no: '003',
    name: 'Lam Ly',
    element: 'Thủy',
    icon: 'droplets',
    color: 'sky',
    skill: 'Sóng ngọc',
    hp: 86,
    mp: 34,
    atk: 11,
  },
  astra: {
    no: '004',
    name: 'Tinh Hồ',
    element: 'Sao',
    icon: 'sparkles',
    color: 'violet',
    skill: 'Mưa sao',
    hp: 92,
    mp: 38,
    atk: 15,
  },
};
export const AREAS = {
  meadow: {
    no: '01',
    name: 'Làng Mầm Xanh',
    kind: 'Làng khởi đầu',
    range: '1–2',
    wins: 0,
    spawn: [46, 61],
    enemies: ['brook', 'cinder'],
    level: 1,
  },
  forest: {
    no: '02',
    name: 'Rừng Ngọc Bích',
    kind: 'Rừng cổ thụ',
    range: '2–3',
    wins: 2,
    spawn: [45, 57],
    enemies: ['sprig', 'brook'],
    level: 2,
  },
  highlands: {
    no: '03',
    name: 'Đồi Hổ Phách',
    kind: 'Lãnh địa thủ lĩnh',
    range: '4–5',
    wins: 5,
    spawn: [45, 55],
    enemies: ['cinder', 'sprig'],
    level: 4,
  },
};
export const ITEMS = {
  berry: { name: 'Quả mọng', detail: 'Hồi 35 HP cho linh thú.', price: 18, pay: 'gold', image: 'berry' },
  dew: { name: 'Sương lam', detail: 'Hồi 15 MP để dùng kỹ năng.', price: 22, pay: 'gold', image: 'dew' },
  seal: {
    name: 'Ấn kết bạn',
    detail: 'Thu phục thú hoang còn tối đa 40% HP.',
    price: 50,
    pay: 'gold',
    image: 'seal',
  },
  charm: {
    name: 'Bùa sao',
    detail: 'Trang bị ngay: thêm 3 sức đánh cho linh thú đang đồng hành.',
    price: 8,
    pay: 'gems',
    image: 'gem',
  },
};
export const MISSIONS = [
  {
    id: 'debut',
    name: 'Bước đầu chinh phục',
    detail: 'Thắng 2 trận với linh thú hoang.',
    stat: 'wins',
    target: 2,
    gold: 80,
    gems: 3,
  },
  {
    id: 'gym',
    name: 'Rèn luyện mỗi ngày',
    detail: 'Hoàn thành 2 buổi huấn luyện.',
    stat: 'trained',
    target: 2,
    gold: 75,
    gems: 4,
  },
  {
    id: 'friend',
    name: 'Một người bạn mới',
    detail: 'Dùng ấn kết bạn để thu phục 1 linh thú.',
    stat: 'caught',
    target: 1,
    gold: 100,
    gems: 5,
  },
  {
    id: 'peak',
    name: 'Ngôi sao trên đỉnh đồi',
    detail: 'Đánh bại Tinh Hồ ở Đồi Hổ Phách.',
    stat: 'bosses',
    target: 1,
    gold: 250,
    gems: 12,
  },
];
const has = (obj, key) => typeof key === 'string' && Object.hasOwn(obj, key);
const integer = (n, min, max, fallback = min) =>
  Number.isSafeInteger(n) ? Math.min(max, Math.max(min, n)) : fallback;
const ok = (message, extra = {}) => ({ ok: true, message, ...extra });
const fail = (message) => ({ ok: false, message });
export const isUnlocked = (s, id) => has(AREAS, id) && s.stats.wins >= AREAS[id].wins;
export const activePet = (s) => s.pets.find((p) => p.id === s.active);
export const nextMission = (s) => MISSIONS.find((m) => !s.claimed.includes(m.id));
export const progress = (s, m) => Math.min(m.target, s.stats[m.stat]);
export const xpNeeded = (p) => 80 + p.level * 20;
export function limits(p) {
  const def = SPECIES[p.id];
  return {
    hp: def.hp + (p.level - 1) * 9,
    mp: def.mp + (p.level - 1) * 3,
    atk: def.atk + (p.level - 1) * 3 + p.training + (p.charm ? 3 : 0),
  };
}
export function makePet(id, level = 1) {
  const p = { id, level, xp: 0, training: 0, charm: false };
  const max = limits(p);
  return { ...p, hp: max.hp, mp: max.mp };
}
export function newGame() {
  return {
    version: 1,
    name: 'Tân binh',
    gold: 250,
    gems: 12,
    sound: true,
    area: 'meadow',
    pos: [...AREAS.meadow.spawn],
    active: 'sprig',
    pets: [makePet('sprig')],
    bag: { berry: 3, dew: 2, seal: 2 },
    stats: { wins: 0, trained: 0, caught: 0, bosses: 0 },
    claimed: [],
    battle: null,
  };
}
export function cleanName(name) {
  return typeof name === 'string'
    ? [
        ...name
          .normalize('NFC')
          .replace(/[<>\u0000-\u001f\u007f]/g, '')
          .trim(),
      ]
        .slice(0, 18)
        .join('')
    : '';
}
// Treat old, malformed or partially written saves as data, not trusted HTML or game rules.
export function restoreGame(text) {
  const s = newGame();
  let raw;
  try {
    raw = JSON.parse(text);
  } catch {
    return s;
  }
  if (raw?.version !== 1 || !Array.isArray(raw.pets)) return s;
  s.name = cleanName(raw.name) || s.name;
  s.gold = integer(raw.gold, 0, 99999999, 250);
  s.gems = integer(raw.gems, 0, 999999, 12);
  s.sound = raw.sound !== false;
  for (const k of Object.keys(s.bag)) s.bag[k] = integer(raw.bag?.[k], 0, 999, s.bag[k]);
  for (const k of Object.keys(s.stats)) s.stats[k] = integer(raw.stats?.[k], 0, 999999);
  s.pets = [];
  for (const r of raw.pets) {
    if (!r || !has(SPECIES, r.id) || s.pets.some((p) => p.id === r.id)) continue;
    const p = makePet(r.id, integer(r.level, 1, 30));
    p.training = integer(r.training, 0, 12);
    p.charm = r.charm === true;
    const max = limits(p);
    p.hp = integer(r.hp, 0, max.hp, max.hp);
    p.mp = integer(r.mp, 0, max.mp, max.mp);
    p.xp = integer(r.xp, 0, xpNeeded(p) - 1);
    s.pets.push(p);
  }
  if (!s.pets.length) s.pets.push(makePet('sprig'));
  s.active = s.pets.some((p) => p.id === raw.active) ? raw.active : s.pets[0].id;
  if (isUnlocked(s, raw.area)) s.area = raw.area;
  s.pos =
    Array.isArray(raw.pos) &&
    raw.pos.length === 2 &&
    raw.pos.every((v) => Number.isFinite(v) && v >= 0 && v <= 100)
      ? raw.pos
      : [...AREAS[s.area].spawn];
  s.claimed = MISSIONS.filter((m) => Array.isArray(raw.claimed) && raw.claimed.includes(m.id)).map(
    (m) => m.id,
  );
  const b = raw.battle;
  if (b && has(SPECIES, b.id) && ['fight', 'won', 'lost', 'caught', 'escaped'].includes(b.phase)) {
    const max = integer(b.maxHp, 1, 500, 48);
    s.battle = {
      id: b.id,
      level: integer(b.level, 1, 30),
      boss: b.boss === true,
      maxHp: max,
      hp: integer(b.hp, 0, max),
      turn: integer(b.turn, 1, 9999),
      phase: b.phase,
      log: typeof b.log === 'string' ? b.log.slice(0, 380) : 'Đến lượt của bạn.',
      reward: {
        xp: integer(b.reward?.xp, 0, 10000),
        gold: integer(b.reward?.gold, 0, 10000),
        gems: integer(b.reward?.gems, 0, 1000),
      },
    };
    if (b.phase === 'fight' && (!activePet(s).hp || !s.battle.hp)) s.battle = null;
  }
  return s;
}
function addXp(p, amount) {
  const before = p.level;
  p.xp += amount;
  while (p.level < 30 && p.xp >= xpNeeded(p)) {
    p.xp -= xpNeeded(p);
    p.level++;
  }
  if (p.level === 30) p.xp = Math.min(p.xp, xpNeeded(p) - 1);
  if (p.level !== before) {
    const max = limits(p);
    p.hp = max.hp;
    p.mp = max.mp;
    return ` Lên cấp ${p.level}! HP và MP đã đầy.`;
  }
  return '';
}
export function travel(s, id) {
  if (s.battle) return fail('Hãy kết thúc trận đấu trước.');
  if (!isUnlocked(s, id)) return fail('Bạn chưa mở khóa khu vực này.');
  s.area = id;
  s.pos = [...AREAS[id].spawn];
  return ok(`Đã đến ${AREAS[id].name}.`);
}
export function setCompanion(s, id) {
  if (s.battle || !s.pets.some((p) => p.id === id)) return fail('Không thể đổi linh thú lúc này.');
  s.active = id;
  return ok(`${SPECIES[id].name} sẽ đồng hành cùng bạn.`);
}
export function rest(s) {
  if (s.battle) return fail('Không thể nghỉ giữa trận đấu.');
  travel(s, 'meadow');
  s.pets.forEach((p) => {
    const max = limits(p);
    p.hp = max.hp;
    p.mp = max.mp;
  });
  return ok('Đã nghỉ ở làng. Tất cả linh thú đã hồi đầy HP và MP!');
}
export function buy(s, id) {
  if (s.battle || !has(ITEMS, id)) return fail('Không thể mua vật phẩm này.');
  const item = ITEMS[id],
    p = activePet(s);
  if (id === 'charm' && p.charm) return fail('Linh thú này đã đeo bùa sao.');
  if (s.bag[id] >= 999) return fail('Ngăn vật phẩm này đã đầy.');
  if (s[item.pay] < item.price) return fail(`Không đủ ${item.pay === 'gold' ? 'vàng' : 'ngọc'}.`);
  s[item.pay] -= item.price;
  if (id === 'charm') p.charm = true;
  else s.bag[id]++;
  return ok(
    id === 'charm' ? `Đã trang bị Bùa sao cho ${SPECIES[p.id].name}.` : `Đã thêm ${item.name} vào túi đồ.`,
  );
}
function consume(s, id) {
  const p = activePet(s),
    max = limits(p);
  if (!['berry', 'dew'].includes(id) || !s.bag[id]) return fail('Không còn vật phẩm phù hợp.');
  const stat = id === 'berry' ? 'hp' : 'mp';
  if (p[stat] >= max[stat]) return fail(`${stat.toUpperCase()} đã đầy, vật phẩm chưa bị dùng.`);
  const n = Math.min(max[stat] - p[stat], id === 'berry' ? 35 : 15);
  p[stat] += n;
  s.bag[id]--;
  return ok(`Dùng ${ITEMS[id].name}, hồi ${n} ${stat.toUpperCase()}.`);
}
export function useItem(s, id) {
  return s.battle ? fail('Hãy dùng vật phẩm trong bảng chiến đấu.') : consume(s, id);
}
export function train(s, precise = false) {
  if (s.battle || s.gold < 25) return fail('Cần 25 vàng để huấn luyện ngoài trận đấu.');
  const p = activePet(s);
  s.gold -= 25;
  s.stats.trained++;
  const grows = p.training < 12;
  p.training = Math.min(12, p.training + 1);
  const xp = precise ? 40 : 24;
  return ok(
    `${precise ? 'Đúng nhịp!' : 'Hoàn thành!'} +${xp} EXP${grows ? ', +1 sức đánh' : ''}.${addXp(p, xp)}`,
  );
}
export function claim(s, id) {
  const q = nextMission(s);
  if (s.battle || !q || q.id !== id || progress(s, q) < q.target)
    return fail('Nhiệm vụ chưa thể nhận thưởng.');
  s.gold += q.gold;
  s.gems += q.gems;
  s.claimed.push(q.id);
  return ok(`Hoàn thành “${q.name}”! +${q.gold} vàng, +${q.gems} ngọc.`);
}
export function startBattle(s, enemy = null, boss = false, random = Math.random) {
  if (s.battle) return fail('Bạn đang ở trong một trận đấu.');
  const a = AREAS[s.area],
    p = activePet(s);
  if (p.hp <= 0) return fail('Linh thú cần nghỉ ở làng trước khi chiến đấu.');
  if (boss && s.area !== 'highlands') return fail('Thủ lĩnh chỉ xuất hiện ở Đồi Hổ Phách.');
  const id = boss
    ? 'astra'
    : a.enemies.includes(enemy)
      ? enemy
      : a.enemies[Math.floor(random() * a.enemies.length)];
  const level = boss ? 5 : a.level + (!a.enemies.includes(enemy) && random() > 0.72 ? 1 : 0),
    hp = boss ? 105 : 30 + level * 9;
  s.battle = {
    id,
    boss,
    level,
    maxHp: hp,
    hp,
    turn: 1,
    phase: 'fight',
    log: `${SPECIES[id].name} ${boss ? 'chặn đường lên đỉnh đồi' : 'hoang dã xuất hiện'}! Chọn hành động của bạn.`,
    reward: { xp: 0, gold: 0, gems: 0 },
  };
  return ok('Bắt đầu trận đấu!');
}
export function effective(attacker, defender) {
  return { Mộc: 'Thủy', Thủy: 'Hỏa', Hỏa: 'Mộc' }[SPECIES[attacker].element] === SPECIES[defender].element;
}
function finish(s, phase) {
  const b = s.battle,
    p = activePet(s);
  b.phase = phase;
  if (phase === 'escaped') {
    b.log = 'Bạn và linh thú đã rút lui an toàn.';
    return;
  }
  if (phase === 'lost') {
    b.log =
      'Bác giữ làng đã đưa cả đội về nghỉ. Linh thú đã khỏe lại, bạn không mất vật phẩm nào ngoài những món đã dùng.';
    s.area = 'meadow';
    s.pos = [...AREAS.meadow.spawn];
    p.hp = limits(p).hp;
    p.mp = limits(p).mp;
    return;
  }
  b.reward = {
    xp: 32 + b.level * 10 + (b.boss ? 38 : 0),
    gold: 20 + b.level * 8 + (b.boss ? 70 : 0),
    gems: b.boss ? 5 : 0,
  };
  s.gold += b.reward.gold;
  s.gems += b.reward.gems;
  s.stats.wins++;
  if (b.boss) s.stats.bosses++;
  const joins = (phase === 'caught' || b.boss) && !s.pets.some((t) => t.id === b.id);
  if (joins) {
    s.pets.push(makePet(b.id, b.level));
    if (phase === 'caught') s.stats.caught++;
  }
  b.log =
    (joins
      ? `${SPECIES[b.id].name} đã gia nhập đội của bạn!`
      : `${SPECIES[p.id].name} đã đánh bại ${SPECIES[b.id].name}!`) + addXp(p, b.reward.xp);
  const unlock = Object.values(AREAS).find((a) => a.wins === s.stats.wins);
  if (unlock) b.log += ` Mở khóa: ${unlock.name}.`;
}
export function act(s, action, random = Math.random) {
  const b = s.battle,
    p = activePet(s);
  if (!b || b.phase !== 'fight') return fail('Trận đấu không còn diễn ra.');
  if (action === 'flee') {
    finish(s, 'escaped');
    return ok(b.log);
  }
  if (action === 'catch') {
    if (b.boss) return fail('Hãy thắng trận để kết bạn với thủ lĩnh.');
    if (s.pets.some((t) => t.id === b.id)) return fail('Bạn đã có loài linh thú này.');
    if (!s.bag.seal) return fail('Bạn chưa có ấn kết bạn.');
    if (b.hp / b.maxHp > 0.4) return fail('Hãy hạ HP của thú hoang xuống 40% hoặc thấp hơn.');
    s.bag.seal--;
    finish(s, 'caught');
    return ok(b.log);
  }
  let log;
  if (action === 'hit' || action === 'skill') {
    const skill = action === 'skill';
    if (skill && p.mp < 6) return fail('Cần 6 MP để dùng kỹ năng.');
    if (skill) p.mp -= 6;
    const advantage = skill && effective(p.id, b.id),
      dmg = Math.max(
        1,
        Math.round((limits(p).atk + random() * 3) * (skill ? 1.5 : 1) * (advantage ? 1.35 : 1)),
      );
    b.hp = Math.max(0, b.hp - dmg);
    log = `${skill ? SPECIES[p.id].skill : 'Đòn đánh'} gây ${dmg} sát thương.${advantage ? ' Khắc hệ!' : ''}`;
    if (!b.hp) {
      finish(s, 'won');
      return ok(b.log, { damage: dmg });
    }
  } else if (action === 'spare') {
    if (b.hp === 1) return fail('Đối thủ chỉ còn 1 HP. Hãy dùng ấn kết bạn hoặc đánh thường.');
    const dmg = Math.min(b.hp - 1, Math.max(1, Math.floor(limits(p).atk * 0.8)));
    b.hp -= dmg;
    log = `Đòn nương tay gây ${dmg} sát thương, không đánh gục đối thủ.`;
  } else if (action === 'berry' || action === 'dew') {
    const r = consume(s, action);
    if (!r.ok) return r;
    log = r.message;
  } else return fail('Hành động không hợp lệ.');
  const dmg = (b.boss ? 11 : 4) + b.level * 2 + Math.floor(random() * 3) + (b.turn % 3 === 0 ? 3 : 0);
  p.hp = Math.max(0, p.hp - dmg);
  b.turn++;
  b.log = `${log} ${SPECIES[b.id].name} đáp trả: −${dmg} HP.`;
  if (!p.hp) finish(s, 'lost');
  return ok(b.log);
}
export function leaveBattle(s) {
  if (!s.battle || s.battle.phase === 'fight') return fail('Trận đấu vẫn đang diễn ra.');
  s.battle = null;
  return ok('Trở lại bản đồ.');
}
