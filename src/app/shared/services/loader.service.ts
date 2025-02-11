import { Injectable } from '@angular/core';
import { NgxUiLoaderService } from 'ngx-ui-loader';

@Injectable({
  providedIn: 'root'
})
export class LoaderService {

  constructor(private ngxService: NgxUiLoaderService) {}

  startLoader() {
    this.ngxService.start();
  }

  stopLoader() {
    this.ngxService.stop();
  }
}
