import "./EmployeeMgmtComponent.scss";
import React, { useEffect, useState} from "react";
import {useAppDispatch, useAppSelector} from "../../custom-hooks/hook";
import {hideIndicator, showIndicator} from "../../app/app.slice";
import {
    Avatar,
    Button,
    Card,
    CardContent,
    Checkbox,
    FormControl,
    Grid,
    InputLabel,
    ListItemText,
    MenuItem,
    OutlinedInput,
    Select,
    SelectChangeEvent,
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableRow,
    TextField,
    Toolbar,
    Tooltip,
    Typography,
} from "@mui/material";
import {FilterAltOutlined, KeyboardArrowDown, KeyboardArrowUp, PersonSearch, UnfoldMore} from "@mui/icons-material";
import {Employee} from "../../models/Employee";
import {UnitApi} from "../../api/unit.api";
import {EmployeeAPI, EmployeeNumber} from "../../api/employee.api";
// Components
import PaginationComponent from "../../components/pagination/PaginationComponent";
import InfoEmployeeDialog from "../group-management/info-employee-dialog/InfoEmployeeDialog";
import FilterDialog from "./filter-dialog/FilterDialog";
import {Unit} from "../../models/Unit";

type Params = {
    unitName?: string;
    employeeName?: string;
    employeeTypes?: string;
    sort?: string;
};

const NAME_ASC = 'displayName,asc';
const NAME_DESC = 'displayName,desc';

function EmployeeMgmtComponent() {
    // Search Input
    const [searchName, setSearchName] = useState('');
    // Filter & Sort
    const [filterParams, setFilterParams] = useState<Params | null>(null);
    const [filterDialogOpen, setFilterDialogOpen] = useState(false);
    const [filtered, setFiltered] = useState(false);
    const [sorted, setSorted] = useState(false);
    const [currentSort, setCurrentSort] = useState<string>('');
    // Statistics
    const [employeeNumber, setEmployeeNumber] = useState<EmployeeNumber | null>(null);
    // Table
    const [currentPage, setCurrentPage] = useState(0);
    const [currentSize, setCurrentSize] = useState(50);
    const [totalCount, setTotalCount] = useState(0);
    const [employees, setEmployees] = useState<Employee[]>([]);
    const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(null);
    const [infoDialogOpened, setInfoDialogOpened] = useState(false);
    const [allUnits, setAllUnits] = useState<Unit[]>([]);
    const account = useAppSelector((state) => state.account);
    const dispatch = useAppDispatch();

    const [unitSelected , setUnitSelected] = useState<string[]>([]);
    const orgSelected = JSON.parse(localStorage.getItem("org-selected")!);

    const handleSelectUnit = (event: SelectChangeEvent<typeof unitSelected>) => {
        const {target: { value }} = event;
        setUnitSelected(
            // On autofill we get a stringified value.
            typeof value === 'string' ? value.split(',') : value,
        );
    };

    // Sort With Arrow Icons In Header Column
    const onSortChange = () => {
        const params: Params = filterParams ? filterParams : {sort: ''};
        if (currentSort === NAME_DESC) {
            params.sort = NAME_ASC;
            setSorted(true);
        } else if (currentSort === NAME_ASC) {
            params.sort = '';
            setSorted(false);
        } else if (currentSort === '') {
            params.sort = NAME_DESC;
            setSorted(true);
        }
        setCurrentSort(params.sort!);
        setFilterParams(params);
        getEmployeesWithTheirGroup(0, currentSize, params);
    };

    useEffect(() => {
        getEmployeesWithTheirGroup(currentPage, currentSize);
        getAllUnit();
    }, [account]);

    const handleOpenInfoDialog = (employee: Employee) => {
        setSelectedEmployee(employee);
        setInfoDialogOpened(true);
    };

    const onCloseInfoDialog = () => {
        setInfoDialogOpened(false);
    };

    const getEmployeesWithTheirGroup = (page: number, size: number, params?: Params) => {
        dispatch(showIndicator());
        EmployeeAPI.getEmployees({page, size, getUnit: true, ...params}).then(res => {
            setTotalCount(res.headers["x-total-count"]);
            setEmployees(res.data);
            setCurrentPage(page);
            setCurrentSize(size);
            dispatch(hideIndicator());
        })
        EmployeeAPI.getEmployeeNumber({...params}).then(res => {
            setEmployeeNumber(res);
        })
    };

    const getAllUnit = () => {
        const orgId = orgSelected.id;
        UnitApi.getAllUnits({orgId: orgId}).then(res => setAllUnits(res));
    }

    const onNameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setSearchName(event.target.value);
    };

  const handleSearch = () => {
    const params: Params = filterParams ? filterParams : { employeeName: '', unitName: ''};
    if (searchName === '') {
      delete params.employeeName;
    } else {
      params.employeeName = searchName.replace(/\s+/g, ' ').trim();
    }
    if (unitSelected.length <= 0) {
      delete params.unitName;
    } else {
        params.unitName = unitSelected.toString();
    }
      setFilterParams(params);
    getEmployeesWithTheirGroup(0, currentSize, params);
  }

    const handleOpenFilterDialog = () => {
        setFilterDialogOpen(true);
    };

    const onCloseFilterDialog = () => {
        setFilterDialogOpen(false);
    };

    const handleApplyFilter = (filter: string) => {
        setFilterDialogOpen(false);
        const params: Params = filterParams ? filterParams : {employeeTypes: ''};
        if (filter === '') {
            setFiltered(false);
            delete params.employeeTypes;
        } else {
            setFiltered(true);
            params.employeeTypes = filter;
        }
        setFilterParams(params);
        getEmployeesWithTheirGroup(0, currentSize, params);
    };

    const handleChangePage = (page: number) => {
        window.scrollTo({top: 0, behavior: "smooth"});
        setCurrentPage(page);
        getEmployeesWithTheirGroup(page, currentSize, filterParams!);
    };

    const handleChangeRowsPerPage = (size: number) => {
        setCurrentPage(0);
        setCurrentSize(size);
        getEmployeesWithTheirGroup(0, size, filterParams!);
    };

    const showSortIcon = () => {
        switch (currentSort) {
            case NAME_ASC:
                return <KeyboardArrowUp color={sorted ? "primary" : "inherit"}/>
            case NAME_DESC:
                return <KeyboardArrowDown color={sorted ? "primary" : "inherit"}/>
            default:
                return <UnfoldMore color={sorted ? "primary" : "inherit"}/>
        }
    }

    return (
        <section className="employee-mgmt-container">
            {/* Toolbar */}
            <Toolbar className="toolbar">
                <Typography variant="h5" style={{flexGrow: 1}}>
                    Employee Management
                </Typography>
                <TextField
                    className="name-text-field"
                    autoComplete="off"
                    name="name"
                    label="Name"
                    value={searchName}
                    onChange={onNameChange}/>
                <FormControl sx={{  m: 1, width: 220 }}>
                    <InputLabel id="multiple-checkbox-label">Unit</InputLabel>
                    <Select
                        labelId="multiple-checkbox-label"
                        multiple
                        value={unitSelected}
                        onChange={handleSelectUnit}
                        input={<OutlinedInput label="Unit" />}
                        renderValue={(selected) => selected.join(', ')}
                        MenuProps={{PaperProps: {
                                        style: {
                                            maxHeight: 220,
                                            width: 220,
                                        },
                                    },
                                }}>
                        {allUnits?.map((unit) => (
                            <MenuItem key={unit.id} value={unit.name}>
                                <Checkbox checked={unitSelected.indexOf(unit.name) > -1} />
                                <ListItemText primary={unit.name} />
                            </MenuItem>
                        ))}
                    </Select>
                </FormControl>
                <Button className='search-btn' startIcon={<PersonSearch/>} onClick={handleSearch}>
                    Search
                </Button>
            </Toolbar>
            <StatisticComponent employeeNumber={employeeNumber}/>
            <Table className="employee-table">
                <TableHead>
                    <TableRow>
                        <TableCell>No.</TableCell>
                        <TableCell>Avatar</TableCell>
                        <TableCell>NTID</TableCell>
                        <TableCell>Personnel No.</TableCell>
                        <TableCell>
                            <div className="employee-table_flex">
                                Full Name
                                <span className="filter-btn" onClick={onSortChange}>
                                    {showSortIcon()}
                                </span>
                            </div>
                        </TableCell>
                        <TableCell>Group(s)</TableCell>
                        <TableCell>
                            <Tooltip title="Filter employee type">
                                <div className="employee-table_flex">
                                    Type
                                    <span className="filter-btn" onClick={handleOpenFilterDialog}>
                                        <FilterAltOutlined fontSize="small" color={filtered ? "primary" : "inherit"}/>
                                    </span>
                                </div>
                            </Tooltip>
                        </TableCell>
                        <TableCell>Email</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {employees.length > 0 ? (
                        employees.map((employee, index) =>
                            <TableRow key={employee.ntid}>
                                <TableCell>
                                    {currentPage * currentSize + index + 1}
                                </TableCell>
                                <TableCell align="center">
                                    <Avatar className="avatar" alt="avatar" src={employee.imageUrl} />
                                </TableCell>
                                <TableCell sx={{width: 100}}>
                                    {employee.ntid.toUpperCase()}
                                </TableCell>
                                <TableCell>
                                    {employee.employeeId}
                                </TableCell>
                                <TableCell>
                                    <span className="user-infomation" onClick={() => handleOpenInfoDialog(employee)}>
                                        {employee.displayName}
                                    </span>
                                </TableCell>
                                <TableCell>
                                    {employee.units && employee.units.length > 0 ?
                                        employee.units.map(group => group.name).join(', ')
                                    : ''}
                                </TableCell>
                                <TableCell>{employee.type}</TableCell>
                                <TableCell>{employee.email}</TableCell>
                            </TableRow>
                        )
                    ) : (
                        <TableRow>
                            <TableCell className="no-data" align="center" colSpan={8}>
                                Don't have any employees
                            </TableCell>
                        </TableRow>
                    )}
                </TableBody>
            </Table>
            <PaginationComponent count={totalCount}
                                 page={currentPage}
                                 rowsPerPageOptions={[5, 20, 50, 100, 200]}
                                 rowsPerPage={currentSize}
                                 onPageChange={handleChangePage}
                                 onRowsPerPageChange={handleChangeRowsPerPage}/>

            {/* Dialogs */}
            <FilterDialog open={filterDialogOpen} onClose={onCloseFilterDialog} handleApply={handleApplyFilter}/>
            <InfoEmployeeDialog open={infoDialogOpened} onClose={onCloseInfoDialog} employee={selectedEmployee}/>
        </section>
    );
}

export default EmployeeMgmtComponent;

function StatisticComponent(props: { employeeNumber: EmployeeNumber | null }) {
    return props.employeeNumber ? (
        <Grid className="statistic-number" container columnSpacing={2}>
            <Grid item xs={3}>
                <Card className="statistic-card purple">
                    <CardContent>
                        <div className="title">ALL</div>
                        <div className="number">{props.employeeNumber.all}</div>
                    </CardContent>
                </Card>
            </Grid>
            <Grid className="statistic-item" item xs={3}>
                <Card className="statistic-card blue">
                    <CardContent>
                        <div className="title">INTERNAL</div>
                        <div className="number">{props.employeeNumber.internal}</div>
                    </CardContent>
                </Card>
            </Grid>
            <Grid className="statistic-item" item xs={3}>
                <Card className="statistic-card turquoise">
                    <CardContent>
                        <div className="title">FIXED-TERM</div>
                        <div className="number">{props.employeeNumber.fixedTerm}</div>
                    </CardContent>
                </Card>
            </Grid>
            <Grid className="statistic-item" item xs={3}>
                <Card className="statistic-card green">
                    <CardContent>
                        <div className="title">EXTERNAL</div>
                        <div className="number">{props.employeeNumber.external}</div>
                    </CardContent>
                </Card>
            </Grid>
        </Grid>
    ) : null;
}
