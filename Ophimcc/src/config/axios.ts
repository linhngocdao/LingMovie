import axios, { AxiosInstance } from "axios";

const axiosInstance: AxiosInstance = axios.create({
  timeout: 3 * 60 * 1000,
  baseURL: "https://ophim1.com",
});

export default axiosInstance;
