import { User } from "./general-data.interface";

export interface UserList {
    items : User[];
    totalCount: number;
    pageNumber: number;
    pageSize: number;
}