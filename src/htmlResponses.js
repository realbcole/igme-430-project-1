const fs = require('fs');

const index = fs.readFileSync(`${__dirname}/../client/client.html`);
const css = fs.readFileSync(`${__dirname}/../client/style.css`);
const room = fs.readFileSync(`${__dirname}/../client/room.html`);
const roomCSS = fs.readFileSync(`${__dirname}/../client/roomStyle.css`);
const notFound = fs.readFileSync(`${__dirname}/../client/notFound.html`);

const getIndex = (req, res) => {
  res.writeHead(200, { 'Content-Type': 'text/html' });
  res.write(index);
  res.end();
};

const getCSS = (req, res) => {
  res.writeHead(200, { 'Content-Type': 'text/css' });
  res.write(css);
  res.end();
};

const getRoom = (req, res) => {
  res.writeHead(200, { 'Content-Type': 'text/html' });
  res.write(room);
  res.end();
};

const getRoomCSS = (req, res) => {
  res.writeHead(200, { 'Content-Type': 'text/css' });
  res.write(roomCSS);
  res.end();
};

const getNotFound = (req, res) => {
  res.writeHead(404, { 'Content-Type': 'text/html' });
  res.write(notFound);
  res.end();
};

module.exports = {
  getIndex,
  getCSS,
  getRoom,
  getRoomCSS,
  getNotFound,
};
