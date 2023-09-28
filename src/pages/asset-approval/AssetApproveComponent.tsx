import "./AssetApproveComponent.scss";
import React, {useEffect, useState} from "react";
import {Table, TableBody, TableCell, TableHead, TableRow, Toolbar, Typography} from "@mui/material";
// Models
import {Asset} from "../../models/Asset";
// Constants
import {AppRouteLabels} from "../../contants/Routes";
import {useAppDispatch, useAppSelector} from "../../custom-hooks/hook";
import {hideIndicator, showIndicator} from "../../app/app.slice";
import {AssetApi} from "../../api/asset.api";
import AssetInfoDialog from "./asset-info-dialog/AssetInfoDialog";

function AssetApproveComponent() {
    const [assets, setAssets] = useState<Asset[]>([]);
    const [selectedAsset, setSelectedAsset] = useState<Asset | null>(null);

    const account = useAppSelector(state => state.account);
    const dispatch = useAppDispatch();

    useEffect(() => {
        loadAssets();
    }, [account]);

    const loadAssets = () => {
        dispatch(showIndicator());
        AssetApi.getAllAssets({status: "DRAFT"}).then(res => {
            setAssets(res);
            dispatch(hideIndicator());
        });
    }

    const handleSelectAsset = (asset: Asset) => {
        setSelectedAsset(asset);
    }

    const handleCloseDialog = () => {
        setSelectedAsset(null);
    }

    return (
        <section className="asset-approve-container">
            <Toolbar className="toolbar">
                <Typography variant="h5" style={{flexGrow: 1}}>
                    {AppRouteLabels.ASSET_APPROVAL}
                </Typography>
            </Toolbar>
            <Table className="asset-table">
                <TableHead>
                    <TableRow>
                        <TableCell>No.</TableCell>
                        <TableCell>Name</TableCell>
                        <TableCell>Description</TableCell>
                        <TableCell>Organization</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {assets.map((asset, index) =>
                        <TableRow key={asset.id}>
                            <TableCell>
                                {index + 1}
                            </TableCell>
                            <TableCell sx={{width: 120}}>
                                <div className="asset-name" onClick={() => handleSelectAsset(asset)}>
                                    {asset.name}
                                </div>
                            </TableCell>
                            <TableCell>
                                {asset.description}
                            </TableCell>
                            <TableCell>
                                {asset.organizations && asset.organizations.map(org =>
                                    <div key={org.id}>{org.name}</div>
                                )}
                            </TableCell>
                        </TableRow>
                    )}
                </TableBody>
            </Table>

            <AssetInfoDialog open={selectedAsset != null} onClose={handleCloseDialog}
                             asset={selectedAsset} reload={loadAssets}/>
        </section>
    )
}

export default AssetApproveComponent;
