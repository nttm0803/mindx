# 🌍 Atlas Kid

Website tra cứu thông tin các quốc gia và lập **sổ tay hành trình** cá nhân, dành cho học sinh yêu địa lý (11–18 tuổi).
Sản phẩm học tập môn Tin học: HTML5, CSS3, Bootstrap 5.3.3, JavaScript thuần, không có backend.

## Cách chạy

### Bước 1. Lấy API key miễn phí của REST Countries (bắt buộc)

Từ năm 2026, restcountries.com đã **tắt các bản cũ v1–v4** (link `.../v3.1/all` chỉ còn trả về lỗi
*"This API version has been deprecated"*). Bản mới **v5** cần một API key miễn phí:

1. Đăng ký tài khoản tại <https://restcountries.com/sign-up> (gói Free: 1.000 lượt gọi/tháng, không cần thẻ).
2. Vào trang **API Keys**, tạo key mới.
3. Ở mục *CORS allowed origins* của key, thêm các tên miền sẽ mở web, cách nhau bằng dấu phẩy:
   - `127.0.0.1,localhost` (để chạy bằng Live Server trên máy)
   - tên miền GitHub Pages nếu đăng web lên mạng, ví dụ `ten-ban.github.io`
4. Mở file `js/storage.js`, dán key vào dòng:

   ```js
   const API_KEY = 'rc_live_...';
   ```

### Bước 2. Mở web bằng Live Server

Trong VS Code: chuột phải `index.html` → **Open with Live Server**.

> ⚠️ Không mở trực tiếp file `index.html` bằng cách nhấp đúp (địa chỉ `file://...`):
> khi đó trình duyệt gửi nguồn gốc là `null` nên API sẽ từ chối. Hãy dùng Live Server hoặc GitHub Pages.

Chưa có key thì web vẫn chạy (đăng ký, đăng nhập, hồ sơ, xem sổ tay đã lưu), chỉ có danh sách quốc gia
hiện thông báo lỗi kèm nút "Tải lại".

## Chức năng

- **Khám phá quốc gia** (`index.html`): hơn 240 quốc gia lấy từ API; tìm theo tên / tên chính thức / thủ đô;
  lọc theo châu lục; sắp xếp theo tên, dân số, diện tích; "Xem thêm" mỗi lần 24 thẻ.
- **Hộp thoại chi tiết**: thủ đô, khu vực, dân số, diện tích, ngôn ngữ, tiền tệ. Khách được mời đăng nhập;
  người dùng lưu yêu thích với tag **⏳ Chưa đến / ✈️ Sẽ đến / ✅ Đã đến**, ngày và ghi chú.
- **Đăng ký / Đăng nhập** (`register.html`, `login.html`): kiểm tra từng ô, báo lỗi ngay dưới ô,
  chặn email trùng, tự quay lại trang trước đó (tham số `?next=`).
- **Sổ tay hành trình** (`wishlist.html`) – CRUD yêu thích: xem, sửa (trong hộp thoại), xoá,
  đổi tag nhanh ngay trên thẻ, lọc theo tag kèm số lượng; nút "Thêm quốc gia" dẫn về trang chủ để lưu thêm.
- **Hồ sơ** (`profile.html`) – CRUD tài khoản: xem thẻ danh tính, sửa thông tin, chọn ảnh đại diện,
  đổi mật khẩu, xoá tài khoản (phải gõ đúng email để xác nhận).
- Giao diện đáp ứng điện thoại (390px), máy tính bảng (768px) và máy tính (1440px).

## Cấu trúc thư mục

```
atlas-kid/
├── index.html          Trang chủ (khám phá quốc gia)
├── login.html          Đăng nhập
├── register.html       Đăng ký
├── wishlist.html       Sổ tay hành trình (CRUD yêu thích)
├── profile.html        Hồ sơ người dùng (CRUD tài khoản)
├── css/
│   └── custom.css      Biến màu, ghi đè Bootstrap, CSS Grid, responsive
├── js/
│   ├── storage.js      Dữ liệu (users, phiên, trips), API, tiện ích, header — dùng chung mọi trang
│   ├── home.js         Trang chủ + hộp thoại chi tiết + lưu yêu thích
│   ├── auth.js         Đăng ký + đăng nhập
│   ├── trips.js        Trang sổ tay
│   └── profile.js      Trang hồ sơ
├── design/             14 ảnh thiết kế mẫu
└── README.md
```

Mỗi trang nạp script theo thứ tự: `bootstrap.bundle` → `storage.js` → file riêng của trang.

Header và footer được viết sẵn trong từng file HTML, có ghi chú `HEADER – BẮT ĐẦU / KẾT THÚC` và
`FOOTER – BẮT ĐẦU / KẾT THÚC`. Cả 5 trang dùng chung một mẫu, nên sửa ở một trang thì nhớ sửa cả 4 trang còn lại.

## Dữ liệu lưu ở đâu?

| Nơi lưu | Key | Nội dung |
|---|---|---|
| Local Storage | `users` | Mảng tài khoản (email là khoá duy nhất, luôn viết thường) |
| Local Storage | `currentUser` | Email của người đang đăng nhập |
| Local Storage | `trips_<email>` | Sổ tay của từng người, mới nhất lên đầu |
| Session Storage | `countries` | Danh sách quốc gia đã tải (đỡ phải gọi API lại) |

**Về API v5:** gói miễn phí trả tối đa 100 nước mỗi lần, nên `fetchCountries()` gọi 3 trang
(`limit=100&offset=0/100/200`), chỉ lấy các trường cần dùng (`response_fields`), rồi hàm `normalizeCountry()`
đổi về dạng object gọn (code, name, capital, population…) để các trang khác dùng. Nhờ cache trong
Session Storage, mỗi lần mở trình duyệt chỉ tốn 3 lượt gọi.

## Đối chiếu bảng điểm

| Tiêu chí | Ở đâu |
|---|---|
| Header, body, footer | Cả 5 trang có `<header>`, `<main>`, `<footer>` viết sẵn trong HTML |
| Đáp ứng đa thiết bị | `@media` trong `custom.css` (900px, 760px, 700px) |
| Dữ liệu từ API ngoài | `fetchCountries()` trong `storage.js`, dùng ở trang chủ, hộp thoại, form sổ tay |
| CSS Grid | lưới quốc gia, lưới yêu thích, ô số liệu ở hồ sơ, footer, bố cục hồ sơ, ô thông tin hộp thoại, trang đăng nhập/đăng ký, 3 bước "Cách dùng" |
| Đăng nhập/đăng ký + Local Storage | `auth.js` + phần "Tài khoản" trong `storage.js` |
| CRUD | Yêu thích: `addTrip` / `getTrips` / `updateTrip` / `removeTrip`; Tài khoản: `registerUser` / `getCurrentUser` / `updateUser` / `deleteAccount` |

## Ghi chú an toàn

- ⚠️ Mật khẩu được lưu **thẳng** trong Local Storage — chỉ chấp nhận được trong bài demo.
  Web thật phải gửi mật khẩu lên server và băm (hash) trước khi lưu.
- API key nằm trong code JavaScript nên ai mở web cũng xem được. Vì vậy chỉ cho phép key chạy trên
  những tên miền của mình (bước 3 ở trên).
- Mọi dữ liệu người dùng nhập đều qua `escapeHtml()` trước khi chèn vào trang.
