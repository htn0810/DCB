import "./DeleteEmployeeDialog.scss";
import React from "react";
import {Button, Dialog, DialogActions, DialogContent, DialogTitle} from "@mui/material";
import {Employee} from "../../../models/Employee";

type Props = {
    open: boolean;
    onClose: () => void;
    employee: Employee;
    handleDelete: () => void;
}

function DeleteEmployeeDialog(props: Props) {

    const handleDelete = () => {
        props.handleDelete();
    }

    return (
        <Dialog className="delete-emp-dialog" open={props.open} onClose={props.onClose}>
            <DialogTitle>
                Delete Employee
            </DialogTitle>
            <DialogContent>
                Are you sure to delete this employee
                <div className="display-name">
                    {props.employee ? props.employee.displayName : ""}
                </div>
                ?
            </DialogContent>
            <DialogActions>
                <Button variant="contained" color="error" onClick={handleDelete}>
                    Delete
                </Button>
                <Button variant="contained" color="inherit" onClick={props.onClose}>
                    Close
                </Button>
            </DialogActions>
        </Dialog>
    )
}

export default DeleteEmployeeDialog;
