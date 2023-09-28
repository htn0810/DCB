import "./CardAsset.scss";
import { Delete, Edit, InfoOutlined, AccountCircle, CalendarMonth } from '@mui/icons-material';
import { IconButton, Skeleton, Tooltip } from '@mui/material';
import React, {useState} from 'react';
import { Link } from 'react-router-dom';
import { Asset } from '../../../models/Asset';
import { IMAGE_URI } from '../../../contants';

type propsCardAsset = {
    app: Asset,
    openAppInfoDialog: (asset: Asset) => void,
    openAppMgmtDialog: (asset: Asset) => void,
    openDeleteDialog: (event: React.MouseEvent, asset: Asset) => void,
}

const CardAsset = (props: propsCardAsset) => {
    const { app, openAppInfoDialog, openAppMgmtDialog, openDeleteDialog } = props;
    const [loadingImage, setLoadingImage] = useState(true);

    return (
        <div className="card">
            <Link className="card__image-container" to={app.appUrl} target="_blank">
                <img src={app.imageUrl || `${IMAGE_URI}/none-img.png`} alt="" onLoad={() => setLoadingImage(false)} />
                {loadingImage && <Skeleton animation="wave" variant="rectangular" className="card__image-skeleton"/>} 
            </Link>
            <div className="card__content">
                <div className={`card__type ${app.type.toLowerCase()}`}>{ app.type }</div>
                <h3 className="card__title">{ app.name }</h3>
                <div className="card__details"> 
                    <p className="card__desc">{app.description}</p>
                    {app.description?.length >= 75 && 
                        <span className="card__desc-tooltip">{app.description}</span> 
                    }
                </div>
                <div className="card__info">
                    <div className='card__sub-info'>
                        <span className="card__owner">
                            <AccountCircle className="card__icon" />
                            
                            <span>{ app.owners[0]?.firstName ? app.owners[0]?.lastName + " " + app.owners[0]?.firstName : "Unknown" }</span>
                        </span>
                        <span className="card__published-date">
                            <CalendarMonth className="card__icon"/>
                            <span>
                                {app.publishedDate?.toString().substring(0, 10)}
                            </span>
                        </span>
                    </div>
                    <div className="card__buttons">
                        <Tooltip title="Info">
                            <IconButton color="primary" onClick={() => openAppInfoDialog(app)}>
                                <InfoOutlined className="card__icon"/>
                            </IconButton>
                        </Tooltip>
                        <Tooltip title="Edit">
                            <IconButton color="primary" onClick={() => openAppMgmtDialog(app)}>
                                <Edit className="card__icon"/>
                            </IconButton>
                        </Tooltip>
                        <Tooltip title="Delete">
                            <IconButton color="error" onClick={event => openDeleteDialog(event, app)}>
                                <Delete className="card__icon"/>
                            </IconButton>
                        </Tooltip>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CardAsset;