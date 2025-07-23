import { useNavigate } from 'react-router-dom'
import background from './telainicio.png'


function App() {
  const navigate = useNavigate()


  return (
    <div
      className="h-screen w-screen bg-cover bg-center flex items-center justify-center"
      style={{ backgroundImage: `url(${background})` }}
    >
      <button
        onClick={() => navigate('/login')}
        className="bg-red-700 hover:bg-red-800 text-white text-2xl px-8 py-4 rounded-md font-bold tracking-wider medieval-font transition duration-300 shadow-lg"
      >
        Jogar
      </button>
    </div>
  )
}


export default App


