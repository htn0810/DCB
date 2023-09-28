import "./DeleteOrgDialog.scss";
import React, {useState} from "react";
import {useAppDispatch} from "../../../custom-hooks/hook";
import {hideIndicator, showIndicator} from "../../../app/app.slice";
import {Button, Dialog, DialogActions, DialogContent, DialogTitle} from "@mui/material";
import {OrganizationApi} from "../../../api/organization.api";
import {Organization} from "../../../models/Organization";

type Props = {
    open: boolean;
    onClose: () => void;
    loadPage: () => void;
    organization: Organization | null;
}

function DeleteOrgDialog(props: Props) {
    const [isError, setIsError] = useState(false);
    const [errorContent, setErrorContent] = useState('')

    const dispatch = useAppDispatch();

    const onClose = () => {
        setIsError(false);
        setErrorContent('');
        props.onClose();
    }

    const handleDelete = () => {
        dispatch(showIndicator());
        OrganizationApi.deleteOrganizationById(props.organization?.id!).then(() => {
            onClose();
            props.loadPage();
        }).catch(error => {
            if (error.response && error.response.status === 424) {
                setIsError(true);
                setErrorContent(error.response.data);
            }
            dispatch(hideIndicator());
        });
    }

    return (
        <Dialog className="delete-org-dialog" open={props.open} onClose={onClose}>
            <DialogTitle>
                Delete Organization
            </DialogTitle>
            <DialogContent>
                {isError ? (
                    <div>{errorContent}</div>
                ) : (
                    <div>
                        Are you sure to delete this organization
                        <span className="display-name">
                            {props.organization ? props.organization.name : ""}
                        </span>
                        ?
                    </div>
                )}
            </DialogContent>
            <DialogActions>
                {!isError ? (
                    <Button variant="contained" color="error" onClick={handleDelete}>
                        Delete
                    </Button>
                ) : null}
                <Button variant="contained" color="inherit" onClick={onClose}>
                    Close
                </Button>
            </DialogActions>
        </Dialog>
    )
}

export default DeleteOrgDialog;
