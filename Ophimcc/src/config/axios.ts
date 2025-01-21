import axios, { AxiosInstance } from "axios";

const axiosInstance: AxiosInstance = axios.create({
  timeout: 3 * 60 * 1000,
  baseURL: "http://localhost:3000/api/movies",
});

export default axiosInstance;
