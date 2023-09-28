export type Unit = {
    id?: number;
    name: string;
    description: string;
    manager: {
        ntid: string;
        employeeId: string;
        fullName: string;
        email: string;
    };
    children: Unit[];
    totalEmployeesOfEachLevel: number;
    fixedtermEmployeesCount: number;
    externalEmployeesCount: number;
    internalEmployeesCount: number;
    lastSynchronizedSubUnitsDate: string;
    lastSynchronizedEmployeesDate: string;
}
