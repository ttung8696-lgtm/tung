import test from 'node:test';
import assert from 'node:assert/strict';
import * as G from '../petoria/game.js';
import { SCENES, findPath, walkable } from '../petoria/terrain.js';

const zero = () => 0;
const encounter = (s, id = 'brook', boss = false) => assert.equal(G.startBattle(s, id, boss, zero).ok, true);
function win(s) {
  while (s.battle.phase === 'fight') assert.ok(G.act(s, 'hit', zero).ok);
  assert.equal(s.battle.phase, 'won');
}

test('starts ready to explore, and a fresh save round-trips', () => {
  const s = G.newGame();
  assert.deepEqual(G.restoreGame(JSON.stringify(s)), s);
  assert.equal(G.activePet(s).hp, G.limits(G.activePet(s)).hp);
  assert.equal(G.isUnlocked(s, 'meadow'), true);
  assert.equal(G.isUnlocked(s, 'forest'), false);
});

test('invalid saves recover with a valid companion, map, items and stats', () => {
  for (const invalid of ['{', '{}', 'null', 'false', '{"version":9}'])
    assert.deepEqual(G.restoreGame(invalid), G.newGame());
  const s = G.restoreGame(
    JSON.stringify({
      version: 1,
      name: '<Tùng>',
      pets: [null, { id: '__proto__' }, { id: 'brook', level: -7, hp: -81, mp: 9999 }],
      bag: { berry: -1, dew: 9876 },
      pos: [-1, 999],
      active: 'who',
      area: 'toString',
      battle: { id: 'toString' },
      stats: { wins: 'NaN' },
    }),
  );
  assert.equal(s.active, 'brook');
  assert.equal(s.pets[0].level, 1);
  assert.equal(s.pets[0].mp, G.limits(s.pets[0]).mp);
  assert.equal(s.name, 'Tùng');
  assert.equal(s.area, 'meadow');
  assert.equal(s.battle, null);
  assert.equal(s.bag.berry, 0);
  assert.equal(s.bag.dew, 999);
  assert.equal(s.stats.wins, 0);
  assert.ok(G.rest(s).ok);
});

test('a turn spends MP, applies elemental advantage and survives reload', () => {
  const s = G.newGame();
  encounter(s);
  const max = G.limits(G.activePet(s));
  assert.equal(G.effective('sprig', 'brook'), true);
  assert.ok(G.act(s, 'skill', zero).ok);
  assert.equal(s.battle.hp, 15);
  assert.equal(G.activePet(s).mp, max.mp - 6);
  assert.equal(s.battle.turn, 2);
  assert.deepEqual(G.restoreGame(JSON.stringify(s)), s);
  G.activePet(s).mp = 0;
  const before = structuredClone(s);
  assert.equal(G.act(s, 'skill').ok, false);
  assert.deepEqual(s, before);
});

test('winning rewards exactly once, including after reloading a result screen', () => {
  let s = G.newGame();
  encounter(s);
  win(s);
  const gold = s.gold;
  assert.equal(s.stats.wins, 1);
  assert.ok(gold > 250);
  assert.ok(G.activePet(s).xp > 0);
  s = G.restoreGame(JSON.stringify(s));
  assert.equal(G.act(s, 'hit').ok, false);
  assert.equal(s.gold, gold);
  assert.ok(G.leaveBattle(s).ok);
  assert.equal(G.leaveBattle(s).ok, false);
  assert.equal(s.gold, gold);
});

test('a capture requires a seal and a weakened, unowned enemy; a new pet can lead', () => {
  const s = G.newGame();
  encounter(s);
  assert.equal(G.act(s, 'catch').ok, false);
  assert.equal(s.bag.seal, 2);
  assert.equal(s.battle.turn, 1);
  G.act(s, 'skill', zero);
  s.bag.seal = 0;
  assert.equal(G.act(s, 'catch').ok, false);
  s.bag.seal = 1;
  assert.ok(G.act(s, 'catch').ok);
  assert.equal(s.battle.phase, 'caught');
  assert.equal(s.stats.caught, 1);
  assert.equal(s.stats.wins, 1);
  assert.equal(s.bag.seal, 0);
  assert.equal(G.setCompanion(s, 'brook').ok, false);
  G.leaveBattle(s);
  assert.ok(G.setCompanion(s, 'brook').ok);
  assert.equal(s.active, 'brook');
  encounter(s);
  s.battle.hp = 1;
  s.bag.seal = 2;
  assert.equal(G.act(s, 'catch').ok, false);
  assert.equal(s.bag.seal, 2);
});

test('even a high-level trainer can weaken a low-level wild pet without knocking it out', () => {
  const s = G.newGame();
  s.pets = [G.makePet('sprig', 30)];
  encounter(s);
  G.act(s, 'spare', zero);
  assert.equal(s.battle.hp, 1);
  assert.equal(s.battle.phase, 'fight');
  assert.ok(G.act(s, 'catch').ok);
  assert.equal(s.pets.length, 2);
});

test('items, training, equipment and purchases validate costs and caps', () => {
  const s = G.newGame(),
    p = G.activePet(s),
    atk = G.limits(p).atk;
  assert.equal(G.useItem(s, 'berry').ok, false);
  assert.equal(s.bag.berry, 3);
  p.hp = 10;
  assert.ok(G.useItem(s, 'berry').ok);
  assert.equal(p.hp, 45);
  assert.equal(s.bag.berry, 2);
  assert.ok(G.buy(s, 'berry').ok);
  assert.equal(s.gold, 232);
  assert.equal(s.bag.berry, 3);
  assert.ok(G.buy(s, 'charm').ok);
  assert.equal(s.gems, 4);
  assert.equal(G.buy(s, 'charm').ok, false);
  assert.equal(G.limits(p).atk, atk + 3);
  assert.equal(G.buy(s, '__proto__').ok, false);
  assert.ok(G.train(s, true).ok);
  assert.equal(p.xp, 40);
  assert.equal(p.training, 1);
  assert.equal(s.gold, 207);
  p.training = 12;
  p.xp = 95;
  G.train(s, false);
  assert.equal(p.training, 12);
  assert.equal(p.level, 2);
  assert.equal(p.hp, G.limits(p).hp);
  s.gold = 0;
  assert.equal(G.train(s, true).ok, false);
  assert.equal(G.buy(s, 'berry').ok, false);
});

test('battle inventory costs a turn; escaping never grants a win or XP', () => {
  const s = G.newGame();
  encounter(s);
  const p = G.activePet(s);
  G.act(s, 'hit', zero);
  const turn = s.battle.turn;
  assert.ok(G.act(s, 'berry', zero).ok);
  assert.equal(s.battle.turn, turn + 1);
  assert.equal(s.bag.berry, 2);
  assert.equal(p.hp, 74);
  assert.equal(G.travel(s, 'meadow').ok, false);
  assert.equal(G.rest(s).ok, false);
  assert.equal(G.buy(s, 'seal').ok, false);
  assert.ok(G.act(s, 'flee').ok);
  G.leaveBattle(s);
  assert.equal(s.stats.wins, 0);
  assert.equal(p.xp, 0);
});

test('defeat safely returns to the village without deleting the party or wallet', () => {
  const s = G.newGame();
  s.stats.wins = 2;
  G.travel(s, 'forest');
  const p = G.activePet(s);
  p.hp = 1;
  encounter(s);
  G.act(s, 'hit', zero);
  assert.equal(s.battle.phase, 'lost');
  assert.equal(s.area, 'meadow');
  assert.equal(p.hp, G.limits(p).hp);
  assert.equal(s.gold, 250);
  assert.equal(s.stats.wins, 2);
});

test('area gates, ordered quests, and the mountain guardian can be completed', () => {
  const s = G.newGame();
  assert.equal(G.travel(s, 'highlands').ok, false);
  assert.equal(G.claim(s, 'debut').ok, false);
  for (let i = 0; i < 5; i++) {
    encounter(s);
    win(s);
    G.leaveBattle(s);
    G.rest(s);
  }
  assert.ok(G.isUnlocked(s, 'forest'));
  assert.ok(G.isUnlocked(s, 'highlands'));
  assert.ok(G.claim(s, 'debut').ok);
  assert.equal(G.claim(s, 'debut').ok, false);
  G.train(s);
  G.train(s);
  assert.ok(G.claim(s, 'gym').ok);
  encounter(s, 'cinder');
  while (s.battle.hp / s.battle.maxHp > 0.4) G.act(s, 'spare', zero);
  G.act(s, 'catch');
  G.leaveBattle(s);
  assert.ok(G.claim(s, 'friend').ok);
  G.rest(s);
  assert.ok(G.travel(s, 'highlands').ok);
  encounter(s, 'astra', true);
  assert.equal(G.act(s, 'catch').ok, false);
  let guard = 30;
  while (s.battle.phase === 'fight' && guard--) {
    const p = G.activePet(s);
    G.act(s, p.hp < 35 && s.bag.berry ? 'berry' : p.mp >= 6 ? 'skill' : 'hit', zero);
  }
  assert.equal(s.battle.phase, 'won');
  assert.equal(s.stats.bosses, 1);
  assert.ok(s.pets.some((p) => p.id === 'astra'));
  G.leaveBattle(s);
  assert.ok(G.claim(s, 'peak').ok);
  assert.equal(G.nextMission(s), undefined);
});

test('spawns and every encounter or village NPC are reachable without crossing walls', () => {
  for (const [id, a] of Object.entries(G.AREAS)) {
    assert.ok(walkable(id, ...a.spawn));
    for (const o of SCENES[id].actors) {
      const route = findPath(id, a.spawn, [o.x, o.y]);
      assert.ok(route.length, `${id}/${o.key}`);
      assert.deepEqual(route.at(-1), [o.x, o.y]);
      assert.ok(route.every((p) => walkable(id, ...p)));
    }
  }
  assert.equal(walkable('meadow', 84, 27), false); // middle of the river, not the bridge
  assert.ok(findPath('meadow', G.AREAS.meadow.spawn, [95, 52]).length > 0);
});
