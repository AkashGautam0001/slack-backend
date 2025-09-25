import express from 'express';
import { StatusCodes } from 'http-status-codes';

import { PORT } from './config/serverConfig.js';
import connectDB from './config/dbConfig.js';
const app = express();
import apiRouter from './routes/apiRoutes.js';

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/api', apiRouter);

app.get('/ping', (req, res) => {
  return res.status(StatusCodes.OK).json({
    message: 'pong'
  });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  connectDB();
});
