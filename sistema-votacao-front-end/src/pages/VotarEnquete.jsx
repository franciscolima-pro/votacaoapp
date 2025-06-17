import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import api from '../services/api';
import { toast } from "react-toastify";
import { Link } from "react-router-dom";

function VotarEnquete() {
  const { id } = useParams();
  const [enquete, setEnquete] = useState(null);
  const [opcaoSelecionada, setOpcaoSelecionada] = useState(null);

  const carregarEnquete = () => {
    api.get(`/enquetes/${id}`)
      .then(res => {
        setEnquete(res.data);
      })
      .catch(err => {
        console.error(err);
        toast.error("Erro ao carregar a enquete.");
      });
  };

  useEffect(() => {
    carregarEnquete();
    const intervalId = setInterval(carregarEnquete, 2000);
    return () => clearInterval(intervalId);
  }, [id]);

  const handleVotar = () => {
    if (opcaoSelecionada === null) {
      toast.error("Selecione uma opção antes de votar.");
      return;
    }

    api.post(`/enquetes/${id}/votar`, { opcaoId: opcaoSelecionada })
      .then(() => {
        toast.success("Voto registrado com sucesso!");
        carregarEnquete();
      })
      .catch(err => {
        console.error(err);
        toast.error("Erro ao registrar o voto.");
      });
  };

  if (!enquete) return <p>Carregando...</p>;

  const totalVotos = enquete.opcoes.reduce((total, opcao) => total + (opcao.votos || 0), 0);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-6 bg-gray-100">
      <div className="w-full max-w-2xl bg-white p-8 rounded-lg shadow-md">
        <h1 className="text-3xl font-bold mb-6 text-gray-800 text-center">{enquete.titulo}</h1>
        
        <form 
          onSubmit={(e) => { 
            e.preventDefault(); 
            handleVotar(); 
          }}
          className="space-y-4"
        >
          <div className="space-y-3">
            {enquete.opcoes.map((opcao) => (
              <div key={opcao.id} className="flex items-center justify-between">
                <div className="flex items-center flex-grow">
                  <input
                    type="radio"
                    id={`opcao-${opcao.id}`}
                    name="opcao"
                    value={opcao.id}
                    onChange={() => setOpcaoSelecionada(opcao.id)}
                    className="h-5 w-5 text-blue-600 focus:ring-blue-500 border-gray-300"
                  />
                  <label 
                    htmlFor={`opcao-${opcao.id}`} 
                    className="ml-3 block text-gray-700 text-lg hover:cursor-pointer hover:text-gray-900 transition-colors"
                  >
                    {opcao.texto}
                  </label>
                </div>
                <div className="text-gray-600 font-medium">
                  {opcao.votos || 0} votos {totalVotos > 0 ? `(${Math.round((opcao.votos || 0) / totalVotos * 100)}%)` : ''}
                </div>
              </div>
            ))}
          </div>
  
          <div className="flex justify-end mt-8">
            <Link
              to="/"
              className="px-6 py-2 mr-4 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-100 transition-colors"
            >
              Voltar
            </Link>
            <button
              type="submit"
              disabled={!opcaoSelecionada}
              className={`px-6 py-2 bg-blue-600 text-white rounded-md shadow transition-colors ${
                opcaoSelecionada ? 'hover:bg-blue-700' : 'opacity-50 cursor-not-allowed'
              }`}
            >
              Confirmar Voto
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default VotarEnquete;