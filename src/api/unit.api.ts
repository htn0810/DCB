import axios from "./digi-http";
import {Unit} from "../models/Unit";
import {BACKEND_URL} from "../contants";

const API_URL = `${BACKEND_URL}/units`;

interface Params {
    orgId?: number;
    parentId?: number;
    name?: string;
}

export class UnitApi {

    static async getAllUnits(params: Params): Promise<Unit[]> {
        const res = await axios.get(API_URL, { params })
        return res.data;
    }

    static async getUnitById(id: number, getChildren = false): Promise<Unit> {
        try {
            return await axios.get(`${API_URL}/${id}`, { params: {getChildren} }).then(res => res.data);
        } catch (e) {
            throw e;
        }
    }

    static async searchUnitsByUnitName(name: string): Promise<string[]> {
        try {
            return await axios.get(`${API_URL}/search`, { params: {name} }).then(res => res.data);
        } catch (e) {
            throw e;
        }
    }

    static async getFamilyUnitsBySelfId(id: number): Promise<Unit[]> {
        try {
            return await axios.get(`${API_URL}/family-groups`, { params: {id} }).then(res => res.data);
        } catch (e) {
            throw e;
        }
    }

    static async getAllParentGroupsByGroupId(id: number): Promise<Unit[]> {
        try {
            return await axios.get(`${API_URL}/parent`, { params: {id} }).then(res => res.data);
        } catch (e) {
            throw e;
        }
    }

    static async syncUnitChildren(data: SyncUnitChildren): Promise<Unit[]> {
        try {
            return await axios.post(`${API_URL}/sync-children`, data).then(res => res.data);
        } catch (e) {
            throw e;
        }
    }

    static async updateDirectManagerAPI(data: Manager) {
        try {
            return await axios.put(`${API_URL}/manager`, data).then(res => res.data);
        } catch (e) {
            throw e;
        }
    }

    static deleteUnitById(id: number): Promise<void> {
        try {
            return axios.delete(`${API_URL}/{id}`, { params: {id} });
        } catch (e) {
            throw e;
        }
    }
}

export type SyncUnitChildren = {
    parentId: number;
    newChildren: Children[];
    updatedChildren: Children[];
    deletedChildren: Children[];
}

type Children = {
    id: number
    name: string;
    description: string;
}

export type Manager = {
    groupId?: number;
    ntid: string;
    employeeId: string;
    name: string;
    email: string;
}
