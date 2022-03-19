import { handler } from './build/handler.js';
import express from 'express';

import http from "http";
import { Server as SocketIO } from "socket.io";

const app = express();

const server = http.createServer();
const io = new SocketIO(server, {
  cors: {
    origin: "*",
  },
});

app.use(handler); // let SvelteKit handle everything else, including serving prerendered pages and static assets

app.listen(process.env.PORT || 3000, () => {
	console.log('server listening');
});