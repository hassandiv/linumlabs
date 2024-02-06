import express from 'express';
import bodyParser from 'body-parser';
import userRouter from './routes/api/user/user';
import { AppDataSource } from './data-source';
import { errorHandler } from './middlewares/errorHandler';
import 'dotenv/config';
const port = parseInt(process.env.PORT!, 10) || 3000;

AppDataSource.initialize()
  .then(async () => {
    const app = express();
    app.use(bodyParser.json({ limit: '100mb' }));
    app.use('/', userRouter);
    app.use(errorHandler);

    app.listen(port);
    console.log(
      `Express server has started on port ${port}. Open http://localhost:${port}/users to see results`,
    );
  })
  .catch((error) => console.log(error));
