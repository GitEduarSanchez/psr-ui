import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { RouterOutlet } from '@angular/router';
import { SyncFolderRequest } from '@core/interfaces/sync-folder-request.interface';
import { FileManagerService } from '@core/services/file-manager.service';
import { GoogleApiService } from '@core/services/google-api.service';
import { StorageService } from '@core/services/storage.service';
import { FolderSyncComponent } from 'src/app/shared/components/folder-sync/folder-sync.component';
import { SelectedFolder } from 'src/app/shared/components/folder-sync/interfaces/selected-folder.interface';
import { DialogConfig } from 'src/app/shared/interfaces/dialog-config.interface';
import { FolderSyncConfig } from 'src/app/shared/interfaces/folder-sync-config.interface';
import { DialogService } from 'src/app/shared/services/dialog.service';
import { LoaderService } from 'src/app/shared/services/loader.service';
import Swal, { SweetAlertIcon } from 'sweetalert2';
import { DriveService } from '../../services/drive.service';

@Component({
  selector: 'app-my-drive',
  standalone: true,
  imports: [
    RouterOutlet,
    FolderSyncComponent
],
  templateUrl: './my-drive.component.html',
  styleUrl: './my-drive.component.scss'
})
export class MyDriveComponent implements OnInit{

  public folderSyncConfig: FolderSyncConfig = {items: []};
  private matDialogRef!: MatDialogRef<any>;
  private syncFolderRequest!: SyncFolderRequest;
  private googleAuthToken: string = '';
  
  //TODO: Remove hardcoded user id when authentication is implemented
  private userId = 'dddd440076062f28f7b8dcba6fa8067cffc59'

  @ViewChild('folderSyncTemplate') folderSyncTemplate!: TemplateRef<any>;

  constructor(
    private googleApiService: GoogleApiService,
    private dialogService: DialogService,
    private fileManagerService: FileManagerService,
    private storageService: StorageService,
    private loaderService: LoaderService,
    private driveService: DriveService
  ) {}

  ngOnInit(): void {
    this.googleAuthToken = this.storageService.getLocalStorage('googleAuthToken');
    if (this.googleAuthToken) {
      this.syncFolderRequest = {
        access_token: this.googleAuthToken,
        folders: [],
      }
    }
  }

  public openGoogleModal(template?: TemplateRef<any>): void {
    if (this.matDialogRef) {
      this.matDialogRef.close();
    }
    const data: DialogConfig =  {
      closeAfterConfirm: false,
      contentTemplate: template,
    }
    this.matDialogRef = this.dialogService.open(data);
  }

  public async login() {
    try {
      this.matDialogRef.close();
      const authenticated = await this.googleApiService.signIn();
      if (authenticated) {
        this.getGoogleDriveFolders();
      } else {
        console.warn('User not authenticated.');
      }
    } catch (error) {
      console.error('Sign-in error:', error);
    }
  }

  public getGoogleDriveFolders(): void {
    this.googleApiService.getGoogleDriveFolders().subscribe({
      next: (res) => {
        this.folderSyncConfig.items = res.data.folders;
        this.openFolderSyncModal();
      },
      error: (error) => {
        console.error('Failed to fetch folders:', error);
      }
    });
  } 
  
  public sendFoldersToSync() {
    this.loaderService.startLoader()
    this.fileManagerService.syncGoogleDriveFolders(this.syncFolderRequest).subscribe({
      next: (response) => {
        console.log('Response:', response);
        this.loaderService.stopLoader();
        this.matDialogRef.close();
        this.notifyMessage('Folders synced successfully!');
        this.driveService.triggerRefreshFolders();
      },
      error: (error) => {
        console.error('Error:', error);
        this.loaderService.stopLoader();
        this.matDialogRef.close();
        this.notifyMessage('Error syncing folders.', 'error');
      },
      
    });
  }

  public onSelectedFolder(selectedFolder: SelectedFolder) {
    if (selectedFolder.checked) {
      this.syncFolderRequest.folders.push({
        user_id: this.userId,
        folder_id: selectedFolder.id,
      });
    }
    else {
      this.syncFolderRequest.folders = this.syncFolderRequest.folders.filter(
        (folder) => folder.folder_id !== selectedFolder.id
      );
    }
  }
  
  protected openFolderSyncModal() {
    if(this.folderSyncTemplate) {
      this.matDialogRef = this.dialogService.open({
         width: '45vw',
         height: '80vh',
         contentTemplate: this.folderSyncTemplate
       })
    }
  }

  private notifyMessage(message: string, icon: SweetAlertIcon = 'success') {
    Swal.fire({
      icon: icon,
      iconColor: '#6200EE',
      title: message,
      color: '#6200EE',
      timer: 2000,
      showConfirmButton: true,
    })
  }
}
