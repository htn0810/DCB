import "./EditEmployeeImageDialog.scss";
import React, {useEffect, useState} from "react";
import {Button, Dialog, DialogActions, DialogContent, DialogTitle, Grid, IconButton} from "@mui/material";
import {Close, FileUpload} from "@mui/icons-material";
import {EmployeeAPI} from "../../../api/employee.api";
import {Employee} from "../../../models/Employee";

type Props = {
    open: boolean;
    onClose: () => void;
    loadPage: () => void;
    employees: Employee | null;
}

function EditEmployeeImageDialog(props: Props) {
    const [image, setImage] = useState<File | null>(null);
    const [imageUrl, setImageUrl] = useState("");

    useEffect(() => {
        if (props.employees) {
            setImageUrl(props.employees.imageUrl!);
        } else {
            setImage(null);
            setImageUrl("");
        }
    }, [props]);

    const onChangeUploadImage = (event: React.ChangeEvent<HTMLInputElement>) => {
        if (event.target.files) {
            setImage(event.target.files[0]);
            setImageUrl(URL.createObjectURL(event.target.files[0]));
        }
    }

    const handleSave = () => {
        if (props.employees) {
            const ntid = props.employees.ntid;
            EmployeeAPI.updateAvatar(ntid, image!).then(() => {
                props.onClose();
                props.loadPage();
            });
        }
    };

    return (
        <Dialog fullWidth maxWidth="sm" className="edit-employee-image-dialog" open={props.open} onClose={props.onClose}>
            <IconButton className="close-btn" onClick={props.onClose}>
                <Close/>
            </IconButton>
            <DialogTitle>
                Upload Avatar
            </DialogTitle>
            <DialogContent>
                <Grid container spacing={3}>
                    <Grid item xs={6}>
                        <div className="avatar-img-txt">
                            Avatar
                        </div>
                        {/* Cover Image */}
                        <Button className="upload-btn" variant="outlined" component="label"
                                startIcon={imageUrl === "" ? <FileUpload/> : null}>
                            {imageUrl === "" ? "Upload Image" : (
                                <img className="avatar-img" alt="avatar" src={imageUrl}/>
                            )}
                            <input accept="image/*" hidden type="file"
                                   onChange={event => onChangeUploadImage(event)}/>
                        </Button>
                    </Grid>
                </Grid>
            </DialogContent>
            <DialogActions>
                <Button variant="contained" color="primary" onClick={handleSave}>
                    Save
                </Button>
                <Button variant="contained" color="inherit" onClick={props.onClose}>
                    Close
                </Button>
            </DialogActions>
        </Dialog>
    )
}

export default EditEmployeeImageDialog;
