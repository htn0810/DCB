import axios from "./digi-http";
import { BACKEND_URL } from "../contants";

const API_URL = `${BACKEND_URL}/external`;

export class ExternalApi {
  static syncOrganization(orgName: string): Promise<OrgGroup> {
    return axios
      .get(`${API_URL}/org-manager`, { params: { orgName } })
      .then((res) => res.data)
      .catch((e) => console.error(e));
  }

  static syncEmployees(orgName: string): Promise<LdapUser[]> {
    return axios
      .get(`${API_URL}/ldap`, { params: { orgName } })
      .then((res) => res.data)
      .catch((e) => console.error(e));
  }

  static getDataCoreSearch(keyword: string) {
    return axios
      .get(`${API_URL}/core-search`, {
        params: {
          text: keyword,
        },
      })
      .then((res) => res.data)
      .catch((e) => console.error(e));
  }
}

export type OrgGroup = {
  name: string;
  description: string;
  manager: Employee;
  employees: Employee[];
  orgParent: OrgGroup[];
  orgChildren: OrgGroup[];
};

export type Employee = {
  ntid: string;
  employeeId: string;
  fullName: string;
  email: string;
};

export type LdapUser = {
  ntid: string;
  firstName: string;
  lastName: string;
  displayName: string;
  email: string;
  department: string[];
  streetAddress: string;
  targetAddress: string;
  phoneNumber: string;
  distinguishedName: string;
  corporate: string;
  imageUrl: string;
  memberOf: string[];
  createdDate?: Date;
  lastModifiedDate?: Date;
};
