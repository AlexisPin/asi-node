import { test } from "@japa/runner";

test.group('Game', (group) => {
  group.each.setup(async () => {
    // run migrations
  });

  test('ensure game can be created', async ({ client }) => {
    const response = await client.post('/game/create').json({
      id: 1,
      name: 'test',
      cardList: [],
    });

    response.assertStatus(201);

  });

  test('ensure game can be found', async ({ client }) => {
    const response = await client.post('/game/find').json({
      id: 1,
      name: 'test',
      cardList: [],
    });

    response.assertStatus(201);
  });

  test('ensure game cannot be created with invalid payload', async ({ client }) => {
    const response = await client.post('/game/create').json({
      id: 1,
      name: 'test',
    });

    response.assertStatus(422);
  })

  test('ensure game cannot be found with invalid payload', async ({ client }) => {
    const response = await client.post('/game/find').json({
      id: 1,
      name: 'test',
    });

    response.assertStatus(422);
  })

});
