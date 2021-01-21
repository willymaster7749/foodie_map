import React, { memo, useEffect, useState } from "react";
import PropTypes from "prop-types";
import { Link } from "react-router-dom";
import {
    AppBar,
    Toolbar,
    Typography,
    Button,
    Hidden,
    IconButton,
    withStyles,
    Box,
} from "@material-ui/core";
import MenuIcon from "@material-ui/icons/Menu";
import HomeIcon from "@material-ui/icons/Home";
import HowToRegIcon from "@material-ui/icons/HowToReg";
import LockOpenIcon from "@material-ui/icons/LockOpen";
import BookIcon from "@material-ui/icons/Book";
import RoomIcon from "@material-ui/icons/Room";
import NavigationDrawer from "../../../shared/components/NavigationDrawer.js";
import AuthService from "../../../services/auth.service.js";

import logo from "../../../assets/pizza.png";

// this file is responsible for the buttons on the very top of main page

const styles = (theme) => ({
    appBar: {
        boxShadow: theme.shadows[6],
        backgroundColor: theme.palette.primary.main,
    },
    toolbar: {
        display: "flex",
        justifyContent: "space-between",
    },
    menuButtonText: {
        fontFamily: "Roboto",
        fontSize: theme.typography.body1.fontSize,
        fontWeight: theme.typography.h6.fontWeight,
        color: theme.palette.common.white,
    },
    brandText: {
        fontFamily: "Roboto",
        fontWeight: 600,
        color: theme.palette.common.white,
    },
    noDecoration: {
        textDecoration: "none !important",
    },
});

function NavBar(props) {
    const {
        classes,
        openRegisterDialog,
        openLoginDialog,
        handleMobileDrawerOpen,
        handleMobileDrawerClose,
        mobileDrawerOpen,
        selectedTab,
        reloadAndLogout,
    } = props;
    const [showUserBoard, setShowUserBoard] = useState(false);
    const [currentUser, setCurrentUser] = useState(undefined);

    useEffect(() => {
        const user = AuthService.getCurrentUser();
        if (user) {
            setCurrentUser(user);
            setShowUserBoard(true);
        }
    }, []);

    const menuItems = [
        {
            link: "/",
            name: "Discover",
            enabled: true,
            icon: <HomeIcon className="text-white" />,
        },
        {
            link: "/about",
            name: "About",
            enabled: true,
            icon: <BookIcon className="text-white" />,
        },
        {
            name: "Profile",
            link: "/user",
            enabled: showUserBoard,
            icon: <HowToRegIcon className="text-white" />,
        },
        {
            name: "Register",
            onClick: openRegisterDialog,
            enabled: !showUserBoard,
            icon: <LockOpenIcon className="text-white" />,
        },
        {
            name: "Login",
            onClick: openLoginDialog,
            enabled: !showUserBoard,
            icon: <HowToRegIcon className="text-white" />,
        },
        {
            name: "Logout",
            onClick: reloadAndLogout,
            enabled: showUserBoard,
        },
    ];

    return (
        <div className={classes.root}>
            <AppBar position="fixed" className={classes.appBar}>
                <Toolbar className={classes.toolbar}>
                    <div>
                        <img src={logo} alt="" id="site_logo" />
                        {/* the website logo */}
                        <Typography
                            variant="h4"
                            className={classes.brandText}
                            display="inline"
                        >
                            Foodiez
                        </Typography>
                    </div>
                    <div>
                        <Hidden mdUp>
                            <IconButton
                                className={classes.menuButton}
                                onClick={handleMobileDrawerOpen}
                                aria-label="Open Navigation"
                            >
                                <MenuIcon color="primary" />
                            </IconButton>
                        </Hidden>
                        <Hidden smDown>
                            {menuItems
                                .filter((element) => element.enabled)
                                .map((element) => {
                                    if (element.link) {
                                        return (
                                            <Link
                                                key={element.name}
                                                to={element.link}
                                                className={classes.noDecoration}
                                                onClick={
                                                    handleMobileDrawerClose
                                                }
                                            >
                                                {/* the first two buttons */}
                                                <Button
                                                    size="large"
                                                    classes={{
                                                        text:
                                                            classes.menuButtonText,
                                                    }}
                                                >
                                                    {element.name}
                                                </Button>
                                            </Link>
                                        );
                                    }
                                    return (
                                        // the last two buttons
                                        <Button
                                            size="large"
                                            onClick={element.onClick}
                                            classes={{
                                                text: classes.menuButtonText,
                                            }}
                                            key={element.name}
                                        >
                                            {element.name}
                                        </Button>
                                    );
                                })}
                        </Hidden>
                    </div>
                </Toolbar>
            </AppBar>
            <NavigationDrawer
                menuItems={menuItems}
                anchor="right"
                open={mobileDrawerOpen}
                selectedItem={selectedTab}
                onClose={handleMobileDrawerClose}
            />
        </div>
    );
}

NavBar.propTypes = {
    classes: PropTypes.object.isRequired,
    handleMobileDrawerOpen: PropTypes.func,
    handleMobileDrawerClose: PropTypes.func,
    mobileDrawerOpen: PropTypes.bool,
    selectedTab: PropTypes.string,
    openRegisterDialog: PropTypes.func.isRequired,
    openLoginDialog: PropTypes.func.isRequired,
};

export default withStyles(styles, { withTheme: true })(memo(NavBar));
