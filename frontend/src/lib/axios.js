import axios from "axios";

import.meta.env.MODE === "development"

export const axiosInstance = axios.create({
    baseURL:
        import.meta.env.MODE === "development"
            ? "http://localhost:3000/api"
            : "/api",
    withCredentials: true,
});