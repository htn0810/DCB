import {Employee} from "./Employee";
import {Unit} from "./Unit";
import {Asset} from "./Asset";

export interface Organization {
     id?: number;
     name: string;
     description: string;
     orgUrl: string;
     owners: Employee[];
     units: Unit[];
     assets: Asset[];
     employees: Employee[];
}
