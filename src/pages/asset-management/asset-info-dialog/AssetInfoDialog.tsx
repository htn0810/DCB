import React, { Fragment, useEffect } from 'react';
import { Dialog, DialogContent, DialogTitle, IconButton, TextField } from '@mui/material';
import { Close, OpenInNew } from '@mui/icons-material';
import {Asset} from "../../../models/Asset";
import { Organization } from "../../../models/Organization";
import "./AssetInfoDialog.scss";
import { Link } from 'react-router-dom';
import { Employee } from '../../../api/external.api';


type Props = {
    open: boolean;
    onClose: () => void;
    loadPage: () => void;
    asset: Asset | null;
    organizations: Organization[];
}

type PropsInfo = {
    className: string,
    value: string,
    name: string,
    label: string,
    multiline?: boolean,
    children?: string | JSX.Element | JSX.Element[],
}

const AssetInfoDialog = (props: Props) => {
    const selectedMicroApp = props.asset;

    const handleEscKey = (event: React.KeyboardEvent) => {
        if (event.key === 'Escape') props.onClose();
    };

    const owners = props.asset?.owners.map((owner: any) => owner.displayName).join(', ');
    const developers = props.asset?.developers.map((developer: any) => developer.displayName).join(', ');

    useEffect(() => {
        // if (selectedMicroApp) {
        //     if (selectedMicroApp.listDeveloperId !== undefined) {
        //         EmployeeAPI.getSelectedEmployeesForApplication(selectedMicroApp.listDeveloperId).then((res) => {
        //             setDevelopers(res.map((employee) => employee.displayName).join(', '));
        //             setListDevelopers(res);
        //         });
        //     }
        // }
    }, [selectedMicroApp])

    return (
         <Dialog className="app-info-dialog" maxWidth="md" open={props.open} onKeyDown={handleEscKey}>
            <IconButton className="close-btn" onClick={props.onClose}>
                <Close/>
            </IconButton>
            <DialogTitle className='app-info-title'>
                {props.asset?.name}
            </DialogTitle>
            <DialogContent>
                {props.asset ? (
                    <Fragment>
                        <div className='info-container'>
                            <div className='info-img'>
                                <img src={props.asset.imageUrl} alt="AppImg" />
                            </div> 
                            <div className="info-id">
                                UUID: <span>{props.asset.uuid}</span>
                            </div>
                            <div className='info-details-2'>
                                <InfoComponent className='info-details-4__component' name="type" label="Type" value={props.asset.type || ' '}></InfoComponent>
                                <InfoComponent className='info-details-4__component' name="status" label="Status" value={props.asset.status ?? ' '}></InfoComponent>
                            </div>
                            <InfoComponent className='info-margin' name="description" label="Description" value={props.asset.description || ' '} multiline />
                            <InfoComponent className='info-margin' name="assetUrl" label="Asset Url" value={props.asset.appUrl || ' '}>
                                {props.asset.appUrl &&
                                    <Link to={props.asset.appUrl} target="_blank"><OpenInNew className="icon" /></Link>
                                }
                            </InfoComponent>
                            <InfoComponent className='info-margin' name="swagger" label="Repo Url" value={props.asset.repoUrl || ' '}>
                                {props.asset.repoUrl &&
                                    <Link to={props.asset.repoUrl} target="_blank"><OpenInNew className="icon" /></Link>
                                }
                            </InfoComponent>
                            <InfoComponent className='info-margin' name="owners" label="Owners" multiline={props.asset.owners?.length > 2  ? true : false} value={owners || ' '} />
                            <InfoComponent className='info-margin' name="developers" label="Developers" multiline={props.asset.developers?.length > 2 ? true : false} value={developers || ' '} />
                        </div>
                    </Fragment>
                ) : null}
            </DialogContent>
        </Dialog>
    
    );
};

export default AssetInfoDialog;

const InfoComponent = (props: PropsInfo) => {
    const {className, ...restProps} = props
    return (
        <div className={className}>
            <TextField fullWidth InputProps={{ readOnly: true, }} {...restProps} />
            {props.children}
        </div>
    )
}
