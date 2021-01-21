import React from "react";
import ReactDOM from "react-dom";
import App from "./App";
import mapboxgl from "mapbox-gl";

mapboxgl.accessToken =
    "pk.eyJ1IjoieWh0ZXJyYW5jZSIsImEiOiJja2h1aWJyZ3Qwa3J5MzBvM3c4bTZ1azVvIn0.XtFSpOOMBL18AMwwzZK8Nw";

ReactDOM.render(<App />, document.getElementById("root"));
