import express from 'express';
import { StatusCodes } from 'http-status-codes';
import { createServer } from 'http';
import { Server } from 'socket.io';

import connectDB from './config/dbConfig.js';
import { PORT } from './config/serverConfig.js';
import apiRouter from './routes/apiRoutes.js';
import bullServerAdapter from './config/bullBoardConfig.js';
import MessageSocketHandlers from './controllers/messageSocketController.js';
import ChannelSocketHandlers from './controllers/channelSocketController.js';

const app = express();
const server = createServer(app);
const io = new Server(server);

app.use('/ui', bullServerAdapter.getRouter());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/api', apiRouter);

app.get('/', (req, res) => {
  return res.send('Slack Backend is working!');
});
app.get('/ping', (req, res) => {
  return res.status(StatusCodes.OK).json({
    message: 'pong'
  });
});

io.on('connection', (socket) => {
  MessageSocketHandlers(io, socket);
  ChannelSocketHandlers(io, socket);
});

server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  connectDB();
});
