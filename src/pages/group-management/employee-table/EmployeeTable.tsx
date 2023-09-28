import "./EmployeeTable.scss";
import React, {Fragment, useState} from "react";
import {Avatar, IconButton, Table, TableBody, TableCell, TableHead, TableRow, Tooltip} from "@mui/material";
import {Delete, Edit, Person} from "@mui/icons-material";
import {EmployeeAPI} from "../../../api/employee.api";
import DeleteEmployeeDialog from "../delete-employee-dialog/DeleteEmployeeDialog";
import EditEmployeeImageDialog from "../edit-employee-image-dialog/EditEmployeeImageDialog";
import InfoEmployeeDialog from "../info-employee-dialog/InfoEmployeeDialog";
import {Employee} from "../../../models/Employee";

type Props = {
    employees: Employee[];
    reloadEmployees: () => void;
}

function EmployeeTable(props: Props) {
    const [selectedEmployee, setSelectedEmployee] = useState(null as null | Employee);
    const [infoDialogOpened, setInfoDialogOpened] = useState(false);
    const [editDialogOpened, setEditDialogOpened] = useState(false);
    const [delDialogOpened, setDelDialogOpened] = useState(false);

    const handleOpenInfoDialog = (employee: Employee) => {
        setSelectedEmployee(employee);
        setInfoDialogOpened(true);
    }

    const onCloseInfoDialog = () => {
        setInfoDialogOpened(false);
    }

    const handleEditAvatarDialog = (employee: Employee) => {
        setSelectedEmployee(employee);
        setEditDialogOpened(true);
    }

    const onCloseEditAvatarDialog = () => {
        setEditDialogOpened(false);
    }

    const handleOpenDeleteDialog = (employee: Employee) => {
        setSelectedEmployee(employee);
        setDelDialogOpened(true);
    }

    const onCloseDeleteDialog = () => {
        setDelDialogOpened(false);
    }

    const handleDeleteEmployee = () => {
        if (selectedEmployee) {
            EmployeeAPI.deleteEmployeeByNtid(selectedEmployee.ntid).then(() => {
                setDelDialogOpened(false);
                props.reloadEmployees();
            });
        }
    }

    return (
        <Fragment>
            <Table className="employee-table">
                <TableHead>
                    <TableRow>
                        <TableCell>NTID</TableCell>
                        <TableCell>Employee's ID</TableCell>
                        <TableCell>Avatar</TableCell>
                        <TableCell>Name</TableCell>
                        <TableCell>Email</TableCell>
                        <TableCell align="center">Action</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {props.employees.length > 0 ? props.employees.map(employee =>
                        <TableRow key={employee.ntid}>
                            <TableCell>
                                {employee.ntid.toUpperCase()}
                            </TableCell>
                            <TableCell>
                                {employee.employeeId}
                            </TableCell>
                            <TableCell>
                                <div className="employee-avatar" style={{ alignItems: "center" }}>
                                    <Avatar className="avatar" alt="avatar" src={employee.imageUrl} />
                                </div>
                            </TableCell>
                            <TableCell>
                                {employee.displayName}
                            </TableCell>
                            <TableCell>
                                {employee.email}
                            </TableCell>
                            <TableCell align="center" sx={{width: 120}}>
                                <Tooltip title="View Employee's Information">
                                    <IconButton color="primary" onClick={() => handleOpenInfoDialog(employee)}>
                                        <Person />
                                    </IconButton>
                                </Tooltip>
                                <Tooltip title="Edit Employee's Image">
                                    <IconButton color="primary" onClick={() => handleEditAvatarDialog(employee)}>
                                        <Edit/>
                                    </IconButton>
                                </Tooltip>
                                <Tooltip title="Delete Employee">
                                    <IconButton color="error" onClick={() => handleOpenDeleteDialog(employee)}>
                                        <Delete />
                                    </IconButton>
                                </Tooltip>
                            </TableCell>
                        </TableRow>
                    ) : (
                        <TableRow>
                            <TableCell className="no-data" align="center" colSpan={5}>
                                Don't have any employees
                            </TableCell>
                        </TableRow>
                    )}
                </TableBody>
            </Table>

            {/* Dialogs */}
            <InfoEmployeeDialog open={infoDialogOpened} onClose={onCloseInfoDialog}
                                employee={selectedEmployee}/>
            <EditEmployeeImageDialog open={editDialogOpened} onClose={onCloseEditAvatarDialog}
                                employees={selectedEmployee} loadPage={props.reloadEmployees}/>
            <DeleteEmployeeDialog open={delDialogOpened} onClose={onCloseDeleteDialog}
                                  employee={selectedEmployee!} handleDelete={handleDeleteEmployee}/>
        </Fragment>
    )
}

export default EmployeeTable;
