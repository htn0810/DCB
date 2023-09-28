import axios from "./digi-http";
import {BACKEND_URL} from "../contants";
import {Statistics} from "../models/Statistics";
import {Organization} from "../models/Organization";

const API_URL = `${BACKEND_URL}/public`;

export class PublicApi {

    static async getStatistics(): Promise<Statistics> {
        const res = await axios.get(`${API_URL}/statistics`);
        return res.data;
    }

    static async getOrganizations(): Promise<Organization[]> {
        const res = await axios.get(`${API_URL}/organizations`);
        return res.data;
    }
}
