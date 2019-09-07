import { Component, OnInit , Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';


@Component({
  selector: 'app-popupdate',
  templateUrl: './popupdate.component.html',
  styleUrls: ['./popupdate.component.scss']
})
export class PopupdateComponent implements OnInit {

  constructor(public dialogref : MatDialogRef<PopupdateComponent>, @Inject(MAT_DIALOG_DATA) public data: any) { }

  ngOnInit() {

    console.log (this.data);
  }

  onClose(updateType:string)
  {
    this.dialogref.close( updateType );
  } 

}
