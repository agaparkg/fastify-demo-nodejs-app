import axios from 'axios';
// Require the framework and instantiate it
// ESM
import Fastify from 'fastify';

const fastify = Fastify({
  logger: true,
});

// Declare a root route
fastify.get('/', async (request, reply) => {
  console.log(users1);

  return { hello: 'world' };
});

// Declare users route
fastify.get('/users', async (request, reply) => {
  let users;
  try {
    users = await axios.get(
      'https://61008c3dbca46600171cf917.mockapi.io/api/v1/users'
    );
  } catch (err) {
    throw Error('Something went wrong!');
  }

  return { users: users.data };
});

// Declare login route
fastify.post('/login', async (request, reply) => {
  let id = request.body.id;
  let user;

  try {
    user = await axios.get(
      `https://61008c3dbca46600171cf917.mockapi.io/api/v1/users/${id}`
    );
    return { status: 'Success!', user: user.data };
  } catch (err) {
    return { user: null };
  }
});

// Declare signup route
fastify.post('/signup', async (request, reply) => {
  let { firstName, lastName, email, password } = request.body;
  try {
    const { data } = await axios.get(
      'https://61008c3dbca46600171cf917.mockapi.io/api/v1/users'
    );
    if (!data.some((u) => u.email === email)) {
      await axios.post(
        'https://61008c3dbca46600171cf917.mockapi.io/api/v1/users',
        {
          firstName,
          lastName,
          email,
          password,
          createdAt: Date.now(),
        }
      );
      return { status: 'User has been added successfully' };
    } else {
      throw new Error(null);
    }
  } catch (err) {
    let newErr =
      err.message == 'null'
        ? 'User with this email already exist in our systems!'
        : 'Something went wrong! Please try again later.';
    return { status: newErr };
  }
});

// Run the server!
const start = async () => {
  try {
    await fastify.listen(3000);
  } catch (err) {
    fastify.log.error(err);
    process.exit(1);
  }
};
start();
