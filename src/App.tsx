import "./App.scss";
import {useEffect, useState} from "react";
import {Route, Routes, useLocation} from "react-router-dom";
import axios from "./api/digi-http";
import {AxiosError} from "axios";
import {useAppDispatch, useAppSelector} from "./custom-hooks/hook";
import {setAccount} from "./app/account.slice";
import {hideIndicator} from "./app/app.slice";
// Authentication
import {InteractionStatus} from "@azure/msal-browser";
import {useIsAuthenticated, useMsal} from "@azure/msal-react";
import {loginRequest} from "./auth.config";
// Components
import ActivityIndicator from "./components/activity-indicator/ActivityIndicator";
import Sidebar from "./layouts/sidebar/Sidebar";
import HeaderComponent from "./layouts/header/HeaderComponent";
import SearchingComponent from "./pages/searching/SearchingComponent";
import AssetMgmtComponent from "./pages/asset-management/AssetMgmtComponent";
import AssetApproveComponent from "./pages/asset-approval/AssetApproveComponent";
import OrgMgmtComponent from "./pages/org-management/OrgMgmtComponent";
import GroupMgmtComponent from "./pages/group-management/GroupMgmtComponent";
import OrgChartComponent from "./pages/group-management/org-chart/OrgChartComponent";
import EmployeeMgmtComponent from "./pages/employee-management/EmployeeMgmtComponent";
import HelpComponent from "./pages/help/HelpComponent";
import HomeComponent from './pages/home/HomeComponent';
// Constants
import {IMAGE_URI} from "./contants";
import {AppRoutes} from "./contants/Routes";

function App() {
    const [sidebarOpened, setSidebarOpened] = useState(true);
    const {instance, accounts, inProgress} = useMsal();
    const {pathname} = useLocation();
    const isAuthenticated = useIsAuthenticated();

    const sidebar = useAppSelector(state => state.sidebar);
    const dispatch = useAppDispatch();

    useEffect(() => {
        const request = {
            ...loginRequest,
            account: accounts[0]
        };
        instance.acquireTokenSilent(request).then(response => {
            setupApiInterceptor(response.accessToken);
            dispatch(setAccount({
                name: String(accounts[0].name),
                username: String(accounts[0].username),
                familyName: String(accounts[0].idTokenClaims!['family_name']),
                givenName: String(accounts[0].idTokenClaims!['given_name']),
                email: String(accounts[0].idTokenClaims!['email']),
                roles: accounts[0].idTokenClaims!.roles ?? [],
            }));
        }).catch(() => {
            if (!isAuthenticated && inProgress === InteractionStatus.None) {
                instance.loginRedirect(loginRequest).catch(e => {
                    console.error(e);
                })
            }
        })
    }, [isAuthenticated, inProgress, instance]);

    const setupApiInterceptor = (accessToken: string) => {
        axios.interceptors.request.use(
            config => {
                config.headers["Authorization"] = 'Bearer ' + accessToken;
                return config;
            },
            error => {
                return Promise.reject(error);
            }
        );
        axios.interceptors.response.use(
            res => {
                return res;
            },
            (error: AxiosError) => {
                dispatch(hideIndicator());
                if (error.response && error.response.status === 401 && error.response.data === 'Token was expired') {
                    instance.loginRedirect(loginRequest).catch(e => {
                        console.error(e);
                    })
                }
                return Promise.reject(error);
            }
        );
    }

    const isHomepage = () => {
        return pathname === "/";
    }

    return (
        <div className="App">
            <ActivityIndicator/>

            <img className="bosch-brand" alt="bosch-brand" src={`${IMAGE_URI}/bosch-band.png`}/>
            <section>
                <Sidebar open={sidebarOpened}
                         handleOpen={() => setSidebarOpened(true)}
                         handleClose={() => setSidebarOpened(false)}/>
                <section className="app-container" style={{marginLeft: sidebar.showSidebar ? "56px" : ""}}>
                    { isHomepage() ? null : <HeaderComponent/> }
                    <div className="app-body">
                        <Routes>
                            <Route path="/" element={<HomeComponent/>}/>
                            <Route path={AppRoutes.SEARCH_PAGE} element={<SearchingComponent/>}/>
                            <Route path={AppRoutes.ASSET_MGMT} element={<AssetMgmtComponent/>}/>
                            <Route path={AppRoutes.ASSET_APPROVAL} element={<AssetApproveComponent/>}/>
                            <Route path={AppRoutes.ORGANIZATION_MGMT} element={<OrgMgmtComponent/>}/>
                            <Route path={AppRoutes.UNIT_MGMT}>
                                <Route index element={<GroupMgmtComponent/>}/>
                                <Route path="org-chart" element={<OrgChartComponent/>}/>
                            </Route>
                            <Route path={AppRoutes.EMPLOYEE_MGMT} element={<EmployeeMgmtComponent/>}/>
                            <Route path={AppRoutes.HELP_PAGE} element={<HelpComponent/>}/>
                        </Routes>
                    </div>
                </section>
            </section>
        </div>
    );
}

export default App;
