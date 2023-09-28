import axios from "./digi-http";
import {BACKEND_URL} from "../contants";
import {Organization} from "../models/Organization";
import {AxiosResponse} from "axios";

const API_URL = `${BACKEND_URL}/organizations`;

export class OrganizationApi {

    static async getAllOrganizations(): Promise<Organization[]> {
        const res = await axios.get(API_URL);
        return res.data;
    }

    static async createOrganization(organization: Organization): Promise<Organization> {
        const res = await axios.post(API_URL, organization);
        return res.data;
    }

    static async updateOrganization(organization: Organization): Promise<Organization> {
        const res = await axios.put(API_URL, organization);
        return res.data;
    }

    static deleteOrganizationById(id: number): Promise<AxiosResponse> {
        return axios.delete(`${API_URL}/${id}`);
    }
}
