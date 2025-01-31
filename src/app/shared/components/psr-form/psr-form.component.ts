import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatNativeDateModule } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { FormConfig } from '../../interfaces/form-config.interface';
import { FieldTypeEnum } from './enums/field-type-enum';
import { FormService } from '../../services/form.service';
import { CustomErrorStateMatcher } from './custom-error-state-matcher';
import { CustomFileInputComponent } from '../custom-file-input/custom-file-input.component';

@Component({
  selector: 'psr-form',
  standalone: true,
  providers: [
  ],
  imports: [
    MatFormFieldModule, 
    MatInputModule, 
    MatSelectModule, 
    MatDialogModule, 
    MatButtonModule,
    FormsModule,
    ReactiveFormsModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatCheckboxModule,
    CustomFileInputComponent
  ],
  templateUrl: './psr-form.component.html',
  styleUrl: './psr-form.component.scss'
})
export class PsrFormComponent {

  @Input() config!: FormConfig; 
  @Output() formDataEmitter = new EventEmitter<any>();
  @Output() cancelEmitter = new EventEmitter();
  
  public formGroup!: FormGroup;
  public fieldTypeEnum: FieldTypeEnum = FieldTypeEnum.Text;
  FieldTypeEnum = FieldTypeEnum
  public customErrorStateMatcher = new CustomErrorStateMatcher();

  constructor(private formService: FormService) {}

  ngOnInit(): void {
    this.buildForm();
  }

  public buildForm(): void {
    if (this.config && this.config.formFields.length) {
      this.formGroup = this.formService.build(this.config);
    }
  }

  public submit(): void {
    if (this.config && this.config.id) {
      this.formGroup.value.id = this.config.id;
    }
    this.formDataEmitter.emit(this.formGroup.value);
  }

  public cancel(): void {
    this.cancelEmitter.emit();
  }
}
