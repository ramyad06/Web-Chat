import express from 'express';
import { createServer } from 'node:http';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';
import { Server } from 'socket.io';
import sqlite3 from 'sqlite3';
import { open } from 'sqlite';
import { availableParallelism } from 'node:os';
import cluster from 'node:cluster';
import { createAdapter, setupPrimary } from '@socket.io/cluster-adapter';

if (cluster.isPrimary) {
  const numCPUs = availableParallelism();
  for (let i = 0; i < numCPUs; i++) {
    cluster.fork({
      PORT: 3000 + i
    });
  }

  setupPrimary();
} else {
  const db = await open({
    filename: 'chat.db',
    driver: sqlite3.Database
  });

  await db.exec(`
    CREATE TABLE IF NOT EXISTS messages (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      client_offset TEXT UNIQUE,
      content TEXT
    );
  `);

  const app = express();
  const server = createServer(app);
  const io = new Server(server, {
    connectionStateRecovery: {},
    adapter: createAdapter()
  });

  const __dirname = dirname(fileURLToPath(import.meta.url));
  app.get('/', (req, res) => {
    res.sendFile(join(__dirname, 'index.html'));
  });

  const users = {};
  const onlineUsers = new Set(); 

  io.on('connection', async (socket) => {
    onlineUsers.add(socket.id);
    io.emit('online users', Array.from(onlineUsers));

    socket.on('set username', (username) => {
      users[socket.id] = username;
      io.emit('user connected', `${username} joined the chat`);
    });

    socket.on('chat message', async (msg, clientOffset, callback) => {
      let result;
      try {
        result = await db.run('INSERT INTO messages (content, client_offset) VALUES (?, ?)', msg, clientOffset);
      } catch (e) {
        if (e.errno === 19 && typeof callback === 'function') {
          callback();  
        }
        return;
      }
    
      io.emit('chat message', msg, result.lastID);  

      if (typeof callback === 'function') {
        callback();  
      }
    });

    socket.on('typing', () => {
      socket.broadcast.emit('typing', users[socket.id] || 'Anonymous');
    });

    socket.on('private message', ({ recipientId, message }) => {
      const sender = users[socket.id] || 'Anonymous';
      io.to(recipientId).emit('private message', { sender, message });
    });

    socket.on('disconnect', () =>{
      delete users[socket.id];
      onlineUsers.delete(socket.id);
      io.emit('online users', Array.from(onlineUsers));
    });

    if (!socket.recovered) {
      try {
        await db.each(
          'SELECT id, content FROM messages WHERE id > ?',
          [socket.handshake.auth.serverOffset || 0],
          (_err, row) => {
            socket.emit('chat message', row.content, row.id);
          }
        );
      } catch (e) {}
    }
  });

  const port = process.env.PORT;
  server.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
  });
}