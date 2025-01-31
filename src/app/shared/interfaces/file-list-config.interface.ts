import { FileListLayoutType } from "../enums/file-list-layout-type.enum";
import { FileItemConfig } from "./file-item-config.interface";

export interface FileListConfig {
    layoutType: FileListLayoutType
    items: FileItemConfig[]
}