/* =========================================================
   storage.js – phần dùng chung cho mọi trang Atlas Kid
   1. Hằng số  2. Tiện ích  3. Tài khoản  4. Yêu thích
   5. API quốc gia  6. Header
   ========================================================= */

// ---------- 1. Hằng số ----------

// restcountries.com bản v5 bắt buộc có API key (miễn phí). Cách lấy key: xem README.md
const API_KEY = 'rc_live_4f3bae73408f4d748e8190971fb60773';
const API_URL = 'https://api.restcountries.com/countries/v5';
// Chỉ lấy những trường cần dùng cho nhẹ
const API_FIELDS = 'names.common,names.official,codes.alpha_3,flag.url_svg,flag.url_png,'
  + 'capitals,region,subregion,population,area,languages,currencies';

const REGION_VI = { Africa: 'Châu Phi', Americas: 'Châu Mỹ', Asia: 'Châu Á', Europe: 'Châu Âu', Oceania: 'Châu Đại Dương', Antarctic: 'Châu Nam Cực' };
const SUBREGION_VI = {
  'Caribbean': 'Caribe', 'Central America': 'Trung Mỹ', 'South America': 'Nam Mỹ', 'North America': 'Bắc Mỹ',
  'Eastern Africa': 'Đông Phi', 'Middle Africa': 'Trung Phi', 'Northern Africa': 'Bắc Phi',
  'Southern Africa': 'Nam Phi', 'Western Africa': 'Tây Phi',
  'Central Asia': 'Trung Á', 'Eastern Asia': 'Đông Á', 'South-Eastern Asia': 'Đông Nam Á',
  'Southern Asia': 'Nam Á', 'Western Asia': 'Tây Á',
  'Eastern Europe': 'Đông Âu', 'Northern Europe': 'Bắc Âu', 'Southern Europe': 'Nam Âu',
  'Western Europe': 'Tây Âu', 'Central Europe': 'Trung Âu', 'Southeast Europe': 'Đông Nam Âu',
  'Australia and New Zealand': 'Úc và New Zealand'
}; // không có trong bảng thì hiển thị nguyên văn tiếng Anh

// Màu theo châu lục: soft = nền nhạt, dark = chữ đậm, solid = màu đặc
const REGION_COLORS = {
  Asia:     { soft: '#FFE0E0', dark: '#B3302F', solid: '#FF6B6B' },
  Europe:   { soft: '#DCEBFF', dark: '#1F5FC4', solid: '#3A86FF' },
  Africa:   { soft: '#FFF1C2', dark: '#8A5F00', solid: '#FFC93C' },
  Americas: { soft: '#D3F5EC', dark: '#0E7A64', solid: '#2EC4A6' },
  Oceania:  { soft: '#E6E0FF', dark: '#5B44C2', solid: '#8A6FF0' }
};
const OTHER_COLORS = { soft: '#EEF2F7', dark: '#1F2A44', solid: '#8A94A8' };

// 3 tag của sổ tay hành trình
const TAGS = {
  not:  { emoji: '⏳', label: 'Chưa đến', desc: 'Mới thích thôi, chưa có kế hoạch', soft: '#EEF2F7', dark: '#1F2A44', solid: '#8A94A8' },
  will: { emoji: '✈️', label: 'Sẽ đến', desc: 'Bạn đang dự định ghé thăm', soft: '#DCEBFF', dark: '#1F5FC4', solid: '#3A86FF' },
  been: { emoji: '✅', label: 'Đã đến', desc: 'Bạn đã từng ghé nơi này', soft: '#D3F5EC', dark: '#0E7A64', solid: '#2EC4A6' }
};

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// ---------- 2. Tiện ích ----------

// Đọc / ghi Local Storage dạng JSON, lỗi thì trả giá trị mặc định
const store = {
  get(key, fallback) {
    try {
      const value = JSON.parse(localStorage.getItem(key));
      return value === null ? fallback : value;
    } catch (e) {
      return fallback;
    }
  },
  set(key, value) { localStorage.setItem(key, JSON.stringify(value)); },
  remove(key) { localStorage.removeItem(key); }
};

// BẮT BUỘC dùng khi chèn dữ liệu vào innerHTML để tránh chèn mã độc
function escapeHtml(str) {
  const map = { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' };
  return String(str ?? '').replace(/[&<>"']/g, ch => map[ch]);
}

// 98858950 -> "98.858.950"
function formatNumber(n) { return Number(n).toLocaleString('vi-VN'); }

// 98858950 -> "98,9 triệu"; số nhỏ hơn 1 triệu thì ghi đầy đủ
function formatPopulation(n) {
  if (n < 1000000) return formatNumber(n);
  return (n / 1000000).toLocaleString('vi-VN', { maximumFractionDigits: 1 }) + ' triệu';
}

// "2027-04-05" -> "05/04/2027"
function formatDate(iso) {
  if (!iso) return '';
  const [year, month, day] = iso.split('-');
  return `${day}/${month}/${year}`;
}

// Ngày hôm nay dạng "yyyy-mm-dd" (theo giờ máy người dùng)
function todayISO() {
  const d = new Date();
  return d.getFullYear() + '-' + String(d.getMonth() + 1).padStart(2, '0') + '-' + String(d.getDate()).padStart(2, '0');
}

// Chuỗi biến CSS để tô màu theo châu lục hoặc tag, ví dụ style="--soft:#FFE0E0;..."
function colorVars(c) { return `--soft:${c.soft};--dark:${c.dark};--solid:${c.solid}`; }

// Thông báo nhỏ ở góc dưới màn hình, tự ẩn sau 2,6 giây
function showToast(message) {
  let box = document.getElementById('toastBox');
  if (!box) {
    box = document.createElement('div');
    box.id = 'toastBox';
    box.className = 'toast-container position-fixed bottom-0 start-50 translate-middle-x p-3';
    box.setAttribute('aria-live', 'polite');
    document.body.appendChild(box);
  }
  const el = document.createElement('div');
  el.className = 'toast toast-x';
  el.innerHTML = `<div class="toast-body">${escapeHtml(message)}</div>`;
  box.appendChild(el);
  el.addEventListener('hidden.bs.toast', () => el.remove());
  new bootstrap.Toast(el, { delay: 2600 }).show();
}

// Hiện alert trong khung box (type: "coral" = lỗi, "mint" = thành công); message rỗng = xoá
function showAlert(box, message, type = 'coral') {
  box.innerHTML = message ? `<div class="alert alert-${type}" role="alert">${escapeHtml(message)}</div>` : '';
}

// Hiện lỗi dưới một ô nhập. Khung lỗi có id = id của ô + "Error"
function setFieldError(input, message) {
  const box = document.getElementById(input.id + 'Error');
  if (!box) return;
  box.textContent = message;
  input.classList.toggle('is-invalid', Boolean(message));
  input.setAttribute('aria-invalid', message ? 'true' : 'false');
}

// Hiện nhiều lỗi cùng lúc: errors = { idÔ: "thông báo" }. Trả về true nếu không có lỗi
function showErrors(errors) {
  let firstInvalid = null;
  for (const id in errors) {
    const input = document.getElementById(id);
    setFieldError(input, errors[id]);
    if (errors[id] && !firstInvalid) firstInvalid = input;
  }
  if (firstInvalid) firstInvalid.focus();
  return firstInvalid === null;
}

// Các quy tắc kiểm tra dùng chung cho Đăng ký và Hồ sơ (trả về "" nếu hợp lệ)
function checkName(value) {
  return value.trim().length >= 2 ? '' : 'Hãy nhập họ tên của bạn.';
}
function checkAge(value) {
  const age = Number(value);
  return value !== '' && Number.isInteger(age) && age >= 6 && age <= 100 ? '' : 'Tuổi cần là số từ 6 đến 100.';
}
function checkAddress(value) {
  const length = value.trim().length;
  return length >= 3 && length <= 120 ? '' : 'Hãy nhập địa chỉ của bạn.';
}

// ---------- 3. Tài khoản ----------

function getUsers() { return store.get('users', []); }
function findUser(email) { return getUsers().find(u => u.email === email); }

function registerUser({ name, age, email, address, password }) {
  const users = getUsers();
  email = email.trim().toLowerCase();
  if (users.some(u => u.email === email)) {
    return { ok: false, error: 'Email này đã được đăng ký. Hãy đăng nhập hoặc dùng email khác.' };
  }
  users.push({
    name: name.trim(), age: Number(age), email, address: address.trim(), phone: '', gender: '', avatar: '🦊',
    password, // CẢNH BÁO: lưu thẳng mật khẩu chỉ để làm bài demo. Web thật phải băm mật khẩu ở server!
    createdAt: Date.now()
  });
  store.set('users', users);
  store.set('currentUser', email); // đăng ký xong thì đăng nhập luôn
  return { ok: true };
}

function loginUser(email, password) {
  const user = findUser(email.trim().toLowerCase());
  if (!user || user.password !== password) {
    // Không nói rõ sai email hay sai mật khẩu để người lạ không dò được email
    return { ok: false, error: 'Email hoặc mật khẩu chưa đúng. Kiểm tra lại rồi thử nữa nhé.' };
  }
  store.set('currentUser', user.email);
  return { ok: true };
}

function logoutUser() { store.remove('currentUser'); }

function getCurrentUser() {
  const email = store.get('currentUser', null);
  return (email && findUser(email)) || null;
}

function updateUser(email, changes) {
  const users = getUsers();
  const user = users.find(u => u.email === email);
  Object.assign(user, changes);
  store.set('users', users);
  return user;
}

function changePassword(email, oldPw, newPw) {
  const user = findUser(email);
  if (user.password !== oldPw) return { ok: false, field: 'current', error: 'Mật khẩu hiện tại chưa đúng.' };
  if (oldPw === newPw) return { ok: false, field: 'new', error: 'Mật khẩu mới cần khác mật khẩu cũ.' };
  updateUser(email, { password: newPw });
  return { ok: true };
}

function deleteAccount(email) {
  store.set('users', getUsers().filter(u => u.email !== email));
  store.remove('trips_' + email);
  store.remove('currentUser');
}

// Tên file của trang đang mở, ví dụ "wishlist.html"
function currentPage() { return location.pathname.split('/').pop() || 'index.html'; }

// Trang cần đăng nhập: chưa đăng nhập thì chuyển sang trang Đăng nhập
function requireLogin() {
  const user = getCurrentUser();
  if (!user) location.replace('login.html?next=' + currentPage());
  return user;
}

// ---------- 4. Yêu thích (sổ tay hành trình) ----------

function getTrips(email) { return store.get('trips_' + email, []); }
function findTrip(email, code) { return getTrips(email).find(t => t.code === code); }

// "Chưa đến" không có ngày; "Đã đến" không được có ngày ở tương lai
function cleanDate(tag, date) {
  if (tag === 'not' || !date) return '';
  if (tag === 'been' && date > todayISO()) return '';
  return date;
}

function addTrip(email, country, { tag, date, note }) {
  const trips = getTrips(email);
  if (trips.some(t => t.code === country.code)) {
    return { ok: false, error: 'Quốc gia này đã có trong sổ tay. Hãy bấm Sửa ở danh sách để cập nhật.' };
  }
  trips.unshift({ // mới nhất lên đầu
    code: country.code, name: country.name, flag: country.flag,
    region: country.region, subregion: country.subregion, capital: country.capital,
    population: country.population, area: country.area,
    languages: country.languages, currencies: country.currencies,
    tag, date: cleanDate(tag, date), note: note.trim().slice(0, 200), savedAt: Date.now()
  });
  store.set('trips_' + email, trips);
  return { ok: true };
}

function updateTrip(email, code, changes) {
  const trips = getTrips(email);
  const trip = trips.find(t => t.code === code);
  if (!trip) return null;
  Object.assign(trip, changes);
  trip.date = cleanDate(trip.tag, trip.date);
  trip.note = trip.note.trim().slice(0, 200);
  store.set('trips_' + email, trips);
  return trip;
}

function removeTrip(email, code) { store.set('trips_' + email, getTrips(email).filter(t => t.code !== code)); }

// Ẩn/hiện ô ngày và đổi nhãn theo tag (dùng cho hộp thoại và form sổ tay)
function applyDateRule(tag, wrap, label, input) {
  wrap.hidden = tag === 'not';
  label.textContent = tag === 'been' ? 'Ngày đã đến (không bắt buộc)' : 'Ngày dự định (không bắt buộc)';
  if (tag === 'been') input.max = todayISO();
  else input.removeAttribute('max');
}

function checkTripDate(tag, date) {
  return tag === 'been' && date > todayISO() ? 'Ngày đã đến không thể ở tương lai.' : '';
}

// ---------- 5. API quốc gia ----------

// Đổi 1 quốc gia từ dạng của API sang dạng gọn mà web dùng
function normalizeCountry(c) {
  const names = c.names || {};
  const flag = c.flag || {};
  return {
    code: c.codes ? c.codes.alpha_3 : '',
    name: names.common || '',
    official: names.official || names.common || '',
    flag: flag.url_svg || flag.url_png || '',
    flagAlt: 'Quốc kỳ ' + names.common,
    capital: c.capitals && c.capitals.length ? c.capitals[0].name : 'Không có',
    region: c.region || '',
    subregion: c.subregion || '',
    population: c.population || 0,
    area: c.area ? c.area.kilometers : 0,
    // Object.values dùng được cho cả mảng lẫn object
    languages: Object.values(c.languages || {}).map(lang => lang.name || lang),
    currencies: Object.values(c.currencies || {}).map(m => (m.symbol ? `${m.name} (${m.symbol})` : m.name))
  };
}

async function fetchCountries() {
  // 1. Đã tải trong phiên này thì lấy lại từ sessionStorage
  try {
    const cached = JSON.parse(sessionStorage.getItem('countries'));
    if (Array.isArray(cached) && cached.length > 0) return cached;
  } catch (e) { /* cache hỏng thì tải lại */ }

  if (!API_KEY) throw new Error('Chưa có API key: hãy dán key vào biến API_KEY trong js/storage.js.');

  // 2. Gói miễn phí trả tối đa 100 nước mỗi lần, nên tải lần lượt từng trang
  let raw = [], offset = 0, more = true;
  while (more && offset < 1000) {
    const url = `${API_URL}?limit=100&offset=${offset}&response_fields=${API_FIELDS}`;
    const res = await fetch(url, { headers: { Authorization: 'Bearer ' + API_KEY } });
    const json = await res.json().catch(() => ({}));
    if (!res.ok) {
      const detail = json.errors && json.errors[0] ? json.errors[0].message : '';
      throw new Error(`API báo lỗi ${res.status}. ${detail}`);
    }
    raw = raw.concat(json.data.objects);
    more = json.data.meta && json.data.meta.more;
    offset += 100;
  }

  // 3. Chuẩn hoá, sắp xếp A → Z rồi lưu cache
  const countries = raw.map(normalizeCountry)
    .filter(c => c.code && c.name) // bỏ vài vùng lãnh thổ chưa có mã quốc gia (cca3)
    .sort((a, b) => a.name.localeCompare(b.name));
  try { sessionStorage.setItem('countries', JSON.stringify(countries)); } catch (e) { /* đầy bộ nhớ thì thôi */ }
  return countries;
}

// Tên tiếng Việt + màu của một châu lục
function getRegionStyle(region) {
  return { name: REGION_VI[region] || 'Khác', ...(REGION_COLORS[region] || OTHER_COLORS) };
}

// ---------- 6. Header ----------

// Điền khu vực tài khoản (#authArea) và đánh dấu liên kết của trang hiện tại
function renderHeaderAuth() {
  document.querySelectorAll('.main-nav .nav-link').forEach(link => {
    if (link.getAttribute('href') === currentPage()) link.setAttribute('aria-current', 'page');
    else link.removeAttribute('aria-current');
  });

  const area = document.getElementById('authArea');
  const user = getCurrentUser();

  // Link "Sổ tay hành trình" (header, footer) chỉ hiện khi đã đăng nhập
  document.querySelectorAll('.needs-login').forEach(el => { el.hidden = !user; });

  if (!area) return; // header bản gọn (đăng nhập / đăng ký) không có ô này
  if (!user) {
    area.innerHTML = `
      <a class="btn btn-outline-ink btn-sm-pill hide-mobile" href="login.html">Đăng nhập</a>
      <a class="btn btn-sun btn-sm-pill" href="register.html">Đăng ký</a>`;
    return;
  }
  area.innerHTML = `
    <div class="dropdown">
      <button class="account-chip" type="button" data-bs-toggle="dropdown" aria-expanded="false">
        <span class="account-avatar" aria-hidden="true">${escapeHtml(user.avatar)}</span>
        <span class="account-name">${escapeHtml(user.name)}</span><span aria-hidden="true">▾</span>
      </button>
      <ul class="dropdown-menu dropdown-menu-end account-menu">
        <li><a class="dropdown-item" href="profile.html">👤 Hồ sơ của tôi</a></li>
        <li><a class="dropdown-item" href="wishlist.html">📒 Sổ tay hành trình</a></li>
        <li><hr class="dropdown-divider"></li>
        <li><button class="dropdown-item text-coral" type="button" id="logoutBtn">🚪 Đăng xuất</button></li>
      </ul>
    </div>`;
  document.getElementById('logoutBtn').addEventListener('click', () => {
    logoutUser();
    location.href = 'index.html';
  });
}

renderHeaderAuth();
