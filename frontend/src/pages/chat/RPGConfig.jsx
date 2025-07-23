import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import fundo from './MadeiraFundo.jpg'

function RPGConfig() {
  const navigate = useNavigate()

  const [form, setForm] = useState({
  titulo: '',
  historia: '',
  nome: '',
  raca: '',
  classe: '',
  nivel: '',
  forca: '',
  destreza: '',
  constituicao: '',
  sabedoria: '',
  inteligencia: '',
  carisma: '',
  contexto_personagem: ''
})

  const handleChange = (e) => {
    const { name, value } = e.target
    setForm({ ...form, [name]: value })
  }

  const renderSelect = (name, label) => (
    <div>
      <label className="block text-lg mb-1">{label}</label>
      <select
        name={name}
        value={form[name]}
        onChange={handleChange}
        className="w-full px-4 py-2 rounded bg-[#6D4C41] text-white focus:outline-none"
      >
        <option value="">Selecione</option>
        {[...Array(20)].map((_, i) => (
          <option key={i + 1} value={i + 1}>
            {i + 1}
          </option>
        ))}
      </select>
    </div>
  )

  const handleSubmit = async (e) => {
    e.preventDefault()

    const payload = {
    titulo: form.titulo,
    contexto: form.historia,
    usuario_id: 1, // substituir por ID do usuário logado

    nome_personagem: form.nome,
    raca_personagem: form.raca,
    classe_personagem: form.classe,
    nivel_personagem: parseInt(form.nivel),

    forca_personagem: parseInt(form.forca),
    destreza_personagem: parseInt(form.destreza),
    constituicao_personagem: parseInt(form.constituicao),
    sabedoria_personagem: parseInt(form.sabedoria),
    inteligencia_personagem: parseInt(form.inteligencia),
    carisma_personagem: parseInt(form.carisma),
    contexto_personagem: form.contexto_personagem
  }

    try {
      const responseHistoria = await fetch('http://localhost:5000/api/historias/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload)
      })

      const result = await responseHistoria.json()
      const historiaId = result.id
      console.log('Resposta do servidor:', result)

       if (!responseHistoria.ok) {
      alert('Erro ao salvar a história: ' + resultHistoria.error)
      return
    }

    // Agora faz a requisição para a cena inicial com o contexto da história
    const responseCena = await fetch('http://localhost:5000/api/cena-inicial', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ contexto: form.historia,
        historia_id: historiaId, // envia o ID da história criada
       }) // ou outro contexto que queira enviar
    })

    const resultCena = await responseCena.json()

    if (!responseCena.ok) {
      alert('Erro ao obter cena inicial: ' + resultCena.error)
      return
    }

    console.log('Cena inicial:', resultCena.resposta)

    
    navigate('/chat', {
      state: {
      historiaId: historiaId,
      contextoInicial: form.historia,
      },
    })


  } catch (error) {
    console.error('Erro na requisição:', error)
  }
}

  return (
    <div
      className="min-h-screen text-white flex items-center justify-center px-4 py-12"
      style={{
        backgroundImage: `url(${fundo})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
      }}
    >
      <form
        onSubmit={handleSubmit}
        className="bg-[#4B3621] p-8 rounded-2xl shadow-xl w-full max-w-2xl space-y-6"
      >
        <h1 className="text-3xl font-bold text-center">Crie seu Personagem</h1>

        {/* Título */}
        <div>
          <label className="block text-lg mb-1">Qual é o título do personagem?</label>
          <textarea
            name="titulo"
            value={form.titulo}
            onChange={handleChange}
            className="w-full px-4 py-2 rounded bg-[#6D4C41] text-white focus:outline-none"
            placeholder="Ex: O Bravo, A Sábia..."
            rows={2}
          />
        </div>

        {/* Nome */}
        <div>
          <label className="block text-lg mb-1">Qual é o nome do personagem?</label>
          <textarea
            name="nome"
            value={form.nome}
            onChange={handleChange}
            className="w-full px-4 py-2 rounded bg-[#6D4C41] text-white focus:outline-none"
            placeholder="Ex: Arion, Lyra..."
            rows={2}
          />
        </div>

        {/* Raça */}
        <div>
          <label className="block text-lg mb-1">Qual é a raça do personagem?</label>
          <textarea
            name="raca"
            value={form.raca}
            onChange={handleChange}
            className="w-full px-4 py-2 rounded bg-[#6D4C41] text-white focus:outline-none"
            placeholder="Ex: Humano, Elfo, Anão..."
            rows={2}
          />
        </div>

        {/* Classe */}
        <div>
          <label className="block text-lg mb-1">Qual é a classe do personagem?</label>
          <select
            name="classe"
            value={form.classe}
            onChange={handleChange}
            className="w-full px-4 py-2 rounded bg-[#6D4C41] text-white focus:outline-none"
          >
            <option value="">Selecione</option>
            <option>Guerreiro</option>
            <option>Mago</option>
            <option>Ladino</option>
            <option>Bardo</option>
            <option>Druida</option>
          </select>
        </div>

        {/* Nível */}
        {renderSelect('nivel', 'Qual é o nível do personagem?')}

        {/* Atributos */}
        {renderSelect('forca', 'Qual é a força do personagem?')}
        {renderSelect('destreza', 'Qual é a destreza do personagem?')}
        {renderSelect('constituicao', 'Qual é a constituição do personagem?')}
        {renderSelect('sabedoria', 'Qual é a sabedoria do personagem?')}
        {renderSelect('inteligencia', 'Qual é a inteligência do personagem?')}
        {renderSelect('carisma', 'Qual é o carisma do personagem?')}

        {/* História */}
        <div>
          <label className="block text-lg mb-1">Qual é a história do personagem?</label>
          <textarea
            name="historia"
            value={form.historia}
            onChange={handleChange}
            className="w-full px-4 py-2 rounded bg-[#6D4C41] text-white focus:outline-none"
            placeholder="Conte a origem e os detalhes importantes..."
            rows={5}
          />
        </div>

        <button
          type="submit"
          className="w-full bg-yellow-700 hover:bg-yellow-800 text-white py-3 rounded-lg text-xl font-semibold transition duration-300"
        >
          Começar Aventura
        </button>
      </form>
    </div>
  )
}

export default RPGConfig
