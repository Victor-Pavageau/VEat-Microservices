require('dotenv').config();
const sql = require('mssql');

const config = {
  server: 'veatsql.database.windows.net',
  port: 1433,
  user: 'AdminSql',
  password: '@c87M7HVe6qAg85',
  database: 'SQLVEat',
  options: {
    encrypt: true,
    enableArithAbort: true,
  }
};

sql.connect(config)
  .then(() => console.log('Connected to SQL Server successfully'))
  .catch(e => console.error('Failed to connect to SQL Server', e));
