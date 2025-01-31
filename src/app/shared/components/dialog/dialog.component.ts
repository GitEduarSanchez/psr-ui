import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatButtonModule } from '@angular/material/button';
import { CommonModule } from '@angular/common';
import { DialogConfig } from '../../interfaces/dialog-config.interface';
import { DialogService } from '../../services/dialog.service';

@Component({
  selector: 'app-dialog',
  standalone: true,
  imports: [
    MatFormFieldModule,
    MatDialogModule,
    MatButtonModule,
    CommonModule
  ],
  templateUrl: './dialog.component.html',
  styleUrl: './dialog.component.scss'
})
export class DialogComponent {

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: DialogConfig,
    private dialogService: DialogService
  ) {}

  public onConfirm(): void {
    if (this.data && this.data.action) {
      this.data.action();
    }
    if (this.data && this.data.closeAfterConfirm) {
      this.dialogService.close();
    }
  }
  
  public onClose(): void {
    this.dialogService.close();
  }
}
