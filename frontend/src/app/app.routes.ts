// app.routes.ts
import { Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component'; // Assurez-vous que l'importation est correcte
import { TimesheetComponent } from './timesheet/timesheet.component';
import { DashboardApprobateurComponent } from './approbateur/dashboard-approbateur/dashboard-approbateur.component';
import { AuthGuard } from './auth.guard';
//import { AbsenceListComponent } from './absence/absence-list/absence-list.component';

 
export const routes: Routes = [
        // Définir les routes ici
    //    {path: 'admin', 
    //loadChildren: () => import('./admin/admin.module').then(m => m.AdminModule) },
        {
        path: 'users',
        loadChildren: () => import('./users/users.module').then(m => m.UsersModule),
        //canActivate: [RoleGuard],       data: { expectedRoles: ['ROLE_ADMIN'] 

        },
        { path: '', component: HomeComponent },
        { path: 'login', component: LoginComponent },
        { path: 'register', component: RegisterComponent },
        { path: '', redirectTo: '/home', pathMatch: 'full' },
        { path: 'home', component: HomeComponent },
        { path: 'timesheet', component: TimesheetComponent },
        { path: '**', redirectTo: '/home', pathMatch: 'full' },  // Redirection par défaut vers Home
        {
                path: 'dashboard-approbateur',
                component: DashboardApprobateurComponent,
                canActivate: [AuthGuard], // si tu utilises une protection d’accès
        },
      //  { path: 'absences', component: AbsenceListComponent },

];
