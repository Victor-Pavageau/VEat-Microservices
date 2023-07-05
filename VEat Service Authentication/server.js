const http = require('http');
const app = require('./app');
const swaggerSetup = require('./swagger'); 
require('./db');

swaggerSetup(app);

app.set('port', process.env.PORT || 3999);
const server = http.createServer(app);

server.listen(process.env.PORT || 3999, () => {
  console.log(`Server is running on port ${app.get('port')}`);
});