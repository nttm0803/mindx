# Hướng dẫn sử dụng bộ tài liệu

## Cách mở
1. Giải nén, mở cả thư mục `khoa-hoc-web` bằng VS Code (File → Open Folder).
2. Cài extension **Live Server**, chuột phải `index.html` → **Open with Live Server**.
3. Trang chủ khóa học có link tới từng buổi.

## Cấu trúc
```
khoa-hoc-web/
├── index.html                         Trang chủ khóa học
├── bai-01-cai-dat-vscode/             Cài extension VS Code (Live Server...)
├── bai-02-html-co-ban/                CHỈ HTML (chưa có CSS)
│   ├── index.html                     Mục lục bài 2
│   ├── 2-cac-the-html.html            Cấu trúc, title, danh sách, đường dẫn, ảnh
│   ├── 3-format-va-the-long-nhau.html
│   ├── 4-website-va-webpage.html
│   └── du-an-portfolio/               Dự án: 2 trang nối với nhau
├── bai-03-css-co-ban/
│   ├── index.html + style.css         CSS là gì, thuộc tính, selectors, Inspect, box model
│   └── du-an-mindx-page/
├── bai-04-css-nang-cao/
│   ├── index.html + style.css         Specificity, inheritance, positioning
│   ├── on-tap.html                    Tóm tắt + 12 câu trắc nghiệm + bài tập
│   └── du-an-the-flag/                4 lá cờ + thử thách
├── bai-05-display-responsive-flexbox/
│   └── index.html + style.css         display, media queries, flexbox, thực hành ShopTeen
├── bai-06-framework-bootstrap/
│   └── index.html + style.css         Framework, Bootstrap (cần Internet), Web Design, Color Theory, giới thiệu Dog Social phần 1
├── bai-07-typography-phan-cap-ui/
│   └── index.html + style.css         Typography & chọn font (Google Fonts), phân cấp, quản lý attention, thực hành thẻ sự kiện, ôn tập
├── bai-08-form-input/
│   ├── index.html + style.css         Thẻ form (action, method GET/POST), các kiểu input, label, select, textarea, validation, fieldset, ôn tập
│   ├── du-an-dang-nhap/               Thực hành 1: form đăng nhập
│   └── du-an-thanh-toan/              Thực hành 2: trang thanh toán ShopTeen (1 cột, đơn giản)
├── website-gioi-thieu-ca-nhan/        Website tổng hợp Bài 2 → 5
└── du-an-dog-social/                  Dự án Bootstrap (Bài 6): index.html = hướng dẫn 6 bước (CSS: huong-dan.css);
                                       buoc-1..6 = từng khối; hoan-chinh.html = bản đầy đủ; style.css = CSS của Dog Social
```

## Gợi ý dạy
- Mỗi trang lý thuyết vừa là **bài giảng** vừa là **ví dụ chạy được**: chiếu trang trên trình duyệt, mở code song song để học sinh đối chiếu.
- Bài 2 cố ý không có CSS – để học sinh cảm nhận "web thô" trước khi học CSS ở Bài 3.
- Ký hiệu `⭐ NGOÀI BÀI HỌC` trong code = kiến thức mở rộng, không bắt buộc. Có thể dùng làm phần "bonus" cho học sinh khá.
- Bài 5: nhấn F12 → Ctrl + Shift + M để học sinh xem trang trên giao diện điện thoại.
- Bài 7 dùng Google Fonts (cần Internet) cho các ví dụ phông chữ; mục 4 có thẻ "Trước khi sửa" cố ý thiết kế sai để học sinh tìm lỗi.
- Bài 8: các form demo trong bài giảng dùng `method="get"` để học sinh bấm Gửi rồi xem dữ liệu trên thanh địa chỉ. Hai dự án dùng `method="post"` (đúng cho mật khẩu/thanh toán); vì chưa có server, Live Server sẽ báo "Cannot POST" khi gửi thành công – đây là điều bình thường, có thể dùng để giải thích vai trò của server.
- Website tổng hợp dùng Google Fonts nên cần Internet để hiện đúng phông (không có mạng vẫn chạy bằng phông dự phòng).