import {
  SPECIES,
  AREAS,
  ITEMS,
  MISSIONS,
  activePet,
  limits,
  progress,
  nextMission,
  isUnlocked,
  xpNeeded,
} from './game.js';

export const ic = (id) =>
  `<svg class="ic" aria-hidden="true"><use href="./assets/icons.svg#${id}"></use></svg>`;
export const px = (id) =>
  `<svg class="px" aria-hidden="true"><use href="./assets/pixels.svg#${id}"></use></svg>`;
export const esc = (v) =>
  String(v).replace(
    /[&<>"']/g,
    (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c],
  );
export const num = (v) => v.toLocaleString('vi-VN');
const pad = (v) => String(v).padStart(2, '0');
export function portrait(id) {
  return `<div class="portrait ${SPECIES[id].color}"><span class="ground-disc"></span><img src="./assets/${id}.png" alt="${SPECIES[id].name}"></div>`;
}
function chips(p) {
  const def = SPECIES[p.id];
  return `<div class="chips"><span class="type ${def.color}">${ic(def.icon)} Hệ ${def.element}</span><span class="level">Lv. ${pad(p.level)}</span></div>`;
}
function bio(p) {
  const def = SPECIES[p.id];
  return `${portrait(p.id)}<div><div class="small-label">LINH THÚ #${def.no}</div><h3>${def.name}</h3>${chips(p)}</div>`;
}
const track = (n, max) =>
  `<div class="track"><span style="width:${Math.min(100, Math.round((n / max) * 100))}%"></span></div>`;
function vitals(p) {
  const max = limits(p);
  return `<div class="vitals">${[
    ['hp', 'heart', 'HP', p.hp, max.hp],
    ['mp', 'zap', 'MP', p.mp, max.mp],
    ['xp', 'star', 'EXP', p.xp, xpNeeded(p)],
  ]
    .map(
      ([id, icon, label, val, total]) =>
        `<div class="vital ${id}"><div class="vital-line"><span class="vital-name">${ic(icon)}${label}</span><span class="vital-val">${val} <span>/ ${total}</span></span></div>${track(val, total)}</div>`,
    )
    .join('')}</div>`;
}
export function companion(s) {
  const p = activePet(s);
  return `<div class="pet-bio">${bio(p)}</div>${vitals(p)}`;
}
function prize(id, amount) {
  return `<span class="prize ${id}" aria-label="${amount} ${id === 'coin' ? 'vàng' : 'ngọc'}">${px(id)} +${num(amount)}</span>`;
}
const rewards = (q) => prize('coin', q.gold) + prize('gem', q.gems);
function qProgress(s, q) {
  const n = progress(s, q);
  return `<div class="quest-progress">${track(n, q.target)}<small>${n} / ${q.target}</small></div>`;
}
export function missionCard(s) {
  const q = nextMission(s);
  if (!q)
    return `<div class="quest-box"><div class="quest-type">${ic('trophy')} ĐÃ HOÀN THÀNH</div><h3>Nhà huấn luyện tài ba</h3><p>Bạn đã hoàn thành sổ nhiệm vụ. Các vùng đất vẫn chờ bạn khám phá!</p></div>`;
  return `<div class="quest-box"><div class="quest-type"><b></b> NHIỆM VỤ CHÍNH · ${pad(s.claimed.length + 1)}</div><h3>${q.name}</h3><p>${q.detail}</p>${qProgress(s, q)}</div><div class="prize-line"><span>Thưởng</span>${rewards(q)}${progress(s, q) === q.target ? `<button class="mission-claim" data-do="claim" data-id="${q.id}">Nhận thưởng</button>` : ''}</div>`;
}
function wallet(s) {
  return `<div class="wallet" aria-label="Số dư"><div class="money">${px('coin')}<strong>${num(s.gold)}</strong></div><i class="vline"></i><div class="money">${px('gem')}<strong>${num(s.gems)}</strong></div></div>`;
}
function head(title, icon, kicker, tail = null) {
  return `<div class="modal-head"><span class="modal-icon">${ic(icon)}</span><div><div class="dialog-kicker">${kicker}</div><h2 id="dialog-title" tabindex="-1">${title}</h2></div>${tail ?? `<button class="mini-btn modal-close" data-do="close" aria-label="Đóng">${ic('x')}</button>`}</div>`;
}
const shell = (title, icon, kicker, main) =>
  head(title, icon, kicker) + `<div class="modal-body">${main}</div>`;
const note = (icon, text) => `<div class="info-note">${ic(icon)}<span>${text}</span></div>`;
const disabled = (v) => (v ? ' disabled' : '');
export function maps(s) {
  return shell(
    'Bản đồ thế giới',
    'map',
    'NHẬT KÝ KHÁM PHÁ',
    `<p class="modal-desc">Chọn điểm đến. Mỗi vùng đất có những linh thú và thử thách riêng.</p><div class="map-list">${Object.entries(
      AREAS,
    )
      .map(([id, a]) => {
        const here = id === s.area,
          open = isUnlocked(s, id);
        return `<button class="dest ${here ? 'current' : ''}" data-do="travel" data-id="${id}"${disabled(!open)}><img src="./assets/${id}.webp" alt=""><div><span class="small-label">KHU VỰC ${a.no} · LV. ${a.range}</span><h3>${a.name}</h3><p class="fine">${here ? 'Bạn đang ở đây' : open ? a.kind : `Cần ${a.wins} trận thắng · ${s.stats.wins}/${a.wins}`}</p></div>${ic(here ? 'map-pin' : open ? 'arrow-right' : 'lock')}</button>`;
      })
      .join('')}</div>`,
  );
}
export function team(s) {
  return shell(
    'Đội linh thú',
    'paw-print',
    'SỔ TAY HUẤN LUYỆN',
    `<p class="modal-desc">Bộ sưu tập ${s.pets.length} / ${Object.keys(SPECIES).length} loài. Chọn một bạn đồng hành để ra trận.</p><div class="rows">${s.pets.map((p) => `<button class="team-row ${p.id === s.active ? 'active' : ''}" data-do="switch" data-id="${p.id}"><img src="./assets/${p.id}.png" alt=""><span class="row-text"><strong>${SPECIES[p.id].name}</strong><span class="fine" style="display:block">Hệ ${SPECIES[p.id].element} · Lv. ${p.level}</span></span><span class="badge ${p.id === s.active ? 'ready' : ''}">${p.id === s.active ? 'Đồng hành' : 'Chọn'}</span></button>`).join('')}</div><div class="block-gap">${note('sparkles', 'Thú hoang còn tối đa 40% HP có thể được thu phục bằng ấn kết bạn. Riêng Tinh Hồ chỉ đi theo người thắng trận.')}</div>`,
  );
}
export function care(s) {
  const p = activePet(s);
  return shell(
    'Chăm sóc linh thú',
    'hand-heart',
    'TRẠM NGHỈ',
    `<div class="care-hero">${bio(p)}</div>${vitals(p)}<div class="numbers"><div><small>Sức đánh</small><strong>${limits(p).atk}</strong></div><div><small>Rèn luyện</small><strong>${p.training}/12</strong></div><div><small>Bùa sao</small><strong>${p.charm ? 'Đã đeo' : 'Chưa có'}</strong></div></div><p class="modal-desc block-gap">Về Làng Mầm Xanh nghỉ miễn phí để hồi đầy HP và MP cho cả đội.</p><button class="primary-btn full" data-do="rest">${ic('house')} Nghỉ ở làng</button><div class="split-buttons block-gap"><button class="secondary-btn" data-do="bag">${ic('backpack')} Túi đồ</button><button class="secondary-btn" data-do="team">${ic('paw-print')} Đổi linh thú</button></div>`,
  );
}
export function shop(s) {
  const p = activePet(s);
  return shell(
    'Cửa hàng Bác Thảo',
    'store',
    'GIAN HÀNG TRONG LÀNG',
    `${wallet(s)}<p class="modal-desc">Chuẩn bị hành trang cho chuyến đi tiếp theo.</p><div class="rows">${Object.entries(
      ITEMS,
    )
      .map(
        ([id, item]) =>
          `<div class="item-row"><span class="item-img">${px(item.image)}</span><div class="row-text"><strong>${item.name}</strong><p>${item.detail}</p></div><button class="row-button" data-do="buy" data-id="${id}" aria-label="Mua ${item.name}, ${item.price} ${item.pay === 'gold' ? 'vàng' : 'ngọc'}"${disabled(s[item.pay] < item.price || (id === 'charm' && p.charm))}>${id === 'charm' && p.charm ? 'Đã đeo' : px(item.pay === 'gold' ? 'coin' : 'gem') + ' ' + item.price}</button></div>`,
      )
      .join('')}</div>`,
  );
}
export function bag(s) {
  const p = activePet(s),
    def = SPECIES[p.id],
    max = limits(p);
  return shell(
    'Túi đồ',
    'backpack',
    'HÀNH TRANG',
    `<p class="modal-desc">Bạn đồng hành: <strong>${def.name}</strong> · ${p.hp}/${max.hp} HP · ${p.mp}/${max.mp} MP.</p><div class="rows">${Object.keys(
      s.bag,
    )
      .map((id) => {
        const item = ITEMS[id],
          stat = id === 'berry' ? 'hp' : 'mp';
        return `<div class="item-row"><span class="item-img">${px(item.image)}</span><div class="row-text"><strong>${item.name} × ${s.bag[id]}</strong><p>${item.detail}</p></div>${id === 'seal' ? '<span class="badge">Trong trận</span>' : `<button class="row-button" data-do="use" data-id="${id}"${disabled(!s.bag[id] || p[stat] >= max[stat])}>${p[stat] >= max[stat] ? stat.toUpperCase() + ' đầy' : 'Dùng'}</button>`}</div>`;
      })
      .join(
        '',
      )}</div><button class="secondary-btn full block-gap" data-do="shop">${ic('store')} Ghé cửa hàng</button>`,
  );
}
export function missions(s) {
  const next = nextMission(s);
  return shell(
    'Sổ nhiệm vụ',
    'scroll-text',
    'HỘI HUẤN LUYỆN VIÊN',
    `<p class="modal-desc">Đã nhận thưởng ${s.claimed.length}/${MISSIONS.length} nhiệm vụ. Tiến độ được ghi lại cả khi bạn chưa mở sổ.</p><div class="rows">${MISSIONS.map(
      (q, i) => {
        const done = s.claimed.includes(q.id),
          current = next?.id === q.id;
        return `<div class="mission-row ${done ? 'done' : ''}"><span class="item-img">${ic(done ? 'check' : current ? 'flag' : 'lock')}</span><div class="row-text"><span class="small-label">CHƯƠNG ${pad(i + 1)} · ${done ? 'ĐÃ NHẬN' : current ? 'ĐANG THEO DÕI' : 'KẾ TIẾP'}</span><h3>${q.name}</h3><p>${q.detail}</p>${!done ? qProgress(s, q) : ''}<div class="prize-line">${rewards(q)}${current && progress(s, q) === q.target ? `<button class="mission-claim" data-do="claim" data-id="${q.id}">Nhận thưởng</button>` : ''}</div></div></div>`;
      },
    ).join('')}</div>`,
  );
}
export function profile(s) {
  return shell(
    'Hồ sơ huấn luyện viên',
    'gamepad-2',
    'THẺ NHÀ THÁM HIỂM',
    `<div class="care-hero"><div class="portrait violet"><img src="./assets/avatar.png" alt="Hình đại diện"></div><div><span class="small-label">NHÀ HUẤN LUYỆN</span><h3>${esc(s.name)}</h3><span class="badge">${ic('map-pin')} ${AREAS[s.area].name}</span></div></div><form id="name-form"><label class="form-label" for="new-name">Tên hiển thị</label><div class="input-row"><input id="new-name" maxlength="18" required autocomplete="off" value="${esc(s.name)}"><button class="primary-btn" type="submit">Lưu tên</button></div></form><div class="numbers"><div><small>Trận thắng</small><strong>${s.stats.wins}</strong></div><div><small>Linh thú</small><strong>${s.pets.length}/4</strong></div><div><small>Khu vực mở</small><strong>${Object.keys(AREAS).filter((id) => isUnlocked(s, id)).length}/3</strong></div></div><div class="block-gap">${note('save', 'Chơi đơn, không cần đăng nhập. Tiến trình được lưu trong trình duyệt này; xóa dữ liệu trang sẽ xóa lượt chơi.')}</div>`,
  );
}
const GUIDES = {
  play: [
    [
      'mouse-pointer-2',
      'Đi bộ trên bản đồ',
      'Chạm vào đường đất hoặc bãi cỏ, hoặc dùng WASD / phím mũi tên. Nhân vật sẽ tìm đường tránh nhà, cây và nước.',
    ],
    [
      'message-circle',
      'Tương tác',
      'Chạm Bác Thảo để mua đồ, chạm bảng gỗ để xem nhiệm vụ. Trên bàn phím, đến gần rồi nhấn E.',
    ],
    [
      'swords',
      'Tìm trận đấu',
      'Đi vào thú hoang hoặc dùng nút Chiến đấu. Các phím 1, 2, 3, 4 tương ứng với bốn thao tác nhanh.',
    ],
  ],
  fight: [
    [
      'zap',
      'Đòn đánh & kỹ năng',
      'Đánh thường không tốn MP. Kỹ năng tốn 6 MP: Mộc khắc Thủy, Thủy khắc Hỏa, Hỏa khắc Mộc. Đòn khắc hệ mạnh hơn 35%.',
    ],
    [
      'paw-print',
      'Thu phục',
      'Hạ thú hoang còn tối đa 40% HP rồi dùng ấn kết bạn. Nương tay luôn chừa ít nhất 1 HP. Thú thu phục cũng được tính là một trận thắng.',
    ],
    [
      'heart',
      'Hồi phục',
      'Quả mọng hồi 35 HP, sương lam hồi 15 MP. Dùng đồ trong trận sẽ mất một lượt. Ngoài trận, vào Chăm sóc để nghỉ miễn phí ở làng.',
    ],
  ],
  travel: [
    [
      'map',
      'Mở khu vực',
      'Thắng 2 trận để đến Rừng Ngọc Bích, thắng 5 trận để đến Đồi Hổ Phách. Mở Bản đồ để dịch chuyển.',
    ],
    [
      'dumbbell',
      'Rèn luyện',
      'Mỗi buổi tập tốn 25 vàng, nhận EXP và thêm 1 sức đánh (tối đa +12). Dừng đúng nhịp sẽ nhận EXP thưởng.',
    ],
    [
      'trophy',
      'Chinh phục thủ lĩnh',
      'Tìm Tinh Hồ ở Đồi Hổ Phách và chiến thắng để nhận linh thú đặc biệt này. Đừng quên nhận thưởng trong Sổ nhiệm vụ!',
    ],
  ],
};
export function guide(tab) {
  return shell(
    'Cẩm nang phiêu lưu',
    'book-open',
    'THƯ VIỆN PETORIA',
    `<div class="guide-tabs" aria-label="Chủ đề">${[
      ['play', 'Điều khiển'],
      ['fight', 'Chiến đấu'],
      ['travel', 'Hành trình'],
    ]
      .map(
        ([id, t]) =>
          `<button class="${tab === id ? 'selected' : ''}" data-do="guide-tab" data-id="${id}" aria-pressed="${tab === id}">${t}</button>`,
      )
      .join(
        '',
      )}</div><ul class="guide-list">${GUIDES[tab].map(([icon, title, text]) => `<li>${ic(icon)}<div><strong>${title}</strong><p>${text}</p></div></li>`).join('')}</ul>`,
  );
}
export function gym(s, running, message) {
  const p = activePet(s);
  return shell(
    'Sân huấn luyện',
    'dumbbell',
    'RÈN LUYỆN LINH THÚ',
    `<div class="care-hero">${bio(p)}</div><p class="modal-desc">Mỗi buổi: <strong>25 vàng</strong> · +24 EXP · +1 sức đánh (tối đa +12). Canh đúng vùng xanh để nhận 40 EXP.</p><div class="workout"><div class="section-line"><strong>Nhịp tập trung</strong><small>${p.training} / 12 sức đánh</small></div><div class="meter"><span class="target"></span><span id="needle" class="needle" style="left:${running ? 0 : 50}%"></span></div><p>${running ? 'Nhấn Dừng nhịp khi vạch sáng đi vào vùng xanh.' : 'Bắt đầu để canh nhịp, hoặc tập cơ bản không cần canh giờ.'}</p></div>${message ? `<p class="message-line" role="status">${esc(message)}</p>` : ''}<div class="split-buttons">${running ? '<button class="primary-btn" data-do="gym-stop">Dừng nhịp</button>' : `<button class="secondary-btn" data-do="gym-basic"${disabled(s.gold < 25)}>Tập cơ bản</button><button class="primary-btn" data-do="gym-start"${disabled(s.gold < 25)}>${ic('timer')} Bắt đầu</button>`}</div><p class="fine block-gap">Số dư: ${num(s.gold)} vàng${s.gold < 25 ? ' · Hãy thắng trận để kiếm thêm vàng.' : '.'}</p>`,
  );
}
function hpTag(name, level, val, max, klass, mp = null) {
  return `<div class="battle-tag ${klass}"><div class="b-name">${name}<small>Lv.${level}</small></div>${track(val, max)}<span class="readout">HP ${val}/${max}${mp === null ? '' : ` · MP ${mp}`}</span></div>`;
}
export function battle(s, pack = false) {
  const b = s.battle,
    p = activePet(s),
    def = SPECIES[p.id],
    foe = SPECIES[b.id],
    fight = b.phase === 'fight';
  const title = fight
    ? b.boss
      ? 'Thử thách thủ lĩnh'
      : 'Chạm trán linh thú'
    : { won: 'Chiến thắng!', caught: 'Thu phục thành công!', lost: 'Trở về làng', escaped: 'Đã rút lui' }[
        b.phase
      ];
  const header = head(
    title,
    fight ? 'swords' : b.phase === 'won' ? 'trophy' : 'paw-print',
    'ĐẤU TRƯỜNG LINH THÚ',
    `<span class="turn-chip">LƯỢT ${pad(b.turn)}</span>`,
  );
  const art = `<div class="battle-stage ${s.area}">${hpTag(foe.name, b.level, b.hp, b.maxHp, 'enemy')}
    <img class="fighter us" src="./assets/${p.id}.png" alt="${def.name}"><img class="fighter them" src="./assets/${b.id}.png" alt="${foe.name}">${hpTag(def.name, p.level, p.hp, limits(p).hp, 'ally', p.mp)}</div>`;
  const owns = s.pets.some((t) => t.id === b.id);
  const actions = [
    ['hit', 'swords', 'Đánh thường', 'Không tốn MP', false],
    ['skill', def.icon, def.skill, '6 MP', p.mp < 6],
    [
      'catch',
      'paw-print',
      'Thu phục',
      b.boss ? 'Phải thắng trận' : owns ? 'Đã sở hữu' : `Ấn: ${s.bag.seal} · HP ≤ 40%`,
      b.boss || owns || !s.bag.seal,
    ],
    ['spare', 'feather', 'Nương tay', 'Chừa ít nhất 1 HP', b.hp <= 1],
    ['pack', 'backpack', 'Túi đồ', 'Vật phẩm hồi phục', false],
    ['flee', 'door-open', 'Rút lui', 'Giữ nguyên EXP', false],
  ];
  const supplies = `<div class="battle-actions"><button data-do="act" data-id="berry"${disabled(s.bag.berry < 1 || p.hp === limits(p).hp)}><span>${px('berry')} Quả mọng</span><small>+35 HP · Còn ${s.bag.berry}</small></button><button data-do="act" data-id="dew"${disabled(s.bag.dew < 1 || p.mp === limits(p).mp)}><span>${px('dew')} Sương lam</span><small>+15 MP · Còn ${s.bag.dew}</small></button><button data-do="battle-back"><span>${ic('arrow-left')} Trở lại</span><small>Không mất lượt</small></button></div>`;
  if (fight && pack)
    return (
      header +
      art +
      `<div class="modal-body"><p class="battle-log">Chọn vật phẩm để hồi phục. Dùng một vật phẩm sẽ tốn một lượt.</p>${supplies}</div>`
    );
  return (
    header +
    art +
    `<div class="modal-body"><p class="battle-log" aria-live="polite">${esc(b.log)}</p>${fight ? `<div class="battle-actions">${actions.map(([id, icon, name, detail, off]) => `<button data-do="${id === 'pack' ? 'battle-bag' : 'act'}" data-id="${id}"${disabled(off)}><span>${ic(icon)} ${name}</span><small>${detail}</small></button>`).join('')}</div>` : `${b.reward.xp ? `<div class="result-loot">${prize('coin', b.reward.gold)}${b.reward.gems ? prize('gem', b.reward.gems) : ''}<span class="xp-text">+${b.reward.xp} EXP</span></div>` : ''}<button class="primary-btn full" data-do="battle-done">${ic('compass')} Trở lại bản đồ</button>`}</div>`
  );
}
