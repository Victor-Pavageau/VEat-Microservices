const http = require('http');
const app = require('./app');
require('./db');
const swaggerSetup = require('./swagger'); 

swaggerSetup(app);

app.set('port', process.env.PORT || 4003);
const server = http.createServer(app);

server.listen(process.env.PORT || 4003, () => {
  console.log(`Server is running on port ${app.get('port')}`);
});