import "./SyncGroupDialog.scss";
import React, {Fragment, useEffect, useState} from "react";
import {
    Button,
    Checkbox,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    IconButton,
    Step,
    StepLabel,
    Stepper,
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableRow,
    Typography
} from "@mui/material";
import {Close} from "@mui/icons-material";
import {UnitApi, SyncUnitChildren} from "../../../api/unit.api";
import {Unit} from "../../../models/Unit";
import {Employee, OrgGroup} from "../../../api/external.api";
import {hideIndicator, showIndicator} from "../../../app/app.slice";
import {useAppDispatch} from "../../../custom-hooks/hook";

type SyncGroupDialogProps = {
    open: boolean;
    onClose: () => void;
    group: Unit;
    syncData: OrgGroup;
}

const steps = ["Group's Manager", "Group's Children"];

enum Type {
    NEW = 'NEW', UPDATE = 'UPDATE', DELETE = 'DELETE'
}

type ShowManager = {
    type: Type;
    manager: Employee;
}

type ShowGroup = {
    type: Type;
    group: OrgGroup | Unit;
}

function SyncGroupDialog(props: SyncGroupDialogProps) {
    const [activeStep, setActiveStep] = useState(0);
    const [shownManager, setShownManager] = useState<ShowManager | null>(null);
    const [shownGroups, setShownGroups] = useState<ShowGroup[]>([]);
    const [selectedGroups, setSelectedGroups] = useState<ShowGroup[]>([]);

    const dispatch = useAppDispatch();
    const checkNullAndCompareValue = (valueLdap: any, valueDatabase: any): boolean =>  {
        if (valueLdap === null && valueDatabase === null) {
            return true;
        }
        if ((valueDatabase === null && valueLdap !== null) || (valueDatabase !== null && valueLdap === null)) {
            return false;
        }
        return valueDatabase.toLowerCase() === valueLdap.toLowerCase();
    }


    useEffect(() => {
        setActiveStep(0);
        if (props.group && props.group.children && props.syncData) {
            // Handle manager
            const oldManager = props.group.manager;
            const newManager = props.syncData.manager;
            if (oldManager && newManager && !(checkNullAndCompareValue(newManager.ntid, oldManager.ntid) &&
                checkNullAndCompareValue(newManager.employeeId, oldManager.employeeId) &&
                checkNullAndCompareValue(newManager.email, oldManager.email)
            )) {
                setShownManager({type: Type.UPDATE, manager: newManager});
            }
            if (!oldManager && newManager) {
                setShownManager({type: Type.NEW, manager: newManager});
            } else if (!newManager && oldManager) {
                setShownManager({type: Type.DELETE, manager: oldManager});
            }
            // Handle children group
            const oldChildrenGroup = props.group.children;
            const newChildrenGroup = props.syncData.orgChildren;
            const _showGroups: ShowGroup[] = [];
            const deletedGroup = [...oldChildrenGroup];
            newChildrenGroup.forEach(group => {
                const index = deletedGroup.findIndex(_group => _group.name === group.name);
                if (index !== -1) {
                    if (group.description !== deletedGroup[index].description) {
                        _showGroups.push({type: Type.UPDATE, group});
                        deletedGroup.splice(index, 1);
                    }
                } else {
                    _showGroups.push({type: Type.NEW, group});
                }
            });
            deletedGroup.forEach(group => {
                const index = newChildrenGroup.findIndex(_group => _group.name === group.name);
                if (index === -1) {
                    _showGroups.push({type: Type.DELETE, group});
                }
            })
            setShownGroups(_showGroups);
        }
    }, [props]);

    const handleClose = (event?: object, reason?: string) => {
        if (reason !== "escapeKeyDown" && reason !== "backdropClick") {
            props.onClose();
            setActiveStep(0);
        }
    }

    const handleUpdateManager = () => {
        if (shownManager) {
            dispatch(showIndicator());
            const manager = {
                unitId: props.group.id,
                ntid: shownManager.manager.ntid,
                employeeId: shownManager.manager.employeeId,
                name: shownManager.manager.fullName,
                email: shownManager.manager.email
            }
            UnitApi.updateDirectManagerAPI(manager).then(() => {
                setActiveStep(1);
                dispatch(hideIndicator());
                props.group.manager = props.syncData.manager;
                setShownManager(null);
            });
        }
    }

    const handleUpdateGroupChildren = () => {
        if (shownGroups.length > 0) {
            dispatch(showIndicator());
            const data: SyncUnitChildren = {
                parentId: props.group.id!,
                newChildren: [],
                updatedChildren: [],
                deletedChildren: []
            }
            selectedGroups.forEach(showGroup => {
                const group = {
                    id: 0,
                    name: showGroup.group.name,
                    description: showGroup.group.description
                };
                switch (showGroup.type) {
                    case Type.NEW:
                        data.newChildren.push(group);
                        break;
                    case Type.UPDATE:
                        data.updatedChildren.push(group);
                        break;
                    case Type.DELETE:
                        group.id = (showGroup.group as Unit).id!;
                        data.deletedChildren.push(group);
                        break;
                }
            });
            UnitApi.syncUnitChildren(data).then(() => {
                handleClose();
                setSelectedGroups([]);
                dispatch(hideIndicator());
            });
        }
    }

    const showFooterButtons = () => {
        if (activeStep === 0) {
            return shownManager ? (
                <Fragment>
                    <Button variant="contained" color="inherit" onClick={() => setActiveStep(1)}>
                        Skip
                    </Button>
                    <Button variant="contained" color="primary" onClick={handleUpdateManager}>
                        Update
                    </Button>
                </Fragment>
            ) : (
                <Button variant="contained" color="primary" onClick={() => setActiveStep(1)}>
                    Next
                </Button>
            )
        }
        return (
            <Fragment>
                <Button variant="contained" color="inherit" onClick={() => setActiveStep(0)}>
                    Back
                </Button>
                {shownGroups.length > 0 ? (
                    <Button variant="contained" color="primary" onClick={handleUpdateGroupChildren}>
                        Update
                    </Button>
                ) : (
                    <Button variant="contained" color="inherit" onClick={handleClose}>
                        Close
                    </Button>
                )}
            </Fragment>
        )
    }

    return (
        <Dialog className="sync-dialog" open={props.open} onClose={handleClose}
                maxWidth="lg" fullWidth>
            <IconButton className="close-btn" onClick={handleClose}>
                <Close/>
            </IconButton>
            <DialogTitle>
                Sync Unit: {props.group?.name}
            </DialogTitle>
            <DialogContent>
                <Stepper activeStep={activeStep}>
                    {steps.map((step) =>
                        <Step key={step}>
                            <StepLabel>{step}</StepLabel>
                        </Step>
                    )}
                </Stepper>
                {activeStep === 0 ? (
                    <ManagerTab showManager={shownManager} currentGroup={props.group}/>
                ) : (
                    <SubGroupTab showGroups={shownGroups} selectedGroups={selectedGroups} setSelectedGroups={setSelectedGroups}
                                 currentGroup={props.group} syncData={props.syncData}/>
                )}
            </DialogContent>
            <DialogActions>
                {showFooterButtons()}
            </DialogActions>
        </Dialog>
    )
}

export default SyncGroupDialog;

function ManagerTab(props: {showManager: ShowManager | null; currentGroup: Unit}) {

    let oldManager = null;
    let className = '';
    if (props.showManager) {
        switch (props.showManager.type) {
            case Type.NEW:
                className = 'new-data';
                break;
            case Type.UPDATE:
                className = 'update-data';
                oldManager = props.currentGroup.manager;
                break;
            case Type.DELETE:
                className = 'delete-data';
                break;
        }
    }

    return (
        props.showManager ? (
            <Table>
                <TableHead>
                    <TableRow>
                        <TableCell>NTID</TableCell>
                        <TableCell>Employee's ID</TableCell>
                        <TableCell>Name</TableCell>
                        <TableCell>Email</TableCell>
                        <TableCell>Type</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    <TableRow>
                        <TableCell className={className}>
                            {props.showManager.manager.ntid.toUpperCase()}
                        </TableCell>
                        <TableCell>
                            <span className={className}>{props.showManager.manager.employeeId}</span>
                            <br/>
                            <span>{oldManager ? (oldManager.employeeId === null ? '\u00A0' : oldManager.employeeId) : null}</span>
                             {/* \u00A0 will create empty line on this column if data is null */}
                        </TableCell>
                        <TableCell>
                            <span className={className}>{props.showManager.manager.fullName}</span>
                            <br/>
                            <span>{oldManager ? (oldManager.fullName === null ? '\u00A0' : oldManager.fullName) : null}</span>
                        </TableCell>
                        <TableCell>
                            <span className={className}>{props.showManager.manager.email}</span>
                            <br/>
                            <span>{oldManager ? (oldManager.email === null ? '\u00A0' : oldManager.email) : null}</span>
                        </TableCell>
                        <TableCell className={className}>
                            {props.showManager.type}
                        </TableCell>
                    </TableRow>
                </TableBody>
            </Table>
        ) : (
            <Typography variant="subtitle1" className="no-data">
                Don't have any update about manager
            </Typography>
        )
    )
}

function SubGroupTab(props: {
    showGroups: ShowGroup[]; selectedGroups: ShowGroup[]; setSelectedGroups: (groups: ShowGroup[]) => void;
    currentGroup: Unit; syncData: OrgGroup
}) {

    const onSelectAllClick = (event: React.ChangeEvent<HTMLInputElement>) => {
        if (event.target.checked) {
            props.setSelectedGroups(props.showGroups);
            return;
        }
        props.setSelectedGroups([]);
    }

    const isRowSelected = (showGroup: ShowGroup) => {
        return props.selectedGroups.findIndex(g => g.group.name === showGroup.group.name) !== -1;
    }

    const onChangeSelectRow = (event: React.ChangeEvent<HTMLInputElement>, showGroup: ShowGroup) => {
        if (event.target.checked) {
            const newSelected = [...props.selectedGroups, showGroup];
            props.setSelectedGroups(newSelected);
            return;
        }
        const newSelected = [...props.selectedGroups];
        newSelected.splice(props.selectedGroups.findIndex(g => g.group.name === showGroup.group.name), 1);
        props.setSelectedGroups(newSelected);
    }

    return (
        props.showGroups.length > 0 ? (
            <Table>
                <TableHead>
                    <TableRow>
                        <TableCell>
                            <Checkbox color="primary"
                                      indeterminate={props.selectedGroups.length > 0 && props.selectedGroups.length < props.showGroups.length}
                                      checked={props.showGroups.length > 0 && props.selectedGroups.length === props.showGroups.length}
                                      onChange={onSelectAllClick}/>
                        </TableCell>
                        <TableCell>Name</TableCell>
                        <TableCell>Description</TableCell>
                        <TableCell>Type</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {props.showGroups.map(shownGroup => {
                        const group = shownGroup.group;
                        let oldGroup = null;
                        let className = '';
                        switch (shownGroup.type) {
                            case Type.NEW:
                                className = 'new-data';
                                break;
                            case Type.UPDATE:
                                className = 'update-data';
                                oldGroup = props.currentGroup.children.find(_group => _group.name === group.name);
                                break;
                            case Type.DELETE:
                                className = 'delete-data';
                                break;
                        }
                        return (
                            <TableRow key={group.name}>
                                <TableCell>
                                    <Checkbox color="primary"
                                              checked={isRowSelected(shownGroup)}
                                              onChange={event => onChangeSelectRow(event, shownGroup)}/>
                                </TableCell>
                                <TableCell className={className}>
                                    {group.name}
                                </TableCell>
                                <TableCell sx={{minWidth: 120}}>
                                    <span className={className}>{group.description}</span>
                                    <br/>
                                    <span>{oldGroup ? oldGroup.description : null}</span>
                                </TableCell>
                                <TableCell>
                                    <span className={className}>
                                        {shownGroup.type}
                                    </span>
                                </TableCell>
                            </TableRow>
                        )
                    })}
                </TableBody>
            </Table>
        ) : (
            <Typography variant="subtitle1" className="no-data">
                Don't have any update about sub-unit
            </Typography>
        )
    )
}
