import { Routes } from '@angular/router';
import { authGuard } from '@core/guards/auth.guard';
import { MainLayoutComponent } from './layouts/main-layout/main-layout.component';

export const routes: Routes = [
    {
        path: '',
        pathMatch: 'full',
        redirectTo: 'login'
    },

    //MARK: AUTHENTICATION
    {
        path: 'login',
        loadComponent: () => import('./PAGES/authentication/login/login.component').then(m => m.LoginComponent)
    },


    {
        path: '',
        canActivate: [authGuard],
        component: MainLayoutComponent,
        children: [
            {
                path: 'dashboard',
                loadComponent: () => import('./PAGES/dashboard/dashboard.component').then(m => m.DashboardComponent)
            },
            {
                path: 'users',
                loadComponent: () => import('./PAGES/users/users.component').then(m => m.UsersComponent)
            },
            {
                path: 'settings',
                loadComponent: () => import('./PAGES/settings/settings.component').then(m => m.SettingsComponent)
            }
        ],
    },
    {
        path: '**',
        loadComponent: () => import('./PAGES/authentication/page404/page404.component').then(m => m.Page404Component)
    }
];
