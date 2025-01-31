import { Routes } from "@angular/router";
import { AdminContainerComponent } from "./components/admin-container/admin-container.component";
import { DriveContainerComponent } from "./components/drive-container/drive-container.component";
import { FileListComponent } from "../shared/components/file-list/file-list.component";
import { FolderListComponent } from "../shared/components/folder-list/folder-list.component";
import { MyDriveComponent } from "./components/drive-container/components/my-drive/my-drive.component";
import { PoliIaComponent } from "./components/drive-container/components/poli-ia/poli-ia.component";
import { ChatComponent } from "../openai/chat/chat.component";

export const ADMIN_ROUTES: Routes = [
    {
      path: '',
      component: AdminContainerComponent,
    },
    {
      path: 'drive',
      component: DriveContainerComponent,
      children: [ 
        {
          path: 'my-drive',
          component: MyDriveComponent,
          children: [
            {
              path: '',
              component: FolderListComponent,
            },
            {
              path: 'folders/:folderId',
              component: FileListComponent
            }, 
          ]
        },
        {
          path: 'poli-ia',
          component: PoliIaComponent,
        },
        {
          path: 'poli-ia/:folderId',
          component: ChatComponent,
          data: { viewType: 'fullChat' }
        },
        {
          path: '',
          redirectTo: 'my-drive',
          pathMatch:'full'
        }
      ]
    },
  ];
  