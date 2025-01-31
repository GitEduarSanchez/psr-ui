import { MatMenuActions } from "./mat-menu-actions.interface";

export interface FolderConfig {
    id: string; 
    name: string;
    creationDate: string;
    modificationDate: string;
    userId: string;
    storageProvider: string;
    icon?: string;
    matMenuActions?: MatMenuActions;
    secondaryIcon?: string;
}