import express from 'express';
import 'dotenv/config';
import bodyParser from 'body-parser';
import userRouter from './routes/api/user/user';

const app = express();
const port = parseInt(process.env.PORT!, 10) || 3000;
app.use(bodyParser.json({ limit: '100mb' }));

app.use('/', userRouter);

app.listen(port, () => {
  return console.log(`Express is listening at http://localhost:${port}`);
});
