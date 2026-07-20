import { Routes } from '@angular/router';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'dashboard', pathMatch: 'full'

  },
  {
    path: 'dashboard',
    loadComponent: () => import('../../PAGES/dashboard/dashboard.component').then(m => m.DashboardComponent)
  },
  {
    path: 'users',
    loadComponent: () => import('../../PAGES/users/users.component').then(m => m.UsersComponent)
  },
  {
    path: 'settings',
    loadComponent: () => import('../../PAGES/settings/settings.component').then(m => m.SettingsComponent)
  },
  {
    path: 'daftar-kontak',
    loadComponent: () => import('../../PAGES/contact-list/list/list.component').then(m => m.ContactListPageComponent)
  }

];
export const MainLayoutRoutes = routes;

