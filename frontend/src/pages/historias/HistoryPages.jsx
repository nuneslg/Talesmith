import { useState, useEffect } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import Shepherd from 'shepherd.js'
import 'shepherd.js/dist/css/shepherd.css'
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
    const historiaSelecionada = historias.find(h => h.id === idDaHistoria)

    if (historiaSelecionada) {
      console.log('Carregando história:', historiaSelecionada)
      navigate('/chat', { state: { config: historiaSelecionada, userId, isNew: false } })
    } else {
      console.error('Erro: História não encontrada!')
    }
  }

  // Função para iniciar o tutorial Shepherd.js
  const startTour = () => {
    const tour = new Shepherd.Tour({
      defaultStepOptions: {
        cancelIcon: { enabled: true },
        classes: 'shepherd-theme-arrows',
        scrollTo: { behavior: 'smooth', block: 'center' },
      }
    })

    tour.addStep({
      id: 'titulo',
      text: 'Essa é a tela inicial onde você vê todas as suas aventuras salvas.',
      attachTo: { element: '.titulo-aventuras', on: 'bottom' },
      buttons: [{ text: 'Próximo', action: tour.next }]
    })

    tour.addStep({
      id: 'lista-historias',
      text: 'Aqui estão suas histórias salvas. Clique em uma para carregar e continuar.',
      attachTo: { element: '.lista-historias', on: 'top' },
      buttons: [
        { text: 'Voltar', action: tour.back },
        { text: 'Próximo', action: tour.next }
      ]
    })

    tour.addStep({
      id: 'botao-criar',
      text: 'Clique aqui para criar uma nova aventura do zero.',
      attachTo: { element: '.botao-criar-nova', on: 'top' },
      buttons: [
        { text: 'Voltar', action: tour.back },
        { text: 'Finalizar', action: tour.complete }
      ]
    })

    tour.start()
  }

  return (
    <div
      className="min-h-screen text-white flex flex-col items-center justify-center px-4 py-12"
      style={{
        backgroundImage: `url(${fundo})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }}
    >
      <button
        onClick={startTour}
        className="mb-6 px-4 py-2 bg-yellow-700 rounded text-white hover:bg-[#4B3621]"
      >
        Como usar esta tela
      </button>

      <div className="bg-[#4B3621] p-8 rounded-2xl shadow-xl w-full max-w-3xl text-center">
        <h1 className="titulo-aventuras text-4xl font-bold mb-8">Suas Aventuras</h1>

        {/* --- Lista de Histórias Salvas --- */}
        <div className="lista-historias space-y-4 mb-8 max-h-[400px] overflow-y-auto">
          {historias.length > 0 ? (
            historias.map((historia) => (
              <div
                key={historia.id}
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
          className="botao-criar-nova w-full bg-yellow-700 hover:bg-yellow-800 text-white py-3 rounded-lg text-xl font-semibold transition duration-300"
        >
          + Criar Nova História
        </button>
      </div>
    </div>
  )
}

export default TelaInicial
