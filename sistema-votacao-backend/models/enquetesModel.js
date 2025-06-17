const conexao = require("../config/db");

class EnqueteModel {
  executaQuery(sql, parametros = "") {
    return new Promise((resolve, reject) => {
      conexao.query(sql, parametros, (error, resposta) => {
        if (error) {
          console.log(error.message);
          reject(error);
        }
        resolve(resposta);
      });
    });
  }

  listar() {
    const sql = `
      SELECT * FROM enquetes
    `;
    return this.executaQuery(sql);
  }

  criar(novaEnquete) {
    const sql = "INSERT INTO enquetes SET ?";
    return this.executaQuery(sql, novaEnquete);
  }

  atualizar(enqueteAtualizada, opcoes, id) {
    const sqlEnquete = "UPDATE enquetes SET ? WHERE id = ?";
    return this.executaQuery(sqlEnquete, [enqueteAtualizada, id]).then(() => {
      const sqlDeletarOpcoes = "DELETE FROM opcoes WHERE enquete_id = ?"
      return this.executaQuery(sqlDeletarOpcoes, id)
    }).then(()=>{
      const sqlInserirOpcoes = "INSERT INTO opcoes (texto, enquete_id) VALUES ?";
      const valores = opcoes.map(opcao => [opcao, id])
      return this.executaQuery(sqlInserirOpcoes, [valores])
    })
  }

  deletar(id) {
    const sql = "DELETE FROM enquetes WHERE id = ?";
    return this.executaQuery(sql, id).then(()=>{
      const sqlDeleteOpcoes = "DELETE FROM opcoes WHERE enquete_id = ?";
      return this.executaQuery(sqlDeleteOpcoes, id)
    })
  }

  listarOpcoes(enqueteId) {
    const sql = `
      SELECT * FROM opcoes WHERE enquete_id = ?
    `;
    return this.executaQuery(sql, enqueteId);
  }

  criarOpcoes(opcoes, enqueteId) {
    const sql = `
      INSERT INTO opcoes (texto, enquete_id) VALUES ?
    `;
    const valores = opcoes.map(opcao => [opcao, enqueteId]);
    return this.executaQuery(sql, [valores]);
  }

  buscarEnquetePorId(id){
    const sql = `
    SELECT * FROM enquetes WHERE id = ?
    `
    return this.executaQuery(sql, id)
  }

  buscarOpcoesPorId(enqueteId){
    const sql = `SELECT * FROM opcoes WHERE enquete_id = ?`
    return this.executaQuery(sql, enqueteId)
  }

  buscarOpcaoPorId(opcaoId) {
    const sql = `SELECT * FROM opcoes WHERE id = ?`;
    return this.executaQuery(sql, opcaoId)
      .then(res => res[0]); // pega o primeiro resultado
  }

  incrementarVoto(opcaoId) {
    const sql = `UPDATE opcoes SET votos = votos + 1 WHERE id = ?`;
    return this.executaQuery(sql, opcaoId);
  }
}

module.exports = new EnqueteModel();
