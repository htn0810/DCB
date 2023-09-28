import {Organization} from "./Organization";
import {Employee} from "./Employee";

export interface Asset {
    id?: number;
    uuid?: string;
    name: string;
    description: string;
    imageUrl?: string;
    owners: Employee[];
    developers: Employee[];
    appUrl: string;
    repoUrl: string;
    otherUrls: Map<string, string>;
    publishedDate?: Date;
    status?: string;
    type: string;
    organizations: Organization[];
}
