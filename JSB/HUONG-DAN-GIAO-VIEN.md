# Hướng dẫn sử dụng bộ tài liệu

## Cách mở
1. Giải nén, mở cả thư mục `khoa-hoc-web` bằng VS Code (File → Open Folder).
2. Cài extension **Live Server**, chuột phải `index.html` → **Open with Live Server**.
3. Trang chủ khóa học có link tới từng buổi.

## Cấu trúc
```
khoa-hoc-web/
├── index.html                         Trang chủ khóa học
├── bai-02-html-co-ban/                CHỈ HTML (chưa có CSS)
│   ├── index.html                     Mục lục bài 2
│   ├── 1-cai-dat-vscode.html
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
└── website-gioi-thieu-ca-nhan/        Website tổng hợp cả khóa
```

## Gợi ý dạy
- Mỗi trang lý thuyết vừa là **bài giảng** vừa là **ví dụ chạy được**: chiếu trang trên trình duyệt, mở code song song để học sinh đối chiếu.
- Bài 2 cố ý không có CSS – để học sinh cảm nhận "web thô" trước khi học CSS ở Bài 3.
- Ký hiệu `⭐ NGOÀI BÀI HỌC` trong code = kiến thức mở rộng, không bắt buộc. Có thể dùng làm phần "bonus" cho học sinh khá.
- Bài 5: nhấn F12 → Ctrl + Shift + M để học sinh xem trang trên giao diện điện thoại.
- Website tổng hợp dùng Google Fonts nên cần Internet để hiện đúng phông (không có mạng vẫn chạy bằng phông dự phòng).