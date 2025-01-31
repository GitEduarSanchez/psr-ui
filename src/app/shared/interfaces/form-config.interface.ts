import { FormField } from "./form-field.interface";

export interface FormConfig {
    title?: string;
    id?: string;
    showCancelButton?: boolean;
    formFields: FormField[];
}