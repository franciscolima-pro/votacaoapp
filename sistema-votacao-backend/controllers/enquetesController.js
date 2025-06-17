const enqueteModel = require("../models/enquetesModel");

class EnqueteController {
  listar(req, res) {
    const enquetes = enqueteModel.listar();
    return enquetes
      .then((result) => res.status(200).json(result))
      .catch((error) => res.status(400).json(error.message));
  }

  criar(req, res) {
    const { titulo, data_inicio, data_fim, opcoes } = req.body;


    if (!titulo || !data_inicio || !data_fim || !Array.isArray(opcoes) || opcoes.length < 3) {
      return res.status(400).json({
        error: "É necessário fornecer título, data_inicio, data_fim e no mínimo 3 opções."
      });
    }

    const novaEnquete = { titulo, data_inicio, data_fim };

    const enquete = enqueteModel.criar(novaEnquete);
    return enquete
      .then((result) => {
        const enqueteId = result.insertId;
        return enqueteModel.criarOpcoes(opcoes, enqueteId)
          .then(() => {
            res.status(201).json({
              message: "Enquete criada com sucesso!",
              enquete: {
                id: enqueteId,
                titulo,
                data_inicio,
                data_fim,
                opcoes
              }
            });
          });
      })
      .catch((error) => res.status(400).json(error.message));
  }

  atualizar(req, res) {
    const { id } = req.params;
    const { titulo, data_inicio, data_fim , opcoes} = req.body;

    const enqueteAtualizada = { titulo, data_inicio, data_fim};

    const enquete = enqueteModel.atualizar(enqueteAtualizada, opcoes, id);
    return enquete
      .then((result) => res.status(200).json({
        message: "Enquete atualizada com sucesso!",
        result
      }))
      .catch((error) => res.status(400).json(error.message));
  }

  deletar(req, res) {
    const { id } = req.params;

    const enquete = enqueteModel.deletar(id);
    return enquete
      .then((result) => res.status(200).json({
        message: "Enquete deletada com sucesso!",
        result
      }))
      .catch((error) => res.status(400).json(error.message));
  }

  listarOpcoes(req, res) {
    const { id } = req.params;

    const opcoes = enqueteModel.listarOpcoes(id);
    return opcoes
      .then((result) => res.status(200).json(result))
      .catch((error) => res.status(400).json(error.message));
  }

  buscarEnquetePorId(req, res) {
  const { id } = req.params;

  enqueteModel.buscarEnquetePorId(id)
    .then((enqueteResult) => {
      const enquete = enqueteResult[0];

      if (!enquete) {
        return res.status(404).json({ message: "Enquete não encontrada" });
      }

      enqueteModel.buscarOpcoesPorId(id)
        .then((opcoes) => {
          const resultado = {
            id: enquete.id,
            titulo: enquete.titulo,
            data_inicio: enquete.data_inicio,
            data_fim: enquete.data_fim,
            opcoes: opcoes || [],
          };
          res.status(200).json(resultado);
        })
        .catch((error) => res.status(500).json({ message: "Erro ao buscar opções" }));
    })
    .catch((error) => res.status(500).json({ message: "Erro ao buscar enquete" }));
}

  async votarEnquete(req, res) {
    const { id } = req.params;
    const { opcaoId } = req.body;

    try {
      const opcao = await enqueteModel.buscarOpcaoPorId(opcaoId);

      if (!opcao || opcao.enquete_id != id) {
        return res.status(404).json({ message: "Opção inválida para esta enquete." });
      }

      await enqueteModel.incrementarVoto(opcaoId);

      res.status(200).json({ message: "Voto registrado com sucesso!" });

    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Erro ao registrar o voto." });
    }
  }

}

module.exports = new EnqueteController();

