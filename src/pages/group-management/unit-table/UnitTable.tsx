import "./UnitTable.scss";
import React from "react";
import {IconButton, Table, TableBody, TableCell, TableHead, TableRow, Tooltip} from "@mui/material";
import {AccountTree, Person, Schema} from "@mui/icons-material";
import {Unit} from "../../../models/Unit";
import { useNavigate } from 'react-router-dom';
import { AppRoutes } from '../../../contants/Routes';

type Props = {
    group: Unit;
    groups: Unit[];
    viewChildren: (group: Unit) => void;
    viewEmployees: (group: Unit) => void;
    reloadGroups: () => void;
}

function UnitTable(props: Props) {
    const navigate = useNavigate();

    const handleNavigateOrgChart = (group: Unit) => {
        navigate(AppRoutes.GROUP_ORG_CHART, { state: { id: group.id } })
    }

    return (
        <Table className="unit-table">
            <TableHead>
                <TableRow>
                    <TableCell>Name</TableCell>
                    <TableCell>Description</TableCell>
                    <TableCell>Manager</TableCell>
                    <TableCell align="center">Action</TableCell>
                </TableRow>
            </TableHead>
            <TableBody>
                {props.groups.length > 0 ? props.groups.map(group =>
                    <TableRow key={group.name}>
                        <TableCell>{group.name}</TableCell>
                        <TableCell>{group.description}</TableCell>
                        <TableCell>
                            {group.manager ? group.manager.fullName : ""}
                        </TableCell>
                        <TableCell align="center">
                            <Tooltip title="View group's children">
                                <IconButton color="primary" onClick={() => props.viewChildren(group)}>
                                    <AccountTree/>
                                </IconButton>
                            </Tooltip>
                            <Tooltip title="View group's employees">
                                <IconButton color="primary" onClick={() => props.viewEmployees(group)}>
                                    <Person/>
                                </IconButton>
                            </Tooltip>
                            {/*<Tooltip title="View org chart">*/}
                            {/*    <IconButton className='orgchart-icon' color="primary" onClick={()=> handleNavigateOrgChart(group)}>*/}
                            {/*        <Schema/>*/}
                            {/*    </IconButton>*/}
                            {/*</Tooltip>*/}
                        </TableCell>
                    </TableRow>
                ) : (
                    <TableRow>
                        <TableCell className="no-data" align="center" colSpan={4}>
                            Don't have any children group
                        </TableCell>
                    </TableRow>
                )}
            </TableBody>
        </Table>
    )
}

export default UnitTable;
