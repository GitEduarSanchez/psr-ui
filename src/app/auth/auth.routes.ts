import { Routes } from "@angular/router";
import { AuthcontainerComponent } from "./components/authcontainer/authcontainer.component";
import { LoginComponent } from "../shared/components/login/login.component";
import { RegisterComponent } from "../shared/components/register/register.component";
import { PinConfirmationComponent } from "../shared/components/pin-confirmation/pin-confirmation.component";
import { SwitchControlComponent } from "../shared/components/switch-control/switch-control.component";
import { OperationsDashboardComponent } from "../shared/components/operations-dashboard/operations-dashboard.component";
import { FolderListComponent } from "../shared/components/folder-list/folder-list.component";

export const AUTH_ROUTES: Routes = [
  {
    path: '',
    component: AuthcontainerComponent,
    children: [
      {
        path: 'login',
        component: LoginComponent
      },
      {
        path: 'register',
        component: RegisterComponent,
      },
      {
        path: 'pin-confirmation',
        component: PinConfirmationComponent,
      },
      {
        path: 'switch-control',
        component: SwitchControlComponent,
      },
      {
        path: 'operations-dashboard',
        component: OperationsDashboardComponent,
      },
      {
        path: 'file-upload',
        component: FolderListComponent,
      },
      {
        path: '',
        redirectTo: 'login',
        pathMatch: 'full',
      }
    ]
  },
];
