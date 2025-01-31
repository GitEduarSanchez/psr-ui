import { ValidatorFn } from "@angular/forms";

export interface FormField {
  controlName: string;
  label: string;
  placeholder?: string;
  type: string;
  validators: ValidatorFn[];
  value?: string | number
  selectOptions?: SelectInputOption[]
}

export interface SelectInputOption {
  label: string;
  value: string | number
}
