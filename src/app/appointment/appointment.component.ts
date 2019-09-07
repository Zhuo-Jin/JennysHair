import { Component, OnInit } from '@angular/core';
import { IAppointment, IAppointmentRow, IServiceItem, IUnit, ISummary, ICusomter, ISchedule, IScheduleItem, IStatus } from '../interface/interface';
import { AppointmentapiService } from '../shared/appointmentapi.service'
import { MatDialog } from '@angular/material';
import { ServiceComponent } from './service/service.component';
import { Router } from '@angular/router';
import { AppDateAdapter, APP_DATE_FORMATS } from '../utils/format-datepicker';
import { DateAdapter, MAT_DATE_FORMATS } from '@angular/material/core';
import { FormBuilder } from '@angular/forms';
import { Guid } from '../utils/utils';
import { DatePipe } from '@angular/common';
import { StatusActive } from 'src/environments/environment';
import { AccesscodeComponent } from './accesscode/accesscode.component';
import { DisplayresultComponent } from './displayresult/displayresult.component';

@Component({
  selector: 'app-appointment',
  templateUrl: './appointment.component.html',
  styleUrls: ['./appointment.component.scss'],
  providers: [
    {provide: DateAdapter, useClass: AppDateAdapter},
    {provide: MAT_DATE_FORMATS, useValue: APP_DATE_FORMATS}
  ]
})

export class AppointmentComponent implements OnInit {

  public user:ICusomter = {
    Id:"",
    Mobile:"",
    Email:"",
    Firstname:"",
    Surname:"",
    IsAdmin:false,
    StatusId:"",
   };

  public dateSelected:Date;

  public appointment : IAppointment ;
  public appItems : IAppointmentRow[] ;
  public appItemsForCalendar : IAppointmentRow[] ;
  
  public selectedServices : IServiceItem[] = [];
  public unit : IUnit ;
  public summary: ISummary;

  public headElements: string[]  ;

  public disableSubmit: boolean = false;
  public loading:boolean = false
  //reactive form builder
  public datePickerForm = this.fb.group({
    appointmentDate: [''],
  });
  
  public startFade:boolean = false;
  public fadeIn:boolean = false;

  public scheduleGuid:string  =  Guid.newGuid();

  public workDateFilter = (d: Date): boolean => {
    const day = d.getDay();
    // Prevent Sunday from being selected.
    return day !== 0;
  }

  constructor(private _appointmentapi: AppointmentapiService, 
              public dialog:MatDialog,
              private router: Router,
              private fb: FormBuilder, 
              public datepipe: DatePipe,
              ) {
 
  }

  

  ngOnInit() {
    if (localStorage.getItem("User") )
      this.user =JSON.parse(localStorage.getItem("User"));
    else
      this.router.navigateByUrl('login');
 
    this.reFreshData();
  }

  updateDate(){
    this.dateSelected = this.datePickerForm.get("appointmentDate").value
    this.reFreshData();
  }

  addDate(addNoOfDay:number)
  {
    this.dateSelected.setDate(this.dateSelected.getDate() + addNoOfDay);
    this.datePickerForm.controls["appointmentDate"].setValue(this.dateSelected);
    this.reFreshData();
 
  }

  reFreshData(){
    if (this.dateSelected)
    {
      this.fadeIn = false;
      this.fadeIn = true;
      this._appointmentapi.GetCurrentAppointmentData(this.dateSelected).subscribe(
        result => {
              this.appointment = result; 
              this.appItems = result.AppointmentItems; 
              this.headElements =  result.Header;
              this.appItemsForCalendar = result.AppointmentItems; 
            }
      );
    }
  }

  onDateSelected(){
    this.dateSelected = this.datePickerForm.get("appointmentDate").value
    this.reFreshData();
  }

  scrollToBottom(el: HTMLElement) {
    el.scrollIntoView({behavior:"smooth", block: "end"});
  }

  
  openDialog(appItem:IAppointmentRow, dateIndex: number, el: HTMLElement){
    
    
    // if update existing , we need to find the start time from the schedule id
    if (appItem.DisplayItemsInRow[dateIndex] != ''){
      // check if access code is invalid
      const accesscodeDialogRef = this.dialog.open(AccesscodeComponent, 
      {
        data: {date: this.appointment.Header[dateIndex], 
          //appItem:appItem.DisplayItemsInRow[0],  
          AppointmentId:appItem.DisplayItemsInRow[dateIndex].split("|")[0]
        }
      });
      
      accesscodeDialogRef.afterClosed().subscribe(result => {
        if (result.returnType != "cancel" && result.validAccessCode){
          var keepGoing = true; // make break in for each loop
          this.appItems.forEach(ai => {
            if (ai.DisplayItemsInRow[dateIndex] == appItem.DisplayItemsInRow[dateIndex]  && keepGoing){
              appItem = ai;
              keepGoing = false;
            }
          });
          this.openServiceDialog(appItem, dateIndex, el);
        }
        
      });
    }
    else{
      this.openServiceDialog(appItem, dateIndex, el);
    }
    
    

    
  }

  openServiceDialog(appItem:IAppointmentRow, dateIndex: number, el: HTMLElement){
    const dialogRef = this.dialog.open(ServiceComponent, { 
      data: {date: this.appointment.Header[dateIndex], 
            dateIndex:dateIndex,
            appItem:appItem,  
            appItems: this.appItems,}, disableClose:true
               });

    this.unit = dialogRef.componentInstance.Unit;

    dialogRef.afterClosed().subscribe(result => {
      this.summary = result.summary;
      this.selectedServices = result.selectSvc;
      if (this.selectedServices.length > 0){
        this.MergeCalendar(this.summary , dateIndex);
        this.scrollToBottom(el);
      }
    });

  }

  onSubmit(){

    var status:IStatus[] = JSON.parse(localStorage.getItem("StatusString"));
    var unit:IUnit = JSON.parse(localStorage.getItem("UnitString"));

    this.scheduleGuid = (this.summary.Id.toString == Guid.EmptyGuid) ? this.scheduleGuid : this.summary.Id;

    let scheduleItems: IScheduleItem[] = [];
      
        this.selectedServices.forEach(s => {
          let scheduleItem:IScheduleItem = {Id: Guid.newGuid(), ScheduleId: this.scheduleGuid, ServiceItemId: s.Id};
          scheduleItems.push(scheduleItem);
        });

    let schedule:ISchedule = {
      Id : this.scheduleGuid,
      StartTime:this.datepipe.transform(this.summary.ServiceStartDate, 'yyyy-MM-dd') + " " + this.summary.ServiceStartTime,
      FinishTime:this.datepipe.transform(this.summary.ServiceStartDate, 'yyyy-MM-dd') + " " + this.summary.ServiceStartTime, // wil be recalculated at server
      TotalUnitCost: (this.summary.TotalEstiamtedTime / unit.UnitInMin),
      Token:"",
      CustomerId:this.user.Id,
      StatusId:status.find( s => s.StatusName == StatusActive).Id,
      UnitId:unit.Id,
      ScheduleItems: scheduleItems,

    };

    this.disableSubmit = true;
    this.loading = true;
    this._appointmentapi.UpsertSchedule(schedule)
      .subscribe(result => {

        
        const dialogRef = this.dialog.open(DisplayresultComponent, { 
          data: {appointment: result}, disableClose:true 
        });
        
        
        dialogRef.afterClosed().subscribe(email => {
          if (email.email != ""){
            // send email notification
            this._appointmentapi
              .SendEmailByAppointmentId(result.Id, {Name : "Customer", Address : email.email})
              .subscribe(res => res);
          }
          this.router.navigateByUrl("/home");
        }); 

        
        
      });

     

  }



  ScheduleBelongsToCurrentUser(appointItem:string) : boolean
  {
    var customerId = appointItem.split("|")[1];
    return (this.user.Id == customerId);

  }

  MergeCalendar(summary:ISummary, dateIndex:number)
  {

    this.appItemsForCalendar = <IAppointmentRow[]> JSON.parse(JSON.stringify(this.appItems));
    var startUpdate:boolean = false;
    this.appItemsForCalendar.forEach(e => {
      if (e.DisplayItemsInRow[0] == summary.ServiceStartTime || (startUpdate && summary.TotalUnit > 0))
      {
        startUpdate = true;
        e.DisplayItemsInRow[dateIndex] = (this.summary.Id.toString == Guid.EmptyGuid ? this.scheduleGuid : this.summary.Id) 
                                        + "|" + this.user.Id // update to schedule id later
        summary.TotalUnit--;
      }
    });
  }

  onCancel(){
    this.router.navigateByUrl ('/home');

  }

  MaskMiddleCharForPhone (mobile:string) :string
  {
    return mobile.replace(/^(\d{2})\d{3}/, '$1***');
  }

  MaskMiddleCharForEmail (email:string) :string
  {
    return email.replace(/^(.{2}).{3}/, '$1***');
  }
}
