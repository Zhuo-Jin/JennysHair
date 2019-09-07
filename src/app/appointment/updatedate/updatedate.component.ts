import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { AppointmentapiService } from '../../shared/appointmentapi.service'
import { FormBuilder, Validators } from '@angular/forms';
import { DateAdapter, MAT_DATE_FORMATS } from '@angular/material';
import { AppDateAdapter, APP_DATE_FORMATS } from 'src/app/utils/format-datepicker';

@Component({
  selector: 'app-updatedate',
  templateUrl: './updatedate.component.html',
  styleUrls: ['./updatedate.component.scss'],
  providers: [
    {provide: DateAdapter, useClass: AppDateAdapter},
    {provide: MAT_DATE_FORMATS, useValue: APP_DATE_FORMATS}
  ]
})
export class UpdatedateComponent implements OnInit {
  public appointmentDate:Date;
  public appointmentTime:string;
  public appoinmentId:string;
  public availableTimeList: string[];
  public datePickerForm = this.fb.group({
    appCtrlDate: [this.appointmentDate],
    appCtrlTime: [this.appointmentTime, [Validators.required, Validators.pattern(/^\d{1,2}\/\d{1,2}\/\d{4}$/) ]]
  });

  public workDateFilter = (d: Date): boolean => {
    const day = d.getDay();
    // Prevent Sunday from being selected.
    return day !== 0;
  }

  constructor(public dialogref : MatDialogRef<UpdatedateComponent>, 
              @Inject(MAT_DIALOG_DATA) public data: any, 
              private _appointmentApi: AppointmentapiService,
              private fb: FormBuilder) { 

     this.appointmentDate = data.date;
     this.appointmentTime = data.time;    
     this.appoinmentId = data.appId;
     //reactive form builder
    this.datePickerForm.get("appCtrlDate").setValue(data.date);    
    this.datePickerForm.get("appCtrlTime").setValue(data.time);

    this.updateDate();
           

  }

  ngOnInit() {
  }

  updateDate(){
    this.appointmentDate = this.datePickerForm.get("appCtrlDate").value;
    this.reFreshData();
  }

  reFreshData(){
    this._appointmentApi.GetAvailableTimeListFromDate(this.appointmentDate, this.appoinmentId).subscribe(result => this.availableTimeList = result);  

  }


  onClose(clickType:string)
  {
    this.dialogref.close( {
                            returnType: clickType, 
                            date: this.appointmentDate, 
                            time: this.appointmentTime 
                          }  );
    
    
  
  } 


}
