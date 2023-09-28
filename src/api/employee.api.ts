import axios from "./digi-http";
import {BACKEND_URL} from "../contants";
import {Employee} from "../models/Employee";
import {AxiosResponse} from "axios";

const API_URL = `${BACKEND_URL}/employees`;

type Params = {
    unitName?: string;
    employeeName?: string;
    employeeTypes?: string;
    getUnit?: boolean;
    page: number;
    size: number;
    sort?: string;
}

export type EmployeeNumber = {
    all: number;
    internal: number;
    external: number;
    fixedTerm: number;
}

export type SyncEmployee = {
    groupId: number;
    newEmployees: Employee[];
    updatedEmployees: Employee[];
    deletedEmployees: Employee[];
}

export class EmployeeAPI {

    static async getEmployees(params: Params): Promise<AxiosResponse> {
        try {
            return await axios.get(API_URL, { params });
        } catch (e) {
            throw e;
        }
    }

    static async getEmployeesByUnitId(unitId: number, page?: number, size?: number): Promise<Employee[]> {
        let params = { page: 0, size: 50 };
        params.page = page ?? 0;
        params.size = size ?? 50;
        const res = await axios.get(`${API_URL}/units/${unitId}`, { params });
        return res.data;
    }

    static async getEmployeesByOrgId(orgId: number, page?: number, size?: number): Promise<Employee[]> {
        let params = { page: 0, size: 50 };
        params.page = page ?? 0;
        params.size = size ?? 50;
        const res = await axios.get(`${API_URL}/organizations/${orgId}`, { params });
        return res.data;
    }

    static getEmployeeByNtid(ntid: string): Promise<Employee> {
        try {
            return axios.get(`${API_URL}/${ntid}`).then(res => res.data);
        } catch (e) {
            throw e;
        }
    }

    static async getEmployeeNumber(params?: {groupName?: string, employeeName?: string, employeeTypes?: string}): Promise<EmployeeNumber> {
        try {
            return await axios.get(`${API_URL}/number`, { params }).then(res => res.data);
        } catch (e) {
            throw e;
        }
    }

    static async syncEmployees(employee: SyncEmployee): Promise<Employee[]> {
        try {
            return await axios.post(`${API_URL}/sync`, employee).then(res => res.data);
        } catch (e) {
            throw e;
        }
    }

    static async deleteEmployeeByNtid(ntid: string): Promise<void> {
        try {
            return await axios.delete(`${API_URL}/${ntid}`);
        } catch (e) {
            throw e;
        }
    }

    static updateAvatar(ntid: string, image: File): Promise<Employee> {
        const formData = new FormData();
        formData.append("ntid", ntid);
        formData.append("image", image);
        return axios.putForm(`${API_URL}/avatar`, formData).then(res => res.data);
    }

    static async getSelectedEmployeesForApplication(ntids: string | undefined): Promise<Employee[]> {
        try {
            return await axios.get(`${API_URL}/list-devs/${ntids}`).then(res => res.data);
        }
        catch (e) {
            throw e;
        }
    }
}
