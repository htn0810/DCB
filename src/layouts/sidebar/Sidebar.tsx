import "./Sidebar.scss";
import React, {Fragment} from "react";
import {useLocation, useNavigate} from "react-router-dom";
import {useIsAuthenticated, useMsal} from "@azure/msal-react";
import {useAppDispatch, useAppSelector} from "../../custom-hooks/hook";
import {
    ClickAwayListener,
    Drawer,
    IconButton,
    List,
    ListItem,
    ListItemButton,
    ListItemIcon,
    ListItemText,
    Tooltip,
    Typography
} from "@mui/material";
import {
    AccountCircle,
    AccountTree,
    Apps, ChecklistRtl,
    Close,
    Copyright,
    CorporateFare,
    Group,
    Help,
    Login,
    Logout,
    Menu,
    Search
} from "@mui/icons-material";
import {AppRouteLabels, AppRoutes} from "../../contants/Routes";
import {hideIndicator, showIndicator} from "../../app/app.slice";
import {deleteAccount} from "../../app/account.slice";
import {loginRequest} from "../../auth.config";

type Props = {
    open: boolean;
    handleOpen: () => void;
    handleClose: () => void;
}

const OPENED_SIDEBAR_WIDTH = 320;
const CLOSED_SIDEBAR_WIDTH = 56;

const cards = [
    {
        name: AppRouteLabels.SEARCH_PAGE,
        url: AppRoutes.SEARCH_PAGE,
        icon: <Search/>
    },
    {
        name: AppRouteLabels.ASSET_MGMT,
        url: AppRoutes.ASSET_MGMT,
        icon: <Apps/>,
    },
    {
        name: AppRouteLabels.ASSET_APPROVAL,
        url: AppRoutes.ASSET_APPROVAL,
        icon: <ChecklistRtl/>,
    },
    {
        name: AppRouteLabels.ORGANIZATION_MGMT,
        url: AppRoutes.ORGANIZATION_MGMT,
        icon: <CorporateFare/>,
    },
    {
        name: AppRouteLabels.UNIT_MGMT,
        url: AppRoutes.UNIT_MGMT,
        icon: <AccountTree/>,
    },
    {
        name: AppRouteLabels.EMPLOYEE_MGMT,
        url: AppRoutes.EMPLOYEE_MGMT,
        icon: <Group/>,
    },
];

const excards = [
    {
        name: AppRouteLabels.HELP_PAGE,
        url: AppRoutes.HELP_PAGE,
        icon: <Help/>,
    },
];

const VERSION = process.env.REACT_APP_VERSION;

function Sidebar(props: Props) {
    const {pathname} = useLocation();
    const navigate = useNavigate();
    const {instance} = useMsal();
    const isAuthenticated = useIsAuthenticated();
    const productionDomain = "https://digital-core.bosch.com";

    const account = useAppSelector(state => state.account);
    const sidebar = useAppSelector(state => state.sidebar);
    const dispatch = useAppDispatch();

    const isItemSelected = (path: string): boolean => {
        return path === pathname;
    }

    const handleSignOut = () => {
        dispatch(showIndicator());
        instance.logoutRedirect({
            postLogoutRedirectUri: window.location.href.includes(productionDomain) ? productionDomain : window.location.href
        }).then(() => {
            dispatch(deleteAccount());
            dispatch(hideIndicator());
        });
    }

    const handleSignIn = () => {
        instance.loginRedirect(loginRequest).catch(e => {
            console.error(e);
        })
    }

    return (
        <ClickAwayListener onClickAway={props.handleClose}>
            <Drawer style={{display: !sidebar.showSidebar ? "none" : ""}} variant="permanent" open={props.open}
                    onClose={props.handleClose}
                    sx={{
                        width: props.open ? OPENED_SIDEBAR_WIDTH : CLOSED_SIDEBAR_WIDTH,
                        flexShrink: 0,
                        '& .MuiDrawer-paper': {
                            width: props.open ? OPENED_SIDEBAR_WIDTH : CLOSED_SIDEBAR_WIDTH,
                        }
                    }}>
                <div className="sidebar-header">
                    {props.open ? (
                        <Fragment>
                            <Typography variant="h5">Digi Core</Typography>
                            <IconButton className="close-btn" onClick={props.handleClose}>
                                <Close/>
                            </IconButton>
                        </Fragment>
                    ) : (
                        <IconButton className="open-btn" onClick={props.handleOpen}>
                            <Menu/>
                        </IconButton>
                    )}
                </div>
                <List className="menu-list">
                    {cards.map(card =>
                        <ListItem className={`menu-item ${isItemSelected(card.url) ? 'selected-item' : null}`}
                                  key={card.name} disablePadding
                                  onClick={() => navigate(card.url)}>
                            <ListItemButton>
                                <Tooltip placement="right" title={props.open ? null : card.name}>
                                    <ListItemIcon>
                                        {card.icon}
                                    </ListItemIcon>
                                </Tooltip>
                                {props.open ? <ListItemText>{card.name}</ListItemText> : null}
                            </ListItemButton>
                        </ListItem>
                    )}
                </List>
                <div className="sidebar-footer">
                    <div className="help-center">
                        <List className="menu-list">
                            {excards.map(card => (
                                <ListItem className={`menu-item ${isItemSelected(card.url) ? 'selected-item' : null}`}
                                          key={card.name} disablePadding
                                          onClick={() => navigate(card.url)}>
                                    <ListItemButton>
                                        <Tooltip placement="right" title={props.open ? null : card.name}>
                                            <ListItemIcon>
                                                {card.icon}
                                            </ListItemIcon>
                                        </Tooltip>
                                        {props.open ? (
                                            <ListItemText>
                                                {card.name}
                                            </ListItemText>
                                        ) : null}
                                    </ListItemButton>
                                </ListItem>
                            ))}
                        </List>
                    </div>
                    <div className="user-info">
                        {isAuthenticated ? (
                            <List>
                                <ListItem className="menu-item" disablePadding>
                                    <ListItemButton>
                                        <Tooltip placement="right" title={account.name}>
                                            <ListItemIcon>
                                                <AccountCircle/>
                                            </ListItemIcon>
                                        </Tooltip>
                                        {props.open ? (
                                            <ListItemText>
                                                {account.familyName + ' ' + account.givenName}
                                            </ListItemText>
                                        ) : null}
                                    </ListItemButton>
                                </ListItem>
                                <ListItem className="menu-item" disablePadding onClick={handleSignOut}>
                                    <ListItemButton>
                                        <Tooltip placement="right" title="Sign Out">
                                            <ListItemIcon>
                                                <Logout/>
                                            </ListItemIcon>
                                        </Tooltip>
                                        {props.open ? (
                                            <ListItemText>
                                                Sign Out
                                            </ListItemText>
                                        ) : null}
                                    </ListItemButton>
                                </ListItem>
                            </List>
                        ) : (
                            <ListItem className="menu-item" disablePadding onClick={handleSignIn}>
                                <ListItemButton>
                                    <Tooltip placement="right" title="Sign In">
                                        <ListItemIcon>
                                            <Login/>
                                        </ListItemIcon>
                                    </Tooltip>
                                    {props.open ? (
                                        <ListItemText>
                                            Sign In
                                        </ListItemText>
                                    ) : null}
                                </ListItemButton>
                            </ListItem>
                        )}
                    </div>
                    <div className="copyrights">
                        {props.open ? (
                            <p className="copyright">&copy; DigiCore v{VERSION}</p>
                        ) : (
                            <Tooltip placement="right" title={`DigiCore version ${VERSION}`}>
                                <Copyright className="copyright-icon"/>
                            </Tooltip>
                        )}
                    </div>
                </div>
            </Drawer>
        </ClickAwayListener>
    )
}

export default Sidebar;
