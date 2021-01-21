import React, { useState, useCallback, Fragment } from "react";
import PropTypes from "prop-types";
import RegisterDialog from "./RegisterDialog.js";
import TermsOfServiceDialog from "./TermsOfServiceDialog.js";
import LoginDialog from "./LoginDialog.js";
import ChangePasswordDialog from "./ChangePasswordDialog.js";
import ModalBackdrop from "../../../shared/components/ModalBackdrop.js";

// deciding where to go

function DialogSelector(props) {
    const {
        dialogOpen,
        openTermsDialog,
        openRegisterDialog,
        openLoginDialog,
        openChangePasswordDialog,
        onClose,
    } = props;
    const [loginStatus, setLoginStatus] = useState(null);
    const [registerStatus, setRegisterStatus] = useState(null);

    const _onClose = useCallback(() => {
        setLoginStatus(null);
        setRegisterStatus(null);
        onClose();
    }, [onClose, setLoginStatus, setRegisterStatus]);

    const printDialog = useCallback(() => {
        switch (dialogOpen) {
            case "register":
                return (
                    <RegisterDialog
                        onClose={_onClose}
                        openTermsDialog={openTermsDialog}
                        openLoginDialog={openLoginDialog}
                        status={registerStatus}
                        setStatus={setRegisterStatus}
                    />
                );
            case "termsOfService":
                return <TermsOfServiceDialog onClose={openRegisterDialog} />;
            case "login":
                return (
                    <LoginDialog
                        onClose={_onClose}
                        status={loginStatus}
                        setStatus={setLoginStatus}
                        openChangePasswordDialog={openChangePasswordDialog}
                    />
                );
            case "changePassword":
                return (
                    <ChangePasswordDialog
                        setLoginStatus={setLoginStatus}
                        onClose={openLoginDialog}
                    />
                );
            default:
        }
    }, [
        dialogOpen,
        openChangePasswordDialog,
        openLoginDialog,
        openRegisterDialog,
        openTermsDialog,
        _onClose,
        loginStatus,
        registerStatus,
        setLoginStatus,
        setRegisterStatus,
    ]);

    return (
        <Fragment>
            {dialogOpen && <ModalBackdrop open />}
            {printDialog()}
        </Fragment>
    );
}

DialogSelector.propTypes = {
    dialogOpen: PropTypes.string,
    openLoginDialog: PropTypes.func.isRequired,
    onClose: PropTypes.func.isRequired,
    openTermsDialog: PropTypes.func.isRequired,
    openRegisterDialog: PropTypes.func.isRequired,
    openChangePasswordDialog: PropTypes.func.isRequired,
};

export default DialogSelector;
