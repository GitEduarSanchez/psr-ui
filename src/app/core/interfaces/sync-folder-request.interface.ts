export interface SyncFolderRequest {
    access_token: string;
    folders: Folder[];
}

export interface Folder {
    folder_id: string;
    user_id: string;
}