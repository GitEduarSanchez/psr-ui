import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FileManagerService } from '@core/services/file-manager.service';
import { map } from 'rxjs';
import { FolderComponent } from 'src/app/shared/components/folder/folder.component';
import { FolderConfig } from 'src/app/shared/interfaces/folder-config.interface';

@Component({
  selector: 'app-poli-ia',
  standalone: true,
  imports: [
    FolderComponent
  ],
  templateUrl: './poli-ia.component.html',
  styleUrl: './poli-ia.component.scss'
})
export class PoliIaComponent implements OnInit {

  folders: FolderConfig[] = [];

  constructor(
    private fileManagerService: FileManagerService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.getAllFolders();
  }
  
  onOpenFolder(folderId: string) {
    if(folderId) {
      this.router.navigate([this.router.url , folderId]);
    }
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
      storageProvider: folder.storage_provider,
      userId: folder.user_id,
      icon: '/assets/svg/folder-item-icon.svg',
      secondaryIcon: '/assets/images/chat-icon.png'
    };
  }
}
