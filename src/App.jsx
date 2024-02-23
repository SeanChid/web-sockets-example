import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'
import LoginPage from './components/LoginPage.jsx'
import Lobby from './components/Lobby.jsx'
import './App.css'

function App() {
  return (
    <Router>
      <Routes>
        <Route path='/' element={<LoginPage />} />
        <Route path='/lobby' element={<Lobby />} />
      </Routes>
    </Router>
  )
}

export default App
