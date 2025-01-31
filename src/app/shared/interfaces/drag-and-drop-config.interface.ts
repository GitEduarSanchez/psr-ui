import { DragAndDropItemType } from "../enums/drag-and-drop-item-type.enum";
import { FileItemConfig } from "./file-item-config.interface";
import { FolderConfig } from "./folder-config.interface";

export interface DragAndDropConfig { 
    folders?: FolderConfig[];
    files?: FileItemConfig[];
    itemType: DragAndDropItemType;
}