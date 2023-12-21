import { cardSchema } from "#domain/schema/card_schema";
import { httpClient } from "#infrastructure/socket/http_client";


export const getCards = async (ids: number[]) => {
  const response = await Promise.all(ids.map(id => httpClient.request({
    path: `/card/${id}`,
    method: 'GET',
  })));
  return Promise.all(response.map(async res => cardSchema.parse(await res.body.json())));
}


