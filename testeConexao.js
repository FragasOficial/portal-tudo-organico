const sql = require('mssql');

const config = {
  user: 'tudoorganico_user',
  password: 'C@twaba2024',
  server: 'localhost',
  port: 49677,
  database: 'TudoOrganico',
  options: {
    encrypt: false,
    trustServerCertificate: true
  }
};

async function testar() {
  try {
    await sql.connect(config);
    console.log('✅ Conexão bem-sucedida com o SQL Server');
    const result = await sql.query('SELECT 1 AS resultado');
    console.log(result.recordset);
  } catch (err) {
    console.error('❌ Erro na conexão:', err);
  } finally {
    await sql.close();
  }
}

testar();
