import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { AppointmentapiService } from 'src/app/shared/appointmentapi.service';

@Component({
  selector: 'app-accesscode',
  templateUrl: './accesscode.component.html',
  styleUrls: ['./accesscode.component.scss']
})
export class AccesscodeComponent implements OnInit {
  public accessCode:string;
  public validAccessCode: boolean = true;
  public AppointmentId: string;

  constructor(public dialogref : MatDialogRef<AccesscodeComponent> , 
              @Inject(MAT_DIALOG_DATA) public data: any, 
              private _appointmentApi: AppointmentapiService) {
    
    this.AppointmentId = data.AppointmentId;

  }

  ngOnInit() {
     

  }

  onClick(returnType:string)
  {
    if (returnType != "cancel"){
      console.log(this.AppointmentId);
      console.log(this.accessCode);
      this._appointmentApi
        .ValidateAccessCode(this.AppointmentId, this.accessCode)
        .subscribe(result => {
          this.validAccessCode =  result;
          if (this.validAccessCode){
            this.dialogref.close( {
              returnType: returnType, 
              validAccessCode: this.validAccessCode, 
            }  );
          }

        });
    }
    else{
      this.dialogref.close( {
        returnType: returnType, 
        validAccessCode: this.validAccessCode, 
      }  );
    }

  }

}
