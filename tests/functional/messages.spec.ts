import { test } from "@japa/runner";


test.group('Messages', (group) => {
  group.each.setup(async () => {
    // run migrations
  });

  test('ensure message can be send', async ({ client }) => {
    const response = await client.post('/message').json({
      content: 'test',
      sender_id: 1,
      receiver_id: 2,
    });

    response.assertStatus(201);
  });

  test('ensure message can be received', async ({ client }) => {
    const response = await client.post('/message').json({
      content: 'test',
      sender_id: 1,
      receiver_id: 2,
    });

    response.assertStatus(201);

    response.assertBodyContains({ 
      content: 'test',
      sender_id: 1,
      conversation_id: '1_2',
    });
  });

  test('ensure message cannot be send to the same user', async ({ client }) => {
    const response = await client.post('/message').json({
      content: 'test',
      sender_id: 1,
      receiver_id: 1,
    });

    response.assertStatus(422);
  });

  test('ensure message cannot be empty', async ({ client }) => {
    const response = await client.post('/message').json({
      content: '',
      sender_id: 1,
      receiver_id: 2,
    });

    response.assertStatus(422);
  });
});
