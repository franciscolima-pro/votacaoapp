const mysql = require("mysql");

const conexao = mysql.createConnection({
  host: process.env.DB_HOST || "localhost",
  port: process.env.DB_PORT || 3306,
  user: process.env.DB_USER || "root",
  password: process.env.DB_PASSWORD || "",
  database: process.env.DB_NAME || "sistema_votacao",
  multipleStatements: true // Permite executar múltiplas queries de uma vez
});

// Conectar ao banco
conexao.connect((err) => {
  if (err) {
    console.error('Erro ao conectar ao MySQL:', err.stack);
    return;
  }
  console.log('Conectado ao MySQL como id', conexao.threadId);
});

module.exports = conexao;