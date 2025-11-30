import { Routes } from '@angular/router';
import { DashboardComponent } from './shared/dashboard/dashboard.component';
import { LaunchListComponent } from './features/launch/launch-list/launch-list.component';
import { LaunchDetailComponent } from './features/launch/launch-detail/launch-detail.component';

export const routes: Routes = [
    { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
    { path: 'dashboard', component: DashboardComponent },
    { path: 'launches', component: LaunchListComponent },
    { path: 'launches/:id', component: LaunchDetailComponent },
];
