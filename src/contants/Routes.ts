import {DIGI_ASSET} from "./index";

export const AppRoutes = {
    SEARCH_PAGE: "/searching",
    ASSET_MGMT: "/asset-management",
    ASSET_APPROVAL: "/asset-approval",
    USER_MGMT: "/user-management",
    EMPLOYEE_MGMT: "/employee-management",
    ORGANIZATION_MGMT: "/organization-management",
    UNIT_MGMT: "/unit-management",
    GROUP_ORG_CHART: "/group-management/org-chart",
    GROUP_DETAIL: "/group-management/details",
    GROUP_DETAIL_SYNC: "/group-management/details/sync",
    GROUP_DETAIL_EMP_HISTORY: "/group-management/details/employee-history",
    HELP_PAGE: "/help",
}

export const AppRouteLabels = {
    SEARCH_PAGE: "Search Page",
    ASSET_MGMT: `${DIGI_ASSET} Management`,
    ASSET_APPROVAL: `${DIGI_ASSET} Approval`,
    USER_MGMT: "User Management",
    EMPLOYEE_MGMT: "Employee Management",
    ORGANIZATION_MGMT: "Organization Management",
    UNIT_MGMT: "Unit Management",
    GROUP_DETAIL: `Group Detail`,
    GROUP_ORG_CHART: `Org Chart`,
    GROUP_DETAIL_SYNC: `Sync Employees`,
    GROUP_DETAIL_EMP_HISTORY: `Sync Employees History`,
    HELP_PAGE: `Help`,
}
