export interface Staff {
    staffId?: number;
    name: string;
    address: string;
    mobileNo: string;
    areaId: number;
    areaName?: string;
    dateOfJoining: string;
    dateOfLeaving: string;
    username?: string;
    password?: string;
    status?:string;
    statusId?:string;
    role?:string;
    roleId?:string;
}