const Database = require('better-sqlite3');
const { nanoid } = require('nanoid');
const path = require('path');

const db = new Database(path.join(__dirname, 'pastes.db'));

db.exec(`
  CREATE TABLE IF NOT EXISTS pastes (
    id TEXT PRIMARY KEY,
    title TEXT,
    content TEXT NOT NULL,
    language TEXT DEFAULT 'plaintext',
    created_at INTEGER NOT NULL,
    expires_at INTEGER,
    views INTEGER DEFAULT 0
  )
`);

const createPaste = (title, content, language, expiresIn) => {
  const id = nanoid(10);
  const createdAt = Date.now();
  const expiresAt = expiresIn ? createdAt + expiresIn : null;

  const stmt = db.prepare(`
    INSERT INTO pastes (id, title, content, language, created_at, expires_at)
    VALUES (?, ?, ?, ?, ?, ?)
  `);

  stmt.run(id, title, content, language, createdAt, expiresAt);
  return { id, title, content, language, createdAt, expiresAt };
};

const getPaste = (id) => {
  const stmt = db.prepare(`
    SELECT * FROM pastes WHERE id = ?
  `);

  const paste = stmt.get(id);
  
  if (!paste) return null;
  
  if (paste.expires_at && paste.expires_at < Date.now()) {
    deletePaste(id);
    return null;
  }

  const updateStmt = db.prepare(`
    UPDATE pastes SET views = views + 1 WHERE id = ?
  `);
  updateStmt.run(id);

  return paste;
};

const getRecentPastes = (limit = 10) => {
  const stmt = db.prepare(`
    SELECT id, title, language, created_at, views
    FROM pastes
    WHERE expires_at IS NULL OR expires_at > ?
    ORDER BY created_at DESC
    LIMIT ?
  `);

  return stmt.all(Date.now(), limit);
};

const deletePaste = (id) => {
  const stmt = db.prepare('DELETE FROM pastes WHERE id = ?');
  return stmt.run(id);
};

const deleteExpiredPastes = () => {
  const stmt = db.prepare('DELETE FROM pastes WHERE expires_at < ?');
  return stmt.run(Date.now());
};

setInterval(deleteExpiredPastes, 60 * 60 * 1000);

module.exports = {
  createPaste,
  getPaste,
  getRecentPastes,
  deletePaste
};
