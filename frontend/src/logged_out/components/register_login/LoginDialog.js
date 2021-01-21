import React, {
    useState,
    useCallback,
    useRef,
    Fragment,
    useContext,
    useEffect,
} from "react";
import PropTypes from "prop-types";
import classNames from "classnames";
import { withRouter } from "react-router-dom";
import {
    TextField,
    Button,
    Checkbox,
    Typography,
    FormControlLabel,
    withStyles,
} from "@material-ui/core";
import FormDialog from "../../../shared/components/FormDialog.js";
import HighlightedInformation from "../../../shared/components/HighlightedInformation.js";
import ButtonCircularProgress from "../../../shared/components/ButtonCircularProgress.js";
import VisibilityPasswordTextField from "../../../shared/components/VisibilityPasswordTextField.js";
import { SocketContext } from "../../../context/socket.js";
import AuthService from "../../../services/auth.service.js";

// this file is responsible for the log in popup
const styles = (theme) => ({
    forgotPassword: {
        marginTop: theme.spacing(2),
        color: theme.palette.primary.main,
        cursor: "pointer",
        "&:enabled:hover": {
            color: theme.palette.primary.dark,
        },
        "&:enabled:focus": {
            color: theme.palette.primary.dark,
        },
    },
    disabledText: {
        cursor: "auto",
        color: theme.palette.text.disabled,
    },
    formControlLabel: {
        marginRight: 0,
    },
});

function LoginDialog(props) {
    const {
        setStatus,
        classes,
        onClose,
        openChangePasswordDialog,
        status,
    } = props;
    const [isLoading, setIsLoading] = useState(false);
    const [isPasswordVisible, setIsPasswordVisible] = useState(false);
    const loginUsername = useRef();
    const loginPassword = useRef();
    const socket = useContext(SocketContext);

    useEffect(() => {
        // Receive messages from server
        socket.on("login", (data) => {
            console.log(data);
        });
    });

    const login = useCallback(() => {
        setIsLoading(true);
        setStatus(null);

        let username = loginUsername.current.value;
        let password = loginPassword.current.value;
        console.log("Entered username: " + username);
        console.log("Entered password: " + password);

        AuthService.login(username, password).then(
            () => {
                window.location.reload();
                console.log("Logging in!");
            },
            (error) => {
                const resMessage =
                    (error.response &&
                        error.response.data &&
                        error.response.data.message) ||
                    error.message ||
                    error.toString();

                setIsLoading(false);
                console.log(resMessage);
                if (resMessage === "Invalid password") {
                    setStatus("invalidPassword");
                } else if (resMessage === "User not found") {
                    setStatus("invalidUsername");
                }
            }
        );
    }, [loginUsername, loginPassword, setStatus]);

    return (
        <Fragment>
            <FormDialog
                open
                onClose={onClose}
                loading={isLoading}
                onFormSubmit={(e) => {
                    e.preventDefault();
                    login();
                }}
                hideBackdrop
                headline="Login"
                content={
                    <Fragment>
                        <TextField
                            variant="outlined"
                            margin="normal"
                            error={status === "invalidUsername"}
                            required
                            fullWidth
                            label="Username"
                            inputRef={loginUsername}
                            autoFocus
                            autoComplete="off"
                            onChange={() => {
                                if (status === "invalidUsername") {
                                    setStatus(null);
                                }
                            }}
                            helperText={
                                status === "invalidUsername" &&
                                "This username isn't associated with an account."
                            }
                            FormHelperTextProps={{ error: true }}
                        />
                        <VisibilityPasswordTextField
                            variant="outlined"
                            margin="normal"
                            required
                            fullWidth
                            error={status === "invalidPassword"}
                            label="Password"
                            inputRef={loginPassword}
                            autoComplete="off"
                            onChange={() => {
                                if (status === "invalidPassword") {
                                    setStatus(null);
                                }
                            }}
                            helperText={
                                status === "invalidPassword" ? (
                                    <span>
                                        Incorrect password. Try again, or click
                                        on <b>&quot;Forgot Password?&quot;</b>{" "}
                                        to reset it.
                                    </span>
                                ) : (
                                    ""
                                )
                            }
                            FormHelperTextProps={{ error: true }}
                            onVisibilityChange={setIsPasswordVisible}
                            isVisible={isPasswordVisible}
                        />
                        <FormControlLabel
                            className={classes.formControlLabel}
                            control={<Checkbox color="primary" />}
                            label={
                                <Typography variant="body1">
                                    Remember me
                                </Typography>
                            }
                        />
                        {status === "verificationEmailSend" ? (
                            <HighlightedInformation>
                                We have send instructions on how to reset your
                                password to your email address
                            </HighlightedInformation>
                        ) : (
                            <HighlightedInformation>
                                In production mode:
                                <br />
                                Email is: <b>root@web.com</b>
                                <br />
                                Password is: <b>root</b>
                            </HighlightedInformation>
                        )}
                    </Fragment>
                }
                actions={
                    <Fragment>
                        <Button
                            type="submit"
                            fullWidth
                            variant="contained"
                            color="secondary"
                            disabled={isLoading}
                            size="large"
                        >
                            Login
                            {isLoading && <ButtonCircularProgress />}
                        </Button>
                        <Typography
                            align="center"
                            className={classNames(
                                classes.forgotPassword,
                                isLoading ? classes.disabledText : null
                            )}
                            color="primary"
                            onClick={
                                isLoading ? null : openChangePasswordDialog
                            }
                            tabIndex={0}
                            role="button"
                            onKeyDown={(event) => {
                                // For screenreaders listen to space and enter events
                                if (
                                    (!isLoading && event.keyCode === 13) ||
                                    event.keyCode === 32
                                ) {
                                    openChangePasswordDialog();
                                }
                            }}
                        >
                            Forgot Password?
                        </Typography>
                    </Fragment>
                }
            />
        </Fragment>
    );
}

LoginDialog.propTypes = {
    classes: PropTypes.object.isRequired,
    onClose: PropTypes.func.isRequired,
    setStatus: PropTypes.func.isRequired,
    openChangePasswordDialog: PropTypes.func.isRequired,
    history: PropTypes.object.isRequired,
    status: PropTypes.string,
};

export default withRouter(withStyles(styles)(LoginDialog));
