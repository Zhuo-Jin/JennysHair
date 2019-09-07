import { Time } from '@angular/common';

export interface IServiceItem {
    Id:string,
    ServiceCode: string,
    ServiceDescription:string,
    ItemPrice: number,
    UnitCost:number,
    Unit:IUnit
 };


 export interface IAppointmentRow {
   DisplayItemsInRow:string[]
 };

 export interface IAppointment{
    WorkTimeStart:Date,
    WorkTimeFinish:Date,
    TimeUnitInMin:number,
    AppointmentItems: IAppointmentRow[],
    Header:any[]
 }

 export interface IUnit {
   Id:string,
   UnitInMin: number,
   
};


export interface ICusomter {
   Id:string,
   Mobile:string,
   Email:string,
   Firstname:string,
   Surname:string,
   IsAdmin:boolean,
   StatusId:string,
  };

export interface ISummary {
   Id:string,
   Name:string,
   Mobile:string,
   Email:string,
   ServiceStartDate:Date,
   ServiceStartTime:string,
   TotalCost:number,
   TotalUnit:number,
   TotalEstiamtedTime: number,
 };

 export interface IStatus {
   Id:string,
   StatusName:string,
 };

 export interface ISchedule{
    Id:string,
    StartTime:string,
    FinishTime:string,
    TotalUnitCost:number,
    Token:string,
    CustomerId:string,
    StatusId:string,
    UnitId:string,
    ScheduleItems : IScheduleItem[]
};

export interface IScheduleItem{
  Id:string,
  ScheduleId:string,
  ServiceItemId:string,
};

export interface IEmailAddress {
  Name:string,
  Address:string
}

 