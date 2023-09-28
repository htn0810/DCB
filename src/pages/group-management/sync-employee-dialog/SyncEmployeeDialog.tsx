import "./SyncEmployeeDialog.scss";
import React, {useEffect, useState} from "react";
import {
    Button,
    Checkbox,
    Dialog,
    DialogActions,
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
import {EmployeeAPI, SyncEmployee} from "../../../api/employee.api";
import {Employee} from "../../../models/Employee";
import {Unit} from "../../../models/Unit";
import {useAppDispatch} from "../../../custom-hooks/hook";
import {hideIndicator, showIndicator} from "../../../app/app.slice";

type SyncEmpDialogProps = {
    open: boolean;
    onClose: () => void;
    group: Unit;
    syncData: Employee[];
    currentEmployees: Employee[];
    reloadList: () => void;
}

enum Type {
    NEW = 'NEW', UPDATE = 'UPDATE', DELETE = 'DELETE'
}

type ShowEmployee = {
    type: Type;
    employee: Employee;
}

function SyncEmployeeDialog(props: SyncEmpDialogProps) {
    const [shownEmployees, setShownEmployees] = useState<ShowEmployee[]>([]);
    const [selectedEmployees, setSelectedEmployees] = useState<ShowEmployee[]>([]);

    const dispatch = useAppDispatch();

    useEffect(() => {
        if (props.open && props.group && props.syncData) {
            const showEmployees: ShowEmployee[] = [];
            const deletedEmployee = [...props.currentEmployees];

            props.syncData.forEach(employee => {
               const index = deletedEmployee.findIndex(emp => emp.ntid.toLowerCase() === employee.ntid.toLowerCase());
               if (index !== -1) {
                   if (!compareEmployee(employee, deletedEmployee[index])) {
                       showEmployees.push({type: Type.UPDATE, employee});
                       deletedEmployee.splice(index, 1);
                   }
               } else {
                   showEmployees.push({type: Type.NEW, employee});
               }
            });
            deletedEmployee.forEach(employee => {
                const index = props.syncData.findIndex(emp => emp.ntid.toLowerCase() === employee.ntid.toLowerCase());
                if (index === -1) {
                    showEmployees.push({type: Type.DELETE, employee});
                }
            });
            setShownEmployees(showEmployees)
        }
    }, [props]);

    const checkNullAndCompareValue = (valueLdap: any, valueDb: any): boolean =>  {
        if (valueLdap === null && valueDb === null) {
            return true;
        }
        if ((valueDb === null && valueLdap !== null) || (valueDb !== null && valueLdap === null)) {
            return false;
        }
        return valueDb.toLowerCase() === valueLdap.toLowerCase();
    }

    const compareEmployee = (employeeLdap: Employee, employeeDb: Employee): boolean => { 
        return checkNullAndCompareValue(employeeLdap.ntid, employeeDb.ntid) &&  checkNullAndCompareValue(employeeLdap.employeeId, employeeDb.employeeId) &&
                checkNullAndCompareValue(employeeLdap.email, employeeDb.email);
    }

    const handleClose = (event?: object, reason?: string) => {
        if (reason !== "escapeKeyDown" && reason !== "backdropClick") {
            setShownEmployees([]);
            setSelectedEmployees([]);
            props.onClose();
        }
    }

    const onSelectAllClick = (event: React.ChangeEvent<HTMLInputElement>) => {
        if (event.target.checked) {
            setSelectedEmployees(shownEmployees);
            return;
        }
        setSelectedEmployees([]);
    }

    const isRowSelected = (showEmployee: ShowEmployee) => {
        return selectedEmployees.findIndex(e => e.employee.ntid.toLowerCase() === showEmployee.employee.ntid.toLowerCase()) !== -1;
    }

    const onChangeSelectRow = (event: React.ChangeEvent<HTMLInputElement>, showEmployee: ShowEmployee) => {
        if (event.target.checked) {
            const newSelected = [...selectedEmployees, showEmployee];
            setSelectedEmployees(newSelected);
            return;
        }
        const newSelected = [...selectedEmployees];
        newSelected.splice(selectedEmployees.findIndex(e => e.employee.ntid.toLowerCase() === showEmployee.employee.ntid.toLowerCase()), 1);
        setSelectedEmployees(newSelected);
    }

    const handleSaveEmployees = () => {
        dispatch(showIndicator());
        const data: SyncEmployee = {
            groupId: props.group.id!,
            newEmployees: [],
            updatedEmployees: [],
            deletedEmployees: []
        }
        selectedEmployees.forEach(showEmployee => {
            switch (showEmployee.type) {
                case Type.NEW:
                    data.newEmployees.push(showEmployee.employee);
                    break;
                case Type.UPDATE:
                    data.updatedEmployees.push(showEmployee.employee);
                    break;
                case Type.DELETE:
                    data.deletedEmployees.push(showEmployee.employee);
                    break;
            }
        });
        EmployeeAPI.syncEmployees(data).then(() => {
            handleClose();
            dispatch(hideIndicator());
            props.reloadList();
        });
    }

    return (
        <Dialog className="sync-employee-dialog" maxWidth="xl" fullWidth
                open={props.open} onClose={handleClose}>
            <IconButton className="close-btn" onClick={handleClose}>
                <Close/>
            </IconButton>
            <DialogTitle>
                Sync Employee of {props.group ? props.group.name : ''}
            </DialogTitle>
            <DialogContent>
                <Table stickyHeader>
                    <TableHead>
                        <TableRow>
                            <TableCell>
                                <Checkbox color="primary"
                                          indeterminate={selectedEmployees.length > 0 && selectedEmployees.length < shownEmployees.length}
                                          checked={shownEmployees.length > 0 && selectedEmployees.length === shownEmployees.length}
                                          onChange={onSelectAllClick}/>
                            </TableCell>
                            <TableCell>NTID</TableCell>
                            <TableCell>Employee's ID</TableCell>
                            <TableCell>Full Name</TableCell>
                            <TableCell>Email</TableCell>
                            <TableCell>Status</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {shownEmployees.length > 0 ? shownEmployees.map(shownEmployee => {
                            const employee = shownEmployee.employee;
                            let oldEmp = null;
                            let className = '';
                            switch (shownEmployee.type) {
                                case Type.NEW:
                                    className = 'new-data';
                                    break;
                                case Type.UPDATE:
                                    className = 'update-data';
                                    oldEmp = props.currentEmployees.find(emp => emp.ntid.toLowerCase() === employee.ntid.toLowerCase());
                                    break;
                                case Type.DELETE:
                                    className = 'delete-data';
                                    break;
                            }
                            return (
                                <TableRow key={employee.ntid}>
                                    <TableCell>
                                        <Checkbox color="primary"
                                                  checked={isRowSelected(shownEmployee)}
                                                  onChange={event => onChangeSelectRow(event, shownEmployee)}/>
                                    </TableCell>
                                    <TableCell className={className}>
                                        {employee.ntid.toUpperCase()}
                                    </TableCell>
                                    <TableCell sx={{minWidth: 120}}>
                                        <span className={className}>{employee.employeeId}</span>
                                        <br/>
                                        <span>{oldEmp ? (oldEmp.employeeId === null ? '\u00A0' : oldEmp.employeeId) : null}</span>
                                    </TableCell>
                                    <TableCell sx={{minWidth: 230}}>
                                        <span className={className}>{employee.displayName}</span>
                                        <br/>
                                        <span>{oldEmp ? (oldEmp.displayName === null ? '\u00A0' : oldEmp.displayName) : null}</span>
                                    </TableCell>
                                    <TableCell sx={{minWidth: 340}}>
                                        <span className={className}>{employee.email}</span>
                                        <br/>
                                        <span>{oldEmp ? (oldEmp.email === null ? '\u00A0' : oldEmp.email) : null}</span>
                                    </TableCell>
                                    <TableCell>
                                        <span className={className}>
                                            {shownEmployee.type}
                                        </span>
                                    </TableCell>
                                </TableRow>
                            )
                        }) : (
                            <TableRow>
                                <TableCell className="no-data" align="center" colSpan={10}>
                                    Don't have any update
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </DialogContent>
            <DialogActions>
                <Button variant="contained" color="primary" onClick={handleSaveEmployees}>
                    Save
                </Button>
                <Button variant="contained" color="inherit" onClick={handleClose}>
                    Close
                </Button>
            </DialogActions>
        </Dialog>
    )
}

export default SyncEmployeeDialog;
