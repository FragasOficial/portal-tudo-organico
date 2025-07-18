const sql = require('mssql');

const config = {
  user: process.env.DB_USER,        // Lê do .env
  password: process.env.DB_PASSWORD, // Lê do .env
  server: process.env.DB_SERVER,     // Lê do .env
  database: process.env.DB_DATABASE, // Lê do .env
  options: {
    encrypt: false, // Pode ser true se você estiver usando SSL
    trustServerCertificate: true // Mude para false em produção, mas true pode ser necessário para desenvolvimento local com certificados autoassinados
  }
};

const pool = new sql.ConnectionPool(config);

// Recomenda-se conectar a pool uma única vez e exportá-la já conectada.
// Assim, você pode usar await poolConnect em qualquer lugar que precise de uma conexão.
const poolConnect = pool.connect()
  .then(() => {
    console.log('Conectado ao SQL Server');
    return pool; // Retorna o pool conectado
  })
  .catch(err => {
    console.error('Erro de conexão ao banco de dados:', err);
    // Em produção, você pode querer encerrar o processo aqui ou tentar reconectar.
    process.exit(1); // Encerra a aplicação se a conexão falhar
  });

module.exports = {
  sql,
  pool: poolConnect, // Exporta a promessa da pool conectada
  poolConnect // Mantém a referência para a promessa de conexão se precisar
};