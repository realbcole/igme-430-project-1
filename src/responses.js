const query = require('querystring');

const users = {};

const respond = (response, status, content, type) => {
  response.writeHead(status, { 'Content-Type': type });
  response.write(content);
  response.end();
};

const respondMeta = (response, status, type) => {
  response.writeHead(status, { 'Content-Type': type });
  response.end();
};

const notFound = (req, res) => {
  const responseJSON = {
    message: 'The page you are looking for was not found.',
    id: 'notFound',
  };

  return respond(res, 404, JSON.stringify(responseJSON), 'application/json');
};

const notFoundMeta = (req, res) => {
  respondMeta(res, 404, 'application/json');
};

const getUsers = (req, res) => {
  respond(res, 200, JSON.stringify({ users }), 'application/json');
};

const getUsersMeta = (req, res) => {
  respondMeta(res, 200, 'application/json');
};

const addUser = (req, res) => {
  const body = [];

  req.on('error', (err) => {
    console.dir(err);
    respond(res, 400, JSON.stringify({ message: 'Failed to parse body' }), 'application/json');
  });

  req.on('data', (chunk) => {
    body.push(chunk);
  });

  req.on('end', () => {
    const bodyString = Buffer.concat(body).toString();
    const bodyParams = query.parse(bodyString);

    if (!bodyParams.name || !bodyParams.age) {
      return respond(res, 400, JSON.stringify({ message: 'Name and age are both required' }), 'application/json');
    }

    let responseCode = 204;
    if (!users[bodyParams.name]) {
      responseCode = 201;
      users[bodyParams.name] = {};
    }

    users[bodyParams.name].name = bodyParams.name;
    users[bodyParams.name].age = bodyParams.age;

    if (responseCode === 204) {
      return respondMeta(res, 204, 'application/json');
    }
    return respond(res, 201, JSON.stringify({ message: 'Created Successfully' }), 'application/json');
  });
};

module.exports = {
  notFound,
  notFoundMeta,
  getUsers,
  getUsersMeta,
  addUser,
};
