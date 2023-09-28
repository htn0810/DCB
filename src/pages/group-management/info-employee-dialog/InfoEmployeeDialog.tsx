import "./InfoEmployeeDialog.scss";
import React, {Fragment} from "react";
import {Avatar, Dialog, DialogContent, DialogTitle, Grid, IconButton, Typography} from "@mui/material";
import {Close} from "@mui/icons-material";
import {Employee} from "../../../models/Employee";

type Props = {
    open: boolean;
    onClose: () => void;
    employee: Employee | null;
}

function InfoEmployeeDialog(props: Props) {

    return (
        <Dialog className="info-emp-dialog" maxWidth="md"
                open={props.open} onClose={props.onClose}>
            <IconButton className="close-btn" onClick={props.onClose}>
                <Close/>
            </IconButton>
            <DialogTitle>
                Information
            </DialogTitle>
            <DialogContent>
                {props.employee ? (
                    <Fragment>
                        <Grid container spacing={2}>
                            <Grid item xs={6}>
                                <Avatar className="avatar" alt="avatar" src={props.employee.imageUrl} />
                            </Grid>
                            <Grid item xs={6}>
                                <Typography variant="subtitle1">
                                    NTID
                                </Typography>
                                <Typography variant="h5">
                                    {props.employee.ntid.toUpperCase()}
                                </Typography>
                                <br/>
                                <Typography variant="subtitle1">
                                    Full Name
                                </Typography>
                                <Typography variant="h5">
                                    {props.employee.displayName}
                                </Typography>
                            </Grid>
                            <Grid item xs={6}>
                                <Typography variant="subtitle1">
                                    Email
                                </Typography>
                                <Typography variant="h6">
                                    {props.employee.email}
                                </Typography>
                            </Grid>
                            <Grid item xs={6}>
                                <Typography variant="subtitle1">
                                    Employee Type
                                </Typography>
                                <Typography variant="h6">
                                    {props.employee.type}
                                </Typography>
                            </Grid>
                        </Grid>
                    </Fragment>
                ) : null}
            </DialogContent>
        </Dialog>
    )
}

export default InfoEmployeeDialog;
