import axios from "axios";

export default axios.create({
    // baseURL: "https://automaticityacademy.ngrok.app",
    baseURL: "http://localhost:8000",
});

export const setAuthToken = (token) => {
    if (token) {
        axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
    } else delete axios.defaults.headers.common["Authorization"];
};
