import React, { Fragment, useEffect, useState } from "react";
import PropTypes from "prop-types";
import { Typography, Box } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import { maxWidth } from "@material-ui/system";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemText from "@material-ui/core/ListItemText";
import Divider from "@material-ui/core/Divider";
import Avatar from "@material-ui/core/Avatar";
import ProfilePhoto from "../../../assets/pizza.png";
import { FindRestaurantsAPI } from "../../../commonAPI";

const useStyles = makeStyles((theme) => ({
    root: {
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        flexDirection: "column",
        marginTop: 125,
        maxWidth: 350,
        margin: "auto",
        backgroundColor: theme.palette.background.paper,
        "& > *": {
            margin: theme.spacing(1),
        },
    },
    nav: {
        width: "100%",
        maxWidth: 350,
        backgroundColor: theme.palette.background.paper,
    },
    profile: {
        width: theme.spacing(30),
        height: theme.spacing(30),
    },
}));

function Profile() {
    const classes = useStyles();

    const user_info = JSON.parse(localStorage.getItem("user"));
    FindRestaurantsAPI(user_info.favorite);

    return (
        <div className={classes.root}>
            <div>
                <Avatar className={classes.profile} src={ProfilePhoto}></Avatar>
            </div>
            <List
                className={classes.nav}
                component="nav"
                aria-label="mailbox folders"
            >
                <ListItem button>
                    <ListItemText
                        primary="Name"
                        secondary={user_info.username}
                    />
                </ListItem>
                <Divider />
                <ListItem button divider>
                    <ListItemText primary="Email" secondary={user_info.email} />
                </ListItem>
                <ListItem button>
                    <ListItemText
                        primary="Favorite"
                        secondary={
                            <div>
                                {JSON.parse(
                                    localStorage.getItem("restaurants-list")
                                ).map((item, key) => {
                                    return <div>{item.properties.name}</div>;
                                })}
                            </div>
                        }
                    />
                </ListItem>
            </List>
        </div>
    );
}

export default Profile;
