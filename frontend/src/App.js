import React, { Fragment, Suspense, lazy, useEffect, useState } from "react";
import { MuiThemeProvider, CssBaseline } from "@material-ui/core";
import { BrowserRouter, Route, Switch } from "react-router-dom";
import theme from "./theme";
import GlobalStyles from "./GlobalStyles";
import * as serviceWorker from "./serviceWorker";
import Pace from "./shared/components/Pace";
import { SocketContext, socket } from "./context/socket";
import {
    CommonAPI,
    RandomAPI,
    BillboardAPI,
    AddStarAPI,
    FindRestaurantsAPI,
} from "./commonAPI";

const LoggedInComponent = lazy(() => import("./logged_in/components/Main"));

const LoggedOutComponent = lazy(() => import("./logged_out/components/Main"));

function App() {
    // onClick function for random
    localStorage.setItem("Database", []);

    return (
        <BrowserRouter>
            <SocketContext.Provider value={socket}>
                <MuiThemeProvider theme={theme}>
                    <CssBaseline />
                    <GlobalStyles />
                    <Pace color={theme.palette.primary.light} />
                    <Suspense fallback={<Fragment />}>
                        <Switch>
                            <Route path="/c">
                                <LoggedInComponent />
                            </Route>
                            <Route>
                                <LoggedOutComponent />
                            </Route>
                            <Route>
                                <LoggedOutComponent />
                            </Route>
                        </Switch>
                    </Suspense>
                </MuiThemeProvider>
            </SocketContext.Provider>
        </BrowserRouter>
    );
}

serviceWorker.register();

export default App;
