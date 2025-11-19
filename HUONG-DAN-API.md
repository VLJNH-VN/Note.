# 📚 Hướng Dẫn Sử Dụng API - Note Paste Bạch Hoàng

## 🚀 API Endpoints

### 1. Tạo Paste Mới

**Endpoint:** `POST /api/paste`

**Request Body (JSON):**
```json
{
  "title": "Tên paste của bạn",
  "content": "Code hoặc văn bản bạn muốn chia sẻ",
  "language": "javascript",
  "expiresIn": 3600,
  "isPrivate": false
}
```

**Parameters:**
- `title` (optional): Tiêu đề của paste
- `content` (required): Nội dung code/văn bản
- `language` (optional): Ngôn ngữ lập trình (mặc định: "plaintext")
  - Các giá trị hỗ trợ: `javascript`, `python`, `java`, `cpp`, `csharp`, `php`, `ruby`, `go`, `rust`, `html`, `css`, `sql`, `json`, `xml`, `markdown`, `bash`, `typescript`, `plaintext`
- `expiresIn` (optional): Thời gian hết hạn (giây). Bỏ trống để không giới hạn.
- `isPrivate` (optional): `true` = paste riêng tư (không hiển thị ở trang chủ), `false` = công khai. **Mặc định: `true`** (bảo vệ thông tin khi bot upload)
  - **Lưu ý:** Nếu không gửi parameter này, paste sẽ tự động là **private** để bảo vệ code/API keys của bạn
  - Private paste sử dụng ID dài 21 ký tự (rất khó đoán) thay vì 10 ký tự

**Response:**
```json
{
  "success": true,
  "id": "abc123xyz_or_21chars",
  "url": "https://your-domain.com/bachhoang/abc123xyz_or_21chars",
  "raw_url": "https://your-domain.com/api/paste/abc123xyz_or_21chars/raw",
  "api_url": "https://your-domain.com/api/paste/abc123xyz_or_21chars",
  "is_private": true
}
```

**Note:** ID sẽ dài 21 ký tự nếu là private paste, 10 ký tự nếu là public paste.

### 2. Lấy Thông Tin Paste

**Endpoint:** `GET /api/paste/:id`

**Response:**
```json
{
  "success": true,
  "paste": {
    "id": "abc123xyz",
    "title": "Tên paste",
    "content": "Nội dung code",
    "language": "javascript",
    "created_at": 1700000000000,
    "expires_at": null,
    "views": 42
  }
}
```

### 3. Lấy Nội Dung Raw

**Endpoint:** `GET /api/paste/:id/raw`

Trả về nội dung văn bản thuần (plain text) của paste.

### 4. Lấy Danh Sách Paste Gần Đây

**Endpoint:** `GET /api/recent?limit=10`

**Response:**
```json
{
  "success": true,
  "pastes": [
    {
      "id": "abc123",
      "title": "Example",
      "language": "javascript",
      "created_at": 1700000000000,
      "views": 10
    }
  ]
}
```

---

## 🤖 Tích Hợp Bot Messenger

### Bước 1: Cài Đặt Thư Viện

**Node.js:**
```bash
npm install axios
```

**Python:**
```bash
pip install requests
```

### Bước 2: Code Mẫu Bot Messenger (Node.js)

```javascript
const axios = require('axios');

// URL API của bạn (thay đổi sau khi deploy lên Railway)
const PASTE_API = 'https://your-railway-app.railway.app';

async function uploadCodeToPaste(code, language = 'javascript', title = 'Code từ Messenger') {
  try {
    const response = await axios.post(`${PASTE_API}/api/paste`, {
      title: title,
      content: code,
      language: language,
      expiresIn: null
    });

    if (response.data.success) {
      return {
        url: response.data.url,
        rawUrl: response.data.raw_url,
        isPrivate: response.data.is_private
      };
    }
  } catch (error) {
    console.error('Lỗi khi upload paste:', error);
    return null;
  }
}

async function getCodeFromPaste(pasteId) {
  try {
    const response = await axios.get(`${PASTE_API}/api/paste/${pasteId}`);
    
    if (response.data.success) {
      return response.data.paste.content;
    }
  } catch (error) {
    console.error('Lỗi khi lấy paste:', error);
    return null;
  }
}

// Sử dụng trong bot Messenger
async function handleMessengerMessage(message, senderId) {
  if (message.startsWith('/paste')) {
    const code = message.replace('/paste', '').trim();
    const result = await uploadCodeToPaste(code, 'javascript', 'Code từ Messenger Bot');
    
    if (result) {
      // Gửi link về cho user
      sendMessage(senderId, `✅ Đã tạo paste: ${result.url}`);
    } else {
      sendMessage(senderId, '❌ Có lỗi khi tạo paste');
    }
  }
  
  if (message.startsWith('/get')) {
    const pasteId = message.split(' ')[1];
    const code = await getCodeFromPaste(pasteId);
    
    if (code) {
      sendMessage(senderId, `Code:\n${code}`);
    } else {
      sendMessage(senderId, '❌ Không tìm thấy paste');
    }
  }
}

// Hàm giả để gửi tin nhắn (thay bằng hàm thực của bot)
function sendMessage(recipientId, message) {
  console.log(`Send to ${recipientId}: ${message}`);
  // Implement your Messenger send API here
}
```

### Bước 3: Code Mẫu Bot Messenger (Python)

```python
import requests

PASTE_API = 'https://your-railway-app.railway.app'

def upload_code_to_paste(code, language='python', title='Code từ Messenger'):
    try:
        response = requests.post(f'{PASTE_API}/api/paste', json={
            'title': title,
            'content': code,
            'language': language,
            'expiresIn': None
        })
        
        data = response.json()
        if data.get('success'):
            return {
                'url': data['url'],
                'raw_url': data['raw_url'],
                'is_private': data['is_private']
            }
    except Exception as e:
        print(f'Lỗi khi upload paste: {e}')
        return None

def get_code_from_paste(paste_id):
    try:
        response = requests.get(f'{PASTE_API}/api/paste/{paste_id}')
        data = response.json()
        
        if data.get('success'):
            return data['paste']['content']
    except Exception as e:
        print(f'Lỗi khi lấy paste: {e}')
        return None

# Sử dụng trong bot
def handle_message(message, sender_id):
    if message.startswith('/paste'):
        code = message.replace('/paste', '').strip()
        result = upload_code_to_paste(code, 'python', 'Code từ Messenger Bot')
        
        if result:
            send_message(sender_id, f"✅ Đã tạo paste: {result['url']}")
        else:
            send_message(sender_id, '❌ Có lỗi khi tạo paste')
    
    elif message.startswith('/get'):
        paste_id = message.split()[1]
        code = get_code_from_paste(paste_id)
        
        if code:
            send_message(sender_id, f'Code:\n{code}')
        else:
            send_message(sender_id, '❌ Không tìm thấy paste')

def send_message(recipient_id, message):
    # Implement your Messenger send API here
    print(f'Send to {recipient_id}: {message}')
```

---

## 🎮 Tích Hợp Bot Discord

### Code Mẫu Discord Bot (Node.js với discord.js)

```javascript
const Discord = require('discord.js');
const axios = require('axios');

const client = new Discord.Client({
  intents: ['Guilds', 'GuildMessages', 'MessageContent']
});

const PASTE_API = 'https://your-railway-app.railway.app';

client.on('messageCreate', async (message) => {
  if (message.author.bot) return;

  // Command: !paste <code>
  if (message.content.startsWith('!paste')) {
    const code = message.content.replace('!paste', '').trim();
    
    try {
      const response = await axios.post(`${PASTE_API}/api/paste`, {
        title: `Code từ ${message.author.username}`,
        content: code,
        language: 'javascript'
      });

      if (response.data.success) {
        message.reply(`✅ Đã tạo paste: ${response.data.url}`);
      }
    } catch (error) {
      message.reply('❌ Có lỗi khi tạo paste');
    }
  }

  // Command: !getpaste <id>
  if (message.content.startsWith('!getpaste')) {
    const pasteId = message.content.split(' ')[1];
    
    try {
      const response = await axios.get(`${PASTE_API}/api/paste/${pasteId}`);
      
      if (response.data.success) {
        const paste = response.data.paste;
        message.reply(`\`\`\`${paste.language}\n${paste.content}\n\`\`\``);
      }
    } catch (error) {
      message.reply('❌ Không tìm thấy paste');
    }
  }
});

client.login('YOUR_DISCORD_BOT_TOKEN');
```

---

## 🚂 Deploy Lên Railway

### Bước 1: Chuẩn Bị

Railway sẽ tự động phát hiện và deploy ứng dụng Node.js. Đảm bảo:
- File `package.json` có script `"start": "node server.js"`
- File `.gitignore` đã loại trừ `node_modules/` và `*.db`

### Bước 2: Deploy

1. Tạo tài khoản tại [Railway.app](https://railway.app)
2. Tạo project mới
3. Connect repository GitHub của bạn HOẶC deploy trực tiếp từ CLI
4. Railway sẽ tự động build và deploy

### Bước 3: Lấy Domain

Sau khi deploy, Railway sẽ cung cấp domain dạng:
```
https://your-app.railway.app
```

Sử dụng domain này để thay thế trong code bot của bạn.

### Bước 4: Custom Domain (Optional)

Bạn có thể thêm custom domain trong Railway settings.

---

## 💡 Các Use Case Thực Tế

### 1. Bot Messenger Share Code
User gửi code cho bot → Bot upload lên paste → Trả link chia sẻ

### 2. Discord Code Review
User paste code → Bot tạo link → Team review qua link

### 3. Telegram Snippet Bot
User gửi snippet → Bot lưu và tạo link → Dễ dàng chia sẻ trong group

### 4. Automated Error Logging
App error → Auto upload stack trace → Nhận link để debug

---

## 📞 Support

- GitHub: [your-github]
- Website: https://your-domain.com

**Note Paste Bạch Hoàng** - Chia sẻ code dễ dàng! 🚀
