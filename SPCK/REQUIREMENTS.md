# Atlas Nhí – Requirements để implement

> Tài liệu này là nguồn sự thật duy nhất để Claude Code xây dựng website **Atlas Nhí**.
> Ảnh thiết kế nằm trong thư mục `design/` (xem mục 14). Khi có mâu thuẫn giữa văn bản và ảnh về
> **bố cục, màu sắc, hình dáng** thì theo ảnh; về **hành vi, dữ liệu, validation** thì theo tài liệu này.

---

## 1. Tổng quan

**Atlas Nhí** là website tra cứu thông tin các quốc gia và lập "sổ tay hành trình" cá nhân, dành cho học sinh yêu địa lý (khoảng 11–18 tuổi).

- Dữ liệu quốc gia lấy từ API công khai `https://restcountries.com`.
- Người dùng đăng ký, đăng nhập, lưu quốc gia yêu thích và gắn tag **Chưa đến / Sẽ đến / Đã đến**.
- Người dùng quản lý hồ sơ cá nhân (sửa thông tin, đổi mật khẩu, xoá tài khoản).
- Toàn bộ dữ liệu người dùng lưu trong **Local Storage** (không có backend).
- Ngôn ngữ giao diện: **tiếng Việt**.

Đây là bài tập môn Tin học, nên code phải **đơn giản, dễ đọc, dễ giải thích**, ưu tiên cách làm cơ bản hơn là kỹ thuật cao siêu.

## 2. Ràng buộc kỹ thuật (bắt buộc)

| Hạng mục | Yêu cầu |
|---|---|
| Công nghệ | HTML5, CSS3, **Bootstrap 5.3.3** (CDN), **JavaScript thuần (ES6+)** |
| Cấm | Framework JS (React, Vue…), bundler/build step, npm dependencies, jQuery, backend |
| Chạy | Mở `index.html` bằng trình duyệt hoặc Live Server là chạy, không cần cài đặt |
| Lưu trữ | `localStorage` (người dùng, phiên, yêu thích), `sessionStorage` (cache API) |
| Icon | Emoji (không dùng thư viện icon) |
| Phông | Google Fonts: **Baloo 2** (tiêu đề), **Nunito** (nội dung), có subset tiếng Việt |
| Trình duyệt | Chrome, Edge, Firefox, Safari bản mới |
| Code style | Comment ngắn bằng tiếng Việt, tên biến/hàm tiếng Anh, mỗi file JS dưới ~300 dòng |

CDN dùng (ghim phiên bản):

```html
<link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css" rel="stylesheet">
<script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/js/bootstrap.bundle.min.js"></script>
<link href="https://fonts.googleapis.com/css2?family=Baloo+2:wght@600;700;800&family=Nunito:wght@400;600;700;800&display=swap" rel="stylesheet">
```

## 3. Đối chiếu bảng điểm (phải đáp ứng đủ)

Nhóm tư duy máy tính (6 tiêu chí):

| # | Tiêu chí | Cách đáp ứng |
|---|---|---|
| 1 | Đủ header, body, footer cho mỗi trang | Mọi trang HTML đều có `<header>`, `<main>`, `<footer>` viết **tĩnh** trong file (không chèn bằng JS) |
| 2 | Bố cục đáp ứng đa thiết bị | Responsive cho **tất cả** trang, kiểm tra ở 390px, 768px, 1440px |
| 3 | Dùng dữ liệu từ API ngoài | `fetch` restcountries.com, hiển thị lên trang chủ, hộp thoại, form chọn quốc gia |
| 4 | Tận dụng **CSS Grid** | Tự viết `display:grid` cho: lưới quốc gia, lưới yêu thích, ô thống kê, footer, bố cục hồ sơ/sổ tay, ô thông tin trong hộp thoại, bố cục trang đăng nhập/đăng ký, 3 bước "Cách dùng" |
| 5 | Đăng nhập/đăng ký + lưu Local Storage | Mục 7 |
| 6 | Đầy đủ CRUD | CRUD yêu thích (mục 9) và CRUD hồ sơ người dùng (mục 10) |

Nhóm tư duy sáng tạo: ý tưởng hợp độ tuổi (có trường tuổi, giao diện vui mắt); nội dung độc đáo (sổ tay với tag hành trình, màu riêng cho từng châu lục); bố cục/màu sắc/icon rõ ràng (dùng mã Hex và RGB, emoji); có giá trị thực tế (thông tin quốc gia thật).

> Lưu ý: Bootstrap mặc định dùng Flexbox. Các vùng nêu ở tiêu chí 4 **phải tự viết CSS Grid** trong `custom.css`, không dùng `row/col` của Bootstrap cho những vùng đó. Bootstrap dùng cho navbar, dropdown, modal, tab, form, alert, toast, nút.

## 4. Cấu trúc thư mục

```
atlas-nhi/
├── index.html          Trang chủ (khám phá quốc gia)
├── login.html          Đăng nhập
├── register.html       Đăng ký
├── wishlist.html       Sổ tay hành trình (CRUD yêu thích)
├── profile.html        Hồ sơ người dùng
├── css/
│   └── custom.css      Biến màu, ghi đè Bootstrap, CSS Grid, responsive
├── js/
│   ├── storage.js      Dữ liệu (users, session, trips), API, tiện ích, header
│   ├── home.js         Trang chủ + hộp thoại chi tiết + lưu yêu thích
│   ├── auth.js         Đăng ký + đăng nhập
│   ├── trips.js        Trang sổ tay (CRUD yêu thích)
│   └── profile.js      Trang hồ sơ
├── design/             Ảnh thiết kế (14 file PNG, xem mục 14)
└── README.md           Hướng dẫn chạy + mô tả ngắn
```

Thứ tự nạp script trên mỗi trang: `bootstrap.bundle` → `storage.js` → file riêng của trang.

## 5. Design system

### 5.1 Màu (đặt trong `:root` của `custom.css`)

```css
:root{
  --ink:#1F2A44;        /* chữ chính, footer */
  --blue:#2F6FE0;       /* nút phụ, liên kết, khung auth */
  --blue-dk:#1B4FA8;
  --blue-soft:#DCEBFF;
  --sun:#FFC93C;        /* nút chính (chữ màu --ink) */
  --sun-dk:#E0A800;
  --sun-soft:#FFF1C2;
  --coral:#FF6B6B;
  --coral-soft:#FFE0E0;
  --mint:#2EC4A6;
  --mint-soft:#D3F5EC;
  --grape:#8A6FF0;
  --grape-soft:#E6E0FF;
  --bg:#F5FAFF;         /* nền trang */
  --line:rgb(31 42 68 / .1);
  --shadow-card:0 6px 0 rgb(31 42 68 / .08);
}
```

Ghi đè biến Bootstrap tương ứng (`--bs-body-bg`, `--bs-body-color`, `--bs-body-font-family`, `--bs-primary`…) để Bootstrap đồng bộ với bảng màu.

### 5.2 Màu theo châu lục (dùng cho nền thẻ, badge)

| `region` (API) | Tên Việt | Nền nhạt | Chữ đậm | Màu đặc |
|---|---|---|---|---|
| Asia | Châu Á | `#FFE0E0` | `#B3302F` | `#FF6B6B` |
| Europe | Châu Âu | `#DCEBFF` | `#1F5FC4` | `#3A86FF` |
| Africa | Châu Phi | `#FFF1C2` | `#8A5F00` | `#FFC93C` |
| Americas | Châu Mỹ | `#D3F5EC` | `#0E7A64` | `#2EC4A6` |
| Oceania | Châu Đại Dương | `#E6E0FF` | `#5B44C2` | `#8A6FF0` |
| Antarctic / khác | Châu Nam Cực / Khác | `#EEF2F7` | `#1F2A44` | `#8A94A8` |

### 5.3 Tag yêu thích

| Key | Emoji | Nhãn | Mô tả (hiện trong hộp thoại) | Nền | Chữ | Màu đặc |
|---|---|---|---|---|---|---|
| `not` | ⏳ | Chưa đến | Mới thích thôi, chưa có kế hoạch | `#EEF2F7` | `#1F2A44` | `#8A94A8` |
| `will` | ✈️ | Sẽ đến | Bạn đang dự định ghé thăm | `#DCEBFF` | `#1F5FC4` | `#3A86FF` |
| `been` | ✅ | Đã đến | Bạn đã từng ghé nơi này | `#D3F5EC` | `#0E7A64` | `#2EC4A6` |

### 5.4 Phông, hình dáng, thành phần

- Tiêu đề (`h1–h3`, logo, số liệu lớn): **Baloo 2**, weight 800 (h3 nhỏ có thể 700). Nội dung: **Nunito** 16px, `line-height:1.55`, chữ đậm dùng weight 700–800.
- Nút: dạng viên thuốc (`border-radius:999px`), có "đáy" nổi: `box-shadow:0 4px 0 <màu đậm hơn>`. Nút chính = nền `--sun`, chữ `--ink`. Nút phụ = nền `--blue`, chữ trắng. Nút viền = nền trắng, viền 2px `--ink`. Nút "Sửa" = nền `--blue-soft`/chữ `#1F5FC4`. Nút "Xoá/Bỏ yêu thích" = nền `--coral-soft`/chữ `#B3302F`.
- Thẻ/panel: nền trắng, `border-radius:26px` (panel lớn 28px), viền 2px `--line`, `box-shadow: var(--shadow-card)`.
- Cờ quốc gia hiển thị **hình tròn** (`border-radius:50%`, viền trắng 6px, đổ bóng nhẹ), dùng ảnh `flags.svg` từ API, `object-fit:cover`.
- Ô nhập: `border-radius:16px`, viền 2px `--line`. Khi focus: viền `--blue` + vòng sáng `0 0 0 4px rgb(47 111 224 / .22)`. Khi lỗi: viền `--coral`, nền `#FFF6F6`, thông báo lỗi chữ `#B3302F` weight 700 cỡ 14px bên dưới ô.
- Hero: nền `--blue-soft`, bo dưới `56px`. Footer: nền `--ink`, chữ trắng 82%, bo trên `40px`.
- Contrast: chữ trên nền màu luôn dùng tông đậm cùng họ màu (bảng 5.2, 5.3), không dùng chữ trắng trên `--sun`/`--mint`.
- `:focus-visible` luôn thấy rõ (viền 3px `--sun` hoặc vòng sáng xanh).
- `@media (prefers-reduced-motion: reduce)` tắt hiệu ứng.

## 6. Thành phần dùng chung (mọi trang)

### 6.1 Header (`<header>`, viết tĩnh trong mỗi file)

Bootstrap navbar, nền trắng, viền dưới 2px `--line`, nội dung nằm trong container tối đa 1200px.

- Trái: logo tròn nền `--sun` chứa 🌍 + chữ "Atlas Nhí" (Baloo 2, 800, 27px).
- Giữa: 2 liên kết dạng viên thuốc: **Khám phá** (`index.html`), **Sổ tay hành trình** (`wishlist.html`). Trang hiện tại có nền `--blue-soft` và chữ `#1F5FC4` (`aria-current="page"`).
- Phải (`<div id="authArea">`, do `storage.js` điền):
  - **Khách**: nút viền "Đăng nhập" (`login.html`) + nút vàng "Đăng ký" (`register.html`).
  - **Đã đăng nhập**: Bootstrap dropdown dạng chip: avatar emoji trong vòng tròn nền `--sun-soft` + họ tên + ▾. Menu: `👤 Hồ sơ của tôi` (`profile.html`, mục đầu nền `--blue-soft`), `📒 Sổ tay hành trình`, đường kẻ, `🚪 Đăng xuất` (chữ `#B3302F`). Bấm Đăng xuất: xoá `currentUser`, chuyển về `index.html`.
- Mobile (≤700px): logo và khu vực tài khoản cùng một hàng, nav xuống hàng dưới; ẩn nút "Đăng nhập" dạng viền để tiết kiệm chỗ (chỉ còn "Đăng ký") hoặc dùng navbar-toggler của Bootstrap, miễn không vỡ bố cục.

### 6.2 Footer (`<footer>`, viết tĩnh)

CSS Grid 3 cột `2fr 1fr 1fr` (1 cột trên mobile):

1. "🌍 Atlas Nhí" + mô tả: "Công cụ tra cứu quốc gia và lập sổ tay hành trình dành cho học sinh yêu địa lý, thích khám phá thế giới."
2. "Trang web": Khám phá quốc gia, Sổ tay hành trình, Đăng nhập, Đăng ký (liên kết thật).
3. "Nguồn dữ liệu": liên kết `https://restcountries.com` (mở tab mới, `rel="noopener"`).

Dòng cuối: "© 2026 Atlas Nhí – Sản phẩm học tập môn Tin học."

### 6.3 Thông báo

- Toast Bootstrap góc dưới giữa màn hình, tự ẩn sau ~2,6 giây, `aria-live="polite"`. Hàm `showToast(message)` trong `storage.js`.
- Cảnh báo trong form: Bootstrap `alert` (lỗi nền `--coral-soft`, thành công nền `--mint-soft` chữ `#0E7A64`).

### 6.4 Bảo vệ trang

`wishlist.html` và `profile.html` gọi `requireLogin()` ngay khi tải. Chưa đăng nhập thì chuyển tới `login.html?next=<tên-file>`. `login.html` và `register.html`: nếu đã đăng nhập thì chuyển tới `next` hoặc `index.html`. Tham số `next` chỉ chấp nhận mẫu `^[\w-]+\.html$`, không hợp lệ thì dùng `index.html`.

## 7. Tài khoản: đăng ký và đăng nhập

### 7.1 Mô hình dữ liệu `users` (Local Storage, key `users`, mảng)

```js
{
  name: "Minh Anh",
  age: 16,                       // số nguyên
  email: "minhanh@gmail.com",    // luôn lưu chữ thường, đã trim, là khoá duy nhất
  address: "Quận Hải Châu, Đà Nẵng",
  phone: "",                     // tuỳ chọn, điền ở trang Hồ sơ
  gender: "",                    // "", "Nữ", "Nam", "Khác", "Không muốn nói"
  avatar: "🦊",                  // 1 trong 🦊🐼🐯🐸🦉🐧
  password: "…",                 // lưu thẳng (bài demo). Thêm comment cảnh báo trong code
  createdAt: 1760000000000       // Date.now()
}
```

Phiên: key `currentUser` = email của người đang đăng nhập (chuỗi).

### 7.2 Trang đăng ký (`register.html`) – ảnh `05`, `09`

Bố cục CSS Grid 2 cột (1 cột trên mobile): trái là panel nền `--blue` chữ trắng (tiêu đề "Tạo sổ tay hành trình của riêng bạn", 3 ý có emoji: 🌏 Lưu bao nhiêu quốc gia tuỳ thích / 📝 Viết ghi chú cho từng điểm đến / 👤 Cập nhật hồ sơ bất cứ lúc nào, hàng 5 cờ tròn); phải là thẻ form trắng.

Trường và validation (kiểm tra khi submit, hiện lỗi ngay dưới từng ô, xoá lỗi khi người dùng sửa):

| Trường | Quy tắc | Thông báo lỗi |
|---|---|---|
| Họ và tên | bắt buộc, từ 2 ký tự (sau trim) | "Hãy nhập họ tên của bạn." |
| Tuổi | bắt buộc, số nguyên 6–100 | "Tuổi cần là số từ 6 đến 100." |
| Email | đúng định dạng `^[^\s@]+@[^\s@]+\.[^\s@]+$` | "Email chưa đúng định dạng, ví dụ: ban@gmail.com" |
| Địa chỉ | bắt buộc, 3–120 ký tự | "Hãy nhập địa chỉ của bạn." |
| Mật khẩu | từ 6 ký tự (gợi ý nhỏ dưới ô: "Ít nhất 6 ký tự") | "Mật khẩu cần ít nhất 6 ký tự." |
| Nhập lại mật khẩu | trùng mật khẩu | "Hai mật khẩu chưa giống nhau." |

Email đã tồn tại (không phân biệt hoa thường): hiện alert "Email này đã được đăng ký. Hãy đăng nhập hoặc dùng email khác." Thành công: tạo user (avatar mặc định 🦊, các trường còn lại rỗng), đặt `currentUser`, chuyển tới `next`/`index.html`. Dưới form: "Đã có tài khoản? **Đăng nhập**".

### 7.3 Trang đăng nhập (`login.html`) – ảnh `04`

Cùng bố cục. Panel trái: "Chào mừng bạn quay lại!" + 3 ý (📍 Xem lại những nơi bạn muốn đến / ✏️ Cập nhật ghi chú và kế hoạch / 🏁 Đánh dấu những quốc gia đã đến). Form: Email, Mật khẩu. Sai thông tin: alert "Email hoặc mật khẩu chưa đúng. Kiểm tra lại rồi thử nữa nhé." (không tiết lộ email có tồn tại hay không). Dưới form: "Chưa có tài khoản? **Đăng ký ngay**".

## 8. Trang chủ (`index.html`) – ảnh `01`, `03`, `10`

### 8.1 Gọi API

Endpoint (tối đa 10 field, bắt buộc có `fields`):

```
https://restcountries.com/v3.1/all?fields=name,flags,capital,region,subregion,population,area,languages,currencies,cca3
```

`fetchCountries()` (trong `storage.js`): đọc cache `sessionStorage` (`countries`) trước; nếu chưa có thì `fetch`, kiểm tra `res.ok`, chuẩn hoá thành mảng object bên dưới, sắp theo tên A→Z, lưu cache, trả về.

```js
{
  code: "VNM",                    // cca3, khoá duy nhất
  name: "Vietnam",               // name.common
  official: "Socialist Republic of Vietnam",
  flag: "https://flagcdn.com/vn.svg",   // flags.svg (fallback flags.png)
  flagAlt: "…",                  // flags.alt hoặc "Quốc kỳ " + name
  capital: "Hanoi",              // capital[0] hoặc "Không có"
  region: "Asia",
  subregion: "South-Eastern Asia",
  population: 98858950,
  area: 331212,
  languages: ["Vietnamese"],     // Object.values(languages)
  currencies: ["Vietnamese đồng (₫)"]  // "name (symbol)"
}
```

Trạng thái: đang tải (Bootstrap spinner + "Đang tải dữ liệu từ restcountries.com..."); lỗi (khung thông báo "Chưa tải được dữ liệu. Hãy kiểm tra kết nối mạng rồi thử lại." + nút "Tải lại"); rỗng ("Không có quốc gia nào khớp bộ lọc. Hãy thử từ khoá khác hoặc bỏ chọn châu lục.").

### 8.2 Bố cục (từ trên xuống)

1. **Hero** (nền `--blue-soft`, bo dưới 56px), CSS Grid 2 cột `1.1fr .9fr` (1 cột trên mobile):
   - Trái: `h1` "Cùng khám phá thế giới, từng quốc gia một!" (Baloo 2, 800, ~58px, mobile ~38px); đoạn dẫn "Tra cứu thủ đô, dân số, ngôn ngữ, tiền tệ của hơn 240 quốc gia. Thích nơi nào, lưu ngay vào sổ tay hành trình của riêng bạn."; **ô tìm kiếm** dạng viên thuốc (🔍 + input placeholder "Thử gõ: Japan, Paris, Brazil…" + nút vàng "Tìm ngay"); hàng **chip châu lục** (chấm màu + tên, dùng màu đặc ở bảng 5.2).
   - Phải: hình quả địa cầu (SVG ở Phụ lục A) + 4 "huy hiệu" cờ tròn (VNM, JPN, FRA, BRA lấy `flag` từ dữ liệu API sau khi tải, ẩn nếu chưa có) + 2 bong bóng chữ "Xin chào! 👋" và "+240 quốc gia".
2. **Danh sách quốc gia** (container 1200px):
   - Tiêu đề "Danh sách quốc gia" + phụ đề "Chạm vào một thẻ để xem đầy đủ thông tin."; bên phải là `<select>` sắp xếp dạng viên thuốc: Tên A → Z (mặc định), Dân số đông nhất, Diện tích lớn nhất. **[Should]**
   - Dòng đếm: "Đang hiển thị 24 / 250 quốc gia" (`aria-live="polite"`).
   - Lưới thẻ (**CSS Grid**): desktop `repeat(auto-fill, minmax(240px,1fr))` gap 24px (4 cột ở 1200px); mobile ≤700px: **2 cột** gap 14px.
   - Nút xanh "Xem thêm quốc gia" cuối lưới: mỗi lần thêm 24 thẻ (`PAGE_SIZE = 24`), ẩn khi đã hết.
3. **Cách dùng sổ tay** (3 thẻ, **CSS Grid** 3 cột, 1 cột trên mobile): tiêu đề "Sổ tay hành trình hoạt động thế nào?", phụ đề "Ba bước đơn giản, dùng được ngay sau khi đăng ký."
   - Nền `--blue-soft`: 🔍 **Tìm quốc gia** – "Gõ tên hoặc lọc theo châu lục để tìm nơi bạn tò mò."
   - Nền `--sun-soft`: 📝 **Lưu vào sổ tay** – "Thêm ngày dự định và ghi chú: bạn muốn ăn gì, xem gì ở đó?"
   - Nền `--mint-soft`: 🏁 **Đánh dấu "Đã đến"** – "Khi hoàn thành chuyến đi, đổi trạng thái để thu thập đủ tem."
   - Mỗi thẻ có ô emoji bo tròn nền trắng và số 1/2/3 mờ ở góc phải.

### 8.3 Tìm kiếm và lọc

- Tìm theo `name`, `official`, `capital` (không phân biệt hoa thường, `includes`). Lọc khi gõ (sự kiện `input`) và khi bấm "Tìm ngay"/Enter.
- Chip châu lục: bấm để lọc theo `region` (Asia, Europe, Africa, Americas, Oceania), bấm lại để bỏ lọc; chip đang chọn có viền đậm. **[Should]**
- Mọi bộ lọc kết hợp (AND). Đổi bộ lọc thì quay về trang đầu (24 thẻ đầu).

### 8.4 Thẻ quốc gia

Từ trên xuống: dải nền nhạt theo châu lục chứa cờ tròn 104px (mobile 76px) và **nút tim** ở góc phải trên (vòng tròn trắng 40px: 🤍 chưa yêu thích, ❤️ đã yêu thích với nền `--coral-soft`); thân thẻ gồm badge tên châu lục (màu bảng 5.2), tên quốc gia (Baloo 2, 800, 24px), `🏛️ Thủ đô: <b>…</b>`, `👥 Dân số: <b>…</b>`, và nếu đã yêu thích: chip tag (màu bảng 5.3, ví dụ "✈️ Sẽ đến").

Dân số rút gọn: ≥ 1.000.000 → "98,9 triệu" (1 chữ số thập phân, dấu phẩy, bỏ ",0"); nhỏ hơn thì dùng `toLocaleString('vi-VN')`. Trong hộp thoại dùng số đầy đủ "98.858.950 người".

Bấm vào thẻ **hoặc** nút tim (dùng `stopPropagation` nếu cần) đều mở hộp thoại chi tiết. Thẻ là `<button>` hoặc có `role="button"` + `tabindex="0"` + phím Enter/Space.

### 8.5 Hộp thoại chi tiết (Bootstrap modal, `modal-xl`, bo 32px) – ảnh `02`, `11`, `12`

CSS Grid 2 cột bằng nhau (xếp 1 cột trên mobile), nút ✕ ở góc phải trên.

**Cột trái (thông tin):** dải nền nhạt theo châu lục chứa cờ tròn 112px, tên quốc gia (Baloo 2, 34px), badge tên chính thức (`official`). Dưới là lưới ô thông tin 2 cột (**CSS Grid**), mỗi ô một màu cố định theo vai trò:

| Ô | Nội dung | Nền / chữ |
|---|---|---|
| Thủ đô | `capital` | `#FFE0E0` / `#B3302F` |
| Khu vực | "Châu Á – Đông Nam Á" (tên châu + `subregion` dịch ở mục 8.6) | `#DCEBFF` / `#1F5FC4` |
| Dân số | "98.858.950 người" | `#D3F5EC` / `#0E7A64` |
| Diện tích | "331.212 km²" | `#E6E0FF` / `#5B44C2` |
| Ngôn ngữ (rộng 2 cột) | `languages.join(", ")` hoặc "Chưa có dữ liệu" | `#FFF1C2` / `#8A5F00` |
| Tiền tệ (rộng 2 cột) | `currencies.join(", ")` hoặc "Chưa có dữ liệu" | `#D3F5EC` / `#0E7A64` |

**Cột phải (3 trạng thái):**

1. **Khách (chưa đăng nhập)**: biểu tượng 🔒 trong vòng tròn nền `--sun-soft`, tiêu đề "Đăng nhập để lưu yêu thích", đoạn "Sau khi đăng nhập, bạn có thể lưu quốc gia này và gắn tag **Chưa đến**, **Sẽ đến** hoặc **Đã đến**.", nút vàng "Đăng nhập" (`login.html?next=index.html`) và nút viền "Tạo tài khoản mới" (`register.html?next=index.html`).
2. **Đã đăng nhập, chưa lưu**: tiêu đề "❤️ Lưu vào yêu thích"; nhãn "Bạn và {tên} thế nào rồi?"; **3 lựa chọn tag** xếp dọc (mỗi hàng: ô emoji, nhãn đậm + mô tả nhỏ, vòng tròn tick bên phải; hàng đang chọn có viền 3px màu đặc, nền nhạt của tag; đây là `radio` thật ẩn bên trong để bàn phím dùng được); mặc định chọn **Sẽ đến**; ô ngày; ô ghi chú (`textarea`, tối đa 200 ký tự, placeholder "Vì sao bạn thích nơi này?"); nút viền "Đóng" + nút vàng "❤️ Lưu yêu thích".
3. **Đã lưu**: tiêu đề "💗 Đã yêu thích" + alert thành công "✔ {tên} đang có trong sổ tay của bạn."; cùng 3 lựa chọn tag (đang chọn đúng tag đã lưu), ngày, ghi chú điền sẵn; nút "🗑️ Bỏ yêu thích" (kiểu coral) + nút vàng "Cập nhật".

Quy tắc ô ngày theo tag:
- `not` (Chưa đến): **ẩn** ô ngày và xoá giá trị ngày khi lưu.
- `will` (Sẽ đến): nhãn "Ngày dự định (không bắt buộc)".
- `been` (Đã đến): nhãn "Ngày đã đến (không bắt buộc)"; không cho chọn ngày ở tương lai (`max` = hôm nay), nếu vẫn nhập sai thì báo "Ngày đã đến không thể ở tương lai."

Hành vi lưu: "Lưu yêu thích" → `addTrip`; toast "Đã lưu {tên} vào yêu thích."; đóng hộp thoại; cập nhật ngay tim và chip tag trên thẻ. "Cập nhật" → `updateTrip`; toast "Đã cập nhật {tên}.". "Bỏ yêu thích" → `removeTrip` (xác nhận bằng `confirm()` hoặc Bootstrap modal nhỏ); toast "Đã bỏ {tên} khỏi yêu thích."

### 8.6 Bảng dịch (đặt trong `storage.js`)

```js
const REGION_VI = { Africa:"Châu Phi", Americas:"Châu Mỹ", Asia:"Châu Á", Europe:"Châu Âu", Oceania:"Châu Đại Dương", Antarctic:"Châu Nam Cực" };
const SUBREGION_VI = {
  "Caribbean":"Caribe", "Central America":"Trung Mỹ", "South America":"Nam Mỹ", "North America":"Bắc Mỹ",
  "Eastern Africa":"Đông Phi", "Middle Africa":"Trung Phi", "Northern Africa":"Bắc Phi",
  "Southern Africa":"Nam Phi", "Western Africa":"Tây Phi",
  "Central Asia":"Trung Á", "Eastern Asia":"Đông Á", "South-Eastern Asia":"Đông Nam Á",
  "Southern Asia":"Nam Á", "Western Asia":"Tây Á",
  "Eastern Europe":"Đông Âu", "Northern Europe":"Bắc Âu", "Southern Europe":"Nam Âu",
  "Western Europe":"Tây Âu", "Central Europe":"Trung Âu", "Southeast Europe":"Đông Nam Âu",
  "Australia and New Zealand":"Úc và New Zealand"
}; // không có trong bảng thì hiển thị nguyên văn tiếng Anh
```

## 9. Sổ tay hành trình (`wishlist.html`) – CRUD yêu thích – ảnh `06`, `13`

Yêu cầu đăng nhập (mục 6.4).

### 9.1 Mô hình dữ liệu `trips_<email>` (Local Storage, mảng, mới nhất lên đầu)

```js
{
  code: "JPN",            // cca3, duy nhất trong mỗi người dùng (không cho trùng)
  name: "Japan",
  flag: "https://flagcdn.com/jp.svg",
  region: "Asia",
  subregion: "Eastern Asia",
  capital: "Tokyo",
  population: 123210000,
  area: 377930,
  languages: ["Japanese"],
  currencies: ["Japanese yen (¥)"],
  tag: "will",            // "not" | "will" | "been"
  date: "2027-04-05",     // "" hoặc yyyy-mm-dd; hiển thị dd/mm/yyyy
  note: "Đi xem hoa anh đào…",   // tối đa 200 ký tự
  savedAt: 1760000000000
}
```

Vì lưu sẵn thông tin quốc gia nên trang này hiển thị được ngay, không phụ thuộc API (chỉ cần API để nạp danh sách quốc gia cho form thêm mới).

### 9.2 Bố cục

- **Dải tiêu đề** nền `--sun-soft`, bo dưới 48px: `h1` "Sổ tay hành trình" + "Các quốc gia bạn đã yêu thích. Gắn tag Chưa đến, Sẽ đến hoặc Đã đến để theo dõi hành trình của mình nhé!"
- **3 ô thống kê** (CSS Grid 3 cột, 1 cột trên mobile; kéo chồng lên dải tiêu đề `margin-top:-42px`): `{n}` quốc gia yêu thích (`--coral-soft`, số màu `#B3302F`), `{n}` sẽ đến trong tương lai (`--blue-soft`, `#1B4FA8`), `{n}` quốc gia đã đến (`--mint-soft`, `#0E7A64`). Số lớn Baloo 2 46px. Cập nhật tức thì khi dữ liệu đổi.
- **Bố cục chính** (CSS Grid): `350px 1fr` gap 28px; 1 cột trên mobile (form lên trước, danh sách sau).

### 9.3 Form thêm / sửa (cột trái, panel trắng)

Tiêu đề "Thêm quốc gia yêu thích". Trường: **Quốc gia** (`<select>` nạp từ API, sắp A→Z, hiện "Chọn quốc gia..."); **Tag** (3 nút viên thuốc dạng radio: ⏳ Chưa đến, ✈️ Sẽ đến, ✅ Đã đến; mặc định Chưa đến; nút đang chọn tô nền nhạt + viền màu đặc của tag); **Ngày dự định hoặc ngày đến** (`input type="date"`, theo quy tắc ngày ở mục 8.5, ẩn khi tag là Chưa đến); **Ghi chú** (`textarea`, tối đa 200 ký tự, `maxlength` + đếm ký tự nhỏ). Nút vàng "❤️ Thêm vào yêu thích".

Validation: chưa chọn quốc gia → "Hãy chọn một quốc gia."; quốc gia đã có → "Quốc gia này đã có trong sổ tay. Hãy bấm Sửa ở danh sách để cập nhật."

**Chế độ sửa** (bấm ✏️ Sửa trên thẻ): form điền sẵn dữ liệu, ô Quốc gia bị `disabled`, tiêu đề "Sửa {tên}", nút đổi thành "Lưu thay đổi" và hiện thêm nút viền "Huỷ sửa"; cuộn form vào tầm nhìn trên mobile. Lưu xong tự thoát chế độ sửa và toast "Đã cập nhật {tên}."

### 9.4 Danh sách (cột phải)

- **Tab lọc** (nút viên thuốc, kèm số lượng nhỏ): Tất cả `n`, ⏳ Chưa đến `n`, ✈️ Sẽ đến `n`, ✅ Đã đến `n`. Tab đang chọn nền `--ink` chữ trắng. Dùng `aria-pressed`.
- **Dải mẹo** nền `--sun-soft`: "💡 Mẹo: bấm vào tag trên thẻ để đổi nhanh giữa Chưa đến, Sẽ đến và Đã đến."
- **Lưới thẻ yêu thích** (CSS Grid `repeat(auto-fill, minmax(300px,1fr))`, tối đa 2 cột ở desktop, 1 cột trên mobile), mỗi thẻ:
  - Dải đầu nền nhạt theo châu lục: cờ tròn 68px, tên quốc gia (Baloo 2, 800, 23px), badge châu lục (nền trắng), nút ❤️ (nền `--coral-soft`) bên phải: bấm = bỏ yêu thích (có xác nhận).
  - Thân: **thẻ chọn tag** là `<select>` được style như chip viền (màu theo tag, ví dụ "✈️ Sẽ đến ▾"); đổi tag lưu ngay + toast "Đã đổi {tên} sang {nhãn}."; dòng `🏛️ Thủ đô: <b>…</b> · 👥 <b>98,9 triệu</b>`; dòng ngày `📅 Dự định: dd/mm/yyyy` (hoặc "Ngày đến" khi tag là Đã đến), chỉ hiện nếu có ngày; dòng `📝 ghi chú` (nếu rỗng thì bỏ).
  - Chân: nút "✏️ Sửa" (kiểu xanh nhạt) và "💔 Bỏ yêu thích" (kiểu coral).
- Trạng thái rỗng: tổng rỗng → "Sổ tay còn trống. Chọn một quốc gia ở biểu mẫu bên cạnh, hoặc khám phá thêm ở trang chủ." (có liên kết `index.html`); lọc tab không có kết quả → "Chưa có quốc gia nào với tag này."
- Khi đổi tag sang `not`, xoá `date`. Khi đổi sang `been`, giữ `date` hiện có nếu không vượt quá hôm nay, ngược lại xoá.

## 10. Hồ sơ người dùng (`profile.html`) – CRUD tài khoản – ảnh `07`, `08`

Yêu cầu đăng nhập (mục 6.4).

### 10.1 Bố cục

- Dải tiêu đề nền `--mint-soft` (bo dưới 48px): `h1` "Hồ sơ của tôi" + "Xem và cập nhật thông tin cá nhân. Thông tin được lưu ngay trên trình duyệt của bạn."
- CSS Grid `340px 1fr` gap 28px (1 cột trên mobile), kéo chồng lên dải tiêu đề `margin-top:-40px`.

### 10.2 Thẻ danh tính (cột trái, căn giữa)

Avatar emoji cỡ lớn trong vòng tròn 128px nền `--sun-soft` (viền trắng 7px + viền ngoài `--sun`); tên (Baloo 2, 30px); email (mờ); 2 badge: `🎂 {tuổi} tuổi` (nền `--grape-soft`, chữ `#5B44C2`) và `📍 {nơi ở}` (nền `--coral-soft`, chữ `#B3302F`; lấy phần sau dấu phẩy cuối của địa chỉ, không có dấu phẩy thì lấy cả địa chỉ); 2 ô số liệu (CSS Grid 2 cột): `{n}` yêu thích (`--blue-soft`) và `{n}` đã đến (`--mint-soft`); dòng nhỏ "Tham gia từ dd/mm/yyyy"; nút xanh "Xem sổ tay của tôi" (`wishlist.html`).

### 10.3 Ba tab (Bootstrap `nav-pills`/`nav-tabs` + `data-bs-toggle="tab"`, không cần JS riêng cho việc chuyển tab)

Tab đang chọn nền `--ink` chữ trắng; tab "Xoá tài khoản" chữ `#B3302F`.

**Tab 1 – Thông tin cá nhân** (form CSS Grid 2 cột, 1 cột trên mobile):

| Trường | Ghi chú / validation |
|---|---|
| Họ và tên | như đăng ký |
| Email | `disabled`, nền xám nhạt `#EEF2F7`, chú thích "Email dùng để đăng nhập nên không đổi được." |
| Tuổi | như đăng ký (6–100) |
| Giới tính | `<select>`: Chưa chọn, Nữ, Nam, Khác, Không muốn nói |
| Số điện thoại | tuỳ chọn; nếu nhập: bỏ khoảng trắng rồi khớp `^(0|\+84)\d{9}$`, sai báo "Số điện thoại chưa đúng, ví dụ: 0905 123 456." |
| Địa chỉ | như đăng ký (rộng 2 cột nếu muốn) |
| Chọn ảnh đại diện | 6 vòng tròn emoji 🦊🐼🐯🐸🦉🐧 (nền `--sun-soft`, 56px); ô đang chọn có viền xanh + vòng sáng; là `radio` thật |

Nút vàng "Lưu thay đổi" + nút viền "Huỷ" (khôi phục giá trị đã lưu, bỏ lỗi). Lưu thành công: alert xanh "✔ Đã cập nhật thông tin của bạn." (tự ẩn sau 3 giây), cập nhật ngay thẻ danh tính và header.

**Tab 2 – Đổi mật khẩu:** Mật khẩu hiện tại (sai → "Mật khẩu hiện tại chưa đúng."), Mật khẩu mới (≥ 6 ký tự, không trùng mật khẩu cũ → "Mật khẩu mới cần khác mật khẩu cũ."), Nhập lại mật khẩu mới (trùng). Thành công: alert xanh "✔ Đã đổi mật khẩu." và xoá nội dung các ô.

**Tab 3 – Xoá tài khoản:** khung cảnh báo nền `--coral-soft` giải thích "Xoá tài khoản sẽ xoá hồ sơ và toàn bộ sổ tay hành trình của bạn. Không thể hoàn tác."; nút "Xoá tài khoản" (coral) mở **Bootstrap modal xác nhận** yêu cầu gõ đúng email của mình mới bật nút "Xoá vĩnh viễn". Xác nhận xong: xoá user khỏi `users`, xoá key `trips_<email>`, xoá `currentUser`, chuyển về `index.html` kèm toast hoặc tham số `?deleted=1` để hiện alert "Tài khoản đã được xoá."

## 11. API nội bộ (`storage.js`)

Mọi thao tác đọc/ghi Local Storage đi qua các hàm sau (bọc `try/catch` khi `JSON.parse`, lỗi thì trả giá trị mặc định):

```js
// Tiện ích
store.get(key, fallback)            // đọc JSON
store.set(key, value)               // ghi JSON
escapeHtml(str)                     // BẮT BUỘC dùng khi chèn dữ liệu người dùng vào innerHTML
formatNumber(n)                     // 98858950 -> "98.858.950"
formatPopulation(n)                 // 98858950 -> "98,9 triệu"
formatDate(iso)                     // "2027-04-05" -> "05/04/2027"
showToast(message)

// Tài khoản
getUsers()                          // -> []
registerUser({name, age, email, address, password})   // -> {ok:true} | {ok:false, error}
loginUser(email, password)          // -> {ok:true} | {ok:false, error}
logoutUser()
getCurrentUser()                    // -> user | null
updateUser(email, changes)          // -> user
changePassword(email, oldPw, newPw) // -> {ok:true} | {ok:false, error}
deleteAccount(email)                // xoá user + trips_<email> + phiên
requireLogin()                      // chuyển hướng nếu chưa đăng nhập, trả user nếu đã đăng nhập
renderHeaderAuth()                  // điền #authArea (khách / chip tài khoản), đặt aria-current cho nav

// Yêu thích
getTrips(email)                     // -> []
findTrip(email, code)               // -> trip | undefined
addTrip(email, country, {tag, date, note})   // country là object chuẩn hoá từ API
updateTrip(email, code, changes)    // changes: tag, date, note
removeTrip(email, code)

// API quốc gia
fetchCountries()                    // -> Promise<country[]> (có cache sessionStorage)
getRegionStyle(region)              // -> {name, soft, dark, solid}  (bảng 5.2)
TAGS                                // hằng số bảng 5.3
```

## 12. Thứ tự implement đề xuất

1. Dựng khung 5 trang HTML (header, main, footer tĩnh) + `custom.css` (biến màu, nút, thẻ, ô nhập, footer, header).
2. `storage.js`: tiện ích, tài khoản, yêu thích, `fetchCountries`, `renderHeaderAuth`, `showToast`.
3. `auth.js`: đăng ký, đăng nhập (validation + chuyển hướng `next`).
4. `home.js`: tải dữ liệu, lưới thẻ, tìm kiếm, lọc châu lục, sắp xếp, "Xem thêm".
5. Hộp thoại chi tiết với 3 trạng thái và lưu/cập nhật/bỏ yêu thích; đồng bộ tim và chip trên thẻ.
6. `trips.js`: thống kê, form thêm/sửa, tab lọc, đổi nhanh tag, xoá.
7. `profile.js`: thẻ danh tính, 3 tab (sửa thông tin, đổi mật khẩu, xoá tài khoản).
8. Responsive (390 / 768 / 1440), kiểm tra bàn phím và độ tương phản, so với ảnh trong `design/`.
9. Viết `README.md` (cách chạy, danh sách chức năng, cấu trúc thư mục, ghi chú mật khẩu lưu thẳng chỉ dành cho bài demo).

## 13. Tiêu chí hoàn thành (kiểm thử thủ công)

- [ ] Mở `index.html`: thấy hơn 240 quốc gia từ API; tìm "japan" ra Japan; lọc Châu Á chỉ còn quốc gia châu Á; "Xem thêm" nạp thêm 24 thẻ.
- [ ] Tắt mạng rồi tải lại: hiện thông báo lỗi + nút "Tải lại", không có lỗi trắng trang.
- [ ] Khách bấm tim hoặc thẻ: thấy hộp thoại với lời nhắc đăng nhập; bấm "Đăng nhập" xong quay lại trang chủ.
- [ ] Đăng ký thiếu/sai từng trường: hiện đúng thông báo dưới đúng ô; email trùng bị chặn; đăng ký đúng thì vào thẳng trạng thái đăng nhập.
- [ ] Đăng nhập sai: hiện thông báo chung; đúng: header đổi thành chip tài khoản.
- [ ] Đã đăng nhập, lưu 1 quốc gia với tag "Sẽ đến": tim thành ❤️, thẻ hiện chip "✈️ Sẽ đến", Sổ tay có thẻ mới, ô thống kê tăng.
- [ ] Mở lại quốc gia đã lưu: hộp thoại ở trạng thái "Đã yêu thích", đổi tag + Cập nhật hoạt động; "Bỏ yêu thích" làm tim về 🤍.
- [ ] Sổ tay: thêm (không cho trùng), sửa (ô quốc gia bị khoá), xoá, lọc tab đúng số lượng, đổi tag nhanh trên thẻ lưu ngay.
- [ ] Tag "Chưa đến" không có ngày; tag "Đã đến" không nhận ngày tương lai.
- [ ] Hồ sơ: sửa thông tin hiện thông báo thành công và cập nhật header; đổi mật khẩu đúng/sai; xoá tài khoản cần gõ đúng email, xoá xong không đăng nhập lại được bằng tài khoản đó và key `trips_<email>` biến mất.
- [ ] Hai tài khoản khác nhau có sổ tay riêng; tải lại trang vẫn giữ dữ liệu và phiên.
- [ ] Truy cập `wishlist.html` / `profile.html` khi chưa đăng nhập: bị chuyển tới `login.html?next=...`.
- [ ] Mọi trang đúng ở 390px, 768px, 1440px, không cuộn ngang; cả 5 trang có header, main, footer.
- [ ] Không có lỗi trong Console; dữ liệu nhập từ người dùng luôn qua `escapeHtml` khi chèn vào HTML.

## 14. Ảnh thiết kế (thư mục `design/`)

Đặt 14 file PNG vào `design/` rồi **xem từng ảnh trước khi viết trang tương ứng**.

| File | Nội dung | Dùng cho |
|---|---|---|
| `00-bang-mau-phong-cach.png` | Bảng màu, màu châu lục, nút, nhãn tag, phông chữ | Mục 5, `custom.css` |
| `01-trang-chu-desktop.png` | Trang chủ của khách (hero, lưới thẻ, 3 bước, footer) | `index.html` |
| `02-chi-tiet-chua-dang-nhap.png` | Hộp thoại chi tiết, trạng thái khách | Hộp thoại (mục 8.5) |
| `03-trang-chu-mobile.png` | Trang chủ trên điện thoại (lưới 2 cột) | Responsive `index.html` |
| `04-dang-nhap.png` | Trang đăng nhập (ô đang chọn, ô lỗi) | `login.html` |
| `05-dang-ky.png`, `09-dang-ky-mobile.png` | Đăng ký có tuổi, địa chỉ (desktop, mobile) | `register.html` |
| `06-so-tay-hanh-trinh.png`, `13-so-tay-mobile.png` | Sổ tay yêu thích, tab tag, menu tài khoản mở (desktop, mobile) | `wishlist.html`, header |
| `07-ho-so-nguoi-dung.png`, `08-ho-so-mobile.png` | Trang hồ sơ (desktop, mobile) | `profile.html` |
| `10-trang-chu-da-dang-nhap.png` | Trang chủ khi đã đăng nhập (tim đỏ, chip tag) | Thẻ quốc gia |
| `11-chi-tiet-luu-yeu-thich.png` | Hộp thoại: chọn tag để lưu | Hộp thoại (mục 8.5) |
| `12-chi-tiet-da-yeu-thich.png` | Hộp thoại: cập nhật/bỏ yêu thích | Hộp thoại (mục 8.5) |

Ghi chú về ảnh: số liệu quốc gia trong ảnh là dữ liệu mẫu; ảnh dùng cờ tròn thật, bố cục 1440px (desktop) và 390px (mobile). Ảnh chưa vẽ trạng thái "Antarctic/khác" và hộp thoại xác nhận xoá tài khoản; hãy làm theo cùng phong cách.

## 15. Ngoài phạm vi (không làm)

Backend/cơ sở dữ liệu, đăng nhập mạng xã hội, quên mật khẩu qua email, tải ảnh đại diện, mã hoá/băm mật khẩu, đa ngôn ngữ, chế độ tối, PWA/offline, trang quản trị xem danh sách mọi người dùng, kiểm thử tự động.

---

## Phụ lục A – SVG quả địa cầu cho hero

Dùng nguyên văn (viewBox 400×400). Đặt trong khung vuông `aspect-ratio:1`, rộng tối đa 470px (320px trên mobile), các huy hiệu cờ định vị tuyệt đối quanh khung.

```html
<svg viewBox="0 0 400 400" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Quả địa cầu">
  <circle cx="200" cy="205" r="150" fill="#1B4FA8" opacity=".25"/>
  <circle cx="200" cy="200" r="150" fill="#2F6FE0"/>
  <g fill="#5FE0C4">
    <path d="M112 128c26-34 74-30 86-6 10 22-12 38-30 48-22 12-42 10-54-8-10-14-10-24-2-34z"/>
    <path d="M218 98c38-16 74 6 76 30 2 22-22 30-44 28-20-2-40-22-32-58z"/>
    <path d="M232 196c34-14 60 8 58 34-2 28-28 50-50 42-22-10-34-52-8-76z"/>
    <path d="M118 214c26-14 48 4 44 30-4 24-20 46-34 42-22-8-28-56-10-72z"/>
  </g>
  <g fill="#FFC93C"><circle cx="150" cy="150" r="5"/><circle cx="262" cy="130" r="5"/><circle cx="260" cy="236" r="5"/></g>
  <ellipse cx="150" cy="110" rx="46" ry="16" fill="#fff" opacity=".22" transform="rotate(-28 150 110)"/>
  <ellipse cx="200" cy="200" rx="188" ry="58" fill="none" stroke="#FFC93C" stroke-width="6"
           stroke-dasharray="2 15" stroke-linecap="round" transform="rotate(-18 200 200)"/>
  <g transform="translate(352 140) rotate(-30)">
    <path d="M0 0l30 8-30 8 4-8z" fill="#fff"/><path d="M6 8l-10-12 6 0 10 10z" fill="#FFC93C"/>
  </g>
  <g fill="#fff">
    <ellipse cx="62" cy="80" rx="34" ry="14"/><ellipse cx="86" cy="70" rx="22" ry="14"/>
    <ellipse cx="338" cy="300" rx="36" ry="14"/><ellipse cx="316" cy="290" rx="22" ry="13"/>
  </g>
</svg>
```

Huy hiệu cờ (tròn 92px, viền trắng 6px, bóng `0 6px 0 rgb(31 42 68 / .15)`, xoay nhẹ ±6–10°): VNM bên trái giữa, JPN góc phải trên, FRA bên phải dưới, BRA dưới trái. Bong bóng chữ: nền trắng, bo 18px, chữ Nunito 800 cỡ 14px.

## Phụ lục B – Gợi ý CSS nút và thẻ

```css
.btn-sun{background:var(--sun);color:var(--ink);border:0;border-radius:999px;font-weight:700;
         padding:11px 24px;box-shadow:0 4px 0 var(--sun-dk)}
.btn-sun:hover{background:#ffd45e;color:var(--ink)}
.btn-blue{background:var(--blue);color:#fff;border:0;border-radius:999px;font-weight:700;
          padding:11px 24px;box-shadow:0 4px 0 var(--blue-dk)}
.card-x{background:#fff;border:2px solid var(--line);border-radius:26px;box-shadow:var(--shadow-card);overflow:hidden}
.country-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(240px,1fr));gap:24px}
@media (max-width:700px){.country-grid{grid-template-columns:1fr 1fr;gap:14px}}
```
