import { Injectable } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { FormValidationsService } from './form-validation.service';
import { FormConfig } from '../interfaces/form-config.interface';
import { FieldTypeEnum } from '../components/psr-form/enums/field-type-enum';

@Injectable({
  providedIn: 'root'
})
export class FormService {

  constructor(
    private formBuilder: FormBuilder,
    private formValidationService: FormValidationsService) { }

  public build(config: FormConfig): FormGroup<any> {
    const formGroupConfig: { [key: string]: any } = {};
    config.formFields.forEach(field => {
      formGroupConfig[field.controlName] = [field.value || '', field.validators || []];
    });
    return this.formBuilder.group(formGroupConfig);
  }


  // Config for location form
  public buildLocationFormConfig(): FormConfig {
    return {
      title: 'Marker registration',
      formFields: [
        {
          controlName: 'trt',
          label: 'TRT',
          type: FieldTypeEnum.Text,
          validators: [
            Validators.required
          ]
        },
        {
          controlName: 'phone',
          label: 'Phone',
          type: FieldTypeEnum.Number,
          validators: [
            Validators.required
          ]
        },
        {
          controlName: 'code',
          label: 'Code',
          type: FieldTypeEnum.Text,
          validators: [
            Validators.required
          ]
        },
        {
          controlName: 'photo',
          label: 'Photo',
          type: FieldTypeEnum.File,
          validators: [
          ]
        },
      ],
      showCancelButton: true,
    }
  }
}
