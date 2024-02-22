const http = require('http');
const url = require('url');
const htmlHandler = require('./htmlResponses.js');
const responseHandler = require('./responses.js');

const port = process.env.PORT || process.env.NODE_PORT || 3000;

const urlStruct = {
  GET: {
    '/': htmlHandler.getIndex,
    '/style.css': htmlHandler.getCSS,
    '/getRooms': responseHandler.getRooms,
    '/getRoom': responseHandler.getRoom,
    '/room': htmlHandler.getRoom,
    '/roomStyle.css': htmlHandler.getRoomCSS,
    notFound: responseHandler.notFound,
  },
  HEAD: {
    '/getRooms': responseHandler.getRoomsMeta,
    '/getRoom': responseHandler.getRoomMeta,
    notFound: responseHandler.notFoundMeta,
  },
  POST: {
    '/addRoom': responseHandler.addRoom,
    '/vote': responseHandler.vote,
    notFound: responseHandler.notFound,
  },
};

const onRequest = (req, res) => {
  const parsedUrl = url.parse(req.url);

  if (!urlStruct[req.method]) return urlStruct.HEAD.notFound(req, res);

  if (urlStruct[req.method][parsedUrl.pathname]) {
    if (req.method === 'POST') {
      return responseHandler.parseBody(req, res, urlStruct[req.method][parsedUrl.pathname]);
    }
    return urlStruct[req.method][parsedUrl.pathname](req, res);
  }

  return urlStruct[req.method].notFound(req, res);
};

http.createServer(onRequest).listen(port, () => {
  console.log(`Listening on port ${port}`);
});
