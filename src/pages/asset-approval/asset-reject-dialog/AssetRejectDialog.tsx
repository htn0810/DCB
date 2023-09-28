import "./AssetRejectDialog.scss";
import React, {useState} from "react";
import {Button, Dialog, DialogActions, DialogContent, DialogTitle, TextField} from "@mui/material";
import {Asset} from "../../../models/Asset";
import {AssetApi} from "../../../api/asset.api";
import {useAppDispatch} from "../../../custom-hooks/hook";
import {showIndicator} from "../../../app/app.slice";

type Props = {
    open: boolean;
    onClose: () => void;
    onReject: () => void;
    asset: Asset | null;
}

function AssetRejectDialog(props: Props) {
    const [comment, setComment] = useState('');
    const dispatch = useAppDispatch();

    const onInputChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
        setComment(event.target.value);
    }

    const handleReject = () => {
        dispatch(showIndicator());
        AssetApi.rejectAsset(props.asset?.id!, comment).then(() => {
            props.onReject();
        })
    }

    const handleClose = () => {
        props.onClose();
        setComment('');
    }

    return (
        <Dialog className="reject-asset-dialog" open={props.open} onClose={props.onClose}>
            <DialogTitle>
                Reject Asset
            </DialogTitle>
            <DialogContent>
                <div className="text-wrapper">
                    Why do you want to reject this asset
                    <div className="display-name">
                        {props.asset ? props.asset.name : ""}
                    </div>
                    ?
                </div>
                <TextField autoComplete="off" fullWidth multiline maxRows={3} required
                           label="Comment" value={comment}
                           onChange={onInputChange}/>
            </DialogContent>
            <DialogActions>
                <Button variant="contained" color="error" onClick={handleReject} disabled={comment === ''}>
                    Reject
                </Button>
                <Button variant="contained" color="inherit" onClick={handleClose}>
                    Close
                </Button>
            </DialogActions>
        </Dialog>
    )
}

export default AssetRejectDialog;
