import "./SelectOrgComponent.scss"
import React, {useEffect, useState} from "react";
import {useNavigate} from "react-router-dom";
import {
    Button,
    Checkbox,
    FormControl,
    FormControlLabel,
    Grid,
    MenuItem,
    Select,
    SelectChangeEvent,
    Typography
} from "@mui/material";
import {PublicApi} from "../../../api/public.api";
import {Organization} from '../../../models/Organization';
import {ORG_SELECTED, REMEMBER_ORG} from "../../../contants";
import {AppRoutes} from "../../../contants/Routes";

export default function SelectOrgComponent() {
    const [organizations, setOrganizations] = useState<Organization[]>([]);
    const [selectedOrgId, setSelectedOrgId] = useState(0);
    const [selectedOrg, setSelectedOrg] = useState<Organization | null>(null);
    const [rememberOrg, setRememberOrg] = useState(false);

    const navigate = useNavigate();

    useEffect(() => {
        PublicApi.getOrganizations().then(res => {
            if (res) {
                setOrganizations(res);
            }
        })
        const storedOrg: Organization = JSON.parse(localStorage.getItem(ORG_SELECTED)!);
        const remember = JSON.parse(localStorage.getItem(REMEMBER_ORG)!);
        if (remember) {
            setRememberOrg(true);
            setSelectedOrgId(storedOrg.id!);
            setSelectedOrg(storedOrg);
        }
    }, []);

    const handleChangeOrg = (event: SelectChangeEvent) => {
        const organization = organizations.find(org => org.id === Number(event.target.value))!;
        setSelectedOrgId(organization.id!);
        setSelectedOrg(organization);
    }

    const navigateSearchPage = () => {
        localStorage.setItem(ORG_SELECTED, JSON.stringify(selectedOrg));
        localStorage.setItem(REMEMBER_ORG, JSON.stringify(rememberOrg));
        navigate(AppRoutes.SEARCH_PAGE);
    }

    return (
        <div className="select-org-container">
            <Typography variant="inherit">
                Please select your organization
            </Typography>
            <Grid container spacing={2}>
                <Grid item xs={10}>
                    <FormControl fullWidth>
                        <Select value={String(selectedOrgId)}
                                onChange={handleChangeOrg}>
                            {organizations && organizations.map && organizations.map(org => (
                                <MenuItem key={org.id} value={org.id}>{org.name}</MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                </Grid>
                <Grid item xs={2}>
                    <Button variant="contained" color="inherit"
                            disabled={selectedOrgId === 0}
                            onClick={navigateSearchPage}>
                        Go
                    </Button>
                </Grid>
            </Grid>
            <FormControlLabel label="Remember your choice"
                              control={<Checkbox checked={rememberOrg}
                                                 onChange={event => setRememberOrg(event.target.checked)}/>}/>
        </div>
    )
}

