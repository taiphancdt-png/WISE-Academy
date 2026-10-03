# Làm việc chung trên website WISE Academy

Tài liệu này dành cho dev cùng phát triển website. Nhánh `main` được bảo vệ bằng ruleset trên GitHub: chỉ chủ repo được đẩy thẳng, mọi người khác phải qua Pull Request. Quy ước chính: **mọi thay đổi của dev đi qua nhánh riêng và Pull Request (PR)**, không đẩy thẳng lên `main`.

## 1. Cài đặt

Yêu cầu: Node.js 20 trở lên, npm.

```bash
git clone https://github.com/taiphancdt-png/WISE-Academy.git
cd WISE-Academy
npm install
npm run dev        # http://localhost:3000
```

Kiểm tra trước khi mở PR:

```bash
npx tsc --noEmit   # không được có lỗi TypeScript
npm run build      # build production phải chạy được
```

## 2. Quy trình nhánh và Pull Request

1. Luôn bắt đầu từ `main` mới nhất:
   ```bash
   git checkout main
   git pull
   git checkout -b feat/ten-tinh-nang     # hoặc fix/..., chore/...
   ```
2. Commit nhỏ, mỗi commit một ý, message rõ ràng (tiếng Việt hoặc tiếng Anh đều được).
3. Đẩy nhánh và mở PR vào `main`:
   ```bash
   git push -u origin feat/ten-tinh-nang
   ```
4. Trước khi xin duyệt, cập nhật nhánh với `main` để tránh xung đột:
   ```bash
   git fetch origin
   git rebase origin/main
   git push --force-with-lease
   ```
5. Chủ dự án xem PR và bấm **Merge**. Sau khi merge, xoá nhánh.

Đặt tên nhánh: `feat/...` (tính năng), `fix/...` (sửa lỗi), `chore/...` (dọn dẹp, cấu hình).

## 3. Ai sửa phần nào

| Khu vực | Người phụ trách | Cách đưa lên |
|---|---|---|
| Nội dung: `src/data/*.json`, `src/data/*.ts`, câu chữ trên các trang, ảnh trong `public/images` | Chủ dự án (cùng trợ lý Claude) | Commit thẳng `main` |
| Tính năng, giao diện, cấu trúc: `src/components/`, `src/app/`, `src/lib/`, cấu hình | Dev | Nhánh riêng + PR |

Nếu PR của dev cần sửa vào file nội dung (ví dụ thêm trường mới vào `courses.json`), ghi rõ trong mô tả PR để tránh ghi đè nội dung đang được cập nhật trên `main`.

## 4. Cấu trúc dự án

- `src/app/` - các trang (Next.js 15 App Router). Server component chọn dữ liệu rồi truyền xuống client component.
- `src/components/` - thành phần giao diện. Icon dùng chung qua `src/components/icons.ts` (Phosphor).
- `src/data/` - nội dung: khoá học, chuyên gia, bài viết, dự án, chương trình LSSI.
- `public/brochures/` - file PDF brochure của từng khoá học.
- `src/app/api/lead/route.ts` - nhận form và gửi email qua SMTP.
- `scripts/` - script tạo brochure LSSI (`node scripts/build-brochures.mjs`).

## 5. Quy ước nội dung và giao diện

- Chỉ viết nội dung **tiếng Việt**. Tiếng Anh và tiếng Trung được dịch tự động bằng Google Translate (nút chọn ngôn ngữ trên header).
- Màu nhận diện: navy `#002F5B`, cam `#F76011`. Chữ cam nhỏ trên nền trắng dùng `#C9500E` để đủ tương phản.
- Font: Be Vietnam Pro (qua `next/font`).
- Không dùng dấu gạch dài `—` hoặc `–` trong nội dung hiển thị; dùng dấu gạch ngắn `-`.
- Viết tên công ty là **WISE Academy** (không viết riêng "WISE").
- Ảnh minh hoạ khoá học lấy từ thư viện Canva Element, không dùng ảnh học viên thật.

## 6. Biến môi trường

Form trên website gửi email qua SMTP. Xem mẫu trong `.env.example`, tạo file `.env.local` khi cần thử gửi email ở máy mình. **Không commit file `.env*` có giá trị thật.** Giá trị thật được cấu hình trên nơi host website, chủ dự án sẽ gửi riêng khi cần.
