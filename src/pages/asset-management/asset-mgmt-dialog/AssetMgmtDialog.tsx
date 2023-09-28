import "./AssetMgmtDialog.scss";
import React, {Fragment, useEffect, useState} from "react";
import {useAppDispatch, useAppSelector} from "../../../custom-hooks/hook";
import {showIndicator} from "../../../app/app.slice";
import {
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    Grid,
    IconButton,
    MenuItem,
    Tab,
    Tabs,
    TextField,
    Typography
} from "@mui/material";
import {Add, Close, Delete, FileUpload, Person} from "@mui/icons-material";
// Models & Constant
import {Asset} from "../../../models/Asset";
import {Employee} from "../../../models/Employee";
import {DIGI_ASSET, ORG_SELECTED} from "../../../contants";
// API
import {EmployeeAPI} from "../../../api/employee.api";
import {AssetApi} from "../../../api/asset.api";
import {Organization} from "../../../models/Organization";

type Props = {
    open: boolean;
    onClose: () => void;
    loadPage: () => void;
    asset: Asset | null;
}

type Input = {
    name: string;
    description: string;
    assetUrl: string;
    repoUrl: string;
}
const initialInput: Input = {  name: '', description: '', assetUrl: '', repoUrl: '' };

type Params = {
    employeeName?: string;
}

const TABS = ["Basics", "Useful Links", "Owners", "Developers", "Review + create"];
const ASSET_TYPES = [
    "APP",
    "SERVICE",
    "COMPONENT"
];

export default function AssetMgmtDialog(props: Props) {
    const [activeTab, setActiveTab] = useState(TABS[0]);
    const [activeTabIndex, setActiveTabIndex] = useState(0);
    const [reviewed, setReviewed] = useState(false);

    const [image, setImage] = useState<File | null>(null);
    const [imageUrl, setImageUrl] = useState("");

    const [inputs, setInputs] = useState(initialInput);
    const [assetType, setAssetType] = useState(ASSET_TYPES[0]);
    const [otherUrls, setOtherUrls] = useState<Map<string, string>>(new Map());

    const [searchedOwners, setSearchedOwners] = useState<Employee[]>([]);
    const [selectedOwners, setSelectedOwners] = useState<Employee[]>([]);
    const [searchedDevelopers, setSearchedDevelopers] = useState<Employee[]>([]);
    const [selectedDevelopers, setSelectedDevelopers] = useState<Employee[]>([]);

    const [inputOwner, setInputOwner] = useState('');
    const [inputDeveloper, setInputDeveloper] = useState('');
    const [timer, setTimer] = useState(0);

    const organization: Organization = JSON.parse(localStorage.getItem(ORG_SELECTED)!);
    const account = useAppSelector(state => state.account);
    const dispatch = useAppDispatch();

    useEffect(() => {
        if (props.asset) {
            setInputs({
                name: props.asset.name,
                description: props.asset.description,
                assetUrl: props.asset.appUrl,
                repoUrl: props.asset.repoUrl
            });
            setSelectedDevelopers(props.asset?.developers);
            setSelectedOwners(props.asset?.owners);
            setImageUrl(props.asset.imageUrl ?? '');
            setAssetType(ASSET_TYPES.find((value) => value === props.asset?.type)!);
        } else {
            EmployeeAPI.getEmployeeByNtid(account.username.slice(0, 6)).then(res => {
                if (res) {
                    setSelectedOwners([res]);
                }
            })
        }
    }, [props]);

    useEffect(() => {
        if (activeTabIndex === TABS.length - 1) {
            setReviewed(true);
        }
    }, [activeTabIndex]);

    const getEmployees = (page: number, size: number, type: string, name?: string) => {
        let params: Params = {employeeName: name};
        EmployeeAPI.getEmployees({page, size, ...params}).then((res) => {
            type === "owners" ? setSearchedOwners(res.data) : setSearchedDevelopers(res.data);
        });
    }

    const onClose = () => {
        setActiveTab(TABS[0]);
        setActiveTabIndex(0);
        setReviewed(false);
        setInputs(initialInput);
        setImage(null);
        setImageUrl("");
        setAssetType(ASSET_TYPES[0]);
        setSearchedOwners([]);
        setSearchedOwners([]);
        setSearchedDevelopers([]);
        setSelectedDevelopers([]);
        setInputDeveloper('');
        setInputOwner('');
        props.onClose();
    }

    const onTabChange = (_event: React.SyntheticEvent, newValue: string) => {
        setActiveTab(newValue);
        setActiveTabIndex(TABS.indexOf(newValue));
    }

    const handleNextTab = () => {
        const newIndex = activeTabIndex + 1;
        setActiveTab(TABS[newIndex]);
        setActiveTabIndex(newIndex);
    }

    const handlePreviousTab = () => {
        const newIndex = activeTabIndex - 1;
        setActiveTab(TABS[newIndex]);
        setActiveTabIndex(newIndex);
    }

    const handleReview = () => {
        setActiveTab(TABS[TABS.length - 1]);
        setActiveTabIndex(TABS.length - 1);
    }

    const onTypeChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setAssetType(event.target.value);
    }

    const onChangeUploadImage = (event: React.ChangeEvent<HTMLInputElement>) => {
        if (event.target.files) {
            setImage(event.target.files[0]);
            setImageUrl(URL.createObjectURL(event.target.files[0]));
        }
    }

    const onInputChange = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setInputs(state => ({...state, [event.target.name]: event.target.value}));
    }

    const onChangeSearchOwner = (event: React.ChangeEvent<HTMLInputElement>) => {
        setInputOwner(event.target.value);
        const value = event.target.value.trim();
        if (value.replace(/^[A-Za-z]/gi, "").length >= 2) {
            clearTimeout(timer);
            setTimer(Number(setTimeout(() => {
                getEmployees(0, 20, "owners", value)
            }, 750)));
        } else {
            setSearchedOwners([]);
        }
    }

    const handleSelectOwner = (employee: Employee) => {
        const owners = [...selectedOwners];
        const index = selectedOwners.findIndex(emp => emp.ntid === employee.ntid);
        if (index === -1) {
            owners.push(employee);
            setSelectedOwners(owners)
        }
    }

    const handleRemoveOwner = (owner: Employee) => {
        const owners = [...selectedOwners];
        const index = selectedOwners.findIndex(emp => emp.ntid === owner.ntid);
        if (index !== -1) {
            owners.splice(index, 1);
            setSelectedOwners(owners)
        }
    }

    const onChangeSearchDeveloper = (event: React.ChangeEvent<HTMLInputElement>) => {
        setInputDeveloper(event.target.value)
        const value = event.target.value.trim();
        if (value.replace(/^[A-Za-z]/gi, "").length >= 2) {
            clearTimeout(timer);
            setTimer(Number(setTimeout(() => {
                getEmployees(0, 35, "developers", value)
            }, 750)));
        } else {
            setSearchedDevelopers([]);
        }
    }

    const handleSelectDeveloper = (employee: Employee) => {
        const developers = [...selectedDevelopers];
        const index = selectedDevelopers.findIndex(emp => emp.ntid === employee.ntid);
        if (index === -1) {
            developers.push(employee);
            setSelectedDevelopers(developers)
        }
    }

    const handleRemoveDeveloper = (developer: Employee) => {
        const developers = [...selectedDevelopers];
        const index = selectedDevelopers.findIndex(emp => emp.ntid === developer.ntid);
        if (index !== -1) {
            developers.splice(index, 1);
            setSelectedDevelopers(developers)
        }
    }

    const isUrlValid = (url: string) => {
        if (url !== '') {
            const regExPlus = /^(ftps|http|https?):\/\/(\w+:?\w*)?(\S+)(:\d+)?(\/|\/([\w#!:.?+=&%]))?/;
            return regExPlus.test(url);
        }
        return true;
    }

    const isValidToSave = (): boolean => {
        return reviewed && inputs.name !== '' && inputs.assetUrl !== '' && inputs.repoUrl !== '' && isUrlValid(inputs.assetUrl);
    }

    const handleSave = () => {
        dispatch(showIndicator());
        const asset: Asset = {
            name: inputs.name,
            description: inputs.description,
            type: assetType,
            appUrl: inputs.assetUrl,
            repoUrl: inputs.repoUrl,
            otherUrls: new Map<string, string>(),
            owners: selectedOwners,
            developers: selectedDevelopers,
            organizations: [organization]
        }
        if (props.asset) {
            asset.id = props.asset.id;
            asset.uuid = props.asset.uuid;
            asset.organizations = props.asset.organizations;
            AssetApi.updateAsset(asset, image!).then(() => {
                onClose();
                props.loadPage();
            });
        } else {
            AssetApi.createAsset(asset, image!).then(() => {
                onClose();
                props.loadPage();
            });
        }
    }

    const renderTab = () => {
        switch (activeTabIndex) {
            case 0:
                return (
                    <Fragment>
                        <Typography variant="h6">
                            Details
                        </Typography>
                        {/* Cover Image */}
                        <Button className="upload-btn" variant="outlined" component="label"
                                startIcon={imageUrl === "" ? <FileUpload/> : null}>
                            {imageUrl === "" ? "Upload Cover Image" :
                                <img className="cover-img" alt="asset" src={imageUrl}/>
                            }
                            <input accept="image/*" hidden type="file"
                                   onChange={event => onChangeUploadImage(event)}/>
                        </Button>

                        <Grid container spacing={2}>
                            <Grid item xs={8}>
                                {/* Name */}
                                <TextField autoComplete="off" required fullWidth
                                           name="name" label="Name"
                                           value={inputs.name}
                                           onChange={onInputChange} />
                                {(reviewed && inputs.name === '') &&
                                    <div className="invalid-message">Please input asset's name!</div>
                                }
                            </Grid>
                            <Grid item xs={4}>
                                {/* Type */}
                                <TextField select fullWidth label="Type" value={assetType || ''}
                                           onChange={onTypeChange}>
                                    {ASSET_TYPES.map(type =>
                                        <MenuItem key={type} value={type}>
                                            {type}
                                        </MenuItem>
                                    )}
                                </TextField>
                            </Grid>
                        </Grid>
                        {/* Description */}
                        <TextField autoComplete="off" fullWidth multiline maxRows={3} name="description"
                                   label="Description" value={inputs.description}
                                   onChange={onInputChange}/>
                    </Fragment>
                )
            case 1:
                return (
                    <Fragment>
                        <Typography variant="subtitle1">
                            The URL to the asset
                        </Typography>
                        {/* App URL */}
                        <TextField autoComplete="off" required fullWidth name="assetUrl"
                                   label="Asset URL" value={inputs.assetUrl}
                                   onChange={onInputChange}/>
                        {(reviewed && inputs.assetUrl === '') &&
                            <div className="invalid-message">Please input asset's URL!</div>
                        }
                        {(!isUrlValid(inputs.assetUrl)) &&
                            <div className="invalid-message">Please start with http(s):// or ftps://</div>
                        }

                        <Typography variant="subtitle1">
                            The URL to asset's repository like Github, Social Coding, Azure DevOps...
                        </Typography>
                        {/* Repository URL */}
                        <TextField autoComplete="off" required fullWidth name="repoUrl"
                                   label="Repository URL" value={inputs.repoUrl}
                                   onChange={onInputChange}/>
                        {(reviewed && inputs.repoUrl === '') &&
                            <div className="invalid-message">Please input repository's URL!</div>
                        }
                        {(!isUrlValid(inputs.repoUrl)) &&
                            <div className="invalid-message">Please start with http(s):// or ftps://</div>
                        }
                        {/*<Typography variant="subtitle1">*/}
                        {/*    The other URL(s) that related to asset like Swagger, SonarQube, Document...*/}
                        {/*</Typography>*/}
                        {/*<Grid container spacing={4}>*/}
                        {/*    <Grid item xs={4}>*/}
                        {/*        /!* URL Name *!/*/}
                        {/*        <TextField label="URL's name" fullWidth/>*/}
                        {/*    </Grid>*/}
                        {/*    <Grid item xs={8}>*/}
                        {/*        /!* URL *!/*/}
                        {/*        <TextField label="URL" fullWidth/>*/}
                        {/*    </Grid>*/}
                        {/*</Grid>*/}
                    </Fragment>
                )
            case 2:
                return (
                    <Fragment>
                        <Typography variant="h6">
                            Owner(s)
                        </Typography>
                        {selectedOwners.length > 0 && selectedOwners.map((owner, index) =>
                            <div className="owners" key={owner.id}>
                                <div className="left-wrapper">
                                    <Person className="person-icon"/>
                                    <div className="search-item">{owner.displayName}</div>
                                </div>
                                {index !== 0 &&
                                    <IconButton color="error" onClick={() => handleRemoveOwner(owner)}>
                                        <Delete/>
                                    </IconButton>
                                }
                            </div>
                        )}
                        <Typography variant="subtitle1">
                            Search
                        </Typography>
                        <TextField autoComplete="off" fullWidth name="owner" label="Find owner by name"
                                   value={inputOwner} onChange={onChangeSearchOwner}/>
                        {searchedOwners.map(employee =>
                            <div className="owners" key={employee.id}>
                                <div className="left-wrapper">
                                    <Person className="person-icon"/>
                                    <div className="search-item">{employee.displayName}</div>
                                </div>
                                <IconButton color="primary" onClick={() => handleSelectOwner(employee)}>
                                    <Add/>
                                </IconButton>
                            </div>
                        )}
                    </Fragment>
                )
            case 3:
                return (
                    <Fragment>
                        <Typography variant="h6">
                            Developer(s)
                        </Typography>
                        {selectedDevelopers.length > 0 ? selectedDevelopers.map(developer =>
                            <div className="developers" key={developer.id}>
                                <div className="left-wrapper">
                                    <Person className="person-icon"/>
                                    <div className="search-item">{developer.displayName}</div>
                                </div>
                                <IconButton color="error" onClick={() => handleRemoveDeveloper(developer)}>
                                    <Delete/>
                                </IconButton>
                            </div>
                        ) : (
                            <div className="no-data-text">There is no selected developer</div>
                        )}
                        <Typography variant="subtitle1">
                            Search
                        </Typography>
                        <TextField autoComplete="off" required fullWidth name="developer"
                                   label="Find developer by name"
                                   value={inputDeveloper}
                                   onChange={onChangeSearchDeveloper}/>
                        {searchedDevelopers.map(employee =>
                            <div className="developers" key={employee.id}>
                                <div className="left-wrapper">
                                    <Person className="person-icon"/>
                                    <div className="search-item">{employee.displayName}</div>
                                </div>
                                <IconButton color="primary" onClick={() => handleSelectDeveloper(employee)}>
                                    <Add/>
                                </IconButton>
                            </div>
                        )}
                    </Fragment>
                )
            default:
                return <ReviewAssetComponent imageUrl={imageUrl} name={inputs.name} type={assetType}
                                             description={inputs.description}
                                             assetUrl={inputs.assetUrl} repoUrl={inputs.repoUrl}
                                             owners={selectedOwners} developers={selectedDevelopers}
                                             isValidSave={isValidToSave()}/>
        }
    }

    return (
        <Dialog className="asset-mgmt-dialog" fullScreen open={props.open}>
            <IconButton className="close-btn" onClick={onClose}>
                <Close/>
            </IconButton>

            <DialogTitle>
                {props.asset ? `Edit ${DIGI_ASSET.toLowerCase()}` : `Create new ${DIGI_ASSET.toLowerCase()}`}
            </DialogTitle>

            <DialogContent>
                <Tabs value={activeTab} onChange={onTabChange}>
                    {TABS.map(tab =>
                        <Tab key={tab} value={tab} label={tab}/>
                    )}
                </Tabs>
                {renderTab()}
            </DialogContent>
            <DialogActions>
                {activeTabIndex === TABS.length - 1 ? (
                    <Button variant="contained" color="primary"
                            disabled={!isValidToSave()}
                            onClick={handleSave}>
                        {props.asset ? "Update" : "Create"}
                    </Button>
                ) : (
                    <Button variant="contained" color="primary" onClick={handleReview}>
                        {props.asset ? "Review + update" : "Review + create"}
                    </Button>
                )}
                <Button variant="contained" color="inherit"
                        disabled={activeTabIndex === 0}
                        onClick={handlePreviousTab}>
                    Previous
                </Button>
                <Button variant="contained" color="inherit"
                        disabled={activeTabIndex === TABS.length - 1}
                        onClick={handleNextTab}>
                    Next
                </Button>
            </DialogActions>
        </Dialog>
    )
}

type ReviewAssetProps = {
    imageUrl: string;
    name: string;
    type: string;
    description: string;
    assetUrl: string;
    repoUrl: string;
    owners: Employee[];
    developers: Employee[];
    isValidSave: boolean;
}

function ReviewAssetComponent(props: ReviewAssetProps) {

    return (
        <div className="review-asset-container">

            {!props.isValidSave &&
                <div className="error-message">
                    * Please fulfill all required data in
                    {(!props.name || props.name === '') && " 'Basics'"}
                    {(!props.assetUrl || props.assetUrl === '' || !props.repoUrl || props.repoUrl === '') ? " 'Useful Links'" : null}
                    .
                </div>
            }

            <Typography variant="h6">
                Details
            </Typography>
            <Grid container spacing={2}>
                <Grid item xs={4} className="title">
                    Cover image
                </Grid>
                <Grid item xs={8}>
                    {props.imageUrl == "" ? '' :
                        <img className="cover-img" alt="asset" src={props.imageUrl}/>
                    }
                </Grid>
                <Grid item xs={4} className="title">
                    Name
                </Grid>
                <Grid item xs={8}>
                    {props.name}
                </Grid>
                <Grid item xs={4} className="title">
                    Type
                </Grid>
                <Grid item xs={8}>
                    {props.type}
                </Grid>
                <Grid item xs={4} className="title">
                    Description
                </Grid>
                <Grid item xs={8}>
                    {props.description}
                </Grid>
                <Grid item xs={4} className="title">
                    Asset's URL
                </Grid>
                <Grid item xs={8}>
                    {props.assetUrl}
                </Grid>
                <Grid item xs={4} className="title">
                    Repository's URL
                </Grid>
                <Grid item xs={8}>
                    {props.repoUrl}
                </Grid>
            </Grid>

            <Typography variant="h6">
                Owners
            </Typography>
            {props.owners.map(owner =>
                <div key={owner.id} className="owner-name">• {owner.displayName}</div>
            )}

            <Typography variant="h6">
                Developers
            </Typography>
            {props.developers.length > 0 ? props.developers.map(developer =>
                <div key={developer.id} className="developer-name">• {developer.displayName}</div>
            ) : (
                <div className="no-data-text">There is no selected developer</div>
            )}
        </div>
    )
}
