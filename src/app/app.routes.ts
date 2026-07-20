import { Routes } from '@angular/router';
import { authGuard } from '@core/guards/auth.guard';
import { MainLayoutComponent } from './layouts/main-layout/main-layout.component';
import { MainLayoutRoutes } from './layouts/main-layout/routes';

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
        path: 'admin-panel',
        canActivate: [authGuard],
        component: MainLayoutComponent,
        children: MainLayoutRoutes
    },
    {
        path: '**',
        loadComponent: () => import('./PAGES/authentication/page404/page404.component').then(m => m.Page404Component)
    }
];
