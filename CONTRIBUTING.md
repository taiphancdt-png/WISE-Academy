# Làm việc chung trên website WISE Academy

Tài liệu này dành cho dev cùng phát triển website. Nhánh `main` được bảo vệ bằng ruleset trên GitHub (không xoá, không force push). Chủ repo và dev có quyền ghi đều được phép đưa code vào `main`, nhưng nên dùng nhánh + Pull Request để dễ theo dõi. Quy ước chính: **mọi thay đổi của dev đi qua nhánh riêng và Pull Request (PR)**, không đẩy thẳng lên `main`.

## 1. Cài đặt

Yêu cầu: Node.js 20 trở lên, npm.

```bash
git clone https://github.com/taiphancdt-png/WISE-Academy.git
cd WISE-Academy
npm install        # cũng tự cài bảo vệ git cho máy này (xem mục 7)
npm run dev        # http://localhost:3000
```

Máy đã clone từ trước: chạy `npm run setup:git` một lần.

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
5. Dev tự bấm **Merge** khi PR đã kiểm tra xong (không bắt buộc duyệt). Nên báo chủ dự án nếu PR thay đổi lớn hoặc đụng file nội dung. Sau khi merge, xoá nhánh.

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

- Chỉ viết nội dung **tiếng Việt**. Bản tiếng Anh và tiếng Trung nằm trong `src/i18n/en.json` và `zh.json` (do Claude dịch, không dùng Google Translate). Nội dung mới cần được dịch và lưu vào hai file này trước khi đẩy lên.
- Màu nhận diện: navy `#002F5B`, cam `#F76011`. Chữ cam nhỏ trên nền trắng dùng `#C9500E` để đủ tương phản.
- Font: Be Vietnam Pro (qua `next/font`).
- Không dùng dấu gạch dài `—` hoặc `–` trong nội dung hiển thị; dùng dấu gạch ngắn `-`.
- Viết tên công ty là **WISE Academy** (không viết riêng "WISE").
- Ảnh minh hoạ khoá học lấy từ thư viện Canva Element, không dùng ảnh học viên thật.

## 6. Biến môi trường

Form trên website gửi email qua SMTP. Xem mẫu trong `.env.example`, tạo file `.env.local` khi cần thử gửi email ở máy mình. **Không commit file `.env*` có giá trị thật.** Giá trị thật được cấu hình trên nơi host website, chủ dự án sẽ gửi riêng khi cần.

## 7. Hai máy cùng làm việc: chống ghi đè dữ liệu

Nhiều máy cùng commit lên `main`, nên repo có sẵn các lớp bảo vệ (cài bằng `npm install` hoặc `npm run setup:git`):

- **Không đẩy đè lên commit của máy khác.** Hook `pre-push` từ chối khi trên GitHub có commit mà máy mình chưa có (kể cả khi dùng `git push -f`). Khi gặp thông báo này chỉ cần chạy `git pull --rebase origin main` rồi đẩy lại.
- **Không commit file đang dở xung đột.** Hook `pre-commit` chặn file còn dấu `<<<<<<<` / `>>>>>>>` và file `.json` hỏng cú pháp.
- **Bản dịch được gộp theo từng mục.** `src/i18n/en.json` và `zh.json` dùng bộ gộp riêng (`scripts/git/merge-i18n.mjs`): hai máy cùng thêm bản dịch thì giữ cả hai; cùng sửa một mục theo hai cách khác nhau thì giữ bản của máy đang gộp và in cảnh báo. Các mục luôn được sắp xếp theo khoá để hạn chế đụng nhau.
- **`git pull` tự rebase và tự cất thay đổi chưa commit** (`pull.rebase`, `rebase.autoStash`).

Thói quen nên giữ:

1. Trước khi bắt đầu sửa: `git pull`.
2. Commit nhỏ và đẩy sớm, không giữ thay đổi trên máy nhiều ngày.
3. Báo cho người kia khi sắp sửa lớn cùng một trang hoặc một file dữ liệu (`src/data/*.json`).
4. Không dùng `git push --force` lên `main` (GitHub cũng đã chặn).
