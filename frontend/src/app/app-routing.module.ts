import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { RoleGuard } from './core/guards/role.guard';
import { HomeComponent } from './home/home.component';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';
import { TimesheetComponent } from './timesheet/timesheet.component';
//import { AuthGuard } from './auth.guard';
import { DashboardApprobateurComponent } from './approbateur/dashboard-approbateur/dashboard-approbateur.component';
//import { AbsenceComponent } from '../../absence/absence.component';
const routes: Routes = [
    { path: 'users'
        , loadChildren: () => import('./users/users.module').then(m => m.UsersModule)
        , canActivate: [RoleGuard]
        , data: { roles: ['ROLE_ADMIN'] }
     },
    { path: 'home', component: HomeComponent },
    { path: 'login', component: LoginComponent },
    { path: 'register', component: RegisterComponent },
    { path: '', redirectTo: '/home', pathMatch: 'full' },  // Redirection par défaut vers Home
    { path: 'timesheet', component: TimesheetComponent 
        , canActivate: [RoleGuard],
        data: { roles: ['ROLE_ADMIN', 'ROLE_APPROBATEUR', 'ROLE_USER'] }
    },
    { path: 'approbateur/dashboard', component: DashboardApprobateurComponent },
   // { path: 'absence', component: AbsenceComponent },
    

];

@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule]
})
export class AppRoutingModule { }
