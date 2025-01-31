import { Component } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

@Component({
  selector: 'custom-file-input',
  standalone: true,
  imports: [],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: CustomFileInputComponent,
      multi: true,
    }
  ],
  templateUrl: './custom-file-input.component.html',
  styleUrl: './custom-file-input.component.scss'
})
export class CustomFileInputComponent implements ControlValueAccessor {
  
  public file: File | null = null;
  public fileLabel = '';

  onChange = (file: File | null) => {};
  onTouched = () => {};

  constructor() {}

  onFileChange(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      this.file = input.files[0];
      this.fileLabel = input.files[0].name;
      this.onChange(this.file);
    } else {
      this.file = null;
      this.onChange(null);
    }
    this.onTouched();
  }

  writeValue(file: File | null): void {
    this.file = file;
  }
  registerOnChange(fn: any): void {
    this.onChange = fn;
  }
  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }
}
