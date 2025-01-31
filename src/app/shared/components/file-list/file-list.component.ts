import { Component } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { ActivatedRoute } from '@angular/router';
import { FileManagerService } from '@core/services/file-manager.service';
import { map } from 'rxjs';
import { FileItemConfig } from '../../interfaces/file-item-config.interface';
import { DragAndDropComponent } from "../drag-and-drop/drag-and-drop.component";
import { DragAndDropItemType } from '../../enums/drag-and-drop-item-type.enum';
import { MatMenuActions } from '../../interfaces/mat-menu-actions.interface';
import { LoaderService } from '../../services/loader.service';
import Swal, { SweetAlertIcon } from 'sweetalert2';

@Component({
  selector: 'file-list',
  standalone: true,
  imports: [
    MatButtonModule,
    MatMenuModule,
    MatIconModule,
    DragAndDropComponent
],
  templateUrl: './file-list.component.html',
  styleUrl: './file-list.component.scss'
})
export class FileListComponent {

  public folderId: string | null = null;
  public files: FileItemConfig[] = [];
  public dragAndDropItemType = DragAndDropItemType;

  private folderMatMenuActions: MatMenuActions = {
      showRename: true,
      showDelete: true,
      showGetInfo: true,
    }

  constructor(
    private route: ActivatedRoute,
    private fileManagerService: FileManagerService,
    private loaderService: LoaderService
  ) {}

  ngOnInit() {
    this.folderId = this.route.snapshot.paramMap.get('folderId');
    this.getFiles();
  }

  public uploadFiles(event: { id: string; files: File[] }): void {
    //TODO: Remove hardcoded user id when authentication is implemented
    const userId = "dddd440076062f28f7b8dcba6fa8067cffc59"
    this.loaderService.startLoader()
    this.fileManagerService.uploadFiles(event.id, userId, event.files).subscribe({
      next: () => {
        this.notifyMessage('Files uploaded successfully!');
        this.loaderService.stopLoader()
        this.getFiles();
      },
      error: (error) => {
        console.error('Error uploading files:', error);
        alert('Error uploading files.');
        this.loaderService.stopLoader()
      },
    });
  }

  public onDeleteFile(id: string) {
    const ids = [id];
    if (this.folderId) {
      this.loaderService.startLoader()
      this.fileManagerService.deleteFiles(this.folderId, ids).subscribe({
        next: () => {
          this.loaderService.stopLoader();
          this.notifyMessage('Files deleted successfully!');
          this.getFiles();
        },
        error: (error) => {
          console.error('Error deleting files:', error);
          this.loaderService.stopLoader();
        },
      });
    }
  }


  private getFiles() {
    if (this.folderId) {
      this.fileManagerService.getFilesByFolderId(this.folderId)
      .pipe(
          map((res) =>
            res.data.map((file: any) => this.mapToFileConfig(file))
          )
        )
      .subscribe({
        next: (files) => {
          this.files = files;
        },
        error: (error) => {
          console.error('API Error', error);
        }
      })
    }
  }

  private mapToFileConfig(file: any): FileItemConfig {
    return {
      id: file.file_id,
      name: file.file_name,
      creationDate: file.creation_date,
      modificationDate: file.modification_date,
      matMenuActions: this.folderMatMenuActions,
      contentFolder: {
        id: file.folder.folder_id,
        name: file.folder.folder_name
      },
      metadata: {
        extension: file.metadata.file_extension,
        size: file.metadata.file_size
      },
      icon: '/assets/svg/drive-image-icon.svg',

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
