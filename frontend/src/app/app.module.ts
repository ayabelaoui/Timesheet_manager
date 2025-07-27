import { NgModule } from '@angular/core';
import { BrowserModule, } from '@angular/platform-browser';
import { RouterModule } from '@angular/router';
import { AppComponent } from './app.component';
import { HomeComponent } from './home/home.component';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';
import { HeaderComponent } from './header/header.component';
import { AppRoutingModule } from './app-routing.module'; // Le module des routes
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { AuthInterceptor } from './auth.interceptor';
import { AuthGuard } from './auth.guard'; // Chemin selon votre structure
import { TimesheetComponent } from './timesheet/timesheet.component';
//import { HoraireService } from './services/horaire.service';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
//import { HoraireComponent } from './composants/horaire.component';
import { DashboardApprobateurComponent } from './approbateur/dashboard-approbateur/dashboard-approbateur.component';
import { ServerModule } from '@angular/platform-server';
//import { AbsenceListComponent } from './absence/absence-list/absence-list.component';
//import { AbsenceFormComponent } from './absence/absence-form/absence-form.component';
//import { AbsenceDetailsComponent } from './absence/absence-details/absence-details.component';
@NgModule({
    declarations: [
        AppComponent,
        DashboardApprobateurComponent,
        HomeComponent,
        LoginComponent,
        HeaderComponent,
        TimesheetComponent,
        HttpClientModule,
 //       HoraireService,
        HoraireComponent,
        RegisterComponent
        //AbsenceListComponent,
       // AbsenceFormComponent,
       // AbsenceDetailsComponent
    ],
    imports: [
        BrowserModule,
        ServerModule,
        AppRoutingModule,
        HttpClientModule,
        CommonModule,
        FormsModule,
        AuthGuard
        // RouterModule.forRoot()
    ],
    providers: [{
        provide: HTTP_INTERCEPTORS,
        useClass: AuthInterceptor,
        multi: true
    }
    ], // Utiliser votre module de routage
    bootstrap: [AppComponent] // Démarrer l'application avec AppComponent
})
export class AppModule { }
