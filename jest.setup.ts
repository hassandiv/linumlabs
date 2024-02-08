import { startServer, stopServer } from './src/app';

beforeAll(async () => {
  const port = parseInt(process.env.TEST_PORT!) || 4000;
  await startServer(port);
});

afterAll(async () => {
  await stopServer();
});
