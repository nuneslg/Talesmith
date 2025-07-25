import { useState, useEffect } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import fundo from './MadeiraFundo.jpg' 

function TelaInicial() {
  const navigate = useNavigate()
  const location = useLocation()
  const userId = location.state?.userId // pega o userId do estado da navegação
  const [historias, setHistorias] = useState([]) 

    useEffect(() => {
    fetch(`http://localhost:5000/api/historias?usuario_id=${userId}`)
      .then(res => {
        if (!res.ok) throw new Error('Erro ao buscar histórias')
        return res.json()
      })
      .then(data => {
        setHistorias(data)
      })
      .catch(err => {
        console.error('Erro ao buscar histórias:', err)
      })
  }, [userId])

  const handleCriarNova = () => {
    // Navega para a página de criação
    navigate('/config', { state: { userId } })
  }

 const handleCarregarHistoria = (idDaHistoria) => {

  const historiaSelecionada = historias.find(h => h.id === idDaHistoria);

  if (historiaSelecionada) {
    console.log('Carregando história:', historiaSelecionada);
    
    navigate('/chat', { state: { config: historiaSelecionada, userId, isNew:false } });
  } else {
    console.error('Erro: História não encontrada!');
 
  }
};

  return (
    <div
      className="min-h-screen text-white flex flex-col items-center justify-center px-4 py-12"
      style={{
        backgroundImage: `url(${fundo})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }}
    >
      <div className="bg-[#4B3621] p-8 rounded-2xl shadow-xl w-full max-w-3xl text-center">
        <h1 className="text-4xl font-bold mb-8">Suas Aventuras</h1>

        {/* --- Lista de Histórias Salvas --- */}
        <div className="space-y-4 mb-8">
          {historias.length > 0 ? (
            historias.map((historia) => (
              <div
                key={historia.id} // É importante ter uma chave única para cada item da lista
                onClick={() => handleCarregarHistoria(historia.id)}
                className="bg-[#6D4C41] p-4 rounded-lg flex justify-between items-center cursor-pointer hover:bg-opacity-80 transition"
              >
                <div>
                  <h2 className="text-xl font-semibold">{historia.titulo}</h2>
                  <p className="text-sm text-gray-300">{historia.contexto}</p>
                </div>
                <span className="text-yellow-500">▶</span>
              </div>
            ))
          ) : (
            <p className="text-gray-400">Nenhuma história salva ainda.</p>
          )}
        </div>

        {/* --- Botão para Criar Nova História --- */}
        <button
          onClick={handleCriarNova}
          className="w-full bg-yellow-700 hover:bg-yellow-800 text-white py-3 rounded-lg text-xl font-semibold transition duration-300"
        >
          + Criar Nova História
        </button>
      </div>
    </div>
  )
}

export default TelaInicial