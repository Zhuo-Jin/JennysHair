import { Component, OnInit } from '@angular/core';
import {ServiceApiService} from '../shared/serviceapi.service'
import { IServiceItem } from '../interface/interface';
import { Router } from '@angular/router';



@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

  public maxImageNumber:number = 36;
  public maxLoadImageNumber:number = 6;
  public totalGroup:number = this.maxImageNumber/this.maxLoadImageNumber; 
  public groupNumber:number = 0;

  public serviceItems : IServiceItem[];
  
  public randomImageNumber:any[];
  constructor(private _serviceApi: ServiceApiService, private router: Router) { }

  ngOnInit() {

    this._serviceApi.GetAllServiceData().subscribe(d => this.serviceItems = d);
    this.getImageGroup();

    setInterval(() => {
      this.getImageGroup()
    }, 8000); 
    
    // setTimeout( () => { /*Your Code*/ }, Milliseconds )
  }

  getImageGroup(){
    this.groupNumber ++;
    this.groupNumber = this.groupNumber % this.totalGroup;
    var imageStartNumber = this.groupNumber * this.maxLoadImageNumber;
    this.randomImageNumber = [];

    setTimeout( () => { this.randomImageNumber.push({'ImageNumber': imageStartNumber + 0, 'isIn':true }) }, 1000 );
    setTimeout( () => { this.randomImageNumber.push({'ImageNumber': imageStartNumber + 1, 'isIn':true }) }, 2000 );
    setTimeout( () => { this.randomImageNumber.push({'ImageNumber': imageStartNumber + 2, 'isIn':true }) }, 3000 );
    setTimeout( () => { this.randomImageNumber.push({'ImageNumber': imageStartNumber + 3, 'isIn':true }) }, 4000 );
    setTimeout( () => { this.randomImageNumber.push({'ImageNumber': imageStartNumber + 4, 'isIn':true }) }, 5000 );
    setTimeout( () => { this.randomImageNumber.push({'ImageNumber': imageStartNumber + 5, 'isIn':true }) }, 6000 );
    // for (var i = 0; i < this.maxLoadImageNumber; i++)
    // {
    //   setTimeout( () => { this.randomImageNumber.push({'ImageNumber': imageStartNumber + i, 'isIn':true }) }, 1000 + i * 1000 );
      
      
    // }

  }
  

  onClickAppointment(){
    this.router.navigateByUrl('/appointment')
  }

  // getRandomImageNumber() : number[] {
    
  //   var listNumber:any[] = [];
  //   for (var i = 0; i < this.maxLoadImageNumber; i++)
  //   {
  //     var randNumber = Math.round(Math.random() * this.maxImageNumber);
  //     while (listNumber.indexOf(randNumber) != -1)
  //     {
  //       randNumber = Math.round(Math.random() * this.maxImageNumber);
  //     }

  //     listNumber.push(randNumber);
  //   }

  //   return listNumber;

  // }
}
