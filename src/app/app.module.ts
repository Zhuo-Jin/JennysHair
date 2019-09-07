
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MDBBootstrapModule } from 'angular-bootstrap-md';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatDialogModule } from '@angular/material';
import { AppRoutingModule, RoutingComponents } from './app-routing.module';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { AgmCoreModule} from '@agm/core';

import { AppComponent } from './app.component';
import { ServiceComponent } from './appointment/service/service.component';

import {ServiceApiService} from './shared/serviceapi.service';

import {MatDatepickerModule} from  '@angular/material/datepicker';


import {MatMomentDateModule} from  '@angular/material-moment-adapter';
import {MatInputModule} from '@angular/material/input';
import {MatSelectModule} from '@angular/material/select';
 


import { DatePipe } from '@angular/common';
import { AppointmentapiService } from './shared/appointmentapi.service';
import { AuthInterceptor } from './shared/authinterceptor.service';
import { AuthtokenapiService } from './shared/authtokenapi.service';
import { CustomerapiService } from './shared/customerapi.service';
import { StatusapiService } from './shared/statusapi.service';
import { PopupdateComponent } from './login/popupdate/popupdate.component';
import { UpdatedateComponent } from './appointment/updatedate/updatedate.component';
import { AccesscodeComponent } from './appointment/accesscode/accesscode.component';
import { DisplayresultComponent } from './appointment/displayresult/displayresult.component';

@NgModule({
  declarations: [
    AppComponent,
    RoutingComponents,
    ServiceComponent,
    PopupdateComponent,
    UpdatedateComponent,
    AccesscodeComponent,
    DisplayresultComponent,

  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    MDBBootstrapModule.forRoot(),
    FormsModule,
    ReactiveFormsModule,
    MatDialogModule,
    AppRoutingModule,
    HttpClientModule,
    MatDatepickerModule,
    MatMomentDateModule,
    MatInputModule,
    MatSelectModule,
    AgmCoreModule.forRoot(
      {apiKey:'AIzaSyBduM8vcFa_QF_BSwjGtCUpR8Q0tv3VqlE'}
    )
  ],
  entryComponents: [
    ServiceComponent,
    PopupdateComponent,
    UpdatedateComponent,
    AccesscodeComponent,
    DisplayresultComponent,
  ],
  providers: [ServiceApiService, 
              AuthtokenapiService,
              CustomerapiService,
              StatusapiService,
              DatePipe, 
              AppointmentapiService,
              {
                provide: HTTP_INTERCEPTORS,
                useClass: AuthInterceptor,
                multi:true,
              }
            ],
  bootstrap: [AppComponent]
})
export class AppModule { }
    