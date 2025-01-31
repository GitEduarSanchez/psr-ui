import { TemplateRef } from "@angular/core";

export interface DialogConfig {
  title?: string;
  message?: string;
  position?: Position;
  height?: string;
  width?: string;
  contentTemplate?: TemplateRef<any>;
  showCloseButton?: boolean;
  showCancelButton?: boolean;
  showConfirmButton?: boolean;
  closeAfterConfirm?: boolean;
  action?: () => void;
}

export interface Position {
  top?: string;
  left?: string;
  bottom?: string;
  right?: string;
}
