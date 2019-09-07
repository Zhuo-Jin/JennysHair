import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { IAppointment, ISchedule, IServiceItem, IEmailAddress } from '../interface/interface';
import { DatePipe } from '@angular/common';
import { ApiList } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AppointmentapiService {

  private appList = ApiList;
  
  constructor(private http : HttpClient ,public datepipe: DatePipe) { }

  GetCurrentAppointmentData(appDate:Date) : Observable<IAppointment> {

    let appointment = this.http.get<IAppointment>(this.appList.AppointmentApi + "/getcurrentappointments/" + this.datepipe.transform(appDate, 'yyyy-MM-dd') );
    return appointment;
  }

  UpsertSchedule(schedule: ISchedule) : Observable<ISchedule>
  {
    return this.http.post<ISchedule>(this.appList.ScheduleApi + "/UpsertSchedule", schedule);
  }

  GetAvailableTimeListFromDate(appDate:Date, scheduleId: string) : Observable<string[]> {
    return this.http.get<any>(this.appList.AppointmentApi + "/GetAvailableTimeListFromDate/" + 
                              this.datepipe.transform(appDate, 'yyyy-MM-dd') + 
                              "/" + scheduleId
                              );
  }
  
  GetScheduleItemsFromAppointmentId(AppointId:string) : Observable<IServiceItem[]>
  {
    return this.http.get<IServiceItem[]> (this.appList.AppointmentApi + "/GetScheduleItemsFromAppointmentId/" + AppointId );

  }

  GetAvailableUnitsFromDateAndTime(appDate:Date, appTime: string, scheduleId: string) : Observable<number> {
    return this.http.get<any>(this.appList.AppointmentApi + "/GetAvailableUnitsFromDateAndTime/" + 
                              this.datepipe.transform(appDate, 'yyyy-MM-dd') + 
                              "/" + appTime.replace(":", "") +
                              "/" + scheduleId
                              );

  }

  ValidateAccessCode(scheduleId: string, accessCode: string) : Observable<boolean>
  {
    return this.http.get<any>(this.appList.AppointmentApi + "/ValidateAccessCode/" + 
                              "/" + scheduleId +
                              "/" + accessCode
                              );
  }
  
  SendEmailByAppointmentId ( scheduleId: string, emailAddress:IEmailAddress) : Observable<string>
  {
    return this.http.post<any>(
                                this.appList.ScheduleApi + "/SendEmailNotification/" + scheduleId, emailAddress
                              );

  }

}
