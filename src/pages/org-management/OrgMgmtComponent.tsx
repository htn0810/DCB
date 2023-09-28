import "./OrgMgmtComponent.scss";
import React, {useEffect, useState} from "react";
import {useAppDispatch, useAppSelector} from "../../custom-hooks/hook";
import {hideIndicator, showIndicator} from "../../app/app.slice";
import {
    Button,
    IconButton,
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableRow,
    Toolbar,
    Tooltip,
    Typography
} from "@mui/material";
import {Add, Delete, Edit} from "@mui/icons-material";
import {Organization} from "../../models/Organization";
import {OrganizationApi} from "../../api/organization.api";
import DeleteOrgDialog from "./delete-org-dialog/DeleteOrgDialog";
import OrgMgmtDialog from "./org-mgmt-dialog/OrgMgmtDialog";

function OrgMgmtComponent() {
    const [organizations, setOrganizations] = useState<Organization[]>([]);
    const [selectedOrg, setSelectedOrg] = useState<Organization | null>(null);
    const [mgmtDialogOpened, setMgmtDialogOpened] = useState(false);
    const [delDialogOpened, setDelDialogOpened] = useState(false);

    const account = useAppSelector(state => state.account);
    const dispatch = useAppDispatch();

    useEffect(() => {
        loadOrgList();
    }, [account]);

    const loadOrgList = () => {
        dispatch(showIndicator());
        OrganizationApi.getAllOrganizations().then(res => {
            setOrganizations(res);
            dispatch(hideIndicator());
        });
    }

    const handleOpenMgmtDialog = (organization?: Organization) => {
        setSelectedOrg(organization ? organization : null);
        setMgmtDialogOpened(true);
    }

    const onCloseMgmtDialog = () => {
        setSelectedOrg(null);
        setMgmtDialogOpened(false);
    }

    const handleOpenDeleteDialog = (organization: Organization) => {
        setSelectedOrg(organization);
        setDelDialogOpened(true);
    }

    const onCloseDeleteDialog = () => {
        setSelectedOrg(null);
        setDelDialogOpened(false);
    }

    return (
        <section className="org-mgmt-container">
            <Toolbar className="toolbar">
                <Typography variant="h5" style={{flexGrow: 1}}>
                    Organization Management
                </Typography>
                {account.roles.includes("ROLE_DIGICORE_SUPER_ADMIN") &&
                    <Tooltip title="Add Organization">
                        <Button className="add-btn" variant="contained" onClick={() => handleOpenMgmtDialog()}>
                            <Add/>
                        </Button>
                    </Tooltip>
                }
            </Toolbar>
            <Table className="organization-table">
                <TableHead>
                    <TableRow>
                        <TableCell>No.</TableCell>
                        <TableCell>Name</TableCell>
                        <TableCell>Description</TableCell>
                        <TableCell align="center">Owners</TableCell>
                        <TableCell align="center">Action</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {organizations.length > 0 ? organizations.map((organization, index) =>
                        <TableRow key={organization.id}>
                            <TableCell>
                                {index + 1}
                            </TableCell>
                            <TableCell sx={{width: 120}}>
                                {organization.name}
                            </TableCell>
                            <TableCell>
                                {organization.description}
                            </TableCell>
                            <TableCell sx={{width: 200}}>
                                {organization.owners.map(owner =>
                                    <div key={owner.id}>{owner.displayName}</div>
                                )}
                            </TableCell>
                            <TableCell align="center" sx={{width: 80}}>
                                {(account.roles.includes("ROLE_DIGICORE_ORG_ADMIN") || account.roles.includes("ROLE_DIGICORE_SUPER_ADMIN")) &&
                                    <Tooltip title="Edit Organization">
                                        <IconButton color="primary" onClick={() => handleOpenMgmtDialog(organization)}>
                                            <Edit />
                                        </IconButton>
                                    </Tooltip>
                                }
                                {(account.roles.includes("ROLE_DIGICORE_ORG_ADMIN") || account.roles.includes("ROLE_DIGICORE_SUPER_ADMIN")) &&
                                    <Tooltip title="Delete Organization">
                                        <IconButton color="error" onClick={() => handleOpenDeleteDialog(organization)}>
                                            <Delete />
                                        </IconButton>
                                    </Tooltip>
                                }
                            </TableCell>
                        </TableRow>
                    ) : (
                        <TableRow>
                            <TableCell className="no-data" align="center" colSpan={4}>
                                Don't have any organization
                            </TableCell>
                        </TableRow>
                    )}
                </TableBody>
            </Table>

            {/* Dialog */}
            <OrgMgmtDialog open={mgmtDialogOpened} onClose={onCloseMgmtDialog} organization={selectedOrg} loadPage={loadOrgList}/>
            <DeleteOrgDialog open={delDialogOpened} onClose={onCloseDeleteDialog} organization={selectedOrg} loadPage={loadOrgList}/>
        </section>
    )
}

export default OrgMgmtComponent;
