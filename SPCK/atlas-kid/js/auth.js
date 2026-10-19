/* =========================================================
   auth.js – Đăng ký (register.html) và Đăng nhập (login.html)
   ========================================================= */

// Trang cần quay lại sau khi đăng nhập. Chỉ nhận dạng "ten-trang.html" cho an toàn
function getNextPage() {
  const next = new URLSearchParams(location.search).get('next') || '';
  const isValid = /^[\w-]+\.html$/.test(next) && next !== 'login.html' && next !== 'register.html';
  return isValid ? next : 'index.html';
}

// Đã đăng nhập rồi thì không cần ở trang này nữa
if (getCurrentUser()) location.replace(getNextPage());

// Giữ tham số "next" khi chuyển qua lại giữa Đăng nhập và Đăng ký
document.querySelectorAll('.keep-next').forEach(link => {
  link.href = link.getAttribute('href') + '?next=' + getNextPage();
});

function checkEmail(value) {
  return EMAIL_PATTERN.test(value.trim()) ? '' : 'Email chưa đúng định dạng, ví dụ: ban@gmail.com';
}

// ---------- Đăng ký ----------
const registerForm = document.getElementById('registerForm');

if (registerForm) {
  const registerAlert = document.getElementById('registerAlert');

  // Người dùng sửa ô nào thì xoá lỗi của ô đó
  registerForm.addEventListener('input', e => {
    setFieldError(e.target, '');
    showAlert(registerAlert, '');
  });

  registerForm.addEventListener('submit', e => {
    e.preventDefault();
    const f = registerForm.elements;
    const isValid = showErrors({
      regName: checkName(f.regName.value),
      regAge: checkAge(f.regAge.value),
      regEmail: checkEmail(f.regEmail.value),
      regAddress: checkAddress(f.regAddress.value),
      regPassword: f.regPassword.value.length >= 6 ? '' : 'Mật khẩu cần ít nhất 6 ký tự.',
      regConfirm: f.regConfirm.value === f.regPassword.value ? '' : 'Hai mật khẩu chưa giống nhau.'
    });
    if (!isValid) return;

    const result = registerUser({
      name: f.regName.value,
      age: f.regAge.value,
      email: f.regEmail.value,
      address: f.regAddress.value,
      password: f.regPassword.value
    });
    if (!result.ok) {
      showAlert(registerAlert, result.error);
      return;
    }
    location.href = getNextPage();
  });
}

// ---------- Đăng nhập ----------
const loginForm = document.getElementById('loginForm');

if (loginForm) {
  const loginAlert = document.getElementById('loginAlert');

  loginForm.addEventListener('input', e => {
    setFieldError(e.target, '');
    showAlert(loginAlert, '');
  });

  loginForm.addEventListener('submit', e => {
    e.preventDefault();
    const f = loginForm.elements;
    const isValid = showErrors({
      loginEmail: checkEmail(f.loginEmail.value),
      loginPassword: f.loginPassword.value ? '' : 'Hãy nhập mật khẩu.'
    });
    if (!isValid) return;

    const result = loginUser(f.loginEmail.value, f.loginPassword.value);
    if (!result.ok) {
      showAlert(loginAlert, result.error);
      return;
    }
    location.href = getNextPage();
  });
}
