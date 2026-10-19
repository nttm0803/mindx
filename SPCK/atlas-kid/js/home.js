/* =========================================================
   home.js – Trang chủ: tải quốc gia, tìm kiếm, lọc, sắp xếp,
   hộp thoại chi tiết và lưu / sửa / bỏ yêu thích
   ========================================================= */

const PAGE_SIZE = 24;     // mỗi lần hiện thêm 24 thẻ
let allCountries = [];    // toàn bộ quốc gia lấy từ API
let shownCount = PAGE_SIZE;
let activeRegion = '';    // châu lục đang lọc ("" = tất cả)
let currentCode = '';     // mã quốc gia đang mở trong hộp thoại

const grid = document.getElementById('countryGrid');
const statusBox = document.getElementById('listStatus');
const countText = document.getElementById('countText');
const moreBtn = document.getElementById('moreBtn');
const sortSelect = document.getElementById('sortSelect');
const searchInput = document.getElementById('searchInput');
const detailInfo = document.getElementById('detailInfo');
const detailAction = document.getElementById('detailAction');
const detailModal = new bootstrap.Modal(document.getElementById('detailModal'));

// ---------- Tải dữ liệu ----------

async function loadCountries() {
  statusBox.hidden = false;
  statusBox.innerHTML = `
    <div class="spinner-border text-primary" role="status"><span class="visually-hidden">Đang tải</span></div>
    <p class="mt-3 mb-0 fw-bold">Đang tải dữ liệu từ restcountries.com...</p>`;
  try {
    allCountries = await fetchCountries();
    showHeroFlags();
    renderList();
  } catch (err) {
    statusBox.innerHTML = `
      <p class="status-emoji" aria-hidden="true">📡</p>
      <p class="fw-bold mb-1">Chưa tải được dữ liệu. Hãy kiểm tra kết nối mạng rồi thử lại.</p>
      <p class="small text-secondary">${escapeHtml(err.message)}</p>
      <button class="btn btn-blue" id="reloadBtn" type="button">Tải lại</button>`;
    document.getElementById('reloadBtn').addEventListener('click', loadCountries);
  }
}

// Gắn ảnh cờ thật cho 4 huy hiệu quanh quả địa cầu
function showHeroFlags() {
  document.querySelectorAll('.hero-flag').forEach(img => {
    const country = allCountries.find(c => c.code === img.dataset.code);
    if (country) {
      img.src = country.flag;
      img.hidden = false;
    }
  });
}

// ---------- Lọc, sắp xếp, vẽ lưới thẻ ----------

function getFilteredCountries() {
  const word = searchInput.value.trim().toLowerCase();
  const list = allCountries.filter(c => {
    const matchWord = [c.name, c.official, c.capital].some(text => text.toLowerCase().includes(word));
    const matchRegion = activeRegion === '' || c.region === activeRegion;
    return matchWord && matchRegion;
  });
  if (sortSelect.value === 'population') list.sort((a, b) => b.population - a.population);
  if (sortSelect.value === 'area') list.sort((a, b) => b.area - a.area);
  return list; // mặc định đã sắp theo tên A → Z từ lúc tải
}

function renderList() {
  if (allCountries.length === 0) return; // chưa tải xong thì chưa vẽ

  const list = getFilteredCountries();
  const visible = list.slice(0, shownCount);
  const user = getCurrentUser();
  const trips = user ? getTrips(user.email) : [];

  grid.innerHTML = visible.map(c => countryCardHtml(c, trips.find(t => t.code === c.code))).join('');
  countText.textContent = `Đang hiển thị ${visible.length} / ${list.length} quốc gia`;
  moreBtn.hidden = visible.length >= list.length;

  statusBox.hidden = list.length > 0;
  statusBox.innerHTML = `
    <p class="status-emoji" aria-hidden="true">🔎</p>
    <p class="fw-bold mb-0">Không có quốc gia nào khớp bộ lọc. Hãy thử từ khoá khác hoặc bỏ chọn châu lục.</p>`;
}

function countryCardHtml(c, trip) {
  const region = getRegionStyle(c.region);
  const tag = trip ? TAGS[trip.tag] || TAGS.not : null;
  return `
    <button type="button" class="country-card" data-code="${escapeHtml(c.code)}">
      <span class="card-top" style="${colorVars(region)}">
        <img class="flag-round" src="${escapeHtml(c.flag)}" alt="${escapeHtml(c.flagAlt)}" loading="lazy">
        <span class="heart ${trip ? 'is-fav' : ''}" aria-hidden="true">${trip ? '❤️' : '🤍'}</span>
      </span>
      <span class="card-body-x">
        <span class="region-badge" style="${colorVars(region)}">${region.name}</span>
        <span class="country-name">${escapeHtml(c.name)}</span>
        <span class="card-line">🏛️ Thủ đô: <b>${escapeHtml(c.capital)}</b></span>
        <span class="card-line">👥 Dân số: <b>${formatPopulation(c.population)}</b></span>
        ${tag ? `<span class="tag-chip" style="${colorVars(tag)}">${tag.emoji} ${tag.label}</span>` : ''}
        ${trip ? '<span class="visually-hidden">Đã có trong sổ tay yêu thích.</span>' : ''}
      </span>
    </button>`;
}

// Đổi bộ lọc thì quay về 24 thẻ đầu
function applyFilters() {
  shownCount = PAGE_SIZE;
  renderList();
}

searchInput.addEventListener('input', applyFilters);

document.getElementById('searchForm').addEventListener('submit', e => {
  e.preventDefault();
  applyFilters();
  document.getElementById('countries').scrollIntoView();
});

document.querySelectorAll('.region-chip').forEach(chip => {
  chip.addEventListener('click', () => {
    // Bấm chip đang chọn thì bỏ lọc
    activeRegion = activeRegion === chip.dataset.region ? '' : chip.dataset.region;
    document.querySelectorAll('.region-chip').forEach(other => {
      other.setAttribute('aria-pressed', other.dataset.region === activeRegion);
    });
    applyFilters();
  });
});

sortSelect.addEventListener('change', applyFilters);

moreBtn.addEventListener('click', () => {
  shownCount += PAGE_SIZE;
  renderList();
});

// Bấm vào thẻ (kể cả nút tim trên thẻ) đều mở hộp thoại chi tiết
grid.addEventListener('click', e => {
  const card = e.target.closest('.country-card');
  if (card) openDetail(card.dataset.code);
});

// ---------- Hộp thoại chi tiết ----------

function openDetail(code) {
  const country = allCountries.find(c => c.code === code);
  if (!country) return;
  currentCode = code;
  detailInfo.innerHTML = detailInfoHtml(country);
  renderDetailAction(country);
  detailModal.show();
}

function infoCell(label, value, bg, color, wide) {
  return `
    <div class="info-cell ${wide ? 'wide' : ''}" style="background:${bg};color:${color}">
      <small>${label}</small><b>${escapeHtml(value)}</b>
    </div>`;
}

function detailInfoHtml(c) {
  const region = getRegionStyle(c.region);
  const subregion = SUBREGION_VI[c.subregion] || c.subregion;
  return `
    <div class="detail-head" style="${colorVars(region)}">
      <img class="flag-round" src="${escapeHtml(c.flag)}" alt="${escapeHtml(c.flagAlt)}">
      <h2 class="detail-name" id="detailTitle">${escapeHtml(c.name)}</h2>
      <span class="official-badge">${escapeHtml(c.official)}</span>
    </div>
    <div class="info-grid">
      ${infoCell('Thủ đô', c.capital, '#FFE0E0', '#B3302F')}
      ${infoCell('Khu vực', subregion ? `${region.name} – ${subregion}` : region.name, '#DCEBFF', '#1F5FC4')}
      ${infoCell('Dân số', formatNumber(c.population) + ' người', '#D3F5EC', '#0E7A64')}
      ${infoCell('Diện tích', formatNumber(c.area) + ' km²', '#E6E0FF', '#5B44C2')}
      ${infoCell('Ngôn ngữ', c.languages.join(', ') || 'Chưa có dữ liệu', '#FFF1C2', '#8A5F00', true)}
      ${infoCell('Tiền tệ', c.currencies.join(', ') || 'Chưa có dữ liệu', '#D3F5EC', '#0E7A64', true)}
    </div>`;
}

// Cột phải có 3 trạng thái: khách / chưa lưu / đã lưu
function renderDetailAction(c) {
  const user = getCurrentUser();
  if (!user) {
    detailAction.innerHTML = `
      <div class="guest-box">
        <div class="lock-icon" aria-hidden="true">🔒</div>
        <h3>Đăng nhập để lưu yêu thích</h3>
        <p>Sau khi đăng nhập, bạn có thể lưu quốc gia này và gắn tag <b>Chưa đến</b>, <b>Sẽ đến</b> hoặc <b>Đã đến</b>.</p>
        <a class="btn btn-sun w-100 mb-3" href="login.html?next=index.html">Đăng nhập</a>
        <a class="btn btn-outline-ink w-100" href="register.html?next=index.html">Tạo tài khoản mới</a>
      </div>`;
    return;
  }

  const trip = findTrip(user.email, c.code);
  const selected = trip ? trip.tag : 'will'; // mặc định chọn "Sẽ đến"
  const buttons = trip
    ? `<button type="button" class="btn btn-coral" id="removeBtn">🗑️ Bỏ yêu thích</button>
       <button type="submit" class="btn btn-sun">Cập nhật</button>`
    : `<button type="button" class="btn btn-outline-ink" data-bs-dismiss="modal">Đóng</button>
       <button type="submit" class="btn btn-sun">❤️ Lưu yêu thích</button>`;

  detailAction.innerHTML = `
    <form id="favForm" novalidate>
      <h3 class="detail-action-title">${trip ? '💗 Đã yêu thích' : '❤️ Lưu vào yêu thích'}</h3>
      ${trip ? `<div class="alert alert-mint py-2">✔ ${escapeHtml(c.name)} đang có trong sổ tay của bạn.</div>` : ''}
      <fieldset class="mb-2">
        <legend class="form-label ${trip ? 'visually-hidden' : ''}">Bạn và ${escapeHtml(c.name)} thế nào rồi?</legend>
        ${Object.keys(TAGS).map(key => tagOptionHtml(key, key === selected)).join('')}
      </fieldset>
      <div class="mb-3" id="favDateWrap">
        <label class="form-label" for="favDate" id="favDateLabel">Ngày dự định (không bắt buộc)</label>
        <input class="form-control" type="date" id="favDate" value="${trip ? escapeHtml(trip.date) : ''}" aria-describedby="favDateError">
        <div class="field-error" id="favDateError"></div>
      </div>
      <div class="mb-4">
        <label class="form-label" for="favNote">Ghi chú của bạn</label>
        <textarea class="form-control" id="favNote" rows="2" maxlength="200" placeholder="Vì sao bạn thích nơi này?">${trip ? escapeHtml(trip.note) : ''}</textarea>
      </div>
      <div class="detail-buttons">${buttons}</div>
    </form>`;
  updateFavDate(selected);
}

function tagOptionHtml(key, checked) {
  const tag = TAGS[key];
  return `
    <label class="tag-option" style="${colorVars(tag)}">
      <input type="radio" name="favTag" value="${key}" ${checked ? 'checked' : ''}>
      <span class="tag-emoji" aria-hidden="true">${tag.emoji}</span>
      <span class="tag-text"><b>${tag.label}</b><small>${tag.desc}</small></span>
      <span class="tag-tick" aria-hidden="true"></span>
    </label>`;
}

function updateFavDate(tag) {
  const dateInput = document.getElementById('favDate');
  applyDateRule(tag, document.getElementById('favDateWrap'), document.getElementById('favDateLabel'), dateInput);
  setFieldError(dateInput, '');
}

// Nội dung cột phải được vẽ lại mỗi lần mở, nên bắt sự kiện ở khung cha
detailAction.addEventListener('change', e => {
  if (e.target.name === 'favTag') updateFavDate(e.target.value);
});

detailAction.addEventListener('input', e => {
  if (e.target.id === 'favDate') setFieldError(e.target, '');
});

detailAction.addEventListener('submit', e => {
  e.preventDefault();
  const user = getCurrentUser();
  const country = allCountries.find(c => c.code === currentCode);
  if (!user || !country) return;

  const tag = detailAction.querySelector('input[name="favTag"]:checked').value;
  const date = document.getElementById('favDate').value;
  const note = document.getElementById('favNote').value;
  if (!showErrors({ favDate: checkTripDate(tag, date) })) return;

  if (findTrip(user.email, country.code)) {
    updateTrip(user.email, country.code, { tag, date, note });
    showToast(`Đã cập nhật ${country.name}.`);
  } else {
    addTrip(user.email, country, { tag, date, note });
    showToast(`Đã lưu ${country.name} vào yêu thích.`);
  }
  detailModal.hide();
  renderList(); // cập nhật ngay tim và chip tag trên thẻ
});

detailAction.addEventListener('click', e => {
  if (!e.target.closest('#removeBtn')) return;
  const user = getCurrentUser();
  const country = allCountries.find(c => c.code === currentCode);
  if (!user || !country || !confirm(`Bỏ ${country.name} khỏi yêu thích?`)) return;

  removeTrip(user.email, country.code);
  showToast(`Đã bỏ ${country.name} khỏi yêu thích.`);
  detailModal.hide();
  renderList();
});

// ---------- Khởi động ----------

// Vừa xoá tài khoản ở trang Hồ sơ thì báo cho người dùng biết
if (new URLSearchParams(location.search).get('deleted') === '1') {
  document.getElementById('pageAlert').innerHTML = `
    <div class="alert alert-mint alert-dismissible fade show" role="alert">
      ✔ Tài khoản đã được xoá.
      <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Đóng"></button>
    </div>`;
  history.replaceState(null, '', 'index.html');
}

loadCountries();
