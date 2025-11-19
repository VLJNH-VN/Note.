# Note Paste Bạch Hoàng

## Overview
Website API chia sẻ code giống dpaste, cho phép:
- Upload code và tạo link chia sẻ (format: /bachhoang/:id)
- Hỗ trợ syntax highlighting cho 18+ ngôn ngữ
- API endpoints đầy đủ cho bot Messenger, Discord, Telegram
- Paste có thể có thời gian hết hạn
- Theo dõi lượt xem
- **Private Paste**: Paste riêng tư không hiển thị ở trang chủ, chỉ người có link mới xem được (ID dài 21 ký tự cho bảo mật cao)

## Tech Stack
- Node.js + Express (server)
- SQLite + better-sqlite3 (database)
- EJS (templating)
- Highlight.js (syntax highlighting)
- nanoid (ID generation)

## Project Structure
- `server.js` - Express server với tất cả routes
- `database.js` - Database operations (create, get, delete pastes)
- `views/` - EJS templates (index, paste, 404)
- `public/` - Static files (CSS, JS)
- `HUONG-DAN-API.md` - API documentation tiếng Việt
- `README.md` - Project documentation

## API Endpoints
- POST /api/paste - Tạo paste mới (mặc định private nếu không chỉ định isPrivate)
- GET /api/paste/:id - Lấy thông tin paste (JSON)
- GET /api/paste/:id/raw - Lấy nội dung raw text
- GET /api/recent?limit=10 - Lấy danh sách paste gần đây (chỉ public pastes)
- GET /bachhoang/:id - Xem paste trên web UI

**API Security Note:** Khi bot/API gọi mà không gửi `isPrivate` parameter, paste sẽ tự động là **private** để bảo vệ code và API keys.

## Deployment
Chuẩn bị cho Railway:
- Port 5000 (mặc định) hoặc process.env.PORT
- railway.json và nixpacks.toml đã được cấu hình
- Database SQLite tự động tạo và persist

## Recent Changes
- 2025-11-19: Khởi tạo project hoàn chỉnh
  - Xây dựng full-stack application
  - Tạo API endpoints
  - UI với syntax highlighting
  - Railway deployment config
  - Documentation cho bot integration
  - Fixed Railway deployment: Downgrade nanoid v3 (CommonJS compatible)
  - Security fixes: XSS protection, input validation, security headers
  - **Added Private Paste feature**: 
    - Checkbox để tạo paste riêng tư
    - Private pastes không hiển thị ở trang chủ
    - Sử dụng ID dài 21 ký tự (vs 10 ký tự cho public) để tăng bảo mật
    - Database schema updated với cột is_private
    - API endpoint hỗ trợ isPrivate parameter
    - **API mặc định là private:** Khi bot gọi mà không gửi `isPrivate`, paste tự động là private để bảo vệ thông tin
    - Updated documentation với ví dụ bot integration
