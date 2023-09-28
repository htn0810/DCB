import "./OrgMgmtDialog.scss";
import React, {Fragment, useEffect, useState} from "react";
import {
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    Grid,
    IconButton,
    Tab,
    Tabs,
    TextField,
    Typography
} from "@mui/material";
import {Add, Close, Delete, Person, Widgets} from "@mui/icons-material";
import {hideIndicator, showIndicator} from "../../../app/app.slice";
import {useAppDispatch} from "../../../custom-hooks/hook";
// API
import {OrganizationApi} from "../../../api/organization.api";
import {EmployeeAPI} from "../../../api/employee.api";
import {UnitApi} from "../../../api/unit.api";
import {AssetApi} from "../../../api/asset.api";
// Models
import {Organization} from "../../../models/Organization";
import {Employee} from "../../../models/Employee";
import {Unit} from "../../../models/Unit";
import {Asset} from "../../../models/Asset";

const TABS = ["Basics", "Digital Assets", "Units", "Employees", "Review + create"];

type Props = {
    open: boolean;
    onClose: () => void;
    loadPage: () => void;
    organization: Organization | null;
}

type Input = {
    name: string;
    description: string;
    orgUrl: string;
    ownerSearch: string;
    unitSearch: string;
    assetSearch: string;
    employeeSearch: string;
}

function OrgMgmtDialog(props: Props) {
    const [activeTab, setActiveTab] = useState(TABS[0]);
    const [activeTabIndex, setActiveTabIndex] = useState(0);
    const [inputs, setInputs] = useState({} as Input);
    const [searchedOwners, setSearchedOwners] = useState<Employee[]>([]);
    const [selectedOwners, setSelectedOwners] = useState<Employee[]>([]);
    const [searchedAssets, setSearchedAssets] = useState<Asset[]>([]);
    const [selectedAssets, setSelectedAssets] = useState<Asset[]>([]);
    const [searchedUnits, setSearchedUnits] = useState<Unit[]>([]);
    const [selectedUnits, setSelectedUnits] = useState<Unit[]>([]);
    const [searchedEmployees, setSearchedEmployees] = useState<Employee[]>([]);
    const [selectedEmployees, setSelectedEmployees] = useState<Employee[]>([]);
    const [reviewed, setReviewed] = useState(false);

    const dispatch = useAppDispatch();

    useEffect(() => {
        if (props.organization) {
            dispatch(showIndicator());
            setInputs({
                name: props.organization.name,
                description: props.organization.description,
                orgUrl: props.organization.orgUrl,
                ownerSearch: '',
                unitSearch: '',
                assetSearch: '',
                employeeSearch: ''
            });
            setSelectedOwners(props.organization.owners);
            AssetApi.getAllAssets({orgId: props.organization.id}).then(res => {
                if (res) {
                    setSelectedAssets(res);
                    dispatch(hideIndicator());
                }
            })
            UnitApi.getAllUnits({orgId: props.organization.id}).then(res => {
                if (res) {
                    setSelectedUnits(res);
                }
            })
            EmployeeAPI.getEmployeesByOrgId(props.organization.id!).then(res => {
                if (res) {
                    setSelectedEmployees(res);
                }
            })
        }
    }, [props]);

    useEffect(() => {
        if (activeTabIndex === TABS.length - 1) {
            setReviewed(true);
        }
    }, [activeTabIndex]);

    const onClose = () => {
        setActiveTab(TABS[0]);
        setActiveTabIndex(0);
        setInputs({} as Input);
        setSearchedOwners([]);
        setSelectedOwners([]);
        setSearchedAssets([]);
        setSelectedAssets([]);
        setSearchedUnits([]);
        setSelectedUnits([]);
        setSearchedEmployees([])
        setSelectedEmployees([]);
        setReviewed(false);
        props.onClose();
    }

    const onTabChange = (_event: React.SyntheticEvent, newValue: string) => {
        setActiveTab(newValue);
        setActiveTabIndex(TABS.indexOf(newValue));
    }

    const handleNextTab = () => {
        const newIndex = activeTabIndex + 1;
        setActiveTab(TABS[newIndex]);
        setActiveTabIndex(newIndex);
    }

    const handlePreviousTab = () => {
        const newIndex = activeTabIndex - 1;
        setActiveTab(TABS[newIndex]);
        setActiveTabIndex(newIndex);
    }

    const handleReview = () => {
        setActiveTab(TABS[TABS.length - 1]);
        setActiveTabIndex(TABS.length - 1);
    }

    const isBasicValid = (): boolean => {
        return reviewed && inputs.name !== '' && selectedOwners.length > 0;
    }

    const onInputChange = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setInputs(state => ({...state, [event.target.name]: event.target.value}));
    }

    // Owner
    const onChangeSearchOwner = (event: React.ChangeEvent<HTMLInputElement>) => {
        setInputs(state => ({...state, ownerSearch: event.target.value}));
        EmployeeAPI.getEmployees({employeeName: event.target.value, page: 0, size: 20}).then(res => {
            if (res.data) {
                setSearchedOwners(res.data);
            }
        }).catch(e => {
            console.error(e)
        });
    }

    const handleSelectOwner = (employee: Employee) => {
        const owners = [...selectedOwners];
        const index = selectedOwners.findIndex(emp => emp.ntid === employee.ntid);
        if (index === -1) {
            owners.push(employee);
            setSelectedOwners(owners)
        }
    }

    const handleRemoveOwner = (owner: Employee) => {
        const owners = [...selectedOwners];
        const index = selectedOwners.findIndex(emp => emp.ntid === owner.ntid);
        if (index !== -1) {
            owners.splice(index, 1);
            setSelectedOwners(owners)
        }
    }

    // Unit
    const onChangeSearchUnit = (event: React.ChangeEvent<HTMLInputElement>) => {
        setInputs(state => ({...state, unitSearch: event.target.value}));
        UnitApi.getAllUnits({name: event.target.value}).then(res => {
            if (res) {
                setSearchedUnits(res);
            }
        }).catch(e => {
            console.error(e)
        });
    }

    const handleSelectUnit = (unit: Unit) => {
        const units = [...selectedUnits];
        const index = selectedUnits.findIndex(uni => uni.name === unit.name);
        if (index === -1) {
            units.push(unit);
            setSelectedUnits(units)
        }
    }

    const handleRemoveUnit = (unit: Unit) => {
        const units = [...selectedUnits];
        const index = selectedUnits.findIndex(uni => uni.name === unit.name);
        if (index !== -1) {
            units.splice(index, 1);
            setSelectedUnits(units)
        }
    }

    // Asset
    const onChangeSearchAsset = (event: React.ChangeEvent<HTMLInputElement>) => {
        setInputs(state => ({...state, assetSearch: event.target.value}));
        AssetApi.getAllAssets({name: event.target.value}).then(res => {
            if (res) {
                setSearchedAssets(res);
            }
        }).catch(e => {
            console.error(e)
        });
    }

    const handleSelectAsset = (asset: Asset) => {
        const assets = [...selectedAssets];
        const index = selectedAssets.findIndex(ast => ast.name === asset.name);
        if (index === -1) {
            assets.push(asset);
            setSelectedAssets(assets)
        }
    }

    const handleRemoveAsset = (asset: Asset) => {
        const assets = [...selectedAssets];
        const index = selectedAssets.findIndex(ast => ast.name === asset.name);
        if (index !== -1) {
            assets.splice(index, 1);
            setSelectedAssets(assets)
        }
    }

    // Employee
    const onChangeSearchEmployee = (event: React.ChangeEvent<HTMLInputElement>) => {
        setInputs(state => ({...state, employeeSearch: event.target.value}));
        EmployeeAPI.getEmployees({employeeName: event.target.value, page: 0, size: 20}).then(res => {
            if (res.data) {
                setSearchedEmployees(res.data);
            }
        }).catch(e => {
            console.error(e)
        });
    }

    const handleSelectEmployee = (employee: Employee) => {
        const employees = [...selectedEmployees];
        const index = selectedEmployees.findIndex(emp => emp.ntid === employee.ntid);
        if (index === -1) {
            employees.push(employee);
            setSelectedEmployees(employees)
        }
    }

    const handleRemoveEmployee = (owner: Employee) => {
        const employees = [...selectedEmployees];
        const index = selectedEmployees.findIndex(emp => emp.ntid === owner.ntid);
        if (index !== -1) {
            employees.splice(index, 1);
            setSelectedEmployees(employees)
        }
    }

    const handleSave = () => {
        dispatch(showIndicator());
        const organization: Organization = {
            name: inputs.name,
            description: inputs.description,
            orgUrl: inputs.orgUrl,
            owners: selectedOwners,
            units: selectedUnits,
            assets: selectedAssets,
            employees: selectedEmployees
        }
        if (props.organization) {
            organization.id = props.organization.id;
            OrganizationApi.updateOrganization(organization).then(() => {
                onClose();
                props.loadPage();
            }).catch(e => {
                console.error(e)
            });
        } else {
            OrganizationApi.createOrganization(organization).then(() => {
                onClose();
                props.loadPage();
            }).catch(e => {
                console.error(e)
            });
        }
    };

    const renderTab = () => {
        switch (activeTabIndex) {
            case 0:
                return (
                    <Fragment>
                        <Typography variant="h6">
                            Details
                        </Typography>
                        {/* Name */}
                        <TextField autoComplete="off" required fullWidth
                                   name="name" label="Name"
                                   value={inputs.name || ''}
                                   onChange={onInputChange}/>
                        {(reviewed && (!inputs.name || inputs.name === '')) &&
                            <div className="invalid-message">Please input organization's name!</div>
                        }

                        {/* Description */}
                        <TextField autoComplete="off" fullWidth multiline maxRows={3}
                                   name="description" label="Description"
                                   value={inputs.description || ''}
                                   onChange={onInputChange}/>

                        {/* Owners */}
                        <Typography variant="h6">
                            Owners *
                        </Typography>
                        {selectedOwners.length > 0 ? selectedOwners.map(owner =>
                            <div className="owners" key={owner.id}>
                                <div className="left-wrapper">
                                    <Person className="person-icon"/>
                                    <div className="emp-name">{owner.displayName}</div>
                                </div>
                                <IconButton color="error" onClick={() => handleRemoveOwner(owner)}>
                                    <Delete/>
                                </IconButton>
                            </div>
                        ) : (
                            reviewed ? (
                                <div className="invalid-message">Please select owner(s) of organization!</div>
                            ) : (
                                <div className="no-data-text">There is no selected owner</div>
                            )
                        )}

                        <Typography variant="subtitle1">
                            Search
                        </Typography>
                        <TextField autoComplete="off" fullWidth
                                   name="search" label="Find owner by name"
                                   value={inputs.ownerSearch || ''}
                                   onChange={onChangeSearchOwner}/>
                        {searchedOwners.map(owner =>
                            <div className="search-emp" key={owner.id}>
                                <div className="left-wrapper">
                                    <Person className="person-icon"/>
                                    <div className="emp-name">{owner.displayName}</div>
                                </div>
                                <IconButton color="primary" onClick={() => handleSelectOwner(owner)}>
                                    <Add/>
                                </IconButton>
                            </div>
                        )}
                    </Fragment>
                )
            case 1:
                return (
                    <Fragment>
                        {/* Digital Asset */}
                        <Typography variant="h6">
                            Digital Assets
                        </Typography>
                        {selectedAssets.length > 0 ? selectedAssets.map(asset =>
                            <div className="asset" key={asset.id}>
                                <div className="left-wrapper">
                                    <Widgets className="app-icon"/>
                                    <div className="emp-name">{asset.name}</div>
                                </div>
                                <IconButton color="error" onClick={() => handleRemoveAsset(asset)}>
                                    <Delete/>
                                </IconButton>
                            </div>
                        ) : (
                            <div className="no-data-text">There is no selected asset</div>
                        )}
                        <Typography variant="subtitle1">
                            Search
                        </Typography>
                        <TextField autoComplete="off" fullWidth
                                   name="search" label="Find asset by name"
                                   value={inputs.assetSearch || ''}
                                   onChange={onChangeSearchAsset}/>
                        {searchedAssets.map(asset =>
                            <div className="search-emp" key={asset.id}>
                                <div className="left-wrapper">
                                    <Widgets className="app-icon"/>
                                    <div className="emp-name">{asset.name}</div>
                                </div>
                                <IconButton color="primary" onClick={() => handleSelectAsset(asset)}>
                                    <Add/>
                                </IconButton>
                            </div>
                        )}
                    </Fragment>
                )
            case 2:
                return (
                    <Fragment>
                        {/* Unit */}
                        <Typography variant="h6">
                            Units
                        </Typography>
                        {selectedUnits.length > 0 ? selectedUnits.map(unit =>
                            <div className="units" key={unit.id}>
                                <div className="left-wrapper">
                                    <Person className="person-icon"/>
                                    <div className="emp-name">{unit.name}</div>
                                </div>
                                <IconButton color="error" onClick={() => handleRemoveUnit(unit)}>
                                    <Delete/>
                                </IconButton>
                            </div>
                        ) : (
                            <div className="no-data-text">There is no selected unit</div>
                        )}

                        <Typography variant="subtitle1">
                            Search
                        </Typography>
                        <TextField autoComplete="off" fullWidth
                                   name="search" label="Find unit by name"
                                   value={inputs.unitSearch || ''}
                                   onChange={onChangeSearchUnit}/>
                        {searchedUnits.map(unit =>
                            <div className="search-emp" key={unit.id}>
                                <div className="left-wrapper">
                                    <Person className="person-icon"/>
                                    <div className="emp-name">{unit.name}</div>
                                </div>
                                <IconButton color="primary" onClick={() => handleSelectUnit(unit)}>
                                    <Add/>
                                </IconButton>
                            </div>
                        )}
                    </Fragment>
                )
            case 3:
                return (
                    <Fragment>
                        {/* Employee */}
                        <Typography variant="h6">
                            Employees
                        </Typography>
                        {selectedEmployees.length > 0 ? selectedEmployees.map(employee =>
                            <div className="employees" key={employee.id}>
                                <div className="left-wrapper">
                                    <Person className="person-icon"/>
                                    <div className="emp-name">{employee.displayName}</div>
                                </div>
                                <IconButton color="error" onClick={() => handleRemoveEmployee(employee)}>
                                    <Delete/>
                                </IconButton>
                            </div>
                        ) : (
                            <div className="no-data-text">There is no selected employees</div>
                        )}

                        <Typography variant="subtitle1">
                            Search
                        </Typography>
                        <TextField autoComplete="off" fullWidth
                                   name="search" label="Find employee by name"
                                   value={inputs.employeeSearch || ''}
                                   onChange={onChangeSearchEmployee}/>
                        {searchedEmployees.map(employee =>
                            <div className="search-emp" key={employee.id}>
                                <div className="left-wrapper">
                                    <Person className="person-icon"/>
                                    <div className="emp-name">{employee.displayName}</div>
                                </div>
                                <IconButton color="primary" onClick={() => handleSelectEmployee(employee)}>
                                    <Add/>
                                </IconButton>
                            </div>
                        )}
                    </Fragment>
                )
            default:
                return <ReviewAssetComponent name={inputs.name} description={inputs.description}
                                             owners={selectedOwners} assets={selectedAssets}
                                             units={selectedUnits} employees={selectedEmployees} isValidSave={isBasicValid()}/>
        }
    }

    return (
        <Dialog className="org-mgmt-dialog" fullScreen open={props.open}>
            <IconButton className="close-btn" onClick={onClose}>
                <Close/>
            </IconButton>
            <DialogTitle>
                {props.organization ? "Edit organization" : "Create new organization"}
            </DialogTitle>
            <DialogContent>
                <Tabs value={activeTab} onChange={onTabChange}>
                    {TABS.map(tab =>
                        <Tab key={tab} value={tab} label={tab}/>
                    )}
                </Tabs>
                {renderTab()}
            </DialogContent>
            <DialogActions>
                {activeTabIndex === TABS.length - 1 ? (
                    <Button variant="contained" color="primary" disabled={!isBasicValid()} onClick={handleSave}>
                        {props.organization ? "Update" : "Create"}
                    </Button>
                ) : (
                    <Button variant="contained" color="primary" onClick={handleReview}>
                        {props.organization ? "Review + update" : "Review + create"}
                    </Button>
                )}
                <Button variant="contained" color="inherit"
                        disabled={activeTabIndex === 0}
                        onClick={handlePreviousTab}>
                    Previous
                </Button>
                <Button variant="contained" color="inherit"
                        disabled={activeTabIndex === TABS.length - 1}
                        onClick={handleNextTab}>
                    Next
                </Button>
            </DialogActions>
        </Dialog>
    )
}

export default OrgMgmtDialog;

type ReviewAssetProps = {
    name: string;
    description: string;
    owners: Employee[];
    assets: Asset[];
    units: Unit[];
    employees: Employee[];
    isValidSave: boolean;
}

function ReviewAssetComponent(props: ReviewAssetProps) {

    return (
        <div className="review-asset-container">

            {!props.isValidSave &&
                <div className="error-message">
                    * Please fulfill all required data in 'Basics'.
                </div>
            }

            <Typography variant="h6">
                Details
            </Typography>
            <Grid container spacing={2}>
                <Grid item xs={4} className="title">
                    Name
                </Grid>
                <Grid item xs={8}>
                    {props.name}
                </Grid>
                <Grid item xs={4} className="title">
                    Description
                </Grid>
                <Grid item xs={8}>
                    {props.description}
                </Grid>
                <Grid item xs={4} className="title">
                    Owner(s)
                </Grid>
                <Grid item xs={8}>
                    {props.owners.map(owner => (
                        <div key={owner.id}>{owner.displayName}</div>
                    ))}
                </Grid>
            </Grid>

            <Typography variant="h6">
                Digital Assets
            </Typography>
            {props.assets.length > 0 ? props.assets.map(asset =>
                <div key={asset.id} className="asset-name">• {asset.name}</div>
            ) : (
                <div className="no-data-text">There is no selected asset</div>
            )}

            <Typography variant="h6">
                Units
            </Typography>
            {props.units.length > 0 ? props.units.map(unit =>
                <div key={unit.id} className="unit-name">• {unit.name}</div>
            ) : (
                <div className="no-data-text">There is no selected unit</div>
            )}


            <Typography variant="h6">
                Employees
            </Typography>
            {props.employees.length > 0 ? props.employees.map(employee =>
                <div key={employee.id} className="employee-name">• {employee.displayName}</div>
            ) : (
                <div className="no-data-text">There is no selected employee</div>
            )}
        </div>
    )
}
