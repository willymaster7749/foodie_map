import React, { Fragment } from "react";
import { Route } from "react-router-dom";

import { CommonAPI, RandomAPI, BillboardAPI } from "../../../commonAPI.js";
import food from "../../../assets/food.jpeg";
import sunset from "../../../assets/sunset.jpeg";
import "../../../rank.css";

export default function HeadSection() {
    var stores = BillboardAPI();
    return (
        <Route
            render={({ history }) => (
                <Fragment>
                    <div
                        className="pic_container"
                        style={{
                            backgroundImage: `url(${food})`,
                        }}
                    >
                        <h1 className="motto">
                            "Foodiez make you reach climax with the help of
                            food"
                            <span>
                                - Terrance Chen, founder and the CEO of Foodiez
                            </span>
                        </h1>
                        <div
                            style={{
                                width: "50%",
                                marginRight: "10%",
                                display: "inline-block",
                            }}
                        >
                            <h2>
                                Foodiez is the paradise where you can explore,
                                locate and enjoy the cuisine in the finest
                                restaurants around NTU campus.
                            </h2>
                        </div>

                        <p
                            onClick={() => {
                                history.push("/about");
                            }}
                        >
                            About Us
                        </p>
                    </div>
                </Fragment>
            )}
        />
    );
}

// 27B2A4
