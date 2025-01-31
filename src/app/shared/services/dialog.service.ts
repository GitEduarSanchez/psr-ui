import { Injectable } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { DialogConfig } from '../interfaces/dialog-config.interface';
import { DialogComponent } from '../components/dialog/dialog.component';

@Injectable({
  providedIn: 'root'
})
export class DialogService {

  constructor(protected dialog: MatDialog) { }

  open(data: DialogConfig ) {
    return this.dialog.open(DialogComponent, {
      ...data.width && { width : data.width },
      ...data.height && { width : data.height },
      data
    });
  }

  close() {
    this.dialog.closeAll()
  }
}
