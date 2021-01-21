import data from "./logged_in/dummy_data/persons";

// import { set } from "mongoose";
const io = require("socket.io-client");

// define socket.io to establish connection between client and server
const socket = io("http://localhost:4000", { secure: true });

// database for common API
// var DATABASE = [];

// ask for common data
socket.emit("common");

socket.on("common-response", (data) => {
    // DATABASE = [...data];
    localStorage.setItem("Database", JSON.stringify(data));
    console.log("data in API", localStorage.getItem("Database"));
});

// data pool
const CommonAPI = () => {
    // ask for common data
    socket.emit("common");

    // get respond from database
    socket.on("common-response", (data) => {
        // DATABASE = [...data];
        localStorage.setItem("Database", JSON.stringify(data));
    });

    console.log(
        "Database in API",
        JSON.parse(localStorage.getItem("Database"))
    );

    return JSON.parse(localStorage.getItem("Database"));
};

const RandomAPI = () => {
    // get rabdom data from DATABASE
    var data = [...JSON.parse(localStorage.getItem("Database"))];
    var rand = data[Math.floor(Math.random() * data.length)];

    console.log("Random in API", rand);

    return rand;
};

const BillboardAPI = () => {
    // respond from API
    var data = [...JSON.parse(localStorage.getItem("Database"))];
    return data
        .sort((a, b) => b.properties.score - a.properties.score)
        .slice(0, 10);
};

const FindRestaurantsAPI = (key) => {
    console.log(key);
    socket.emit("find-restaurants", key);

    socket.on("find-restaurants-response", (data) => {
        console.log("get data", data);
        localStorage.setItem("restaurants-list", JSON.stringify(data));
    });
};

const AddStarAPI = (restaurant_id) => {
    socket.emit("addstar", restaurant_id);

    socket.on("addstar-response", (status) => {
        if (status) {
            console.log("success");
        } else {
            console.log("fail");
        }
    });
};

const AddtoFavAPI = (key, restaurant) => {
    socket.emit("add-to-favorite", [key, restaurant]);
    FindRestaurantsAPI(JSON.parse(localStorage.getItem("user")).favorite);
};

export {
    CommonAPI,
    RandomAPI,
    BillboardAPI,
    AddStarAPI,
    FindRestaurantsAPI,
    AddtoFavAPI,
};
