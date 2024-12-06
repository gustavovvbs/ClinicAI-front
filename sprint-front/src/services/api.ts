import axios from "axios";

const API_BASE_URL = "https://sprint-hsl-first-c8b5d7dddb20.herokuapp.com"; 

// const API_BASE_URL = "http://localhost:8000"; 

const api = axios.create({
  baseURL: API_BASE_URL,
});

export default api;
