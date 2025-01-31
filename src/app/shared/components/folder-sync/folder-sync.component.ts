import { Component, EventEmitter, Input, Output } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { FolderSyncConfig } from '../../interfaces/folder-sync-config.interface';
import { SearchComponent } from "../search/search.component";
import { ToggleComponent } from "../toggle/toggle.component";
import { SelectedFolder } from './interfaces/selected-folder.interface';

@Component({
  selector: 'folder-sync',
  standalone: true,
  imports: [
    SearchComponent,
    MatButtonModule,
    MatMenuModule,
    MatIconModule,
    ToggleComponent
],
  templateUrl: './folder-sync.component.html',
  styleUrl: './folder-sync.component.scss'
})
export class FolderSyncComponent {

  @Input() config!: FolderSyncConfig

  @Output() selectedFolderEmitter = new EventEmitter<SelectedFolder>();
  @Output() syncEmitter = new EventEmitter();

  public changeAccount() {
    console.log('Changing account');
  }

  public logout() {
    console.log('Logging out');
  }

  public closed() {
    console.log('closed X');
  }

  public sync(){
    this.syncEmitter.emit();
  }

  public onToggled(checked: boolean, folderId: string) {
    const selectedFolder: SelectedFolder = {
      checked,
      id: folderId
    }
    this.selectedFolderEmitter.emit(selectedFolder)
  }
}
