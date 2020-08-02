import { Component, OnInit } from '@angular/core';
import { DataService } from '../helpers/data.service';

@Component({
  selector: 'app-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.css']
})
export class ListComponent implements OnInit {
  products = [];

  constructor(private dataService: DataService) { }

  ngOnInit() {

    this.dataService.sendGetRequest().subscribe((data: any[])=>{
      this.products = data;
    })
  }

  IsLogged(){
    return localStorage.getItem('user') !== null
  }

}
