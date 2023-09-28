import "./AssetDeleteDialog.scss";
import React from "react";
import {Button, Dialog, DialogActions, DialogContent, DialogTitle} from "@mui/material";
import {AssetApi} from "../../../api/asset.api";
import {Asset} from "../../../models/Asset";
import {useAppDispatch} from "../../../custom-hooks/hook";
import {showIndicator} from "../../../app/app.slice";

type Props = {
    open: boolean;
    onClose: () => void;
    loadPage: () => void;
    asset: Asset | null;
}

function AssetDeleteDialog(props: Props) {
    const dispatch = useAppDispatch();

    const handleDelete = () => {
        dispatch(showIndicator());
        AssetApi.deleteAssetById(props.asset?.id!).then(() => {
            props.onClose();
            props.loadPage();
        });
    }

    return (
        <Dialog className="delete-org-dialog" open={props.open} onClose={props.onClose}>
            <DialogTitle>
                Delete Application
            </DialogTitle>
            <DialogContent>
                Are you sure to delete this application
                <div className="display-name">
                    {props.asset ? props.asset.name : ""}
                </div>
                ?
            </DialogContent>
            <DialogActions>
                <Button variant="contained" color="error" onClick={handleDelete}>
                    Delete
                </Button>
                <Button variant="contained" color="inherit" onClick={props.onClose}>
                    Close
                </Button>
            </DialogActions>
        </Dialog>
    )
}

export default AssetDeleteDialog;
