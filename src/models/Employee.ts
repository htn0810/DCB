import {Unit} from "./Unit";

export interface Employee {
    id?: number;
    ntid: string;
    employeeId: string | null;
    firstName: string;
    lastName: string;
    displayName: string;
    email: string;
    type?: string;
    imageUrl?: string;
    units?: Unit[];
    createdDate?: Date;
    lastModifiedDate?: Date;
}
