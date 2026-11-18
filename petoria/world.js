import { AREAS } from './game.js';
import { SCENES, ASPECT, distance, findPath, walkable } from './terrain.js';

const DIR = {
  w: [0, -1],
  ArrowUp: [0, -1],
  s: [0, 1],
  ArrowDown: [0, 1],
  a: [-1, 0],
  ArrowLeft: [-1, 0],
  d: [1, 0],
  ArrowRight: [1, 0],
};
const $ = (id) => document.getElementById(id);
const coord = (n) => String(Math.round(n)).padStart(3, '0');
const place = (el, x, y) => {
  el.style.left = x + '%';
  el.style.top = y + '%';
  el.style.zIndex = String(Math.round(y));
};
const plinth = '<svg class="ic" aria-hidden="true"><use href="./assets/icons.svg#store"></use></svg>';
const alt = {
  meadow: 'Hai mái nhà ngói đỏ bên con đường đất và chiếc cầu gỗ bắc qua suối.',
  forest: 'Lối mòn dưới tán cây cổ thụ, giữa nấm tím và thác nước xanh.',
  highlands: 'Cao nguyên hổ phách với con đường men theo vách đá và mỏ cổ.',
};

export function mountWorld(s, { interact, paused, onStop, hint }) {
  const stage = $('stage'),
    world = $('world'),
    player = $('player'),
    buddy = $('buddy'),
    point = $('waypoint');
  let area = '',
    active = '',
    path = [],
    goal = null,
    keys = new Set(),
    ignored = new Set(),
    moved = false,
    face = 1;
  let width = 0,
    height = 0,
    sw = 0,
    sh = 0,
    camX = 0,
    camY = 0,
    buddyPos = [0, 0];
  function pose() {
    const [x, y] = s.pos;
    place(player, x, y);
    place(buddy, ...buddyPos);
    // A phone follows the trainer rather than shrinking the sprites to dots.
    camX = Math.min(0, Math.max(sw - width, sw / 2 - (width * x) / 100));
    camY =
      height - sh < 130 ? (sh - height) / 2 : Math.min(0, Math.max(sh - height, sh / 2 - (height * y) / 100));
    world.style.transform = `translate(${Math.round(camX)}px,${Math.round(camY)}px)`;
    $('coords').textContent = `${coord(x)} : ${coord(y)}`;
  }
  function resize() {
    sw = stage.clientWidth;
    sh = stage.clientHeight;
    width = Math.max(sw, sh * ASPECT, Math.min(520, sw * 1.34));
    height = width / ASPECT;
    world.style.width = width + 'px';
    world.style.height = height + 'px';
    pose();
  }
  function stop() {
    keys.clear();
    path = [];
    goal = null;
    point.hidden = true;
    player.classList.remove('walking');
    buddy.classList.remove('walking');
    if (moved) {
      moved = false;
      onStop();
    }
  }
  function reset() {
    stop();
    const a = AREAS[s.area];
    area = s.area;
    if (!walkable(area, ...s.pos)) s.pos = [...a.spawn];
    $('land').src = `./assets/${area}.webp`;
    $('land').alt = alt[area];
    $('zone-no').textContent = 'KHU VỰC ' + a.no;
    $('zone-name').textContent = a.name;
    $('actors').replaceChildren();
    for (const obj of SCENES[area].actors) {
      const btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'actor';
      btn.dataset.key = obj.key;
      btn.dataset.kind = obj.kind;
      btn.title = obj.name;
      btn.setAttribute('aria-label', obj.name);
      const label = document.createElement('span');
      label.className = 'actor-tag' + (['shop', '!', '…'].includes(obj.badge) ? ' notice' : '');
      if (obj.badge === 'shop') label.innerHTML = plinth;
      else label.textContent = obj.badge;
      const img = new Image();
      img.alt = '';
      img.draggable = false;
      img.src = `./assets/${obj.art}.${obj.art === 'board' ? 'svg' : 'png'}`;
      btn.append(label, img);
      place(btn, obj.x, obj.y);
      $('actors').append(btn);
    }
    buddyPos = [s.pos[0] + 4.8, s.pos[1] + 1.6];
    ignored = new Set(SCENES[area].actors.filter((o) => distance(s.pos, [o.x, o.y]) < 4).map((o) => o.key));
    resize();
    sync();
  }
  function sync() {
    if (s.area !== area) {
      reset();
      return;
    }
    if (active !== s.active) {
      active = s.active;
      buddy.firstElementChild.src = `./assets/${active}.png`;
    }
  }
  function go(to, obj = null) {
    keys.clear();
    const route = findPath(area, s.pos, to);
    if (!route.length) {
      stop();
      hint('Lối này bị chắn. Hãy chọn đường đất hoặc bãi cỏ.');
      return;
    }
    path = route;
    goal = obj;
    point.hidden = false;
    place(point, ...route.at(-1));
    point.style.zIndex = 1;
  }
  function trigger(obj) {
    stop();
    ignored.add(obj.key);
    interact(obj);
  }
  stage.addEventListener('click', (e) => {
    if (paused() || e.target.closest('[data-do]')) return;
    const actor = e.target.closest('[data-key]');
    stage.focus({ preventScroll: true });
    if (actor) {
      const obj = SCENES[area].actors.find((o) => o.key === actor.dataset.key);
      if (distance(s.pos, [obj.x, obj.y]) < 4) trigger(obj);
      else go([obj.x, obj.y], obj);
      return;
    }
    const rect = world.getBoundingClientRect();
    go([((e.clientX - rect.left) / width) * 100, ((e.clientY - rect.top) / height) * 100]);
  });
  const keyName = (e) => (e.key.length === 1 ? e.key.toLowerCase() : e.key);
  const isInput = (el) => el?.matches('input,textarea,select,[contenteditable=true]');
  window.addEventListener('keydown', (e) => {
    if (paused() || isInput(e.target) || e.ctrlKey || e.altKey || e.metaKey) return;
    const key = keyName(e);
    if (Object.hasOwn(DIR, key)) {
      e.preventDefault();
      keys.add(key);
      goal = null;
      path = [];
      point.hidden = true;
    } else if (key === 'e' && !e.repeat) {
      const near = SCENES[area].actors
        .map((o) => ({ o, d: distance(s.pos, [o.x, o.y]) }))
        .sort((a, b) => a.d - b.d)[0];
      if (near.d < 8) trigger(near.o);
      else hint('Đến gần nhân vật hoặc linh thú rồi nhấn E.');
    }
  });
  window.addEventListener('keyup', (e) => keys.delete(keyName(e)));
  window.addEventListener('blur', stop);
  document.addEventListener('visibilitychange', () => {
    if (document.hidden) stop();
  });
  function move(dx, dy, factor) {
    const [x, y] = s.pos;
    if (walkable(area, x + dx, y + dy)) s.pos = [x + dx, y + dy];
    else if (walkable(area, x + dx, y)) s.pos = [x + dx, y];
    else if (walkable(area, x, y + dy)) s.pos = [x, y + dy];
    if (dx) face = dx > 0 ? 1 : -1;
    buddyPos[0] += (s.pos[0] - face * 3.9 - buddyPos[0]) * factor;
    buddyPos[1] += (s.pos[1] + 2 - buddyPos[1]) * factor;
    player.classList.toggle('face-left', face < 0);
    player.classList.add('walking');
    buddy.classList.add('walking');
    moved = true;
    pose();
  }
  function frame(dt) {
    if (paused()) {
      if (moved || keys.size || path.length) stop();
      return;
    }
    const step = dt * 21;
    let dx = 0,
      dy = 0;
    if (keys.size) {
      for (const k of keys) {
        dx += DIR[k][0];
        dy += DIR[k][1];
      }
      const n = Math.hypot(dx, dy) || 1;
      dx = (dx / n) * step;
      dy = (dy / n) * step * ASPECT;
    } else if (path.length) {
      const next = path[0],
        d = distance(s.pos, next);
      const f = d ? Math.min(1, step / d) : 1;
      dx = (next[0] - s.pos[0]) * f;
      dy = (next[1] - s.pos[1]) * f;
      if (f >= 1) path.shift();
    }
    if (dx || dy) {
      move(dx, dy, Math.min(1, dt * 10));
      for (const o of SCENES[area].actors) {
        const d = distance(s.pos, [o.x, o.y]);
        if (d > 5) ignored.delete(o.key);
        if (
          (goal?.key === o.key && d < 3.2) ||
          (!goal && !ignored.has(o.key) && ['battle', 'boss'].includes(o.kind) && d < 2.5)
        ) {
          trigger(o);
          return;
        }
      }
    }
    if (!keys.size && !path.length) {
      if (goal) {
        const o = goal;
        trigger(o);
      } else if (moved) stop();
    }
  }
  let last = performance.now();
  function loop(t) {
    frame(Math.max(0, Math.min(0.06, (t - last) / 1000)));
    last = t;
    requestAnimationFrame(loop);
  }
  reset();
  new ResizeObserver(resize).observe(stage);
  requestAnimationFrame(loop);
  return { reset, sync, stop, resize };
}
