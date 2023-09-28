import "./AssetMgmtComponent.scss";
import React, {Fragment, useEffect, useRef, useState} from "react";
import {
    Button,
    IconButton,
    MenuItem,
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableRow,
    TextField,
    Toolbar,
    Tooltip,
    Typography
} from "@mui/material";
import {
    Add,
    Delete,
    Edit,
    GridViewSharp,
    Language,
    TableRows,
    InfoOutlined
} from "@mui/icons-material";
import {useAppDispatch, useAppSelector} from "../../custom-hooks/hook";
import {hideIndicator, showIndicator} from "../../app/app.slice";
// Models & Constant
import {Asset} from "../../models/Asset";
import {Organization} from "../../models/Organization";
import {ASSET_STATUS, DIGI_ASSET, ORG_SELECTED} from "../../contants";
// API
import {AssetApi} from "../../api/asset.api";
import {OrganizationApi} from "../../api/organization.api";
// Components
import AssetMgmtDialog from "./asset-mgmt-dialog/AssetMgmtDialog";
import AssetDeleteDialog from "./asset-delete-dialog/AssetDeleteDialog";
import AssetInfoDialog from './asset-info-dialog/AssetInfoDialog';
import CardAsset from './card-assets/CardAsset';

function AppMgmtComponent() {
    const [assets, setAssets] = useState<Asset[]>([]);
    const [selectedAsset, setSelectedAsset] = useState<Asset | null>(null);
    const [mgmtDialogOpened, setMgmtDialogOpened] = useState(false);
    const [infoDialogOpened, setInfoDialogOpened] = useState(false);
    const [delDialogOpened, setDelDialogOpened] = useState(false);
    const [organizations, setOrganizations] = useState<Organization[]>([]);
    const [showList, setShowList] = useState(false);
    const [statusAssets, setStatusAssets] = useState("ALL");

    const orgId = (JSON.parse(localStorage.getItem(ORG_SELECTED)!) as Organization).id;
    const gridRef = useRef<HTMLDivElement>(null);
    const listRef = useRef<HTMLDivElement>(null);

    const account = useAppSelector(state => state.account);
    const dispatch = useAppDispatch();

    useEffect(() => {
        loadAssetList();
        loadOrgList();
    }, [account]);

    const loadAssetList = () => {
        dispatch(showIndicator());
        AssetApi.getAllAssets({ orgId }).then(res => {
            setAssets(res);
            dispatch(hideIndicator());
        });
    };

    const loadOrgList = () => {
        dispatch(showIndicator());
        OrganizationApi.getAllOrganizations().then((res) => {
            setOrganizations(res);
        });
    };

    const onCloseMgmtDialog = () => {
        setSelectedAsset(null);
        setMgmtDialogOpened(false);
    };

     const onCloseInfoDialog = () => {
        setSelectedAsset(null);
        setInfoDialogOpened(false);
    };

    const onCloseDeleteDialog = () => {
        setSelectedAsset(null);
        setDelDialogOpened(false);
    };

    const onChangeStatus = (event: React.ChangeEvent<HTMLInputElement>) => {
        setStatusAssets(event.target.value);
    };

    const handleOpenAppMgmtDialog = (app?: Asset) => {
        setSelectedAsset(app ? app : null);
        setMgmtDialogOpened(true);
    };

    const handleOpenAppInfoDialog = (app?: Asset) => {
        setSelectedAsset(app ? app : null);
        setInfoDialogOpened(true);
    };

    const handleOpenDeleteDialog = (event: React.MouseEvent, microApp: Asset) => {
        setSelectedAsset(microApp);
        setDelDialogOpened(true);
    };

    const handleShowListItem = (): void => {
        if (!showList) {
            listRef.current?.classList.add("active");
            setShowList(true);
            gridRef.current?.classList.remove("active");
        }
    };

    const handleShowGridItem = (): void => {
        if (showList) {
            listRef.current?.classList.remove("active");
            setShowList(false);
            gridRef.current?.classList.add("active");
        }
    };

    return (
        <section className="app-mgmt-container">
            <Toolbar className="toolbar">
                <Typography variant="h5" style={{flexGrow: 1}}>{`${DIGI_ASSET} Management`}</Typography>
                    <Tooltip placement="left" title={`Filter ${DIGI_ASSET.toLowerCase()}(s) by status`}>
                        <TextField select label="Status" className="org-text-field"
                                value={statusAssets}
                                onChange={onChangeStatus}
                                style={{width: "140px"}}>
                            <MenuItem value="ALL">ALL</MenuItem>
                            {ASSET_STATUS.map(status =>
                                <MenuItem key={status} value={status}>
                                    {status}
                                </MenuItem>
                            )};
                        </TextField>
                    </Tooltip>
                <Tooltip placement="top" title={`Add ${DIGI_ASSET}`}>
                    <Button className="add-btn" variant="contained" onClick={() => handleOpenAppMgmtDialog()}>
                        <Add/>
                    </Button>
                </Tooltip>
                <div className="switch-layout">
                    <Tooltip placement="top" title="Grid Layout">
                        <div className="switch-layout-icon active" ref={gridRef}>
                            <GridViewSharp onClick={handleShowGridItem}/>
                        </div>
                    </Tooltip>
                    <Tooltip placement="top" title="Table Layout">
                        <div className="switch-layout-icon" ref={listRef}>
                            <TableRows onClick={handleShowListItem}/>
                        </div>
                    </Tooltip>
                </div>
            </Toolbar>
            {showList ? (
                <Table className="organization-table">
                    <TableHead>
                        <TableRow>
                            <TableCell>No.</TableCell>
                            <TableCell>Name</TableCell>
                            <TableCell>Description</TableCell>
                            <TableCell>Website</TableCell>
                            <TableCell align="center">Action</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {assets.filter(app => {
                            return statusAssets !== "ALL" ? app.status === statusAssets : app;
                        }).map((app, index) => (
                            <TableRow key={app.id}>
                                <TableCell>{index + 1}</TableCell>
                                <TableCell sx={{width: 120}}>{app.name}</TableCell>
                                <TableCell>{app.description}</TableCell>
                                <TableCell align="center">
                                    <a href={app.appUrl} target="_blank" rel="noreferrer">
                                        <Language className="website-icon"/>
                                    </a>
                                </TableCell>
                                <TableCell align="center" sx={{ width: 120 }}>
                                    <Tooltip title="Info">
                                        <IconButton color="primary" onClick={() => handleOpenAppInfoDialog(app)}>
                                            <InfoOutlined/>
                                        </IconButton>
                                    </Tooltip>
                                    {/*{(account.roles.includes("ROLE_DIGICORE_SUPER_ADMIN") || account.name.includes(app.owners)) &&*/}
                                        <Fragment>
                                            <Tooltip title="Edit">
                                                <IconButton color="primary" onClick={() => handleOpenAppMgmtDialog(app)}>
                                                    <Edit/>
                                                </IconButton>
                                            </Tooltip>
                                            <Tooltip title="Delete">
                                                <IconButton color="error"
                                                            onClick={event => handleOpenDeleteDialog(event, app)}>
                                                    <Delete/>
                                                </IconButton>
                                            </Tooltip>
                                        </Fragment>
                                    {/*}*/}
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            ) : (
                <div className='card-grid'>
                    {assets.filter(app => {
                        return statusAssets !== "ALL" ? app.status === statusAssets : app;
                    }).map(app =>
                        <CardAsset key={app.id} app={app} openAppInfoDialog={handleOpenAppInfoDialog}
                            openAppMgmtDialog={handleOpenAppMgmtDialog} openDeleteDialog={handleOpenDeleteDialog}/>
                    )}
                </div>
            )}

            {/* Dialogs */}
            <AssetDeleteDialog open={delDialogOpened} onClose={onCloseDeleteDialog} asset={selectedAsset}
                               loadPage={loadAssetList}/>
            <AssetMgmtDialog open={mgmtDialogOpened} onClose={onCloseMgmtDialog} asset={selectedAsset} loadPage={loadAssetList} />
            <AssetInfoDialog open={infoDialogOpened} onClose={onCloseInfoDialog} asset={selectedAsset}
                             organizations={organizations} loadPage={loadAssetList}/>
            
        </section>
    );
}

export default AppMgmtComponent;
