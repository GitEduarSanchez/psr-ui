import { Address } from "./address.interface";
import { Person } from "./person.interface";

export interface IUserInformation {
    id: string;
    person: Person,
    address: Address[]
}

