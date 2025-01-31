import { DragDropModule } from '@angular/cdk/drag-drop';
import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, ElementRef, EventEmitter, Input, Output, ViewChild } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { Subscription } from 'rxjs';
import { DriveService } from 'src/app/admin/components/drive-container/services/drive.service';
import { UploadTypeEnum } from '../../enums/upload-type.enum';
import { DragAndDropConfig } from '../../interfaces/drag-and-drop-config.interface';
import { FileListConfig } from '../../interfaces/file-list-config.interface';
import { FileItemComponent } from "../file-item/file-item.component";
import { FolderComponent } from '../folder/folder.component';
import { DragAndDropItemType } from '../../enums/drag-and-drop-item-type.enum';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'drag-and-drop',
  standalone: true,
  imports: [
    CommonModule,
    DragDropModule,
    MatButtonModule,
    MatMenuModule,
    MatIconModule,
    MatCardModule,
    MatSnackBarModule,
    FolderComponent,
    FileItemComponent
],
  templateUrl: './drag-and-drop.component.html',
  styleUrl: './drag-and-drop.component.scss'
})
export class DragAndDropComponent {

  public dragAndDropItemType = DragAndDropItemType;
  public folderId: string | null = null;
  
  @Input() config!: DragAndDropConfig;

  @Output() uploadFilesEmmiter = new EventEmitter<{ id: string; files: File[] }>();
  @Output() openEmitter = new EventEmitter();
  @Output() deleteEmitter = new EventEmitter();

  @ViewChild('fileInput', { static: false }) fileInput!: ElementRef;
  @ViewChild('folderInput', { static: false }) folderInput!: ElementRef;

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

  public selectedFiles: File[] = [];
  public showOptions: boolean = false;
  public isDragOver = false;
  public fileListConfig!: FileListConfig
  private subscription!: Subscription;

  constructor(
    private cdr: ChangeDetectorRef,
    private snackBar: MatSnackBar,
    private driveService: DriveService,
    private route: ActivatedRoute
  ) { }

  ngOnInit() {
    this.folderId = this.route.snapshot.paramMap.get('folderId');
    this.subscribeToFileOptionMode();
  }

  ngOnDestroy() {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }

  public handleInputSelection(event: Event) {
    const target = event.target as HTMLInputElement;
    if (target.files) {
      Array.from(target.files).forEach(file => this.addFile(file));
    }
    if (this.selectedFiles.length + this.selectedFiles.length > 50) {
      this.snackBar.open('You cannot select more than 50 PDF files.', 'Close', {
        duration: 3000,
        panelClass: ['error-snackbar']
      });
    }
  }

  public onDragOver(event: Event) {
    event.preventDefault();
    this.isDragOver = true;
  }

  public onDragLeave() {
    this.isDragOver = false;
  }

  public removeFile(index: number) {
    this.selectedFiles.splice(index, 1);
    this.cdr.detectChanges();
  }

  public onDrop(event: DragEvent) {
    event.preventDefault();
    this.isDragOver = false;
    if (event.dataTransfer?.items) {
      const items = event.dataTransfer.items;
      this.readDroppedItems(items);
    }
  }

  public onOpenFolder(id: string) {
    this.openEmitter.emit(id);
  }

  public onDelete(id: string): void {
   this.deleteEmitter.emit(id);
  }

  public uploadFiles(): void {
    if (this.config.itemType === this.dragAndDropItemType.Folder) {
      const defaultFolder = this.config.folders?.find(x => x.storageProvider === 'default'); // TODO: Verify in the future this approach 
      this.uploadFilesEmmiter.emit({
        id: defaultFolder ? defaultFolder.id : '',
        files: this.selectedFiles
      });
    }
    if (this.config.itemType === this.dragAndDropItemType.File) {
      this.uploadFilesEmmiter.emit({
        id: this.folderId ?? '',
        files: this.selectedFiles
      });
    }

    this.selectedFiles = [];
  }

  private readDroppedItems(items: DataTransferItemList) {
    const itemsArray = Array.from(items);
    for (const item of itemsArray) {
      const entry = item.webkitGetAsEntry();
      if (entry) {
        this.processEntry(entry);
      }
    }
  }

  private async processEntry(entry: FileSystemEntry) {
    if (entry.isFile) {
      const file = await this.getFile(entry);
      if (file) {
        this.addFile(file);
      }
    } else if (entry.isDirectory) {
      const dirEntry = entry as FileSystemDirectoryEntry;
      this.readDirectory(dirEntry);
    }
    this.cdr.detectChanges();
  }

  private getFile(entry: any): Promise<File | null> {
    return new Promise((resolve, reject) => {
      entry.file(
        (file: File) => resolve(file),
        (error: any) => reject(new Error(error))
      );
    });
  }

  private readDirectory(directory: FileSystemDirectoryEntry) {
    const reader = directory.createReader();
    reader.readEntries((entries: FileSystemEntry[]) => {
      entries.forEach(entry => this.processEntry(entry));
    });
  }

  private addFile(file: File) {
    if (this.allowedFileTypes.includes(file.type)) {
      const fileExists = this.selectedFiles.some(existingFile => existingFile.name === file.name);
      if (!fileExists) {
        this.selectedFiles = [...this.selectedFiles, file];
        this.cdr.detectChanges();
      } else {
        this.snackBar.open(`File ${file.name} has already been added.`, 'Close', {
          duration: 3000,
          panelClass: ['error-snackbar'],
        });
      }
    }
    else {
      this.snackBar.open(`File ${file.name} has already been added.`, 'Close', {
        duration: 3000,
        panelClass: ['error-snackbar'],
      });
    }
  }

  private subscribeToFileOptionMode() {
    this.subscription = this.driveService.mode$.subscribe((mode) => {
      this.handleOptionClicked(mode);
    });
  }

  private handleOptionClicked(option: UploadTypeEnum) {
    switch (option) {
      case UploadTypeEnum.File:
        this.fileInput?.nativeElement.click();
        break;
      case UploadTypeEnum.Folder:
        this.folderInput?.nativeElement.click();
        break;
    }
  }

}
