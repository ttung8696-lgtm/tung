import * as G from './game.js';
import * as UI from './ui.js';
import { mountWorld } from './world.js';

const $ = (id) => document.getElementById(id);
for (const el of document.querySelectorAll('i[data-i],i[data-p]'))
  el.outerHTML = el.dataset.i ? UI.ic(el.dataset.i) : UI.px(el.dataset.p);
let state,
  canSave = true;
try {
  state = G.restoreGame(localStorage.getItem(G.SAVE_KEY));
} catch {
  canSave = false;
  state = G.newGame();
}
const dialog = $('dialog'),
  content = $('dialog-content'),
  toast = $('toast');
let view = '',
  battlePack = false,
  guideTab = 'play',
  workoutStart = null,
  workoutMsg = '',
  needleFrame = 0,
  toastTimer = 0,
  audio = null,
  world,
  hitLock = 0;
function status() {
  $('save-state').innerHTML = canSave
    ? UI.ic('check-check') + ' Tự động lưu trên thiết bị'
    : UI.ic('circle-alert') + ' Không lưu được trên thiết bị';
}
function save() {
  const before = canSave;
  try {
    localStorage.setItem(G.SAVE_KEY, JSON.stringify(state));
    canSave = true;
  } catch {
    canSave = false;
  }
  if (canSave !== before) status();
}
function chirp(sound = 'tap') {
  if (!state.sound) return;
  try {
    const Audio = window.AudioContext || window.webkitAudioContext;
    if (!Audio) return;
    audio ??= new Audio();
    if (audio.state === 'suspended') audio.resume().catch(() => {});
    const melody = {
      tap: [440],
      fight: [330, 440, 570],
      hit: [180, 120],
      skill: [420, 650, 820],
      win: [440, 554, 659, 880],
      coin: [660, 880],
      heal: [392, 494, 587],
      step: [340],
    }[sound] || [440];
    melody.forEach((hz, i) => {
      const osc = audio.createOscillator(),
        gain = audio.createGain(),
        t = audio.currentTime + i * 0.065;
      osc.type = 'triangle';
      osc.frequency.value = hz;
      gain.gain.setValueAtTime(0.0001, t);
      gain.gain.exponentialRampToValueAtTime(0.06, t + 0.009);
      gain.gain.exponentialRampToValueAtTime(0.0001, t + 0.12);
      osc.connect(gain);
      gain.connect(audio.destination);
      osc.start(t);
      osc.stop(t + 0.14);
    });
  } catch {
    /* Audio is optional on browsers that block it. */
  }
}
function notify(text) {
  (dialog.open ? dialog : document.body).append(toast);
  clearTimeout(toastTimer);
  toast.textContent = text;
  toast.classList.add('show');
  toastTimer = setTimeout(() => {
    toast.classList.remove('show');
    toast.textContent = '';
  }, 3400);
}
function hud() {
  $('gold').textContent = UI.num(state.gold);
  $('gems').textContent = UI.num(state.gems);
  $('trainer-name').textContent = state.name;
  $('companion-info').innerHTML = UI.companion(state);
  $('mission-info').innerHTML = UI.missionCard(state);
  const sound = $('sound');
  sound.innerHTML = UI.ic(state.sound ? 'volume-2' : 'volume-x');
  sound.title = state.sound ? 'Tắt âm thanh' : 'Bật âm thanh';
  sound.setAttribute('aria-label', sound.title);
  sound.setAttribute('aria-pressed', String(state.sound));
  world?.sync();
}
function needleValue() {
  const t = ((performance.now() - workoutStart) / 1150) % 2;
  return t <= 1 ? t : 2 - t;
}
function animateNeedle() {
  const needle = $('needle');
  if (view !== 'gym' || workoutStart === null || !needle) return;
  needle.style.left = `calc(${(needleValue() * 100).toFixed(1)}% - 2px)`;
  needleFrame = requestAnimationFrame(animateNeedle);
}
const screens = {
  maps: UI.maps,
  team: UI.team,
  care: UI.care,
  shop: UI.shop,
  bag: UI.bag,
  missions: UI.missions,
  profile: UI.profile,
  battle: () => UI.battle(state, battlePack),
  guide: () => UI.guide(guideTab),
  gym: () => UI.gym(state, workoutStart !== null, workoutMsg),
};
function paintDialog(next) {
  if (!Object.hasOwn(screens, next)) return;
  const same = dialog.open && view === next,
    scroll = same ? dialog.scrollTop : 0;
  const focused = same ? document.activeElement?.closest('button[data-do]') : null;
  const prevDo = focused?.dataset.do,
    prevId = focused?.dataset.id;
  if (!same) {
    world?.stop();
    workoutStart = null;
    workoutMsg = '';
  }
  cancelAnimationFrame(needleFrame);
  view = next;
  content.innerHTML = screens[next](state);
  dialog.classList.toggle('wide', next === 'battle');
  if (!dialog.open) dialog.showModal();
  document.body.classList.add('no-scroll');
  // Keep keyboard focus on the action after an update, without jumping the page.
  const replacement =
    prevDo &&
    [...content.querySelectorAll('button[data-do]:not(:disabled)')].find(
      (b) => b.dataset.do === prevDo && b.dataset.id === prevId,
    );
  (replacement || $('dialog-title')).focus({ preventScroll: true });
  dialog.scrollTop = scroll;
  if (next === 'gym' && workoutStart !== null) animateNeedle();
}
function open(next) {
  paintDialog(state.battle ? 'battle' : next);
}
function closeView() {
  if (state.battle) {
    if (state.battle.phase === 'fight') {
      if (battlePack) {
        battlePack = false;
        paintDialog('battle');
        return;
      }
      notify('Dùng Rút lui để rời trận đấu.');
      return;
    }
    finishBattle();
    return;
  }
  view = '';
  workoutStart = null;
  workoutMsg = '';
  cancelAnimationFrame(needleFrame);
  if (dialog.open) dialog.close();
  document.body.append(toast);
  document.body.classList.toggle('no-scroll', $('map-card').classList.contains('expanded'));
}
dialog.addEventListener('cancel', (e) => {
  e.preventDefault();
  closeView();
});
dialog.addEventListener('click', (e) => {
  if (e.target !== dialog) return;
  const r = dialog.getBoundingClientRect();
  if (e.clientX < r.left || e.clientX > r.right || e.clientY < r.top || e.clientY > r.bottom) closeView();
});
function changed(result, { sound = 'tap', refresh = true, tell = true } = {}) {
  if (!result.ok) {
    notify(result.message);
    return false;
  }
  save();
  hud();
  chirp(sound);
  if (refresh && dialog.open && view) paintDialog(view);
  if (tell) notify(result.message);
  return true;
}
function fight(id = null, boss = false) {
  const r = G.startBattle(state, id, boss);
  if (!r.ok) {
    notify(r.message);
    return;
  }
  hitLock = 0;
  battlePack = false;
  save();
  hud();
  chirp('fight');
  open('battle');
}
function finishBattle() {
  const r = G.leaveBattle(state);
  if (!r.ok) {
    notify(r.message);
    return;
  }
  save();
  closeView();
  world.reset();
  hud();
}
function travel(id) {
  const r = G.travel(state, id);
  if (!r.ok) {
    notify(r.message);
    return;
  }
  closeView();
  world.reset();
  changed(r, { refresh: false });
}
function expand() {
  const up = $('map-card').classList.toggle('expanded');
  document.body.classList.toggle('no-scroll', up);
  const btn = $('expand');
  btn.innerHTML = UI.ic(up ? 'minimize' : 'maximize');
  btn.title = up ? 'Thu nhỏ bản đồ' : 'Mở rộng bản đồ';
  btn.setAttribute('aria-label', btn.title);
  btn.setAttribute('aria-pressed', String(up));
  world.resize();
  $('stage').focus({ preventScroll: true });
}
function train(precise) {
  const r = G.train(state, precise);
  workoutStart = null;
  workoutMsg = r.message;
  changed(r, { sound: 'heal', tell: false });
}
function handle(action, id) {
  switch (action) {
    case 'world':
      closeView();
      $('stage').focus({ preventScroll: true });
      return;
    case 'close':
      closeView();
      return;
    case 'sound':
      state.sound = !state.sound;
      save();
      hud();
      chirp();
      notify(state.sound ? 'Đã bật âm thanh.' : 'Đã tắt âm thanh.');
      return;
    case 'fight':
      fight();
      return;
    case 'maps':
    case 'guide':
    case 'shop':
    case 'bag':
    case 'profile':
    case 'team':
    case 'care':
    case 'missions':
    case 'gym':
      open(action);
      return;
    case 'guide-tab':
      if (['play', 'fight', 'travel'].includes(id)) {
        guideTab = id;
        paintDialog('guide');
      }
      return;
    case 'expand':
      expand();
      return;
    case 'travel':
      travel(id);
      return;
    case 'rest': {
      const r = G.rest(state);
      if (r.ok) {
        closeView();
        world.reset();
      }
      changed(r, { sound: 'heal', refresh: false });
      return;
    }
    case 'buy':
      changed(G.buy(state, id), { sound: 'coin' });
      return;
    case 'use':
      changed(G.useItem(state, id), { sound: 'heal' });
      return;
    case 'switch':
      changed(G.setCompanion(state, id));
      return;
    case 'claim':
      changed(G.claim(state, id), { sound: 'win' });
      return;
    case 'gym-start':
      if (state.gold < 25) return;
      workoutStart = performance.now();
      workoutMsg = '';
      chirp();
      paintDialog('gym');
      return;
    case 'gym-stop':
      if (workoutStart !== null) {
        const v = needleValue();
        train(v >= 0.36 && v <= 0.64);
      }
      return;
    case 'gym-basic':
      train(false);
      return;
    case 'battle-bag':
    case 'battle-back':
      if (state.battle?.phase === 'fight') {
        battlePack = action === 'battle-bag';
        paintDialog('battle');
      }
      return;
    case 'act': {
      if (performance.now() < hitLock) return;
      const r = G.act(state, id);
      if (!r.ok) {
        notify(r.message);
        return;
      }
      hitLock = performance.now() + 210;
      battlePack = false;
      changed(r, {
        sound:
          state.battle.phase === 'won' || state.battle.phase === 'caught'
            ? 'win'
            : id === 'hit'
              ? 'hit'
              : id === 'skill'
                ? 'skill'
                : 'tap',
        tell: false,
      });
      if (state.battle.phase === 'fight') content.querySelector('.fighter.them')?.classList.add('strike');
      return;
    }
    case 'battle-done':
      finishBattle();
      return;
  }
}
document.addEventListener('click', (e) => {
  const btn = e.target.closest('button[data-do]');
  if (btn && !btn.disabled) handle(btn.dataset.do, btn.dataset.id);
});
document.addEventListener('submit', (e) => {
  if (e.target.id !== 'name-form') return;
  e.preventDefault();
  const name = G.cleanName($('new-name').value);
  if (!name) {
    notify('Hãy nhập tên huấn luyện viên.');
    return;
  }
  state.name = name;
  changed({ ok: true, message: 'Đã lưu tên huấn luyện viên.' });
});
world = mountWorld(state, {
  paused: () => dialog.open || !!state.battle || document.hidden,
  onStop: save,
  hint: notify,
  interact: (obj) => {
    if (obj.kind === 'battle' || obj.kind === 'boss') fight(obj.art, obj.kind === 'boss');
    else open(obj.kind === 'rest' ? 'care' : obj.kind);
  },
});
window.addEventListener('keydown', (e) => {
  if (
    e.ctrlKey ||
    e.altKey ||
    e.metaKey ||
    e.repeat ||
    dialog.open ||
    e.target.matches('input,textarea,select,[contenteditable=true]')
  )
    return;
  if (e.key === 'Escape' && $('map-card').classList.contains('expanded')) {
    expand();
    return;
  }
  const a = { 1: 'fight', 2: 'gym', 3: 'bag', 4: 'shop' }[e.key];
  if (a) {
    e.preventDefault();
    handle(a);
  }
});
window.addEventListener('pagehide', save);
document.addEventListener('visibilitychange', () => {
  if (document.hidden) save();
});
hud();
save();
status();
if (state.battle) open('battle');
