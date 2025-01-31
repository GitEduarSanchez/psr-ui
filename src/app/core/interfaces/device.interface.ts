import { IReaderHistories } from "./reader-histories.interface";
import { ServiceState } from "./service-state.interface";

export interface Device {
    guid: string;
    deviceType: string;
    provider: string;
    qr: QR;
    state: ServiceState;
    reader: Reader;
    readerHistories: IReaderHistories;
}

export interface QR {
    code: string;
    uri: string;
}

export interface Reader {
    reader: string;
    dateTime: string | Date;
    lastReader: string;
}