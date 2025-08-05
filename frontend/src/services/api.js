import axios from "axios"

export const baseApi = axios.create({
    baseURL: "https://talesmith.onrender.com/api"
})