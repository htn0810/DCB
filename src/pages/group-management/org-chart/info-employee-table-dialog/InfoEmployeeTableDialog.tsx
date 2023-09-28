import "./InfoEmployeeTableDialog.scss";
import React, {Fragment} from "react";
import {
    Dialog,
    DialogContent,
    DialogTitle,
    IconButton,
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableRow
} from "@mui/material";
import {Close} from "@mui/icons-material";
import {Employee} from "../../../../models/Employee";

type Props = {
    open: boolean;
    onClose: () => void;
    employees: Employee[] | null;
}

function InfoEmployeeTableDialog(props: Props) {
    return (
        <Dialog className="info-emp-dialog" maxWidth={"xl"} open={props.open} onClose={props.onClose}>
            <IconButton className="close-btn" onClick={props.onClose}>
                <Close/>
            </IconButton>

            <DialogTitle>Employee's Information</DialogTitle>

            <DialogContent>
                {props.employees
                    ? (
                        <Fragment>
                            <Table className="employee-table">
                                <TableHead>
                                    <TableRow>
                                        <TableCell>No.</TableCell>
                                        <TableCell style={{width: "100px"}}>NTID</TableCell>
                                        <TableCell style={{width: "300px"}}>Fullname</TableCell>
                                        <TableCell style={{width: "400px"}}>Email</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {props.employees.length > 0
                                        ? props.employees.map((employee, index) =>
                                            (
                                                <TableRow key={employee.ntid}>
                                                    <TableCell>{index + 1}</TableCell>
                                                    <TableCell>{employee.ntid.toUpperCase()}</TableCell>
                                                    <TableCell>{employee.displayName}</TableCell>
                                                    <TableCell>{employee.email}</TableCell>
                                                </TableRow>
                                            )
                                        )
                                        : (
                                            <TableRow>
                                                <TableCell className="no-data" align="center" colSpan={5}>Don't have any employees</TableCell>
                                            </TableRow>
                                        )
                                    }
                                </TableBody>
                            </Table>
                        </Fragment>
                    )
                    : null
                }
            </DialogContent>
        </Dialog>
    )
}

export default InfoEmployeeTableDialog;
