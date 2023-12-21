import { registerUserSchema } from "#domain/schema/register_user_schema";
import { httpClient } from "#infrastructure/socket/http_client";


export const getUser = async (id: number) => {
  const response = await httpClient.request({
    path: `/user/${id}`,
    method: 'GET',
  });
  return registerUserSchema.parse(await response.body.json());
}
