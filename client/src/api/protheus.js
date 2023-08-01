import axios from 'axios'

export const protheus = axios.create({
    baseURL: 'http://localhost:3003/', //linux
    headers: { "Content-Type": "application/json" }
})

protheus.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('access_token')
        if (token) {
            config.headers["x-access-token"] = token;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);