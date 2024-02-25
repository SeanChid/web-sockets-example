import { configureStore } from '@reduxjs/toolkit'
import authReducer from './reducer.js'

const store = configureStore({
    reducer: {
        auth: authReducer
    }
})

export default store