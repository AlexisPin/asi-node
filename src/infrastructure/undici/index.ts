import { Pool } from 'undici';

const DEV = true;

const URL = DEV ? 'http://localhost:8083' : 'http://tp.cpe.fr:8083';

const pool = new Pool(URL, {
  connections: 100,
  pipelining: 10,
  keepAliveTimeout: 60_000,
  headersTimeout: 0,
  bodyTimeout: 0,
});

export const findUser = async (id: number) => {
  return await pool.request({
    method: 'GET',
    path: `/user/${id}`,
  });
};
