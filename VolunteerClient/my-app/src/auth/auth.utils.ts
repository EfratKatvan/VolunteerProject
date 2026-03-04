import { Paths } from "../routes/paths"
import axios from "../services/axios"

export const setSession = (token: string) => {
    localStorage.setItem('token', token)
    axios.defaults.headers.common.Authorization = `Bearer ${token}`
}
export const getSession = () => {
    const token = localStorage.getItem('token')
    return token
}

export const removeSession = () => {
    localStorage.removeItem('token')
    location.href = Paths.login
}