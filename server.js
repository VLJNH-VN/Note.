const express = require('express');
const path = require('path');
const { createPaste, getPaste, getRecentPastes } = require('./database');

const app = express();
const PORT = process.env.PORT || 5000;

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.use((req, res, next) => {
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('X-Frame-Options', 'DENY');
  res.setHeader('X-XSS-Protection', '1; mode=block');
  res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
  res.setHeader('Permissions-Policy', 'geolocation=(), microphone=(), camera=()');
  res.setHeader('Strict-Transport-Security', 'max-age=31536000; includeSubDomains');
  next();
});

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

app.get('/', (req, res) => {
  const recentPastes = getRecentPastes(10);
  res.render('index', { recentPastes });
});

app.post('/api/paste', (req, res) => {
  try {
    const { title, content, language, expiresIn, isPrivate } = req.body;

    if (!content || content.trim().length === 0) {
      return res.status(400).json({ 
        success: false, 
        error: 'Nội dung không được để trống' 
      });
    }

    if (content.length > 1000000) {
      return res.status(400).json({ 
        success: false, 
        error: 'Nội dung quá dài (tối đa 1MB)' 
      });
    }

    const validLanguages = ['plaintext', 'javascript', 'python', 'java', 'cpp', 'csharp', 
      'php', 'ruby', 'go', 'rust', 'html', 'css', 'sql', 'json', 'xml', 
      'markdown', 'bash', 'typescript'];
    
    const validatedLanguage = language && validLanguages.includes(language) 
      ? language 
      : 'plaintext';

    let expirationMs = null;
    if (expiresIn) {
      const expiresInNum = parseInt(expiresIn);
      if (isNaN(expiresInNum) || expiresInNum < 0 || expiresInNum > 31536000) {
        return res.status(400).json({ 
          success: false, 
          error: 'Thời gian hết hạn không hợp lệ (0-31536000 giây)' 
        });
      }
      expirationMs = expiresInNum * 1000;
    }

    const paste = createPaste(
      title || 'Untitled',
      content,
      validatedLanguage,
      expirationMs,
      isPrivate
    );

    const baseUrl = req.get('host');
    const protocol = req.protocol;
    
    res.json({
      success: true,
      id: paste.id,
      url: `${protocol}://${baseUrl}/bachhoang/${paste.id}`,
      raw_url: `${protocol}://${baseUrl}/api/paste/${paste.id}/raw`,
      api_url: `${protocol}://${baseUrl}/api/paste/${paste.id}`,
      is_private: !!isPrivate
    });
  } catch (error) {
    console.error('Error creating paste:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Lỗi khi tạo paste' 
    });
  }
});

app.get('/api/paste/:id', (req, res) => {
  try {
    const paste = getPaste(req.params.id);
    
    if (!paste) {
      return res.status(404).json({ 
        success: false, 
        error: 'Không tìm thấy paste' 
      });
    }

    res.json({
      success: true,
      paste: {
        id: paste.id,
        title: paste.title,
        content: paste.content,
        language: paste.language,
        created_at: paste.created_at,
        expires_at: paste.expires_at,
        views: paste.views
      }
    });
  } catch (error) {
    console.error('Error fetching paste:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Lỗi khi lấy paste' 
    });
  }
});

app.get('/api/paste/:id/raw', (req, res) => {
  try {
    const paste = getPaste(req.params.id);
    
    if (!paste) {
      return res.status(404).send('Không tìm thấy paste');
    }

    res.setHeader('Content-Type', 'text/plain; charset=utf-8');
    res.setHeader('Content-Disposition', 'inline');
    res.setHeader('X-Content-Type-Options', 'nosniff');
    res.send(paste.content);
  } catch (error) {
    console.error('Error fetching raw paste:', error);
    res.status(500).send('Lỗi khi lấy paste');
  }
});

app.get('/bachhoang/:id', (req, res) => {
  try {
    const paste = getPaste(req.params.id);
    
    if (!paste) {
      return res.status(404).render('404');
    }

    res.render('paste', { paste });
  } catch (error) {
    console.error('Error rendering paste:', error);
    res.status(500).send('Lỗi khi hiển thị paste');
  }
});

app.get('/api/recent', (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 10;
    const pastes = getRecentPastes(limit);
    
    res.json({
      success: true,
      pastes
    });
  } catch (error) {
    console.error('Error fetching recent pastes:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Lỗi khi lấy danh sách paste' 
    });
  }
});

app.use((req, res) => {
  res.status(404).render('404');
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 Note Paste Bạch Hoàng đang chạy tại http://0.0.0.0:${PORT}`);
});
