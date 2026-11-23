# Website giới thiệu bản thân - Minh Anh

Website cá nhân 3 trang, phong cách tối giản, dùng HTML, CSS và Bootstrap 5 (cần Internet để tải Bootstrap, Bootstrap Icons và Google Fonts).

| Trang | Nội dung |
|---|---|
| `index.html` | Hero, giới thiệu, kỹ năng + hành trình học, carousel dự án, liên hệ |
| `project.html` | Chi tiết một dự án (Tiệm Bánh Mây) |
| `contact.html` | Form gửi lời nhắn (bài 8) |

Học viên thay tên, ảnh `images/avatar.svg`, thông tin trong bảng "Một chút về mình" và ảnh dự án bằng thông tin của mình.

## Kiến thức sử dụng

| Bài | Áp dụng |
|---|---|
| HTML (bài 2) | `header`, `main`, `footer`, `dl`, `ol`, `ul`, ảnh, liên kết giữa các trang |
| CSS (bài 3, 4) | Biến màu trong `:root`, box model, `position` cho dấu chấm ở timeline, `::before` / `::after` |
| Flexbox, responsive (bài 5) | Danh sách kỹ năng, hàng thông tin, `@media (max-width: 991px)` |
| Bootstrap (bài 6) | Navbar + dropdown, lưới `row` / `col`, **carousel** dự án, modal phóng to ảnh |
| Typography (bài 7) | 1 font Be Vietnam Pro với 3 độ đậm, nhãn chữ in hoa giãn chữ, chữ phụ màu xám |
| Form (bài 8) | `label`, `input` email, `select`, `textarea`, `required` |

## Hiệu ứng

- Gạch chân chạy ra khi rê chuột vào menu.
- Nút nhấc lên và đổi màu khi rê chuột.
- Carousel tự chuyển dự án, nút trước/sau đặt cạnh tiêu đề, mỗi slide có số thứ tự (01 / 03).
- Bấm ảnh dự án để phóng to.
- Trang hiện dần khi tải (`@keyframes fadeIn`).
