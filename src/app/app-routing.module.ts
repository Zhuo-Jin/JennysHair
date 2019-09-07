import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { AppointmentComponent } from './appointment/appointment.component';
import { PriceComponent } from './price/price.component';
import { AboutComponent } from './about/about.component';
import { LoginComponent } from './login/login.component';


const routes: Routes = [
  
  {path: "home", component: HomeComponent},
  {path: "appointment", component: AppointmentComponent},
  {path: "servicelist", component: PriceComponent},
  {path: "about", component: AboutComponent},
  {path: "login", component: LoginComponent},
  {path: '', redirectTo: '/home', pathMatch: 'full' },
  
];




@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})

export class AppRoutingModule { }

export  const RoutingComponents = [HomeComponent, AppointmentComponent, PriceComponent, AboutComponent,LoginComponent];
