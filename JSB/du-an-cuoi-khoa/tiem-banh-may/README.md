# Tiệm Bánh Mây - Sản phẩm cuối khóa JSB

Website bán bánh ngọt gồm 4 trang, dùng HTML, CSS và Bootstrap 5 (cần Internet để tải Bootstrap, Bootstrap Icons và Google Fonts).

| Trang | Nội dung |
|---|---|
| `index.html` | Trang chủ: hero, danh mục, bánh bán chạy, giới thiệu |
| `products.html` | Sản phẩm chia theo 3 loại: bánh kem, bánh mì ngọt, bánh quy |
| `detail.html` | Chi tiết một sản phẩm (bánh kem dâu tây) |
| `order.html` | Form đặt bánh (bài 8) |

Ảnh trong `images/` là ảnh minh họa SVG. Học viên có thể thay bằng ảnh thật, giữ nguyên tên file hoặc sửa lại `src`.

## Đối chiếu tiêu chí đánh giá

| Tiêu chí | Thể hiện ở đâu |
|---|---|
| Header - body - footer | Mỗi trang có `<header>` (navbar), `<main>`, `<footer>` |
| 1 màn hình - 1 section | Class `.screen`: section cao tối thiểu bằng màn hình (trừ navbar), nội dung căn giữa theo chiều dọc |
| Responsive | Lưới Bootstrap `col-12 col-sm-6 col-lg-4`, navbar thu gọn trên điện thoại, `@media` trong `style.css` |
| Bố cục chia theo thể loại | `products.html` chia 3 section, mỗi loại một màu viền riêng |
| Hiệu ứng | Hover card nhấc lên và zoom ảnh, hover đổi màu tiêu đề, dropdown "Sản phẩm", click ảnh để phóng to (`detail.html`), trang hiện dần khi tải (`@keyframes fadeIn`) |
| Navigation đa dạng | Navbar + dropdown, breadcrumb, link danh mục ở trang chủ, "Có thể bạn cũng thích" |
| Trang con chi tiết | `detail.html` |
| Màu sắc, icon | Bảng màu bằng mã HEX trong `:root`, Bootstrap Icons, emoji |
| Giá trị thực tế | Bánh ít đường, thông tin bảo quản, chính sách đặt hàng |
| Tính năng AI | Nút chat "Trợ lý Mây" ở góc phải (bản mô phỏng). Có thể thay bằng chatbot thật hoặc trình bày phần dùng AI để gợi ý bảng màu, nội dung trong slide |
