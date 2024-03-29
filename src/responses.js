const query = require('querystring');

const rooms = {};

// parses the body of a request and passes it to a callback
const parseBody = (req, res, callback) => {
  const body = [];

  req.on('error', (err) => {
    console.dir(err);
    res.statusCode = 400;
    res.end();
  });

  req.on('data', (chunk) => {
    body.push(chunk);
  });

  req.on('end', () => {
    const bodyString = Buffer.concat(body).toString();
    const bodyParams = query.parse(bodyString);
    callback(req, res, bodyParams);
  });
};

// sends a response with content and a status code
const respond = (response, status, content, type) => {
  response.writeHead(status, { 'Content-Type': type });
  response.write(content);
  response.end();
};

// sends a response with only a status code
const respondMeta = (response, status, type) => {
  response.writeHead(status, { 'Content-Type': type });
  response.end();
};

// sends a response with a message that the page was not found
const notFound = (req, res) => {
  const responseJSON = {
    message: 'The page you are looking for was not found.',
    id: 'notFound',
  };

  return respond(res, 404, JSON.stringify(responseJSON), 'application/json');
};

// sends a response with only a status code for a page not found
const notFoundMeta = (req, res) => {
  respondMeta(res, 404, 'application/json');
};

// sends a response with a list of rooms
const getRooms = (req, res) => {
  respond(res, 200, JSON.stringify({ rooms }), 'application/json');
};

// sends a response with only a status code for a list of rooms
const getRoomsMeta = (req, res) => {
  respondMeta(res, 200, 'application/json');
};

// takes in a code and returns the room with that code
const getRoom = (req, res) => {
  const params = query.parse(req.url.split('?')[1]);
  const { code } = params;

  if (rooms[code]) {
    return respond(res, 200, JSON.stringify({ room: rooms[code] }), 'application/json');
  }

  return respond(res, 404, JSON.stringify({ message: 'Room not found' }), 'application/json');
};

// sends a response with only a status code for a room
const getRoomMeta = (req, res) => {
  respondMeta(res, 200, 'application/json');
};

// adds a room to the list of rooms, or adds a user to an existing room
const addRoom = (req, res, bodyParams) => {
  if (!bodyParams.room || !bodyParams.name) {
    return respond(res, 400, JSON.stringify({ message: 'Name and Room are both required' }), 'application/json');
  }

  let responseCode = 204;
  if (!rooms[bodyParams.room]) {
    responseCode = 201;
    rooms[bodyParams.room] = { users: {}, votes: { yes: 0, abstain: 0, no: 0 } };
  }

  rooms[bodyParams.room].users = rooms[bodyParams.room].users || {};

  if (!rooms[bodyParams.room].users[bodyParams.name]) {
    rooms[bodyParams.room].users[bodyParams.name] = true;
  }

  if (responseCode === 204) {
    return respondMeta(res, 204, 'application/json');
  }
  return respond(res, 201, JSON.stringify({ message: 'Created Successfully' }), 'application/json');
};

// adds a vote to a room
const vote = (req, res, bodyParams) => {
  if (!bodyParams.room || !bodyParams.vote) {
    return respond(res, 400, JSON.stringify({ message: 'Room code and vote are required' }), 'application/json');
  }

  if (!rooms[bodyParams.room]) {
    return respond(res, 404, JSON.stringify({ message: 'Room not found' }), 'application/json');
  }

  if (bodyParams.vote === 'yes') {
    rooms[bodyParams.room].votes.yes++;
  } else if (bodyParams.vote === 'no') {
    rooms[bodyParams.room].votes.no++;
  } else if (bodyParams.vote === 'abstain') {
    rooms[bodyParams.room].votes.abstain++;
  }

  return respondMeta(res, 204, 'application/json');
};

module.exports = {
  parseBody,
  notFound,
  notFoundMeta,
  getRooms,
  getRoomsMeta,
  addRoom,
  getRoom,
  getRoomMeta,
  vote,
};
