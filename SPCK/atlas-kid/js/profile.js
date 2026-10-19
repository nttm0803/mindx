/* =========================================================
   profile.js – Hồ sơ người dùng (CRUD tài khoản):
   xem thẻ danh tính, sửa thông tin, đổi mật khẩu, xoá tài khoản
   ========================================================= */

let user = requireLogin();   // dùng let vì sẽ gán lại sau khi lưu thông tin

const infoForm = document.getElementById('infoForm');
const passwordForm = document.getElementById('passwordForm');
const infoAlert = document.getElementById('infoAlert');
const passwordAlert = document.getElementById('passwordAlert');
const deleteConfirm = document.getElementById('deleteConfirm');
const deleteBtn = document.getElementById('deleteBtn');

// ---------- Thẻ danh tính (Read) ----------

function renderIdentity() {
  const trips = getTrips(user.email);
  // Nơi ở = phần sau dấu phẩy cuối của địa chỉ, ví dụ "Quận Hải Châu, Đà Nẵng" -> "Đà Nẵng"
  const place = user.address.split(',').pop().trim() || user.address;
  const joined = new Date(user.createdAt).toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit', year: 'numeric' });

  document.getElementById('idAvatar').textContent = user.avatar;
  document.getElementById('idName').textContent = user.name;
  document.getElementById('idEmail').textContent = user.email;
  document.getElementById('idAge').textContent = `🎂 ${user.age} tuổi`;
  document.getElementById('idPlace').textContent = `📍 ${place}`;
  document.getElementById('idTotal').textContent = trips.length;
  document.getElementById('idBeen').textContent = trips.filter(t => t.tag === 'been').length;
  document.getElementById('idJoined').textContent = 'Tham gia từ ' + joined;
  document.getElementById('deleteEmail').textContent = user.email;
}

// ---------- Tab 1: Sửa thông tin (Update) ----------

// Điền lại form bằng dữ liệu đã lưu và xoá hết lỗi (dùng cho nút Huỷ)
function fillInfoForm() {
  const f = infoForm.elements;
  f.pName.value = user.name;
  f.pEmail.value = user.email;
  f.pAge.value = user.age;
  f.pGender.value = user.gender;
  f.pPhone.value = user.phone;
  f.pAddress.value = user.address;
  f.avatar.value = user.avatar;   // chọn đúng ô ảnh đại diện
  showErrors({ pName: '', pAge: '', pPhone: '', pAddress: '' });
}

// Hiện alert thành công rồi tự ẩn sau 3 giây
function flashSuccess(box, message) {
  showAlert(box, message, 'mint');
  clearTimeout(box.hideTimer);
  box.hideTimer = setTimeout(() => showAlert(box, ''), 3000);
}

infoForm.addEventListener('input', e => setFieldError(e.target, ''));
document.getElementById('infoCancel').addEventListener('click', fillInfoForm);

infoForm.addEventListener('submit', e => {
  e.preventDefault();
  const f = infoForm.elements;
  const phone = f.pPhone.value.replace(/\s/g, ''); // bỏ khoảng trắng trước khi kiểm tra
  const isValid = showErrors({
    pName: checkName(f.pName.value),
    pAge: checkAge(f.pAge.value),
    pPhone: phone === '' || /^(0|\+84)\d{9}$/.test(phone) ? '' : 'Số điện thoại chưa đúng, ví dụ: 0905 123 456.',
    pAddress: checkAddress(f.pAddress.value)
  });
  if (!isValid) return;

  user = updateUser(user.email, {
    name: f.pName.value.trim(),
    age: Number(f.pAge.value),
    gender: f.pGender.value,
    phone: f.pPhone.value.trim(),
    address: f.pAddress.value.trim(),
    avatar: f.avatar.value || user.avatar
  });
  renderIdentity();
  renderHeaderAuth(); // tên và ảnh đại diện trên header đổi ngay
  flashSuccess(infoAlert, '✔ Đã cập nhật thông tin của bạn.');
});

// ---------- Tab 2: Đổi mật khẩu ----------

passwordForm.addEventListener('input', e => setFieldError(e.target, ''));

passwordForm.addEventListener('submit', e => {
  e.preventDefault();
  const f = passwordForm.elements;
  const isValid = showErrors({
    pwCurrent: f.pwCurrent.value ? '' : 'Mật khẩu hiện tại chưa đúng.',
    pwNew: f.pwNew.value.length >= 6 ? '' : 'Mật khẩu cần ít nhất 6 ký tự.',
    pwConfirm: f.pwConfirm.value === f.pwNew.value ? '' : 'Hai mật khẩu chưa giống nhau.'
  });
  if (!isValid) return;

  const result = changePassword(user.email, f.pwCurrent.value, f.pwNew.value);
  if (!result.ok) {
    showErrors({ [result.field === 'current' ? 'pwCurrent' : 'pwNew']: result.error });
    return;
  }
  passwordForm.reset();
  flashSuccess(passwordAlert, '✔ Đã đổi mật khẩu.');
});

// ---------- Tab 3: Xoá tài khoản (Delete) ----------

// Mỗi lần mở hộp thoại thì xoá ô xác nhận và khoá nút
document.getElementById('deleteModal').addEventListener('show.bs.modal', () => {
  deleteConfirm.value = '';
  deleteBtn.disabled = true;
});

// Chỉ bật nút khi gõ đúng email của mình
deleteConfirm.addEventListener('input', () => {
  deleteBtn.disabled = deleteConfirm.value.trim().toLowerCase() !== user.email;
});

deleteBtn.addEventListener('click', () => {
  deleteAccount(user.email);
  location.href = 'index.html?deleted=1';
});

// ---------- Khởi động ----------
if (user) {
  renderIdentity();
  fillInfoForm();
}
