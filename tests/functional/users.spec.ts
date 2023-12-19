import { test } from "@japa/runner";


test.group('User | Register', (group) => {
  group.each.setup(async () => {
    // run migrations
  });

  test('ensure user can register', async ({ client }) => {
    const response = await client.post('/users').json({
      id: 1,
      login: 'test',
      pwd: 'password1234',
      account: 100,
      cardList: [1, 2, 3]
    });

    response.assertStatus(201);

    response.assertBodyContains({ id: 1 });
  });

  test('ensure user can get all users', async ({ client }) => {
    const response = await client.get('/users');

    response.assertStatus(200);
  });
});
