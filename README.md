# Web-Chat  
Using WebSockets  

## Chat Application (Socket.io + SQLite + Clustering)  

### Overview  
A real-time chat app using **Node.js, Express, Socket.io, and SQLite**, with support for multiple clients and message persistence.  

### Features  
✅ Real-time messaging  
✅ Message persistence with SQLite  
✅ Typing indicator & user join notifications  
✅ Clustered WebSocket server for scalability  

### How It Works  

#### Backend:  
- Uses **Socket.io** for WebSocket communication.  
- Stores messages in **SQLite** for persistence.  
- Uses **clustering** to handle multiple connections efficiently.  

#### Frontend:  
- Sends messages via `socket.emit('chat message', msg)`.  
- Displays messages received from `socket.on('chat message', msg)`.  
- Shows **who’s typing** and **who joined**.  
