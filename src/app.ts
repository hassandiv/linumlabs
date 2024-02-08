import express from 'express';
import http from 'http';
import bodyParser from 'body-parser';
import userRouter from './routes/api/user/user';
import { AppDataSource } from './data-source';
import { errorHandler } from './middlewares/errorHandler';
import 'dotenv/config';

const port = parseInt(process.env.PORT!, 10) || 3000;
const app = express();
let server: http.Server;

export const startServer = async () => {
  try {
    await AppDataSource.initialize();
    app.use(bodyParser.json({ limit: '100mb' }));
    app.use('/', userRouter);
    app.use(errorHandler);
    server = app.listen(port, () => {
      console.log(
        `Express server has started on port ${port}. Open http://localhost:${port}/users to see results`,
      );
    });
  } catch (error) {
    console.log(error);
  }
};

export const stopServer = async () => {
  if (server) {
    server.close();
  }
};

if (require.main === module) {
  startServer();
}

export default app;
