import { FileListLayoutType } from "../enums/file-list-layout-type.enum";
import { FileStatus } from "../enums/file-status.enum";
import { MatMenuActions } from "./mat-menu-actions.interface";

export interface FileItemConfig  {
    id: string;
    name: string;
    creationDate: string | Date;
    modificationDate: string | Date;
    metadata: Metadata
    matMenuActions?: MatMenuActions; 
    icon?: string;
    status?: FileStatus;
    contentFolder?: ContentFolder;
    layoutType?: FileListLayoutType;
}
 
export interface ContentFolder {
    name: string;
    id: string;
}

export interface Metadata {
    extension: string;
    size: string;
}