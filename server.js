const dotenv = require('dotenv');
process.on('uncaughtException', err => {
  console.log(err.name, err.message);
  process.exit(1);
});
dotenv.config({ path: `./config.env` });
const mongoose = require('mongoose');
const app = require('./app');

const PORT = process.env.PORT || 3009;

console.log(`your port is ${process.env.PORT}`);
const server = app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`);
});

process.on('unhanledRejection', err => {
  server.close(() => {
    // drna server.close bash n3tiw lw9t l server ttaysali lkhdma likaydir db 3ad ydir process exit ( we give the server time to finish pending or  being handled  requests )
    process.exit(1);
  });
});
process.on('UnhandledPromiseRejectionWarning', err => {
  server.close(() => {
    // drna server.close bash n3tiw lw9t l server ttaysali lkhdma likaydir db 3ad ydir process exit ( we give the server time to finish pending or  being handled  requests )
    process.exit(1);
  });
});

process.on('UnhandledPromiseRejection', err => {
  server.close(() => {
    // drna server.close bash n3tiw lw9t l server ttaysali lkhdma likaydir db 3ad ydir process exit ( we give the server time to finish pending or  being handled  requests )
    process.exit(1);
  });
});
