import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import fundo from './MadeiraFundo.jpg'


function RPGConfig() {
  const navigate = useNavigate()


  const [form, setForm] = useState({
    personagem: '',
    classe: '',
    ambientacao: '',
    tom: '',
    objetivo: '',
  })


  const handleChange = (e) => {
    const { name, value } = e.target
    setForm({ ...form, [name]: value })
  }



  const handleSubmit = (e) => {
    e.preventDefault();
  // 1. Pega a lista de histórias que já existem no navegador
  const historiasAtuais = JSON.parse(localStorage.getItem('rpg_historias')) || [];
  // 2. Cria a nova história com os dados do formulário e um ID único
  const novaHistoria = {
    ...form, // Copia todos os dados do formulário (personagem, classe, etc.)
    id: Date.now() // Cria um ID único baseado na data e hora atuais
  };
  // 3. Adiciona a nova história à lista
  const novasHistorias = [...historiasAtuais, novaHistoria];
  // 4. Salva a lista atualizada de volta no navegador
  localStorage.setItem('rpg_historias', JSON.stringify(novasHistorias));

  console.log('História salva com sucesso!', novaHistoria);

  navigate('/chat');
};



  return (
    <div className="min-h-screen text-white flex items-center justify-center px-4 py-12"
    style={{
      backgroundImage: `url(${fundo})`,
      backgroundSize: 'cover',
      backgroundPosition: 'center',
      backgroundRepeat: 'no-repeat',
    }}>
     
      <form
        onSubmit={handleSubmit}
        className="bg-[#4B3621] p-8 rounded-2xl shadow-xl w-full max-w-2xl space-y-6"
      >
        <h1 className="text-3xl font-bold text-center">Crie sua Aventura</h1>


        <div>
            <label className="block text-lg mb-1">Quem é seu personagem?</label>
            <textarea
                name="personagem"
                value={form.personagem}
                onChange={handleChange}
                className="w-full px-4 py-2 rounded bg-[#6D4C41] text-white focus:outline-none"
                placeholder="Ex: Um elfo arqueiro, uma princesa rebelde..."
                rows={4}  // você pode ajustar a quantidade de linhas visíveis aqui
            />
        </div>


        <div>
          <label className="block text-lg mb-1">Qual a classe do personagem?</label>
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


        <div>
            <label className="block text-lg mb-1">Onde a história acontece?</label>
            <textarea
                name="ambientacao"
                value={form.ambientacao}
                onChange={handleChange}
                className="w-full px-4 py-2 rounded bg-[#6D4C41] text-white focus:outline-none"
                placeholder="Ex: Reino gelado, cidade cyberpunk, floresta mística..."
                rows={4}
            />
        </div>


        <div>
          <label className="block text-lg mb-1">Qual o tom da aventura?</label>
          <select
            name="tom"
            value={form.tom}
            onChange={handleChange}
            className="w-full px-4 py-2 rounded bg-[#6D4C41] text-white focus:outline-none"
          >
            <option value="">Selecione</option>
            <option>Épico</option>
            <option>Cômico</option>
            <option>Terror</option>
            <option>Misterioso</option>
            <option>Romântico</option>
          </select>
        </div>


        <div>
          <label className="block text-lg mb-1">Qual o objetivo do personagem?</label>
          <textarea
            name="objetivo"
            value={form.objetivo}
            onChange={handleChange}
            className="w-full px-4 py-2 rounded bg-[#6D4C41] text-white focus:outline-none resize-none"
            placeholder="Ex: Salvar o reino, encontrar um artefato, fugir de uma maldição..."
            rows={3}
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


