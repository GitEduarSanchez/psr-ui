import { Device } from "./device.interface";
import { Gps } from "./gps.interface";

export interface Address {
    kdx: string;
    neighborhood: string;
    zone: string;
    city: string;
    country: string;
    devices: Device[];
    gps: Gps
}