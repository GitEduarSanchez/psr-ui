import { Component, EventEmitter, input, Input, Output } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { FolderConfig } from '../../interfaces/folder-config.interface';

@Component({
  selector: 'folder',
  standalone: true,
  imports: [
    MatButtonModule,
    MatMenuModule, 
    MatIconModule
  ],
  templateUrl: './folder.component.html',
  styleUrl: './folder.component.scss'
})
export class FolderComponent {

  @Input() config!: FolderConfig;

  @Output() openFolderEmmiter = new EventEmitter();
  @Output() deleteFolderEmmiter = new EventEmitter();
  @Output() renameFolderEmmiter = new EventEmitter();


  public openFolder(id: string) {
    this.openFolderEmmiter.emit(id);
  }

  public rename() {

  }

  public delete(id: string) {
    this.deleteFolderEmmiter.emit(id);
  }
}
