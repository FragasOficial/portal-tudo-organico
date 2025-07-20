// // const sql = require('mssql');

// // const config = {
// //   user: 'tudoorganico_user',
// //   password: 'C@twaba2024',
// //   server: 'localhost',        // ✅ Tem que ser string, não número ou indefinido
// //   port: 49677,                // ✅ Essa é a porta dinâmica que você informou
// //   database: 'TudoOrganico',
// //   options: {
// //     encrypt: false,
// //     trustServerCertificate: true
// //   }
// // };

// // const pool = new sql.ConnectionPool(config);
// // const poolConnect = pool.connect();

// // pool.on('error', err => {
// //   console.error('Erro no pool de conexões:', err);
// // });

// // module.exports = {
// //   sql,
// //   pool,
// //   poolConnect,
// //   getPool: () => pool
// // };

// // db.js - conexão ajustada
// const sql = require('mssql');

// const config = {
//   user: process.env.DB_USER || 'tudoorganico_user',
//   password: process.env.DB_PASS || 'C@twaba2024',
//   server: process.env.DB_SERVER || 'localhost',
//   port: parseInt(process.env.DB_PORT || '49677', 10),
//   database: process.env.DB_NAME || 'TudoOrganico',
//   options: {
//     encrypt: false,
//     trustServerCertificate: true
//   }
// };

// const poolPromise = new sql.ConnectionPool(config)
//   .connect()
//   .then(pool => {
//     console.log('✅ Banco de dados conectado (TudoOrganico)');
//     return pool;
//   })
//   .catch(err => {
//     console.error('❌ Erro ao conectar ao banco de dados:', err);
//     throw err;
//   });

// module.exports = {
//   sql,
//   getPool: () => poolPromise
// };

// db.js - conexão ajustada com função getPool()
const sql = require('mssql');

const config = {
  user: process.env.DB_USER || 'tudoorganico_user',
  password: process.env.DB_PASS || 'C@twaba2024',
  server: process.env.DB_SERVER || 'localhost',
  port: parseInt(process.env.DB_PORT || '49677', 10),
  database: process.env.DB_NAME || 'TudoOrganico',
  options: {
    encrypt: false,
    trustServerCertificate: true
  }
};

const poolPromise = new sql.ConnectionPool(config)
  .connect()
  .then(pool => {
    console.log('✅ Banco de dados conectado (TudoOrganico)');
    return pool;
  })
  .catch(err => {
    console.error('❌ Erro ao conectar ao banco de dados:', err);
    throw err;
  });

module.exports = {
  sql,
  getPool: () => poolPromise
};
