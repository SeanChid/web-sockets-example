import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'
import { Provider } from 'react-redux'
import { PersistGate } from 'redux-persist/integration/react'
import store, { persistor } from '../redux/store.js'
import LoginPage from './components/LoginPage.jsx'
import UserPage from './components/UserPage.jsx'
import Lobby from './components/Lobby.jsx'
import './App.css'

function App() {
  return (
    <Router>
      <Provider store={store}>
        <PersistGate loading={null} persistor={persistor}>
          <Routes>
            <Route path='/' element={<LoginPage />} />
            <Route path='/user' element={<UserPage />} />
            <Route path='/lobby' element={<Lobby />} />
          </Routes>
        </PersistGate>
      </Provider>
    </Router>
  )
}

export default App
