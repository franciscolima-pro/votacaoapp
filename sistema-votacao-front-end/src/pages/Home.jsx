import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../services/api";
import { toast } from "react-toastify";

function Home() {
  const [enquetes, setEnquetes] = useState([]);

  //Exibir as enquetes
  useEffect(() => {
    api
      .get("/enquetes")
      .then((res) => setEnquetes(res.data, console.log("Os dados: ",res.data)),)
      .catch((error) => console.log("Erro ao buscar Enquetes:", error));
  }, []);

  //Deletar Enquete
  const deletarEnquete = (id) => {
    if (window.confirm("Tem certeza que deseja deletar esta enquete?")) {
      api
        .delete(`/enquetes/${id}`)
        .then(() => {
          toast.success("Enquete deletada com sucesso!");
          setEnquetes(enquetes.filter((enquete) => enquete.id != id));
        })
        .catch((error) => {
          console.log("Erro ao deletar enquete: ", error);
          toast.error("Erro ao deletar enquete!");
        });
    }
  };

  //verificar o status da enquete
  const verificaStatus = (start, end) => {
    const today = new Date();
    const dataStart = new Date(start);
    const dataEnd = new Date(end);

    if (today < dataStart) return "Agendada";
    if (today > dataEnd) return "Finalizada";
    return "Ativa";
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4 bg-gray-100">
      <h1 className="text-2xl max-sm:text-xl font-bold mb-4 text-gray-800">Enquetes</h1>
  
      <Link to="/nova" className="w-full max-sm:mb-4 max-w-[700px]">
        <button className="w-full max-sm:w-full mb-6 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md shadow">
          Nova Enquete
        </button>
      </Link>
  
      {enquetes.length === 0 ? (
        <p className="text-gray-600">Não há enquetes cadastradas.</p>
      ) : (
        <div className="w-full max-w-[700px]">
          {/* Versão Desktop (acima de 599px) */}
          <div className="hidden sm:block overflow-x-auto">
            <table className="w-full bg-white rounded-lg shadow-md">
              <thead>
                <tr className="bg-blue-600 text-white">
                  <th className="px-4 py-2 text-left">ID</th>
                  <th className="px-4 py-2 text-left">Título</th>
                  <th className="px-4 py-2 text-left">Início</th>
                  <th className="px-4 py-2 text-left">Término</th>
                  <th className="px-4 py-2 text-left">Status</th>
                  <th className="px-4 py-2 text-left">Ações</th>
                </tr>
              </thead>
              <tbody>
                {enquetes.map((enquete, index) => {
                  const status = verificaStatus(enquete.data_inicio, enquete.data_fim);
                  const isAtiva = status === "Ativa";
                  
                  return (
                    <tr
                      key={enquete.id}
                      className={index % 2 === 0 ? "bg-gray-100" : "bg-white"}
                    >
                      <td className="px-4 py-3">{enquete.id}</td>
                      <td className="px-4 py-3">{enquete.titulo}</td>
                      <td className="px-4 py-3">
                        {new Date(enquete.data_inicio).toLocaleDateString()}
                      </td>
                      <td className="px-4 py-3">
                        {new Date(enquete.data_fim).toLocaleDateString()}
                      </td>
                      <td className="px-4 py-3">{status}</td>
                      <td className="flex px-4 py-3 space-x-2">
                        {isAtiva ? (
                          <Link to={`/votar/${enquete.id}`}>
                            <button className="px-2 py-1 text-sm bg-green-600 hover:bg-green-700 text-white rounded-md">
                              Votar
                            </button>
                          </Link>
                        ) : (
                          <button 
                            className="px-2 py-1 text-sm bg-gray-400 text-white rounded-md cursor-not-allowed"
                            disabled
                            title={status === "Agendada" ? "Enquete ainda não iniciou" : "Enquete já finalizada"}
                          >
                            Votar
                          </button>
                        )}
                        <Link to={`/editar/${enquete.id}`}>
                          <button className="px-2 py-1 text-sm bg-yellow-500 hover:bg-yellow-600 text-white rounded-md">
                            Editar
                          </button>
                        </Link>
                        <button
                          onClick={() => deletarEnquete(enquete.id)}
                          className="px-2 py-1 text-sm bg-red-600 hover:bg-red-700 text-white rounded-md"
                        >
                          Deletar
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
  
          {/* Versão Mobile (até 599px) */}
          <div className="sm:hidden space-y-4">
            {enquetes.map((enquete) => {
              const status = verificaStatus(enquete.data_inicio, enquete.data_fim);
              const isAtiva = status === "Ativa";
              
              return (
                <div key={enquete.id} className="bg-white p-4 rounded-lg shadow">
                  <div className="grid grid-cols-2 gap-2 mb-3">
                    <div>
                      <p className="text-sm text-gray-500">ID</p>
                      <p>{enquete.id}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Status</p>
                      <p>{status}</p>
                    </div>
                    <div className="col-span-2">
                      <p className="text-sm text-gray-500">Título</p>
                      <p className="font-medium">{enquete.titulo}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Início</p>
                      <p>{new Date(enquete.data_inicio).toLocaleDateString()}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Término</p>
                      <p>{new Date(enquete.data_fim).toLocaleDateString()}</p>
                    </div>
                  </div>
                  
                  <div className="flex justify-between space-x-2 mt-2">
                    {isAtiva ? (
                      <Link to={`/votar/${enquete.id}`} className="flex-1">
                        <button className="w-full px-2 py-1 text-sm bg-green-600 hover:bg-green-700 text-white rounded-md">
                          Votar
                        </button>
                      </Link>
                    ) : (
                      <button 
                        className="flex-1 w-full px-2 py-1 text-sm bg-gray-400 text-white rounded-md cursor-not-allowed"
                        disabled
                        title={status === "Agendada" ? "Enquete ainda não iniciou" : "Enquete já finalizada"}
                      >
                        Votar
                      </button>
                    )}
                    <Link to={`/editar/${enquete.id}`} className="flex-1">
                      <button className="w-full px-2 py-1 text-sm bg-yellow-500 hover:bg-yellow-600 text-white rounded-md">
                        Editar
                      </button>
                    </Link>
                    <button
                      onClick={() => deletarEnquete(enquete.id)}
                      className="flex-1 px-2 py-1 text-sm bg-red-600 hover:bg-red-700 text-white rounded-md"
                    >
                      Deletar
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}

export default Home;
