import React from "react";
import {Snackbar} from "@mui/material";
import MuiAlert, {AlertProps} from '@mui/material/Alert';
import "./NotifyEndpointOrglayerSnackbar.scss";

type Props = {
    open: boolean;
    onClose: () => void;
}

const Alert = React.forwardRef<HTMLDivElement, AlertProps>(
    function Alert(props, ref,) {
        return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
    }
);

function NotifyEndpointOrglayerSnackbar(props: Props) {

    return (
        <Snackbar open={props.open}
                  onClose={props.onClose}
                  autoHideDuration={2213}
                  anchorOrigin={{vertical: "bottom", horizontal: "center"}}>
            <Alert severity="info"
                   sx={{width: '100%'}}>
                This is the last branch!
            </Alert>
        </Snackbar>
    )
}

export default NotifyEndpointOrglayerSnackbar;
