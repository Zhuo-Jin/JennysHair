import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ISchedule, ICusomter } from 'src/app/interface/interface';

@Component({
  selector: 'app-displayresult',
  templateUrl: './displayresult.component.html',
  styleUrls: ['./displayresult.component.scss']
})
export class DisplayresultComponent implements OnInit {

  public appoinment:ISchedule;
  public user: ICusomter;

  public email: string = "";

  constructor(public dialogref : MatDialogRef<DisplayresultComponent > , 
            @Inject(MAT_DIALOG_DATA) public data: any) { 

    this.appoinment = data.appointment;
    if (localStorage.getItem("User")){
      this.user = JSON.parse(localStorage.getItem("User"));
    }


              
  }

  ngOnInit() {
  }

  onClick()
  {
    this.dialogref.close( {
      email: this.email     
    }  );
  }

}
