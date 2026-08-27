import axios from "axios";

const axiosClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_FRONTEND_URL,
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  }
})

export default axiosClient;