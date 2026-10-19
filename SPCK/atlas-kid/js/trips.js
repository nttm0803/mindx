/* =========================================================
   trips.js – Sổ tay hành trình (CRUD yêu thích):
   thống kê, form thêm / sửa, lọc theo tag, đổi tag nhanh, xoá
   ========================================================= */

const user = requireLogin();   // chưa đăng nhập thì bị chuyển sang trang Đăng nhập
let countries = [];            // danh sách quốc gia cho ô chọn (từ API)
let editingCode = '';          // mã quốc gia đang sửa ("" = đang thêm mới)
let activeFilter = 'all';      // tab lọc đang chọn

const tripForm = document.getElementById('tripForm');
const countrySelect = document.getElementById('countrySelect');
const dateInput = document.getElementById('tripDate');
const noteInput = document.getElementById('tripNote');
const noteCount = document.getElementById('noteCount');
const formTitle = document.getElementById('formTitle');
const submitBtn = document.getElementById('submitBtn');
const cancelEditBtn = document.getElementById('cancelEditBtn');
const tripGrid = document.getElementById('tripGrid');
const tripEmpty = document.getElementById('tripEmpty');

// ---------- Vẽ thống kê, tab và danh sách ----------

function renderAll() {
  const trips = getTrips(user.email);
  const countTag = tag => trips.filter(t => t.tag === tag).length;

  document.getElementById('statTotal').textContent = trips.length;
  document.getElementById('statWill').textContent = countTag('will');
  document.getElementById('statBeen').textContent = countTag('been');

  document.querySelectorAll('.filter-tab').forEach(tab => {
    const key = tab.dataset.filter;
    tab.querySelector('.tab-count').textContent = key === 'all' ? trips.length : countTag(key);
    tab.setAttribute('aria-pressed', key === activeFilter);
  });

  const list = activeFilter === 'all' ? trips : trips.filter(t => t.tag === activeFilter);
  tripGrid.innerHTML = list.map(tripCardHtml).join('');

  tripEmpty.hidden = list.length > 0;
  tripEmpty.innerHTML = trips.length === 0
    ? '<p class="status-emoji" aria-hidden="true">📒</p><p class="fw-bold mb-0">Sổ tay còn trống. Chọn một quốc gia ở biểu mẫu bên cạnh, hoặc <a href="index.html">khám phá thêm ở trang chủ</a>.</p>'
    : '<p class="fw-bold mb-0">Chưa có quốc gia nào với tag này.</p>';
}

function tripCardHtml(t) {
  const region = getRegionStyle(t.region);
  const tag = TAGS[t.tag] || TAGS.not;
  const code = escapeHtml(t.code);
  const name = escapeHtml(t.name);
  const options = Object.keys(TAGS).map(key =>
    `<option value="${key}" ${key === t.tag ? 'selected' : ''}>${TAGS[key].emoji} ${TAGS[key].label}</option>`
  ).join('');
  const dateLine = t.date
    ? `<p class="trip-line">📅 ${t.tag === 'been' ? 'Ngày đến' : 'Dự định'}: <b>${escapeHtml(formatDate(t.date))}</b></p>`
    : '';
  const noteLine = t.note ? `<p class="trip-line">📝 ${escapeHtml(t.note)}</p>` : '';

  return `
    <article class="trip-card">
      <div class="trip-head" style="${colorVars(region)}">
        <img class="flag-round" src="${escapeHtml(t.flag)}" alt="Quốc kỳ ${name}">
        <div>
          <h3 class="trip-name">${name}</h3>
          <span class="region-badge on-white" style="${colorVars(region)}">${region.name}</span>
        </div>
        <button type="button" class="trip-heart" data-action="remove" data-code="${code}" aria-label="Bỏ yêu thích ${name}">❤️</button>
      </div>
      <div class="trip-body">
        <label class="tag-select-wrap" style="${colorVars(tag)}">
          <span class="visually-hidden">Đổi tag cho ${name}</span>
          <select class="tag-select" data-code="${code}">${options}</select>
        </label>
        <p class="trip-line">🏛️ Thủ đô: <b>${escapeHtml(t.capital)}</b> · 👥 <b>${formatPopulation(t.population)}</b></p>
        ${dateLine}
        ${noteLine}
      </div>
      <div class="trip-foot">
        <button type="button" class="btn btn-soft-blue btn-sm-pill" data-action="edit" data-code="${code}">✏️ Sửa</button>
        <button type="button" class="btn btn-coral btn-sm-pill" data-action="remove" data-code="${code}">💔 Bỏ yêu thích</button>
      </div>
    </article>`;
}

// ---------- Form thêm / sửa ----------

async function loadCountryOptions() {
  try {
    countries = await fetchCountries();
    countrySelect.innerHTML = '<option value="">Chọn quốc gia...</option>'
      + countries.map(c => `<option value="${escapeHtml(c.code)}">${escapeHtml(c.name)}</option>`).join('');
    if (editingCode) countrySelect.value = editingCode; // đang sửa dở thì chọn lại quốc gia
  } catch (err) {
    countrySelect.innerHTML = '<option value="">Chưa tải được danh sách quốc gia</option>';
  }
}

function selectedTag() {
  return tripForm.querySelector('input[name="tag"]:checked').value;
}

function updateDateField() {
  applyDateRule(selectedTag(), document.getElementById('tripDateWrap'), document.getElementById('tripDateLabel'), dateInput);
}

function updateNoteCount() {
  noteCount.textContent = `${noteInput.value.length}/200`;
}

function startEdit(code) {
  const trip = findTrip(user.email, code);
  if (!trip) return;
  editingCode = code;

  // Ô chọn có thể chưa có quốc gia này (API chưa tải xong) thì thêm tạm vào
  if (![...countrySelect.options].some(option => option.value === code)) {
    countrySelect.add(new Option(trip.name, trip.code));
  }
  countrySelect.value = code;
  countrySelect.disabled = true;
  tripForm.elements.tag.value = TAGS[trip.tag] ? trip.tag : 'not';
  dateInput.value = trip.date;
  noteInput.value = trip.note;

  formTitle.textContent = `Sửa ${trip.name}`;
  submitBtn.textContent = 'Lưu thay đổi';
  cancelEditBtn.hidden = false;
  showErrors({ countrySelect: '', tripDate: '' });
  updateDateField();
  updateNoteCount();
}

function resetForm() {
  editingCode = '';
  tripForm.reset();
  countrySelect.disabled = false;
  formTitle.textContent = 'Thêm quốc gia yêu thích';
  submitBtn.textContent = '❤️ Thêm vào yêu thích';
  cancelEditBtn.hidden = true;
  showErrors({ countrySelect: '', tripDate: '' });
  updateDateField();
  updateNoteCount();
}

tripForm.addEventListener('change', e => {
  if (e.target.name === 'tag') {
    updateDateField();
    setFieldError(dateInput, '');
  }
  if (e.target === countrySelect) setFieldError(countrySelect, '');
});
dateInput.addEventListener('input', () => setFieldError(dateInput, ''));
noteInput.addEventListener('input', updateNoteCount);
cancelEditBtn.addEventListener('click', resetForm);

tripForm.addEventListener('submit', e => {
  e.preventDefault();
  const data = { tag: selectedTag(), date: dateInput.value, note: noteInput.value };
  const dateError = checkTripDate(data.tag, data.date);

  if (editingCode) {
    // Sửa: không đổi quốc gia, chỉ đổi tag / ngày / ghi chú
    if (!showErrors({ tripDate: dateError })) return;
    const trip = updateTrip(user.email, editingCode, data);
    showToast(`Đã cập nhật ${trip.name}.`);
  } else {
    // Thêm mới: phải chọn quốc gia và không được trùng
    const country = countries.find(c => c.code === countrySelect.value);
    let countryError = country ? '' : 'Hãy chọn một quốc gia.';
    if (country && findTrip(user.email, country.code)) {
      countryError = 'Quốc gia này đã có trong sổ tay. Hãy bấm Sửa ở danh sách để cập nhật.';
    }
    if (!showErrors({ countrySelect: countryError, tripDate: dateError })) return;
    addTrip(user.email, country, data);
    showToast(`Đã lưu ${country.name} vào yêu thích.`);
  }
  resetForm();
  renderAll();
});

// ---------- Thao tác trên thẻ ----------

function removeOne(code) {
  const trip = findTrip(user.email, code);
  if (!trip || !confirm(`Bỏ ${trip.name} khỏi yêu thích?`)) return;
  removeTrip(user.email, code);
  if (editingCode === code) resetForm();
  showToast(`Đã bỏ ${trip.name} khỏi yêu thích.`);
  renderAll();
}

tripGrid.addEventListener('click', e => {
  const btn = e.target.closest('[data-action]');
  if (!btn) return;
  if (btn.dataset.action === 'edit') {
    startEdit(btn.dataset.code);
    // Trên điện thoại form nằm phía trên, cuộn lên cho thấy
    if (window.matchMedia('(max-width: 900px)').matches) tripForm.scrollIntoView({ block: 'start' });
    noteInput.focus({ preventScroll: true });
  } else {
    removeOne(btn.dataset.code);
  }
});

// Đổi tag nhanh ngay trên thẻ: lưu luôn
tripGrid.addEventListener('change', e => {
  if (!e.target.classList.contains('tag-select')) return;
  const code = e.target.dataset.code;
  const trip = updateTrip(user.email, code, { tag: e.target.value });
  showToast(`Đã đổi ${trip.name} sang ${TAGS[trip.tag].label}.`);
  if (editingCode === code) startEdit(code); // form đang sửa thẻ này thì cập nhật theo
  renderAll();
  const select = [...tripGrid.querySelectorAll('.tag-select')].find(s => s.dataset.code === code);
  if (select) select.focus(); // giữ chỗ cho người dùng bàn phím
});

document.querySelectorAll('.filter-tab').forEach(tab => {
  tab.addEventListener('click', () => {
    activeFilter = tab.dataset.filter;
    renderAll();
  });
});

// ---------- Khởi động ----------
if (user) {
  renderAll();
  updateDateField();
  loadCountryOptions();
}
