# Web-Chat
using websockets
Chat Application (Socket.io + SQLite + Clustering)
🚀 Overview
A real-time chat app using Node.js, Express, Socket.io, and SQLite, with support for multiple clients and message persistence.

✨ Features
✅ Real-time messaging
✅ Message persistence with SQLite
✅ Typing indicator & user join notifications
✅ Clustered WebSocket server for scalability

🏗 Setup & Run
1️⃣ Clone & Install

sh
Copy
Edit
git clone https://github.com/your-username/Chat-Application.git  
cd Chat-Application  
npm install  
2️⃣ Run the Server

sh
Copy
Edit
node index.js  
or

sh
Copy
Edit
npx nodemon index.js  
3️⃣ Open in Browser

arduino
Copy
Edit
http://localhost:3000  
Open multiple tabs to test messaging.

⚙️ How It Works
🔹 Backend:

Uses Socket.io for WebSocket communication.
Stores messages in SQLite for persistence.
Uses clustering to handle multiple connections efficiently.
🔹 Frontend:

Sends messages via socket.emit('chat message', msg).
Displays messages received from socket.on('chat message', msg).
Shows who’s typing and who joined.
