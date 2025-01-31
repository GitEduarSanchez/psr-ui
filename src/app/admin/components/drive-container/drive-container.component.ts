import { Component, OnInit, TemplateRef } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatMenuModule } from '@angular/material/menu';
import { Router, RouterOutlet } from '@angular/router';
import { UploadTypeEnum } from 'src/app/shared/enums/upload-type.enum';
import { SearchComponent } from "../../../shared/components/search/search.component";
import { DriveService } from './services/drive.service';
import { DialogService } from 'src/app/shared/services/dialog.service';
import { DialogConfig } from 'src/app/shared/interfaces/dialog-config.interface';
import { MatInputModule } from '@angular/material/input';
import { FormsModule } from '@angular/forms';
import { FileManagerService } from '@core/services/file-manager.service';
import { LoaderService } from 'src/app/shared/services/loader.service';

@Component({
  selector: 'app-drive-container',
  standalone: true,
  imports: [
    SearchComponent,
    RouterOutlet,
    MatButtonModule,
    MatMenuModule,
    MatInputModule,
    FormsModule
],
  templateUrl: './drive-container.component.html',
  styleUrl: './drive-container.component.scss'
})
export class DriveContainerComponent implements OnInit {

  public uploadSelectedOption!: string;
  public uploadTypeEnum = UploadTypeEnum;
  public newFolderName: string = '';

  public sidebarButtons = [
    { route: 'my-drive', label: 'My Drive', icon: '/assets/svg/home-icon.svg' },
    { route: 'poli-ia', label: 'Poli IA', icon: '/assets/svg/poli-ia-icon.svg' }
  ];

  public selectedRoute = 'my-drive';

  // TODO: remove mock data and implement functionality to search component 
  users: { name: string; id: number }[] = [
    { name: 'John', id: 1 },
    { name: 'Jane', id: 2 },
    { name: 'Alice', id: 3 }
  ];
  filteredUsers: { name: string; id: number }[] = [...this.users];

  constructor(
    private router: Router,
    private driveService: DriveService,
    private dialogService: DialogService,
    private fileManagerService: FileManagerService,
    private loaderService: LoaderService
  ) {}

  ngOnInit() {
    const currentRoute = this.router.url.split('/')[3];
    this.selectedRoute = currentRoute ?? 'my-drive';
  }

  updateFilteredResults(results: { name: string; id: number }[]): void {
    this.filteredUsers = results;
  }

  public openNewFolderModal(template: TemplateRef<any>) {
    const data : DialogConfig = {
      contentTemplate: template,
    }
    this.dialogService.open(data);
  }

  public createFolder() {
    // TODO: Delete hardcoded id when Authentication is implemented
    const requestPayload = {
      user_id: 'dddd440076062f28f7b8dcba6fa8067cffc59',
      folder_name: this.newFolderName
    };

    this.loaderService.startLoader();
    this.fileManagerService.createFolder(requestPayload).subscribe({
      next: () => {
        this.loaderService.stopLoader();
        this.closeNewFolderModal();
        this.driveService.triggerRefreshFolders();
        this.newFolderName = '';
      },
      error: (error) => {
        console.error('Error creating folder:', error);
        this.loaderService.stopLoader();
      }
    });
  }

  public closeNewFolderModal() {
    this.dialogService.close();
  }
  
  public redirectTo(path: string) {
    this.selectedRoute = path;
    this.router.navigate(['admin/drive/', path]);
  }

  public handleMenuSelection(mode: UploadTypeEnum) {
      this.driveService.setMode(mode);
    }
}
