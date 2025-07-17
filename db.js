const sql = require('mssql');

const config = {
  user: 'seu_usuario_sql',
  password: 'sua_senha_sql',
  server: 'localhost',
  database: 'TudoOrganico',
  options: {
    encrypt: false,
    trustServerCertificate: true
  }
};

module.exports = {
  sql, config
};
