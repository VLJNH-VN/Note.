# 📝 Note Paste Bạch Hoàng

Website API chia sẻ code giống dpaste, hỗ trợ bot Messenger, Discord, Telegram.

## ✨ Tính Năng

- 🚀 Upload code nhanh chóng, tạo link chia sẻ
- 🎨 Giao diện đẹp, hiện đại với syntax highlighting
- 🤖 API đầy đủ cho bot Messenger, Discord, Telegram
- ⏰ Hỗ trợ paste có thời gian hết hạn
- 📊 Theo dõi lượt xem
- 🌐 Hỗ trợ 18+ ngôn ngữ lập trình
- 💾 Database SQLite - dễ dàng deploy

## 🛠️ Công Nghệ

- **Backend:** Node.js + Express
- **Database:** SQLite (better-sqlite3)
- **Template Engine:** EJS
- **Syntax Highlighting:** Highlight.js
- **ID Generation:** nanoid

## 🚀 Cài Đặt & Chạy

### Local Development

```bash
# Clone repository
git clone <your-repo>
cd note-paste-bach-hoang

# Install dependencies
npm install

# Start server
npm start
```

Server sẽ chạy tại `http://localhost:5000`

### Deploy Lên Railway

1. Push code lên GitHub
2. Tạo project mới trên [Railway.app](https://railway.app)
3. Connect GitHub repository
4. Railway sẽ tự động deploy!

File cấu hình Railway đã được thiết lập sẵn.

## 📚 API Documentation

Xem chi tiết tại [HUONG-DAN-API.md](./HUONG-DAN-API.md)

### Quick Example

**Tạo paste:**
```bash
curl -X POST https://your-domain.com/api/paste \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Hello World",
    "content": "console.log(\"Hello, World!\");",
    "language": "javascript"
  }'
```

**Response:**
```json
{
  "success": true,
  "id": "abc123xyz",
  "url": "https://your-domain.com/bachhoang/abc123xyz",
  "raw_url": "https://your-domain.com/api/paste/abc123xyz/raw"
}
```

## 🤖 Tích Hợp Bot

### Bot Messenger Example (Node.js)

```javascript
const axios = require('axios');

async function uploadCode(code) {
  const response = await axios.post('https://your-domain.com/api/paste', {
    content: code,
    language: 'javascript'
  });
  return response.data.url;
}
```

### Bot Discord Example

```javascript
// Command: !paste <code>
if (message.content.startsWith('!paste')) {
  const code = message.content.replace('!paste', '').trim();
  const url = await uploadCode(code);
  message.reply(`✅ Paste: ${url}`);
}
```

Xem hướng dẫn chi tiết tại [HUONG-DAN-API.md](./HUONG-DAN-API.md)

## 📁 Cấu Trúc Project

```
note-paste-bach-hoang/
├── server.js              # Express server
├── database.js            # Database operations
├── package.json           # Dependencies
├── views/
│   ├── index.ejs         # Homepage
│   ├── paste.ejs         # Paste view page
│   └── 404.ejs           # Error page
├── public/
│   ├── styles.css        # Styling
│   └── script.js         # Frontend logic
├── HUONG-DAN-API.md      # API documentation
└── README.md             # This file
```

## 🌟 Features

- ✅ Tạo paste với/không có tiêu đề
- ✅ Chọn ngôn ngữ lập trình (syntax highlighting)
- ✅ Thiết lập thời gian hết hạn
- ✅ Copy code dễ dàng
- ✅ Xem raw text
- ✅ API endpoints đầy đủ
- ✅ Responsive design
- ✅ Danh sách paste gần đây

## 📝 License

MIT License

## 👨‍💻 Author

**Bạch Hoàng**

---

Made with ❤️ for developers and bot creators
