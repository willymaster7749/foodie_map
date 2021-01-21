import React, {
    useState,
    useCallback,
    useRef,
    useEffect,
    Fragment,
    useContext,
} from "react";
import PropTypes from "prop-types";
import {
    FormHelperText,
    TextField,
    Button,
    Checkbox,
    Typography,
    FormControlLabel,
    withStyles,
} from "@material-ui/core";
import Snackbar from "../utilities/Snackbar.js";
import FormDialog from "../../../shared/components/FormDialog.js";
import HighlightedInformation from "../../../shared/components/HighlightedInformation.js";
import ButtonCircularProgress from "../../../shared/components/ButtonCircularProgress.js";
import VisibilityPasswordTextField from "../../../shared/components/VisibilityPasswordTextField.js";
import { SocketContext } from "../../../context/socket.js";
import AuthService from "../../../services/auth.service.js";
// this file is responsible for login register popup

const styles = (theme) => ({
    link: {
        transition: theme.transitions.create(["background-color"], {
            duration: theme.transitions.duration.complex,
            easing: theme.transitions.easing.easeInOut,
        }),
        cursor: "pointer",
        color: theme.palette.primary.main,
        "&:enabled:hover": {
            color: theme.palette.primary.dark,
        },
        "&:enabled:focus": {
            color: theme.palette.primary.dark,
        },
    },
});

function RegisterDialog(props) {
    const {
        setStatus,
        theme,
        history,
        onClose,
        openTermsDialog,
        status,
        classes,
        openLoginDialog,
    } = props;
    const [isLoading, setIsLoading] = useState(false);
    const [hasTermsOfServiceError, setHasTermsOfServiceError] = useState(false);
    const [isPasswordVisible, setIsPasswordVisible] = useState(false);
    const [snackbarOpen, setSnackbarOpen] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState("");
    const [snackbarSeverity, setSnackbarSeverity] = useState("success");
    const registerTermsCheckbox = useRef();
    const registerUsername = useRef();
    const registerEmail = useRef();
    const registerPassword = useRef();
    const registerPasswordRepeat = useRef();
    const socket = useContext(SocketContext);

    useEffect(() => {
        // Receive message from server
        socket.on("register", (data) => {
            console.log(data);

            if (data.info !== "Success") {
                setTimeout(() => {
                    setStatus("invalidEmail");
                    setIsLoading(false);
                }, 1500);
            } else {
                setTimeout(() => {
                    setIsLoading(false);
                    // history.push("/c/dashboard");
                }, 150);
            }
        });
    }, [socket, setStatus, history]);

    const openSnackbar = (message, severity) => {
        setSnackbarMessage(message);
        setSnackbarSeverity(severity);
        setSnackbarOpen(true);
        setTimeout(() => {
            setSnackbarOpen(false);
        }, 1500);
    };

    const register = useCallback(() => {
        if (!registerTermsCheckbox.current.checked) {
            setHasTermsOfServiceError(true);
            return;
        }
        if (
            registerPassword.current.value !==
            registerPasswordRepeat.current.value
        ) {
            setStatus("passwordsDontMatch");
            return;
        }

        let email = registerEmail.current.value;
        let password = registerPassword.current.value;
        let username = registerUsername.current.value;

        setStatus(null);
        setIsLoading(true);

        AuthService.register(username, email, password).then(
            (response) => {
                console.log(response.data.message);
                console.log("Successfully registered");

                setIsLoading(false);

                openSnackbar("You have successfully registered!!", "success");

                setTimeout(() => {
                    openLoginDialog();
                }, 3000);
            },
            (error) => {
                let resMessage =
                    (error.response &&
                        error.response.data &&
                        error.response.data.message) ||
                    error.message ||
                    error.toString();

                console.log(resMessage);

                setIsLoading(false);
                if (!resMessage instanceof String) resMessage = "Error";

                openSnackbar(resMessage, "error");
            }
        );
    }, [
        setIsLoading,
        setStatus,
        setHasTermsOfServiceError,
        registerPassword,
        registerPasswordRepeat,
        registerTermsCheckbox,
        openLoginDialog,
    ]);

    return (
        <>
            <FormDialog
                loading={isLoading}
                onClose={onClose}
                open
                headline="Register"
                onFormSubmit={(e) => {
                    e.preventDefault();
                    register();
                }}
                hideBackdrop
                hasCloseIcon
                content={
                    <Fragment>
                        <TextField
                            variant="outlined"
                            margin="normal"
                            required
                            fullWidth
                            error={status === "invalidEmail"}
                            label="Username"
                            inputRef={registerUsername}
                            autoFocus
                            onChange={() => {
                                if (status === "invalidEmail") {
                                    setStatus(null);
                                }
                            }}
                            autoComplete="off"
                            FormHelperTextProps={{ error: true }}
                        />
                        <TextField
                            variant="outlined"
                            margin="normal"
                            required
                            fullWidth
                            error={status === "invalidEmail"}
                            label="Email Address"
                            inputRef={registerEmail}
                            autoComplete="off"
                            type="email"
                            onChange={() => {
                                if (status === "invalidEmail") {
                                    setStatus(null);
                                }
                            }}
                            FormHelperTextProps={{ error: true }}
                        />
                        <VisibilityPasswordTextField
                            variant="outlined"
                            margin="normal"
                            required
                            fullWidth
                            error={
                                status === "passwordTooShort" ||
                                status === "passwordsDontMatch"
                            }
                            label="Password"
                            inputRef={registerPassword}
                            autoComplete="off"
                            onChange={() => {
                                if (
                                    status === "passwordTooShort" ||
                                    status === "passwordsDontMatch"
                                ) {
                                    setStatus(null);
                                }
                            }}
                            helperText={(() => {
                                if (status === "passwordTooShort") {
                                    return "Create a password at least 6 characters long.";
                                }
                                if (status === "passwordsDontMatch") {
                                    return "Your passwords dont match.";
                                }
                                return null;
                            })()}
                            FormHelperTextProps={{ error: true }}
                            isVisible={isPasswordVisible}
                            onVisibilityChange={setIsPasswordVisible}
                        />
                        <VisibilityPasswordTextField
                            variant="outlined"
                            margin="normal"
                            required
                            fullWidth
                            error={
                                status === "passwordTooShort" ||
                                status === "passwordsDontMatch"
                            }
                            label="Repeat Password"
                            inputRef={registerPasswordRepeat}
                            autoComplete="off"
                            onChange={() => {
                                if (
                                    status === "passwordTooShort" ||
                                    status === "passwordsDontMatch"
                                ) {
                                    setStatus(null);
                                }
                            }}
                            helperText={(() => {
                                if (status === "passwordTooShort") {
                                    return "Create a password at least 6 characters long.";
                                }
                                if (status === "passwordsDontMatch") {
                                    return "Your passwords dont match.";
                                }
                            })()}
                            FormHelperTextProps={{ error: true }}
                            isVisible={isPasswordVisible}
                            onVisibilityChange={setIsPasswordVisible}
                        />
                        <FormControlLabel
                            style={{ marginRight: 0 }}
                            control={
                                <Checkbox
                                    color="primary"
                                    inputRef={registerTermsCheckbox}
                                    onChange={() => {
                                        setHasTermsOfServiceError(false);
                                    }}
                                />
                            }
                            label={
                                <Typography variant="body1">
                                    I agree to the
                                    <span
                                        className={classes.link}
                                        onClick={
                                            isLoading ? null : openTermsDialog
                                        }
                                        tabIndex={0}
                                        role="button"
                                        onKeyDown={(event) => {
                                            // For screenreaders listen to space and enter events
                                            if (
                                                (!isLoading &&
                                                    event.keyCode === 13) ||
                                                event.keyCode === 32
                                            ) {
                                                openTermsDialog();
                                            }
                                        }}
                                    >
                                        {" "}
                                        terms of service
                                    </span>
                                </Typography>
                            }
                        />
                        {hasTermsOfServiceError && (
                            <FormHelperText
                                error
                                style={{
                                    display: "block",
                                    marginTop: theme.spacing(-1),
                                }}
                            >
                                In order to create an account, you have to
                                accept our terms of service.
                            </FormHelperText>
                        )}
                        {status === "accountCreated" ? (
                            <HighlightedInformation>
                                We have created your account. Please click on
                                the link in the email we have sent to you before
                                logging in.
                            </HighlightedInformation>
                        ) : (
                            <HighlightedInformation>
                                Registration is disabled until we go live.
                            </HighlightedInformation>
                        )}
                    </Fragment>
                }
                actions={
                    <Button
                        type="submit"
                        fullWidth
                        variant="contained"
                        size="large"
                        color="secondary"
                        disabled={isLoading}
                    >
                        Register
                        {isLoading && <ButtonCircularProgress />}
                    </Button>
                }
            />
            <Snackbar
                open={snackbarOpen}
                setOpen={setSnackbarOpen}
                message={snackbarMessage}
                severity={snackbarSeverity}
            />
        </>
    );
}

RegisterDialog.propTypes = {
    theme: PropTypes.object.isRequired,
    onClose: PropTypes.func.isRequired,
    openTermsDialog: PropTypes.func.isRequired,
    status: PropTypes.string,
    setStatus: PropTypes.func.isRequired,
    classes: PropTypes.object.isRequired,
};

export default withStyles(styles, { withTheme: true })(RegisterDialog);
