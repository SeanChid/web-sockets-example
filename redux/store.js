import { createStore } from 'redux'
import authReducer from './reducer.js'

const store = createStore(authReducer)

export default store