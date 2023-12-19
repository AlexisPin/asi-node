import { Pool } from 'undici';

const DEV = true;

const URL = DEV ? 'http://localhost:8083' : 'http://tp.cpe.fr:8083';

export const httpClient = new Pool(URL, {
  connections: 128,
  pipelining: 1,
  connect: {
    keepAlive: true,
    rejectUnauthorized: false,
  }
});
