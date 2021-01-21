import React, { Component } from "react";
import { NavLink } from "react-router-dom";

import mapboxgl from "mapbox-gl";
import logo from "../../../assets/circle.png";
import full_heart from "../../../assets/orange_heart.png";
import half_heart from "../../../assets/halfbrid_heart2.png";
import no_heart from "../../../assets/gray_heart2.png";
import addressMarker from "../../../assets/addressMarker.png";
import description from "../../../assets/description.png";
import time from "../../../assets/time.png";
import close from "../../../assets/close.png";
import home from "../../../assets/home.png";
import zoom from "../../../assets/zoom.png";
import add from "../../../assets/add.svg";
import minus from "../../../assets/minus.svg";

import {
    CommonAPI,
    RandomAPI,
    BillboardAPI,
    AddtoFavAPI,
} from "../../../commonAPI";

export default class Map extends React.Component {
    // Set initial coordinates to the center of NTU
    constructor(props) {
        super(props);
        this.state = {
            lng: 121.5399,
            lat: 25.0172,
            zoom: 14.77,
        };
    }

    componentDidMount() {
        /* This will let you use the .remove() function later on */
        if (!("remove" in Element.prototype)) {
            Element.prototype.remove = function () {
                if (this.parentNode) {
                    this.parentNode.removeChild(this);
                }
            };
        }

        // Initialize map
        const map = new mapboxgl.Map({
            container: this.mapContainer,
            style: "mapbox://styles/mapbox/streets-v11",
            center: [this.state.lng, this.state.lat],
            zoom: this.state.zoom,
        });
        CommonAPI();
        var stores = JSON.parse(localStorage.getItem("Database"));
        //var stores = [RandomAPI()];
        //var stores = BillboardAPI();

        console.log("map", stores);

        stores.forEach(function (store, i) {
            store.properties.id = i;
        });

        /* add the layer of store info */
        map.on("load", function (e) {
            alert("loading");
            console.log("loading...");
            /* Add the data to your map as a layer */
            map.addSource("places", {
                type: "geojson",
                data: stores,
            });

            console.log("1");
            buildLocationList(stores);
            console.log("2");
            random(stores);
            console.log("3");
            zoom_button();
            console.log("4");
            topTen(stores);
            console.log("5");
            addMarkers();
        });

        function addMarkers() {
            /* For each feature in the GeoJSON object above: */
            stores.forEach(function (marker) {
                /* Create a div element for the marker. */
                var el = document.createElement("div");
                /* Assign a unique `id` to the marker. */
                el.id = "marker-" + marker.properties.id;
                /* Assign the `marker` class to each marker for styling. */
                el.className = "marker";

                /**
                 * Create a marker using the div element
                 * defined above and add it to the map.
                 **/
                el.addEventListener("click", function (e) {
                    /* Fly to the point */
                    flyToStore(marker);
                    /* Close all other popups and display popup for clicked store */
                    createPopUp(marker);
                    /* Highlight listing in sidebar */
                    var activeItem = document.getElementsByClassName("active");
                    e.stopPropagation();
                    if (activeItem[0]) {
                        activeItem[0].classList.remove("active");
                    }

                    var listing = document.getElementById(
                        "listing-" + marker.properties.id
                    );
                    listing.classList.add("active");
                });

                new mapboxgl.Marker(el, { offset: [0, -23] })
                    .setLngLat(marker.geometry.coordinates)
                    .addTo(map);
            });
        }

        // the function responsible for the list on the left of the map
        function buildLocationList(data) {
            data.forEach(function (store, i) {
                /**
                 * Create a shortcut for `store.properties`,
                 * which will be used several times below.
                 **/
                var prop = store.properties;

                /* Add a new listing section to the sidebar. */
                var listings = document.getElementById("listings");
                var listing = listings.appendChild(
                    document.createElement("div")
                );

                /* Assign a unique `id` to the listing. */
                listing.id = "listing-" + prop.id;
                /* Assign the `item` class to each listing for styling. */
                listing.className = "item";

                /* Add the link to the individual listing created above. */
                var link = listing.appendChild(document.createElement("a"));
                link.href = "#";
                link.className = "title";
                link.id = "link-" + prop.id;
                link.innerHTML = prop.name;

                /* Add details to the individual listing. */
                var details = listing.appendChild(
                    document.createElement("div")
                );

                var tag = "";
                for (let i = 0; i < prop.category.length; i++) {
                    tag =
                        tag +
                        `<span style="margin-right: 0.5vh;font-size: 12px;padding: 3px 5px; background-color: #D6D6D6;border-radius: 3px;">` +
                        prop.category[i] +
                        `</span>`;
                    if (i !== prop.category.length - 1) {
                        tag += " ";
                    }
                }

                details.innerHTML = `<p>` + tag + `</p>`;

                // add the scoring with hearts
                var score = listing.appendChild(document.createElement("div"));

                var hearts = "";
                var number = prop.score * 10;
                var full_num = Math.floor(number / 10);
                var half_num = score % 10 == 0 ? 0 : 1;
                var no_num = 5 - half_num - full_num;
                var likeButton = "";

                for (let i = 0; i < full_num; i++) {
                    hearts += `<img src=${full_heart} style="height: 13px; width: 13px;">`;
                    if (i !== full_num - 1) {
                        hearts += " ";
                    }
                }
                hearts += " ";
                for (let i = 0; i < half_num; i++) {
                    hearts += `<img src=${half_heart} style="height: 13px; width: 13px;">`;
                    if (i !== half_num - 1) {
                        hearts += " ";
                    }
                }
                hearts += " ";
                for (let i = 0; i < no_num; i++) {
                    hearts += `<img src=${no_heart} style="height: 13px; width: 13px;">`;
                    if (i !== no_num - 1) {
                        hearts += " ";
                    }
                }

                // TODO: make likeButton a real button, and handle function
                if (localStorage.getItem("user")) {
                    var myID = "like" + i;
                    if (
                        JSON.parse(
                            localStorage.getItem("restaurants-list")
                        ).find((item) => item._id === store._id)
                    ) {
                        likeButton += `<span id=${myID}><img src=${minus} id=${store._id} style="height: 13px; width: 13px; margin-left: 8px;" ></span>`;
                    } else {
                        likeButton += `<span id=${myID}><img src=${add} id=${store._id} style="height: 13px; width: 13px; margin-left: 8px;" ></span>`;
                    }
                }

                score.innerHTML =
                    `<span style="margin-right:5px;font-size: 15px;">` +
                    prop.score +
                    `</span>` +
                    `   ` +
                    hearts +
                    likeButton;

                if (localStorage.getItem("user")) {
                    var current = JSON.parse(localStorage.getItem("user"));

                    var current_id = "like" + i;
                    var element = document.getElementById(current_id);

                    if (element) {
                        element.addEventListener("click", function (event) {
                            AddtoFavAPI(current.favorite, event.target.id);
                            if (event.target.src.includes({ add }.add)) {
                                event.target.src = "." + { minus }.minus;
                            } else {
                                event.target.src = "." + { add }.add;
                            }
                        });
                    }
                }

                link.addEventListener("click", function (e) {
                    // remove all the former popups
                    const popup = document.getElementsByClassName(
                        "mapboxgl-popup"
                    );
                    for (let i = 0; i < popup.length; i++) {
                        popup[i].remove();
                    }

                    // create a popup
                    for (var i = 0; i < data.length; i++) {
                        if (this.id === "link-" + data[i].properties.id) {
                            var clickedListing = data[i];
                            flyToStore(clickedListing);
                            createPopUp(clickedListing);
                        }
                    }
                    var activeItem = document.getElementsByClassName("active");
                    if (activeItem[0]) {
                        activeItem[0].classList.remove("active");
                    }

                    this.parentNode.classList.add("active");
                });
            });
        }

        // the function of flying to a location
        function flyToStore(currentFeature) {
            map.flyTo({
                center: currentFeature.geometry.coordinates,
                zoom: 15,
            });
        }

        // the popup2, is the global variable, yes, because everyone wants to use it...
        var popup2;

        // the location of creating a poppu tag
        function createPopUp(currentFeature) {
            var popUps = document.getElementsByClassName("mapboxgl-popup");
            /** Check if there is already a popup on the map and if so, remove it */
            for (let i = 0; i < popUps.length; i++) {
                if (popUps[i]) {
                    popUps[i].remove();
                }
            }
            if (popup2) {
                popup2.remove();
            }

            var content = "";

            content += `<h3>` + currentFeature.properties.name + `</h3>`;
            content +=
                `<p style="margin:8px 3px;font-size: 8px;text-align: left;">` +
                `<img src=${addressMarker} style="margin:0px 3px 0px 5px ;height: 15px; width: 15px;">` +
                `<span>` +
                "地址：" +
                currentFeature.properties.address +
                `</span>` +
                `<br>` +
                `<img src=${description} style="margin:3px 3px 0 5px;height: 15px; width: 15px;">` +
                "描述：" +
                currentFeature.properties.description +
                `</p>`;

            var tag = `<span style="margin-top: 0vh;margin-left: 1vh;"></span>`;
            for (
                let i = 0;
                i < currentFeature.properties.category.length;
                i++
            ) {
                tag =
                    tag +
                    `<span style="margin-right: 0.5vh;font-size: 13px;padding: 3px 5px; background-color: #D6D6D6;border-radius: 3px;">` +
                    currentFeature.properties.category[i] +
                    `</span>`;
                if (i !== currentFeature.properties.category.length - 1) {
                    tag += " ";
                }
            }

            content += "  " + tag;

            var hearts = "";
            var number = currentFeature.properties.score * 10;
            var full_num = Math.floor(number / 10);
            var half_num = number % 10 == 0 ? 0 : 1;
            var no_num = 5 - half_num - full_num;

            for (let i = 0; i < full_num; i++) {
                hearts += `<img src=${full_heart} style="margin: 8px 0 0px 0;height: 15px; width: 15px;">`;
                if (i !== full_num - 1) {
                    hearts += " ";
                }
            }
            hearts += " ";
            for (let i = 0; i < half_num; i++) {
                hearts += `<img src=${half_heart} style="margin: 8px 0 0px 0;height: 15px; width: 15px;">`;
                if (i !== half_num - 1) {
                    hearts += " ";
                }
            }
            hearts += " ";
            for (let i = 0; i < no_num; i++) {
                hearts += `<img src=${no_heart} style="margin: 8px 0 0px 0;height: 15px; width: 15px;">`;
                if (i !== no_num - 1) {
                    hearts += " ";
                }
            }

            content +=
                `<br>` +
                `<p style="padding: 0 0 5px 5px;margin: 0;font-size: 18px;">` +
                currentFeature.properties.score +
                `   ` +
                hearts +
                `</p>`;

            function close() {
                popup.remove();
                if (popup2) {
                    popup2.remove();
                }
            }

            function schedule() {
                if (popup2) {
                    popup2.remove();
                }
                var time = currentFeature.properties.hours;

                var content =
                    `<h3 style="font-size: 16px;">` +
                    "Mon" +
                    " " +
                    " Tue" +
                    " " +
                    " Wed" +
                    " " +
                    " Thu" +
                    " " +
                    " Fri" +
                    " " +
                    " Sat" +
                    " " +
                    " Sun" +
                    `</h3>`;
                content +=
                    `<p style="margin:0px;text-align: center;width: 35px;padding: 0;display: inline-block;font-size: 5px;">` +
                    time.Mon[0][0] +
                    `</p>` +
                    `<p style="margin:0px;text-align: center;width: 35px;padding: 0;display: inline-block;font-size: 5px;">` +
                    time.Tue[0][0] +
                    `</p>` +
                    `<p style="margin:0px;text-align: center;width: 35px;padding: 0;display: inline-block;font-size: 5px;">` +
                    time.Wed[0][0] +
                    `</p>` +
                    `<p style="margin:0px;text-align: center;width: 35px;padding: 0;display: inline-block;font-size: 5px;">` +
                    time.Thu[0][0] +
                    `</p>` +
                    `<p style="margin:0px;text-align: center;width: 35px;padding: 0;display: inline-block;font-size: 5px;">` +
                    time.Fri[0][0] +
                    `</p>` +
                    `<p style="margin:0px;text-align: center;width: 35px;padding: 0;display: inline-block;font-size: 5px;">` +
                    time.Sat[0][0] +
                    `</p>` +
                    `<p style="margin:0px;text-align: center;width: 35px;padding: 0;display: inline-block;font-size: 5px;">` +
                    time.Sat[0][0] +
                    `</p>`;
                content +=
                    `<p style="margin:0px;text-align: center;width: 35px;padding: 0;display: inline-block;font-size: 5px;">` +
                    "~" +
                    `</p>` +
                    `<p style="margin:0px;text-align: center;width: 35px;padding: 0;display: inline-block;font-size: 5px;">` +
                    "~" +
                    `</p>` +
                    `<p style="margin:0px;text-align: center;width: 35px;padding: 0;display: inline-block;font-size: 5px;">` +
                    "~" +
                    `</p>` +
                    `<p style="margin:0px;text-align: center;width: 35px;padding: 0;display: inline-block;font-size: 5px;">` +
                    "~" +
                    `</p>` +
                    `<p style="margin:0px;text-align: center;width: 35px;padding: 0;display: inline-block;font-size: 5px;">` +
                    "~" +
                    `</p>` +
                    `<p style="margin:0px;text-align: center;width: 35px;padding: 0;display: inline-block;font-size: 5px;">` +
                    "~" +
                    `</p>` +
                    `<p style="margin:0px;text-align: center;width: 35px;padding: 0;display: inline-block;font-size: 5px;">` +
                    "~" +
                    `</p>`;
                content +=
                    `<p style="margin:0px;text-align: center;width: 35px;padding: 0;display: inline-block;font-size: 5px;">` +
                    time.Mon[0][1] +
                    `</p>` +
                    `<p style="margin:0px;text-align: center;width: 35px;padding: 0;display: inline-block; font-size: 5px;">` +
                    time.Tue[0][1] +
                    `</p>` +
                    `<p style="margin:0px;text-align: center;width: 35px;padding: 0;display: inline-block; font-size: 5px;">` +
                    time.Wed[0][1] +
                    `</p>` +
                    `<p style="margin:0px;text-align: center;width: 35px;padding: 0;display: inline-block; font-size: 5px;">` +
                    time.Thu[0][1] +
                    `</p>` +
                    `<p style="margin:0px;text-align: center;width: 35px;padding: 0;display: inline-block; font-size: 5px;">` +
                    time.Fri[0][1] +
                    `</p>` +
                    `<p style="margin:0px;text-align: center;width: 35px;padding: 0;display: inline-block;font-size: 5px;">` +
                    time.Sat[0][1] +
                    `</p>` +
                    `<p style="margin:0px;text-align: center;width: 35px;padding: 0;display: inline-block; font-size: 5px;">` +
                    time.Sat[0][1] +
                    `</p>`;

                popup2 = new mapboxgl.Popup({
                    closeOnClick: true,
                })
                    .setLngLat([
                        currentFeature.geometry.coordinates[0] + 0.0055,
                        currentFeature.geometry.coordinates[1],
                    ])
                    .setHTML(content)
                    .addTo(map);
            }

            content += `<img src=${time} class=popup id=time style="position: absolute;top: 75%;border-radius: 100%;padding:5px;background-color: #ffa45b;margin-left: 160px;width: 30px;height: 30px;"></img>`;
            content += `<img src=${home} id=close style="position: absolute;top: 75%;border-radius: 100%;padding:5px;background-color: #ffa45b;margin-left:200px;width: 30px;height: 30px;">`;

            // var popup = new mapboxgl.Popup({ closeOnClick: false })
            //     .setLngLat(currentFeature.geometry.coordinates)
            //     .setHTML(content)
            //     .addTo(map);

            var popup = new mapboxgl.Popup({ closeOnClick: false })
                .setLngLat([
                    currentFeature.geometry.coordinates[0],
                    currentFeature.geometry.coordinates[1],
                ])
                .setHTML(content)
                .addTo(map);

            document.getElementById("time").addEventListener("click", schedule);
            document.getElementById("close").addEventListener("click", close);

            document
                .querySelector(".mapboxgl-ctrl")
                .addEventListener("click", () => {
                    if (popup2) {
                        popup2.remove();
                    }
                });
        }

        function zoom_button() {
            var zoom_state = 0;

            function zoom() {
                if (zoom_state == 0) {
                    map.scrollZoom.enable();
                    zoom_state = 1;
                } else {
                    map.scrollZoom.disable();
                    zoom_state = 0;
                }
            }
            var zoom_button = document.getElementById("scrollZoom");
            zoom_button.addEventListener("click", zoom);
        }

        // this function decide the random restaurant after clicking the random button
        function random(stores) {
            var button = document.getElementsByClassName("element-with-timer");

            button[0].addEventListener("click", function (e) {
                // get random restaurant
                var store = RandomAPI();
                // remove all the former popups
                const popup = document.getElementsByClassName("mapboxgl-popup");
                for (let i = 0; i < popup.length; i++) {
                    popup[i].remove();
                }

                // create a popup corresponding to the random restaurant
                for (var i = 0; i < stores.length; i++) {
                    if (store.properties.name === stores[i].properties.name) {
                        var clickedListing = stores[i];
                        flyToStore(clickedListing);
                        createPopUp(clickedListing);
                    }
                }
                var activeItem = document.getElementsByClassName("active");
                if (activeItem[0]) {
                    activeItem[0].classList.remove("active");
                }

                this.parentNode.classList.add("active");
            });
        }

        // this function define the action of top10 button
        function topTen(stores) {
            var button = document.getElementsByClassName("topTen");
            var state = 0;
            // var top_ten = BillboardAPI();
            button[0].addEventListener("click", function (e) {
                alert("fuck");
                // if (state == 0) {
                //     var listings = document.getElementById("listings");
                //     listings.innerHTML = "";
                //     buildLocationList(top_ten);
                //     state = 1;
                //     button[0].setAttribute(
                //         "style",
                //         "background-color: black; color: white;"
                //     );
                // } else {
                //     var listings = document.getElementById("listings");
                //     listings.innerHTML = "";
                //     buildLocationList(stores);
                //     state = 0;
                //     button[0].setAttribute(
                //         "style",
                //         "background-color: white; color: black;"
                //     );
                // }
            });
        }

        // Update value as user interacts with the map
        map.on("move", () => {
            this.setState({
                lng: map.getCenter().lng.toFixed(4),
                lat: map.getCenter().lat.toFixed(4),
                zoom: map.getZoom().toFixed(2),
            });
        });

        // Add geolocate control to map
        map.addControl(
            new mapboxgl.GeolocateControl({
                positionOptions: {
                    enableHighAccuracy: true,
                },
                trackUserLocation: true,
            })
        );

        map.on("click", function (e) {
            /* Determine if a feature in the "locations" layer exists at that point. */
            var features = map.queryRenderedFeatures(e.point, {
                layers: ["locations"],
            });

            /* If yes, then: */
            if (features.length) {
                var clickedPoint = features[0];

                /* Fly to the point */
                flyToStore(clickedPoint);

                /* Close all other popups and display popup for clicked store */
                createPopUp(clickedPoint);

                /* Highlight listing in sidebar (and remove highlight for all other listings) */
                var activeItem = document.getElementsByClassName("active");
                if (activeItem[0]) {
                    activeItem[0].classList.remove("active");
                }
                var listing = document.getElementById(
                    "listing-" + clickedPoint.properties.id
                );
                listing.classList.add("active");
            }
        });

        // map.addControl(new mapboxgl.NavigationControl());
        var nav = new mapboxgl.NavigationControl();
        map.addControl(nav, "top-left");
        map.scrollZoom.disable();
        nav._container.parentNode.className = "mapboxgl-ctrl-top-center";
    }

    // onClick function for random
    RandomRestaurants = () => {
        var rand = RandomAPI();
        console.log("random in map.js", rand);
        return rand;
    };

    // return top 10 restaurant by rating
    TopTenRestaurants = () => {
        var topTen = BillboardAPI();
        console.log("billborad in map.js", topTen);
        return topTen;
    };

    render() {
        return (
            <React.Fragment>
                <div className="sidebar">
                    <div className="heading">
                        <h1>Restaurant Locations</h1>
                        <h1 className="topTen">Top 10</h1>
                    </div>
                    <div id="listings" className="listings"></div>
                </div>
                <div
                    ref={(el) => (this.mapContainer = el)}
                    id="map"
                    className="mapContainer map pad2"
                >
                    <div className="container">
                        <div className="element-with-timer" id="random">
                            <h1>What to eat ?</h1>
                        </div>
                        <div className="element-with-timer" id="scrollZoom">
                            <img alt="" src={zoom}></img>
                        </div>
                    </div>
                </div>
            </React.Fragment>
        );
    }
}
