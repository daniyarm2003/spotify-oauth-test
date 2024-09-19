import axios from 'axios'
import { createContext, PropsWithChildren } from 'react'

export const apiClient = axios.create({
    baseURL: process.env.REACT_APP_SERVER_BASE_URL
})

export const ApiClientContext = createContext(apiClient)