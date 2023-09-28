import axios from "./digi-http";
import {BACKEND_URL} from "../contants";
import {Asset} from "../models/Asset";

const API_URL = `${BACKEND_URL}/assets`;

type Params = {
    orgId?: number;
    status?: string;
    name?: string;
}

export class AssetApi {

    static async getAllAssets(params?: Params): Promise<Asset[]> {
        if (params) {
            if (params.orgId) {
                const res = await axios.get(`${API_URL}?orgId=${params.orgId}`);
                return res.data;
            }
            if (params.status) {
                const res = await axios.get(`${API_URL}?status=${params.status}`);
                return res.data;
            }
        }
        const res = await axios.get(API_URL);
        return res.data;
    }

    static async createAsset(asset: Asset, image: File): Promise<Asset> {
        const formData = new FormData();
        formData.append("asset", new Blob([JSON.stringify(asset)], {type: 'application/json'}));
        formData.append("image", image);
        const res = await axios.postForm(API_URL, formData);
        return res.data;
    }

    static async updateAsset(microApp: Asset, image: File): Promise<Asset> {
        const formData = new FormData();
        formData.append("asset", new Blob([JSON.stringify(microApp)], {type: 'application/json'}));
        formData.append("image", image);
        const res = await axios.putForm(API_URL, formData);
        return res.data;
    }

    static async publishAsset(id: number): Promise<Asset> {
        const res = await axios.put(`${API_URL}/publish?id=${id}`);
        return res.data;
    }

    static async rejectAsset(id: number, comment: string): Promise<Asset> {
        const res = await axios.put(`${API_URL}/reject`, null, {
            params: { id, comment }
        });
        return res.data;
    }

    static deleteAssetById(id: number): Promise<void> {
        return axios.delete(`${API_URL}/${id}`);
    }
}
