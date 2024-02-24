import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'
import { Provider } from 'react-redux'
import store from '../redux/store.js'
import LoginPage from './components/LoginPage.jsx'
import Lobby from './components/Lobby.jsx'
import './App.css'

function App() {
  return (
    <Router>
      <Provider store={store}>
        <Routes>
          <Route path='/' element={<LoginPage />} />
          <Route path='/lobby' element={<Lobby />} />
        </Routes>
      </Provider>
    </Router>
  )
}

export default App
