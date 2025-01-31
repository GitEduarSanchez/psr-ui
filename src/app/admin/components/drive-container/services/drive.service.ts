import { Injectable } from '@angular/core';
import { BehaviorSubject, Subject } from 'rxjs';
import { UploadTypeEnum } from 'src/app/shared/enums/upload-type.enum';

@Injectable({
  providedIn: 'root'
})
export class DriveService {

  private modeSubject = new BehaviorSubject<UploadTypeEnum>(UploadTypeEnum.File);
  mode$ = this.modeSubject.asObservable();

  private refreshFoldersSubject = new Subject<void>();
  refreshFolders$ = this.refreshFoldersSubject.asObservable();

  setMode(mode: UploadTypeEnum) {
    this.modeSubject.next(mode);
  }

  triggerRefreshFolders() {
    this.refreshFoldersSubject.next();
  }
}
