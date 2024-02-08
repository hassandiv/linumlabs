import express from 'express';
import http from 'http';
import bodyParser from 'body-parser';
import userRouter from './routes/api/user/user';
import { AppDataSource } from './data-source';
import { errorHandler } from './middlewares/errorHandler';
import 'dotenv/config';

const serverPort = parseInt(process.env.PORT!, 10) || 3000;
const app = express();
let server: http.Server;

export async function startServer(port?: number): Promise<void> {
  try {
    await AppDataSource.initialize();
    app.use(bodyParser.json({ limit: '100mb' }));
    app.use('/', userRouter);
    app.use(errorHandler);

    const selectedPort = port || serverPort;

    server = app.listen(selectedPort, () => {
      console.log(
        `Express server has started on port ${serverPort}. Open http://localhost:${serverPort}/ to see results`,
      );
    });
  } catch (error) {
    console.log(error);
  }
}

export async function stopServer(): Promise<void> {
  return new Promise((resolve) => {
    server.close(() => {
      resolve();
    });
  });
}

if (require.main === module) {
  startServer();
}

export default app;
