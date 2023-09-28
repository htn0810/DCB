import "./Breadcrumb.scss";
import React, {useEffect, useState} from "react";
import {Link, useLocation} from "react-router-dom";
import {AppRouteLabels, AppRoutes} from "../../../contants/Routes";

export const pathData = {
    home: {
        name: "Home",
        link: "/"
    },
    searching: {
        name: AppRouteLabels.SEARCH_PAGE,
        link: AppRoutes.SEARCH_PAGE
    },
    assetMgmt: {
        name: AppRouteLabels.ASSET_MGMT,
        link: AppRoutes.ASSET_MGMT
    },
    assetApproval: {
        name: AppRouteLabels.ASSET_APPROVAL,
        link: AppRoutes.ASSET_APPROVAL
    },
    manageUser: {
        name: AppRouteLabels.USER_MGMT,
        link: AppRoutes.USER_MGMT
    },
    manageEmployee: {
        name: AppRouteLabels.EMPLOYEE_MGMT,
        link: AppRoutes.EMPLOYEE_MGMT
    },
    manageOrg: {
        name: AppRouteLabels.ORGANIZATION_MGMT,
        link: AppRoutes.ORGANIZATION_MGMT
    },
    groupManagement: {
        groups: {
            name: AppRouteLabels.UNIT_MGMT,
            link: AppRoutes.UNIT_MGMT
        },
        detail: {
            name: AppRouteLabels.GROUP_DETAIL,
            link: AppRoutes.GROUP_DETAIL
        },
        employeeHistory: {
            name: AppRouteLabels.GROUP_DETAIL,
            link: AppRoutes.GROUP_DETAIL_EMP_HISTORY
        },
        sync: {
            name: AppRouteLabels.GROUP_DETAIL,
            link: AppRoutes.GROUP_DETAIL_SYNC
        },
        orgChart: {
            name: AppRouteLabels.GROUP_ORG_CHART,
            link: AppRoutes.GROUP_ORG_CHART
        }
    },
    help: {
        name: AppRouteLabels.HELP_PAGE,
        link: AppRoutes.HELP_PAGE
    },
};

export default function Breadcrumb() {
    const {pathname} = useLocation();
    const [paths, setPaths] = useState([] as any[]);

    useEffect(() => {
        const paths: string[] = pathname.slice(1).split("/");
        const breadcrumb: any[] = [];
        breadcrumb.push(pathData.home);
        for (const element of paths) {
            const path = `/${element}`;
            switch (path) {
                case AppRoutes.SEARCH_PAGE:
                    breadcrumb.push(pathData.searching);
                    break;
                case AppRoutes.ASSET_MGMT:
                    breadcrumb.push(pathData.assetMgmt);
                    break;
                case AppRoutes.ASSET_APPROVAL:
                    breadcrumb.push(pathData.assetApproval);
                    break;
                case AppRoutes.USER_MGMT:
                    breadcrumb.push(pathData.manageUser);
                    break;
                case AppRoutes.EMPLOYEE_MGMT:
                    breadcrumb.push(pathData.manageEmployee);
                    break;
                case AppRoutes.ORGANIZATION_MGMT:
                    breadcrumb.push(pathData.manageOrg);
                    break;
                case AppRoutes.UNIT_MGMT:
                    breadcrumb.push(pathData.groupManagement.groups);
                    break;
                case "/org-chart":
                    breadcrumb.push(pathData.groupManagement.orgChart);
                    break;
                case "/details":
                    breadcrumb.push(pathData.groupManagement.detail);
                    break;
                case "/sync":
                    breadcrumb.push(pathData.groupManagement.sync);
                    break;
                case "/employee-history":
                    breadcrumb.push(pathData.groupManagement.employeeHistory);
                    break;
                case "/help":
                    breadcrumb.push(pathData.help);
                    break;
                default:
            }
            setPaths(breadcrumb);
        }
    }, [pathname]);

    return (
        <div className="breadcrumb-wrapper">
            <div className="breadcrumb">
                {paths.map((path, i) => (
                    <span key={path.name}>
                        {path.link && i !== paths.length - 1 ? (
                            <Link to={path.link}>{path.name}</Link>
                        ) : ` ${path.name}`}
                        {i !== paths.length - 1 ? (
                            <span className="breadcrumb_right-arrow">&gt;</span>
                        ) : ""}
                    </span>
                ))}
            </div>
        </div>
    );
}
