const sql = require('mssql');

const config = {
  user: 'tudoorganico_user',
  password: 'C@twaba2024',
  server: 'localhost',        // ✅ Tem que ser string, não número ou indefinido
  port: 49677,                // ✅ Essa é a porta dinâmica que você informou
  database: 'TudoOrganico',
  options: {
    encrypt: false,
    trustServerCertificate: true
  }
};

const pool = new sql.ConnectionPool(config);
const poolConnect = pool.connect();

pool.on('error', err => {
  console.error('Erro no pool de conexões:', err);
});

module.exports = {
  sql,
  pool,
  poolConnect,
  getPool: () => pool
};
