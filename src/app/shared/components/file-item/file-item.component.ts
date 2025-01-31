import { Component, EventEmitter, Input, Output } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { FileItemConfig } from '../../interfaces/file-item-config.interface';

@Component({
  selector: 'file-item',
  standalone: true,
  imports: [
    MatButtonModule,
    MatMenuModule, 
    MatIconModule
  ],
  templateUrl: './file-item.component.html',
  styleUrl: './file-item.component.scss'
})
export class FileItemComponent {

  actions: { label: string; action: string }[] = [];

  @Input() config!: FileItemConfig

  @Output() actionSelected = new EventEmitter<string>();
  @Output() deleteFolderEmmiter = new EventEmitter();


  public delete(id: string) {
    this.deleteFolderEmmiter.emit(id);
  }

  public rename() {
    console.log('rename');
  }
}
