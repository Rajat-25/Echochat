import cors from 'cors';
import dotenv from 'dotenv';
import express from 'express';
import http from 'http';
import { WebSocketSingleton } from './WebSocketServer';
const PORT = process.env.PORT || 3005;
const app = express();
const server = http.createServer(app);

app.use(express.json());
dotenv.config();

app.use(cors())
WebSocketSingleton.getInstance(server);


server.listen(PORT, () => {
  console.log(`🚀 Server is listening on http://localhost:${PORT}`);
  console.log(`🔌 WebSocket server is running on ws://localhost:${PORT}`);
});
