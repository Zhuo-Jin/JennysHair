import { Component, OnInit, Inject, EventEmitter, Output } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialog } from '@angular/material/dialog';
import { IServiceItem, IUnit , ISummary, ICusomter, IAppointmentRow} from '../../interface/interface';
import { ServiceApiService } from '../../shared/serviceapi.service'
import { AppointmentapiService } from '../../shared/appointmentapi.service'
import { Router } from '@angular/router';
import { Guid } from 'src/app/utils/utils';
import { UpdatedateComponent } from '../updatedate/updatedate.component';


@Component({
  selector: 'app-service',
  templateUrl: './service.component.html',
  styleUrls: ['./service.component.scss']
})
export class ServiceComponent implements OnInit {

  public ServiceList: IServiceItem[] ;
  public SelectedServices : IServiceItem[] = []; 
  public Unit: IUnit;
  public AvailableUnits : number;
  public Summary: ISummary ;

  public user:ICusomter = {
    Id:"",
    Mobile:"",
    Email:"",
    Firstname:"",
    Surname:"",
    IsAdmin:false,
    StatusId:"",
   };;

  public willExceedMaxAvalibaleHours: boolean = false;
  public alreadyExceedMaxAvalibaleHours: boolean = false;
  public bounceOut:boolean = true;
  public bounceIn:boolean = false;

  public AppointId:string;

  public appItem:IAppointmentRow;
  public appItems: IAppointmentRow[];



 
  constructor(public dialogref : MatDialogRef<ServiceComponent>, 
              @Inject(MAT_DIALOG_DATA) public data: any, 
              private _serviceApi: ServiceApiService,
              private _appointmentApi: AppointmentapiService,
              private router: Router,
              public dialog: MatDialog,
              ) { 
    
    this.Summary = {
      Id: "",  
      Name: "",
        Mobile: "",
        Email:"",
        TotalCost : 0,
        TotalEstiamtedTime : 0,
        TotalUnit : 0,
        ServiceStartDate :  data.date,
        ServiceStartTime : data.appItem.DisplayItemsInRow[0],
    }

    this.appItem = data.appItem;
    this.appItems = data.appItems;

    
    

    if (data.appItem.DisplayItemsInRow[data.dateIndex] == "")
    {
      this.AppointId = Guid.EmptyGuid();
    }
    else{
      this.AppointId = data.appItem.DisplayItemsInRow[data.dateIndex].split("|")[0]
    }

    this.AvailableUnits = this.calculateAvailableTimeInUnit(data.dateIndex);

  }

  ngOnInit() {
    
    this._serviceApi.GetAllServiceData()
      .subscribe(d => {
          this.ServiceList = d;
          this.Unit = d[0].Unit;
          
          this._appointmentApi.GetScheduleItemsFromAppointmentId(this.AppointId)
            .subscribe(result => {
                result.forEach(ss => {
                  this.ServiceList.forEach(si => {
                    if (si.Id == ss.Id)  
                    {
                      this.SelectedServices.push(si);
                      let index = this.ServiceList.indexOf(si);
                      this.ServiceList.splice(index, 1);
                    }
                      
                  })
                });
                this.reCalculateTotal();
            });
      });

    if (localStorage.getItem("User") )
      this.user =JSON.parse(localStorage.getItem("User"));
    else
      this.router.navigateByUrl('login');      
      
    
  }

  onClose(clickType:string)
  {
    if (clickType == "cancel"){
      this.SelectedServices = [];
    }

    this.Summary.Id = this.AppointId;


    if (this.alreadyExceedMaxAvalibaleHours ==false)
      this.dialogref.close( {selectSvc: this.SelectedServices, summary: this.Summary}  );
  } 

  onClick(svcitem){

    if (this.Summary.TotalUnit + svcitem.UnitCost <= this.AvailableUnits)
    {
      this.SelectedServices.push(svcitem);
      const index: number = this.ServiceList.indexOf(svcitem);
      
      
      
      if (index !== -1) {
          this.ServiceList.splice(index, 1);
      }        
      this.reCalculateTotal();
      this.willExceedMaxAvalibaleHours = false;
      this.bounceIn=true;
      //this.bounceOut = false;
      
    }
    else{
      this.willExceedMaxAvalibaleHours = true;
    }
  }

  onClickBack(svcitem)
  {
    this.ServiceList.push(svcitem);
    const index: number = this.SelectedServices.indexOf(svcitem);
    if (index !== -1) {
        this.SelectedServices.splice(index, 1);
        this.bounceOut = true;
    }        
    this.reCalculateTotal();
    if (this.Summary.TotalUnit <= this.AvailableUnits){
      this.alreadyExceedMaxAvalibaleHours = false;
    }

    this.willExceedMaxAvalibaleHours = false;
  }
  
  reCalculateTotal()
  {
    this.Summary.TotalCost = 0;
    this.Summary.TotalEstiamtedTime = 0;
    this.Summary.TotalUnit = 0;
    for (var i = 0; i < this.SelectedServices.length; i++) {
      this.Summary.TotalCost += this.SelectedServices[i].ItemPrice;
      this.Summary.TotalEstiamtedTime += this.SelectedServices[i].UnitCost *  this.Unit.UnitInMin;
      this.Summary.TotalUnit += this.SelectedServices[i].UnitCost;
    }
    
  }

  openDialog(){
    
    const dialogRef = this.dialog.open(UpdatedateComponent, { 
      data: {date: this.Summary.ServiceStartDate, 
            appId:this.AppointId,  
            time: this.Summary.ServiceStartTime,

    }});

    dialogRef.afterClosed().subscribe(result => {
      if (result.returnType != "cancel"){
        this.Summary.ServiceStartDate = result.date;
        this.Summary.ServiceStartTime = result.time;
        
        this._appointmentApi
            .GetAvailableUnitsFromDateAndTime(result.date, result.time, this.AppointId)
            .subscribe(result => {
              this.AvailableUnits = result;

              if (this.Summary.TotalUnit  > this.AvailableUnits){
                this.alreadyExceedMaxAvalibaleHours = true;
              }
            }
        );
      
      }
    });

   
  }


  calculateAvailableTimeInUnit(dateIndex: number) : number{
    var totalAvai: number = 0;
    const index: number = this.appItems.indexOf(this.appItem);
    for (let i = index; i < this.appItems.length; i++)
    {

      if (this.appItems[i].DisplayItemsInRow[dateIndex] != '' && this.AppointId  != this.appItems[i].DisplayItemsInRow[dateIndex].split('|')[0]){
        // exit loop
         break;
      }
      else{
        totalAvai += 1; 
     }

    }
    return totalAvai;
  }
}
