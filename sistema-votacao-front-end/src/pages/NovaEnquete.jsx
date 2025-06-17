import { useState } from "react";
import { toast } from "react-toastify";
import api from "../services/api";
import { Link } from "react-router-dom";

const NovaEnquete = () => {
  const [titulo, setTitulo] = useState("");
  const [dataInicio, setDataInicio] = useState("");
  const [dataFim, setDataFim] = useState("");
  const [opcoes, setOpcoes] = useState(["", "", ""]); // 3 opções mínimas obrigatórias

  const adicionarOpcao = () => {
    setOpcoes([...opcoes, ""]);
  };

  const atualizarOpcao = (index, valor) => {
    const novasOpcoes = [...opcoes];
    novasOpcoes[index] = valor;
    setOpcoes(novasOpcoes);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (opcoes.filter(o => o.trim()).length < 3) {
      toast.error("Você precisa de pelo menos 3 opções preenchidas.");
      return;
    }

    const novaEnquete = {
      titulo,
      data_inicio: dataInicio,
      data_fim: dataFim,
      opcoes: opcoes.filter(o => o.trim()),
    };

    api.post("/enquetes", novaEnquete)
      .then(() => {
        toast.success("Enquete criada com sucesso!");
        setTitulo("");
        setDataInicio("");
        setDataFim("");
        setOpcoes(["", "", ""]);
      })
      .catch((err) => {
        console.error(err);
        toast.error("Erro ao criar enquete.");
      });
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-6 bg-gray-100">
      <h1 className="text-3xl font-bold mb-6 text-gray-800">Criar Nova Enquete</h1>
      
      <form onSubmit={handleSubmit} className="w-full max-w-2xl bg-white p-8 rounded-lg shadow-md">
        <div className="mb-6">
          <label htmlFor="titulo" className="block text-gray-700 font-medium mb-2">
            Título da Enquete
          </label>
          <input
            type="text"
            id="titulo"
            placeholder="Digite o título da enquete"
            value={titulo}
            onChange={(e) => setTitulo(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>
  
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div>
            <label htmlFor="dataInicio" className="block text-gray-700 font-medium mb-2">
              Data de Início
            </label>
            <input
              type="date"
              id="dataInicio"
              value={dataInicio}
              onChange={(e) => setDataInicio(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>
  
          <div>
            <label htmlFor="dataFim" className="block text-gray-700 font-medium mb-2">
              Data de Término
            </label>
            <input
              type="date"
              id="dataFim"
              value={dataFim}
              onChange={(e) => setDataFim(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>
        </div>
  
        <div className="mb-6">
          <h4 className="text-xl font-semibold text-gray-800 mb-4">Opções da Enquete</h4>
          
          {opcoes.map((opcao, index) => (
            <div key={index} className="mb-3">
              <label htmlFor={`opcao-${index}`} className="block text-gray-700 mb-1">
                Opção {index + 1}
              </label>
              <input
                id={`opcao-${index}`}
                type="text"
                placeholder={`Digite a opção ${index + 1}`}
                value={opcao}
                onChange={(e) => atualizarOpcao(index, e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                required={index < 3}
              />
            </div>
          ))}
  
          <button
            type="button"
            onClick={adicionarOpcao}
            className="mt-4 px-4 py-2 bg-gray-200 hover:bg-gray-300 text-gray-800 rounded-md transition-colors"
          >
            + Adicionar mais uma opção
          </button>
        </div>
  
        <div className="flex justify-end space-x-4">
          <Link
            to="/"
            className="px-6 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-100 transition-colors"
          >
            Cancelar
          </Link>
          <button
            type="submit"
            className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md shadow transition-colors"
          >
            Criar Enquete
          </button>
        </div>
      </form>
    </div>
  );
};

export default NovaEnquete;
