import { DragDropModule } from '@angular/cdk/drag-drop';
import { CommonModule } from '@angular/common';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from "@angular/material/card";
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { FileManagerService } from '@core/services/file-manager.service';
import { map } from 'rxjs';
import { FileListConfig } from '../../interfaces/file-list-config.interface';
import { FolderConfig } from '../../interfaces/folder-config.interface';
import { MatMenuActions } from '../../interfaces/mat-menu-actions.interface';
import { DragAndDropComponent } from "../drag-and-drop/drag-and-drop.component";
import { DragAndDropItemType } from '../../enums/drag-and-drop-item-type.enum';
import { LoaderService } from '../../services/loader.service';
import Swal, { SweetAlertIcon } from 'sweetalert2';
import { DriveService } from 'src/app/admin/components/drive-container/services/drive.service';

@Component({
  selector: 'folder-list',
  standalone: true,
  imports: [
    CommonModule,
    DragDropModule,
    MatButtonModule,
    MatMenuModule,
    MatIconModule,
    MatCardModule,
    MatSnackBarModule,
    DragAndDropComponent
],
  templateUrl: './folder-list.component.html',
  styleUrls: ['./folder-list.component.scss']
})
export class FolderListComponent implements OnInit {
  @ViewChild('fileInput', {static: false}) fileInput!: ElementRef;
  @ViewChild('folderInput', {static: false}) folderInput!: ElementRef;

  public allowedFileTypes = [
    'application/pdf',
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', // Excel
    'application/vnd.ms-excel', // Excel (older format)
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document', // Word
    'application/msword', // Word (older format)
    'image/png', // Image
    'image/jpeg', 
    'image/jpg', 
    'image/gif'
  ];

  public showOptions: boolean = false;
  public isDragOver= false;
  public fileListConfig!: FileListConfig
  public folders: FolderConfig[] = [];
  public dragAndDropItemType = DragAndDropItemType

  private folderMatMenuActions: MatMenuActions = {
    showRename: true,
    showDelete: true,
    showGetInfo: true,
  }

  constructor(
    private fileManagerService: FileManagerService,
    private router: Router,
    private loaderService: LoaderService,
    private driveService: DriveService
  ) {}

  ngOnInit() {
    this.subscribeToRefreshFolders();
    this.getAllFolders();
  }

  public uploadFiles(event: { id: string; files: File[] }): void {
    //TODO: Remove hardcoded user id when authentication is implemented
    const userId = "dddd440076062f28f7b8dcba6fa8067cffc59"
    this.loaderService.startLoader();
    this.fileManagerService.uploadFiles(event.id, userId, event.files).subscribe({
      next: () => {
        this.loaderService.stopLoader();
        this.notifyMessage('Files uploaded successfully!');
        this.getAllFolders();
      },
      error: (error) => {
        console.error('Error uploading files:', error);
      },
    });
  }

  public onOpenFolder(id: string) {
    this.router.navigate([this.router.url + '/folders', id]);
  }

  public onDeleteFolder(folderId: string): void {
    this.loaderService.startLoader();
    this.fileManagerService.deleteFolder(folderId).subscribe({
      next: () => {
        this.loaderService.stopLoader();
        this.getAllFolders();
      },
      error: (error) => {
        console.error('Error deleting folder:', error);
        this.loaderService.stopLoader();
      }
    });
  }

  private getAllFolders() {
    //TODO: Remove hardcoded user id when authentication is implemented
    const id = 'dddd440076062f28f7b8dcba6fa8067cffc59'
    this.fileManagerService.getAllFolders(id)
    .pipe(
      map((res) =>
        res.data.map((folder: any) => this.mapToFolderConfig(folder))
      )
    )
    .subscribe({
      next: (folders) => {
        this.folders = folders;
      },
      error: (error) => {
        console.error('Error fetching folders:', error);
      }
    });
  }

  private mapToFolderConfig(folder: any): FolderConfig {
    return {
      id: folder.folder_id,
      name: folder.folder_name,
      creationDate: folder.creation_date,
      modificationDate: folder.modification_date,
      userId: folder.user_id,
      storageProvider: folder.storage_provider,
      icon: '/assets/svg/folder-item-icon.svg',
      matMenuActions: this.folderMatMenuActions,
    };
  }

  private notifyMessage(message: string, icon: SweetAlertIcon = 'success') {
    Swal.fire({
      icon: icon,
      iconColor: '#6200EE',
      title: message,
      color: '#6200EE',
      showConfirmButton: true,
    })
  }

  private subscribeToRefreshFolders() {
    this.driveService.refreshFolders$.subscribe(() => {
      this.getAllFolders();
    });
  }
}
