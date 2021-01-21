import axios from "axios";
import { FindRestaurantsAPI } from "../commonAPI.js";

const API_URL = "http://localhost:4000/api/auth/";

const register = (username, email, password) => {
    return axios.post(API_URL + "register", {
        username,
        email,
        password,
    });
};

const login = async (username, password) => {
    return await axios
        .post(API_URL + "signin", {
            username,
            password,
        })
        .then((response) => {
            console.log(response);
            if (response.data.accessToken) {
                localStorage.setItem("user", JSON.stringify(response.data));
                localStorage.setItem(
                    "restaurants-list",
                    JSON.stringify(response.data.tmp_list)
                );
            }

            return response.data;
        });
};

const logout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("restaurants-list");
};

const getCurrentUser = () => {
    return JSON.parse(localStorage.getItem("user"));
};

const exp = { register, login, logout, getCurrentUser };

export default exp;
