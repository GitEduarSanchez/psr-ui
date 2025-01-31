import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: 'auth',
    loadChildren: () => import('./auth/auth.routes').then((x) => x.AUTH_ROUTES),
  },
  {
    path: '',
    loadChildren: () =>
      import('./client/client.routes').then((x) => x.CLIENT_ROUTES),
  },
  {
    path: 'admin',
    loadChildren: () =>
      import('./admin/admin.routes').then((x) => x.ADMIN_ROUTES),
  },
  {
    path: 'business',
    loadChildren: () =>
      import('./business/business.routes').then((x) => x.BUSINESS_ROUTES),
  },
  {
    path: 'chat',
    loadChildren: () =>
      import('./openai/openai.routes').then((x) => x.OPENIA_ROUTES),
  },
  {
    path: 'signalr',
    loadChildren: () =>
      import('./signalr/signalr.routes').then((x) => x.SIGNALR_ROUTES),
  },
  {
    path: '',
    loadChildren: () =>
      import('./agent/agent.routes').then((x) => x.AGENT_ROUTES),
  },
];
