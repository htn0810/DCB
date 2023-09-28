import "./GroupMgmtComponent.scss";
import React, {Fragment, useEffect, useState} from "react";
import {
    Autocomplete,
    Button,
    CircularProgress,
    Grid,
    Tab,
    Tabs,
    TextField,
    Toolbar, Tooltip,
    Typography
} from "@mui/material";
import { HourglassTop, KeyboardArrowRight, Sync} from "@mui/icons-material";
import Snackbar from '@mui/material/Snackbar';
import Stack from '@mui/material/Stack';
import MuiAlert, { AlertProps } from '@mui/material/Alert';
// API
import {ExternalApi, OrgGroup} from "../../api/external.api";
import {UnitApi} from "../../api/unit.api";
import {EmployeeAPI} from "../../api/employee.api";
// Models & Constants
import {Employee} from "../../models/Employee";
import {Unit} from "../../models/Unit";
// Component
import SyncGroupDialog from "./sync-group-dialog/SyncGroupDialog";
import SyncEmployeeDialog from "./sync-employee-dialog/SyncEmployeeDialog";
import UnitTable from "./unit-table/UnitTable";
import EmployeeTable from "./employee-table/EmployeeTable";
import {useAppDispatch, useAppSelector} from "../../custom-hooks/hook";
import {hideIndicator, showIndicator} from "../../app/app.slice";

enum Table {
    GROUP,
    EMPLOYEE
}

const BREADCRUMB = 'breadcrumb';
const CURRENT_GROUP = 'currentGroup';

function GroupMgmtComponent() {
    const [breadcrumb, setBreadcrumb] = useState<Unit[]>([]);
    const [groups, setGroups] = useState<Unit[]>([]);
    const [groupNames, setGroupNames] = useState<string[]>([]);
    const [autoCompleteLoading, setAutoCompleteLoading] = useState(false);
    const [searchGroup, setSearchGroup] = useState('');
    const [employees, setEmployees] = useState<Employee[]>([]);
    const [selectedGroup, setSelectedGroup] = useState<Unit | null>(null);
    const [tableShown, setTableShown] = useState(Table.GROUP);
    // Sync Dialog
    const [syncGroupDialogOpened, setSyncGroupDialogOpened] = useState(false);
    const [syncGroupData, setSyncGroupData] = useState<OrgGroup | null>(null);
    const [syncEmpDialogOpened, setSyncEmpDialogOpened] = useState(false);
    const [syncEmpData, setSyncEmpData] = useState<Employee[] | null>(null);

    const [syncUpTotalCountEmployee, setSyncUpTotalCountEmployee] = useState<number | undefined>(selectedGroup?.totalEmployeesOfEachLevel);
    const [syncUpFixedtermCountEmployee, setSyncUpFixedtermCountEmployee] = useState<number | undefined>(selectedGroup?.fixedtermEmployeesCount);
    const [syncUpExternalCountEmployee, setSyncUpExternalCountEmployee] = useState<number | undefined>(selectedGroup?.externalEmployeesCount);
    const [syncUpInternalCountEmployee, setSyncUpInternalCountEmployee] = useState<number | undefined>(selectedGroup?.internalEmployeesCount);

    const [openSnackbars, setOpenSnackbars] = useState<boolean>(false);
    let [syncUpDate, setSyncUpDate] = useState<string | undefined>(selectedGroup?.lastSynchronizedSubUnitsDate);
    let colorOfSyncUpDate = '#71767C'; //light-grey color for 'unknown' value of syncUpDate

    const account = useAppSelector(state => state.account);
    const dispatch = useAppDispatch();

    useEffect(() => {
        dispatch(showIndicator());
        setBreadcrumb(JSON.parse(sessionStorage.getItem(BREADCRUMB) || '[]') as Unit[]);
        setSelectedGroup(JSON.parse(sessionStorage.getItem(CURRENT_GROUP)!) as Unit | null);
        setSyncUpDate(selectedGroup?.lastSynchronizedSubUnitsDate);

        setSyncUpTotalCountEmployee(selectedGroup?.totalEmployeesOfEachLevel)
        setSyncUpFixedtermCountEmployee(selectedGroup?.fixedtermEmployeesCount)
        setSyncUpExternalCountEmployee(selectedGroup?.externalEmployeesCount)
        setSyncUpInternalCountEmployee(selectedGroup?.internalEmployeesCount)

        if (!sessionStorage.getItem(CURRENT_GROUP) || sessionStorage.getItem(CURRENT_GROUP) === 'null') {
            UnitApi.getAllUnits({orgId: 1}).then(res => {
                setGroups(res);
                dispatch(hideIndicator());
            });
        }
    }, [account, selectedGroup?.lastSynchronizedSubUnitsDate]);

    useEffect(() => {
        loadGroups();
        loadEmployees();
    }, [selectedGroup]);

    const loadBreadcrumb = () => {
        if (selectedGroup) {
            dispatch(showIndicator());
            UnitApi.getUnitById(selectedGroup.id!, false).then(res => {
                updateSelectedGroup(res);

                setSyncUpTotalCountEmployee(res?.totalEmployeesOfEachLevel)
                setSyncUpFixedtermCountEmployee(res?.fixedtermEmployeesCount)
                setSyncUpExternalCountEmployee(res?.externalEmployeesCount)
                setSyncUpInternalCountEmployee(res?.internalEmployeesCount)

                if (tableShown === Table.GROUP || tableShown === undefined) {
                    setSyncUpDate(res.lastSynchronizedSubUnitsDate);
                } else {
                    setSyncUpDate(res.lastSynchronizedEmployeesDate);
                }
                dispatch(hideIndicator());
            })
        }
    }

    const loadGroups = () => {
        if (selectedGroup) {
            dispatch(showIndicator());
            UnitApi.getAllUnits({parentId: selectedGroup.id}).then(res => {
                setGroups(res);
                dispatch(hideIndicator());
            });
        }
    }

    const loadEmployees = () => {
        if (selectedGroup) {
            dispatch(showIndicator());
            EmployeeAPI.getEmployeesByUnitId(selectedGroup.id!).then(res => {
                setEmployees(res);
                dispatch(hideIndicator());
            });
        }
    }

    const onInputGroupChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setSearchGroup(event.target.value);
        if (event.target.value.length > 1) {
            setAutoCompleteLoading(true);
            UnitApi.searchUnitsByUnitName(event.target.value).then(res => {
                setGroupNames(res);
                setAutoCompleteLoading(false);
                dispatch(hideIndicator());
            })
        }
    }

    const onSelectGroup = (groupName: string | null) => {
        if (groupName) {
            dispatch(showIndicator());
            getAllGroups_API(groupName);
        } else {
            dispatch(showIndicator());
            setGroupNames([]);
            setSelectedGroup(null)
            updateBreadcrumb([]);
            setTableShown(Table.GROUP);
            UnitApi.getAllUnits({orgId: 1}).then(res => {
                setGroups(res);
                dispatch(hideIndicator());
            });
        }
    }

    const onPressEnter = (event: React.KeyboardEvent) => {
        if (event.key === 'Enter') {
            dispatch(showIndicator());
            getAllGroups_API(searchGroup);
        }
    }

    const getAllGroups_API = (param: string | undefined) => {
        UnitApi.getAllUnits({name: param}).then(res => {
            if (res && res.length > 0) {
                const group = res[0];
                setSelectedGroup(group);
                UnitApi.getAllParentGroupsByGroupId(group.id!).then(res1 => {
                    if (res1 && res1.length > 0) {
                        const parents = [...res1].reverse();
                        updateBreadcrumb([...parents, group]);
                    }
                })
            }
        })
    }

    const updateBreadcrumb = (breadcrumb: Unit[]) => {
        setBreadcrumb(breadcrumb);
        sessionStorage.setItem(BREADCRUMB, JSON.stringify(breadcrumb));
    }

    const updateSelectedGroup = (selectedGroup: Unit | null) => {
        setSelectedGroup(selectedGroup);
        // Call Api to update some property: last_synchronized or totalcCount...
        UnitApi.getUnitById(selectedGroup?.id!).then(res => {
            setSyncUpDate(tableShown === Table.GROUP ? res?.lastSynchronizedSubUnitsDate : res?.lastSynchronizedEmployeesDate);

            setSyncUpTotalCountEmployee(res?.totalEmployeesOfEachLevel);
            setSyncUpFixedtermCountEmployee(res?.fixedtermEmployeesCount)
            setSyncUpExternalCountEmployee(res?.externalEmployeesCount)
            setSyncUpInternalCountEmployee(res?.internalEmployeesCount)
        });
        sessionStorage.setItem(CURRENT_GROUP, JSON.stringify(selectedGroup));
    }

    const handleBackToRootGroup = () => {
        dispatch(showIndicator());
        updateBreadcrumb([]);
        updateSelectedGroup(null);
        setTableShown(Table.GROUP);
        UnitApi.getAllUnits({orgId: 1}).then(res => {
            setGroups(res);
            dispatch(hideIndicator());
        });
    }

    const handleBackToRandomGroup = (group: Unit, index: number) => {
        dispatch(showIndicator());
        updateBreadcrumb(breadcrumb.slice(0, index + 1));
        updateSelectedGroup(group);
        setTableShown(Table.GROUP);
        UnitApi.getAllUnits({parentId: group.id}).then(res => {
            setGroups(res);
            dispatch(hideIndicator());
        });
    }

    const handleSyncData = () => {
        if (selectedGroup) {
            dispatch(showIndicator());
            ExternalApi.syncOrganization(selectedGroup.name).then(orgGroup => {
                if (tableShown === Table.GROUP) {
                    // Synchronize groups
                    setSyncGroupData(orgGroup);
                    UnitApi.getUnitById(selectedGroup.id!, true).then(res => {
                        setSelectedGroup(res);
                        setSyncGroupDialogOpened(true);
                        setSyncUpDate(res.lastSynchronizedSubUnitsDate);
                        dispatch(hideIndicator());
                    })
                } else {
                    // Synchronize employees
                    const employees: Employee[] = [];
                    ExternalApi.syncEmployees(selectedGroup.name).then(res => {
                        res && res.forEach(employee => {
                            const index = orgGroup.employees?.findIndex(emp => emp.ntid.toLowerCase() === employee.ntid.toLowerCase());
                            const employeeId = orgGroup.employees && index !== -1 ? orgGroup.employees[index].employeeId : null;
                            employees.push({
                                ntid: employee.ntid.toUpperCase(),
                                employeeId,
                                firstName: employee.firstName,
                                lastName: employee.lastName,
                                displayName: employee.displayName,
                                email: employee.email,
                                createdDate: employee?.createdDate,
                                lastModifiedDate: employee?.lastModifiedDate
                            });
                        });
                        setSyncEmpData(employees);
                        setSyncEmpDialogOpened(true);
                        setSyncUpDate(selectedGroup.lastSynchronizedEmployeesDate);
                        dispatch(hideIndicator());
                    });
                }
            });
        }
    };

    const onCloseSyncGroupDialog = () => {
        setSyncGroupDialogOpened(false);
        loadBreadcrumb();
        UnitApi.getAllUnits({parentId: selectedGroup!.id}).then(res => {
            setGroups(res);
        });
    }

    const onCloseSyncEmpDialog = () => {
        setSyncEmpDialogOpened(false);
        loadBreadcrumb();
        EmployeeAPI.getEmployeesByUnitId(selectedGroup!.id!).then(res => {
            setEmployees(res);
        })
    }

    const handleViewGroupChildren = (group: Unit) => {
        updateBreadcrumb([...breadcrumb, group]);
        updateSelectedGroup(group);
        setSyncUpDate(group.lastSynchronizedSubUnitsDate);
        UnitApi.getAllUnits({parentId: group.id}).then(res => {
            setGroups(res);
        });
    }

    const handleViewGroupEmployees = (group: Unit) => {
        updateBreadcrumb([...breadcrumb, group]);
        updateSelectedGroup(group);
        setSyncUpDate(group.lastSynchronizedEmployeesDate);
        EmployeeAPI.getEmployeesByUnitId(group.id!).then(res => {
            setEmployees(res);
            setTableShown(Table.EMPLOYEE);
        })
    }

    const onChangeTab = (event: React.SyntheticEvent, value: Table) => {
        if (value === Table.EMPLOYEE) {
            setSyncUpDate(selectedGroup!.lastSynchronizedEmployeesDate);
        } else {
            setSyncUpDate(selectedGroup!.lastSynchronizedSubUnitsDate);
        }
        setTableShown(value);
    }

    const calculateDistanceDayBetweenTwoTimes = (syncUpDate: string | undefined) => {
        let dayCountBetweenTwoTimes = Math.ceil((new Date().getTime() - new Date(syncUpDate!.slice(0, 10)).getTime()) / (1000 * 3600 * 24));

        if (dayCountBetweenTwoTimes <= 15) {
            colorOfSyncUpDate = '#00884A';
            return 'Valid (<= 15 days)';
        }

        colorOfSyncUpDate = '#ED0007';
        return 'Expired (> 15 days)';
    }

    const onDisplayLastSynchronizeDate = (group: Unit) => {
        //Show when selected-Group is not in the last layer of current branch (related on Organization Tree)
        //OR selected-Group is in the last layer of current branch, but selected-tab is Employee tab, not Sub-group tab
        if (groups.length > 0 || (groups.length <= 0 && tableShown === Table.EMPLOYEE)) {
            syncUpDate = syncUpDate?.slice(0, 19);
            
            return (
                <div>
                    {group.name} (Total Employees: {syncUpTotalCountEmployee};  Internal: {syncUpInternalCountEmployee};  External: {syncUpExternalCountEmployee};  Fixed-term: {syncUpFixedtermCountEmployee})
                    <div style={{color: "#43464A", display: "flex"}}>last synchronized: 
                        <span style={{paddingLeft: '5px'}}>
                            {syncUpDate !== 'unknown' && syncUpDate !== undefined
                                ? (
                                    <Tooltip title={calculateDistanceDayBetweenTwoTimes(syncUpDate)}>
                                         <div style={{color: colorOfSyncUpDate}}>{syncUpDate!.replace('T', ' at ')}</div>
                                    </Tooltip>
                                )
                                : <div style={{color: colorOfSyncUpDate}}>{syncUpDate}</div>
                            }
                        </span>
                    </div>
                </div>
            )
        }

        //not show synchronize date for Sub-group tab because selected-Group is in the last layer of current branch
        //it means this Group doesn't have sub-groups
        // return <div>{group.name} ({syncUpTotalCountEmployee} employees )</div>
        return <div>{group.name} (Total Employees: {syncUpTotalCountEmployee};  Internal: {syncUpInternalCountEmployee};  External: {syncUpExternalCountEmployee};  Fixed-term: {syncUpFixedtermCountEmployee})</div>
    }

    const handleShowSnackbars = () => {
            dispatch(showIndicator());
            setTimeout(() => { dispatch(hideIndicator()) }, 1500);
            setOpenSnackbars(true);
        };

    const Alert = React.forwardRef<HTMLDivElement, AlertProps>(function Alert(props,ref,) {
        return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
    });

    const SnackbarsSyncCount = () => {
        const handleClose = (event?: React.SyntheticEvent | Event, reason?: string) => {
            if (reason === 'clickaway') {
                return;
            }
            setOpenSnackbars(false);
        };

        return (
        <Stack spacing={2} sx={{ width: '100%' }}>
            <Snackbar anchorOrigin={{ vertical : "top", horizontal: "center" }} open={openSnackbars} autoHideDuration={5000} onClose={handleClose}>
                <Alert onClose={handleClose} severity="success" sx={{ width: '100%', textAlign: 'center' }}>
                    System is counting employees, please turn back to update number after 5 minutes!
                </Alert>
            </Snackbar>
        </Stack>
    );
}

    return (
        <section className="group-mgmt-container">
            <Toolbar className="toolbar">
                <Typography variant="h6" style={{flexGrow: 1}}>
                    Unit Management
                </Typography>
                <Autocomplete options={groupNames} clearOnBlur={false}
                              loading={autoCompleteLoading}
                              onChange={(event, value) => onSelectGroup(value)}
                              renderInput={params =>
                                  <TextField {...params} className="group-text-field" label="Unit's Name"
                                             value={searchGroup}
                                             onChange={onInputGroupChange}
                                             onKeyDown={onPressEnter}
                                             InputProps={{
                                                 ...params.InputProps,
                                                 endAdornment: autoCompleteLoading ?
                                                     <CircularProgress color="inherit" size={20}/> : null
                                             }}
                                  />}
                />
                {breadcrumb.length > 0
                    ? (<Fragment>
                            <Button color="inherit" startIcon={<Sync />} onClick={handleSyncData}>Sync Data</Button>
                            <Tooltip title={"Sync total number employees"}>
                                <Button color="inherit" startIcon={<HourglassTop/>} onClick={handleShowSnackbars}>Sync Count</Button>
                            </Tooltip>
                        </Fragment>)
                    : null
                }
            </Toolbar>

            <Grid container sx={{marginBottom: "1rem"}}>
                <Grid item xs={9} className="group-breadcrumb">
                    <Typography variant="subtitle2" className={breadcrumb.length > 0 ? 'hovered' : ''}
                                onClick={handleBackToRootGroup}>
                        Bosch Global Software Vietnam
                    </Typography>
                    {breadcrumb.map((group, index) =>
                        <Fragment key={group.name}>
                            <KeyboardArrowRight/>
                            <Typography variant="subtitle2" className={index !== breadcrumb.length - 1 ? 'hovered' : ''}
                                        onClick={() => index !== breadcrumb.length - 1 ? handleBackToRandomGroup(group, index) : null}>
                                <div>
                                    {index === breadcrumb.length - 1   //only show for the last index of breadcrumb (selected-Group)
                                        ? onDisplayLastSynchronizeDate(group)
                                        : group.name
                                    }
                                </div>
                            </Typography>
                        </Fragment>
                    )}
                </Grid>

                <Grid item xs={3} className="group-tab">
                    {breadcrumb.length > 0
                        ? (
                            <Tabs value={tableShown} onChange={onChangeTab}>
                                <Tab label="Sub-unit" value={Table.GROUP}/>
                                <Tab label="Employee" value={Table.EMPLOYEE}/>
                            </Tabs>
                        )
                        : null
                    }
                </Grid>
            </Grid>

            <SnackbarsSyncCount />
            {/* Table */}
            {tableShown === Table.GROUP
                ? <UnitTable group={selectedGroup!} groups={groups} reloadGroups={loadGroups}
                             viewChildren={handleViewGroupChildren} viewEmployees={handleViewGroupEmployees}/>
                : <EmployeeTable employees={employees} reloadEmployees={loadEmployees}/>
            }

            {/* Dialog */}
            <SyncGroupDialog open={syncGroupDialogOpened} onClose={onCloseSyncGroupDialog} group={selectedGroup!} syncData={syncGroupData!}/>
            <SyncEmployeeDialog open={syncEmpDialogOpened} onClose={onCloseSyncEmpDialog} group={selectedGroup!} syncData={syncEmpData!}
                                currentEmployees={employees} reloadList={loadEmployees}/>
        </section>
    );
}

export default GroupMgmtComponent;
