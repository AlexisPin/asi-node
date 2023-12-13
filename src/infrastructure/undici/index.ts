import { Pool } from "undici";



const pool = new Pool("http://tp.cpe.fr:8083", {
    connections: 100,
    pipelining: 10,
    keepAliveTimeout: 60_000,
    headersTimeout: 0,
    bodyTimeout: 0,
})


export const findUser = async (id: string) => {
    return await pool.request({
        method: "GET",
        path: `/user/${id}`,
    })
}
