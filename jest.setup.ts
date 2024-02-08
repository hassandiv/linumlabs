import { startServer, stopServer } from './src/app';

beforeAll(async () => {
  await startServer();
});

afterAll(async () => {
  await stopServer();
});
