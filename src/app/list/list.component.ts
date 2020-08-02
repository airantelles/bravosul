import { Component, OnInit } from '@angular/core';
import { DataService } from '../helpers/data.service';
import {NgbModal, ModalDismissReasons} from '@ng-bootstrap/ng-bootstrap';
import { HttpParams, HttpClient, HttpHeaders } from '@angular/common/http';


@Component({
  selector: 'app-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.css']
})
export class ListComponent implements OnInit {
  private _basicUrl = 'https://bravosul-app.herokuapp.com';
  private _createUrl = '/products';
  closeResult: string;
  enabled = 1;
  products = [];

  constructor(private dataService: DataService, private modalService: NgbModal, private _http: HttpClient) { }

  open(content, value=null) {
    this.enabled = 1;
    this.modalService.open(content, {ariaLabelledBy: 'modal-basic-title'}).result.then((result) => {
      this.closeResult = `Closed with: ${result}`;
    }, (reason) => {
      this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
    });
    if(value != null){
      let user = JSON.parse(localStorage.getItem('user'))
      const myheader = new HttpHeaders().set('Content-Type', 'application/x-www-form-urlencoded').set('Authorization', `Bearer ${user.jwt}`)
      this._http.get(this._basicUrl+this._createUrl+'/'+value.id, {headers: myheader}).subscribe(
        data => {
          document.getElementById("idProduct").setAttribute('value',data["id"]);
          document.getElementById("nameProduct").setAttribute('value',data["name"]);
          document.getElementById("descriptionProduct").setAttribute('value',data["description"]);
          this.enabled = data["enabled"]
        },
        error => {
          console.log(error)
          console.log("Error")
        }
      );
    }
  }

  ngOnInit() {
    this.dataService.sendGetRequest().subscribe((data: any[])=>{
      data.sort((a, b) => (a.id > b.id) ? 1 : -1)
      this.products = data;
    })
  }

  IsLogged(){
    return localStorage.getItem('user') !== null
  }

  getProducts(){
    this.products = [];
    this.dataService.sendGetRequest().subscribe((data: any[])=>{
      data.sort((a, b) => (a.id > b.id) ? 1 : -1)
      this.products = data;
    })
  }

  CreateOrUpdate(name, description, enabled, id){
    let user = JSON.parse(localStorage.getItem('user'))
    const myheader = new HttpHeaders().set('Content-Type', 'application/x-www-form-urlencoded').set('Authorization', `Bearer ${user.jwt}`)
    let body = new HttpParams();
    if(id == ''){
      body = body.set('name', name);
      body = body.set('description', description);
      body = body.set('enabled', enabled);
      this._http.post(this._basicUrl+this._createUrl, body, {headers: myheader}).subscribe(
        data => {
          this.getProducts();
          this.modalService.dismissAll("#product");
        },
        error => {
          console.log(error)
        }
      );
    } else {
      body = body.set('id', id);
      body = body.set('name', name);
      body = body.set('description', description);
      body = body.set('enabled', enabled);
      this._http.put(this._basicUrl+this._createUrl+'/'+id, body, {headers: myheader}).subscribe(
        data => {
          this.getProducts();
          this.modalService.dismissAll("#product");
        },
        error => {
          console.log(error)
        }
      );
    }
  }

  Destroy(id){
    let user = JSON.parse(localStorage.getItem('user'))
    const myheader = new HttpHeaders().set('Authorization', `Bearer ${user.jwt}`)
    this._http.delete(this._basicUrl+this._createUrl+'/'+id, {headers: myheader}).subscribe(
      data => {
        this.getProducts();
      },
      error => {
        console.log(error)
        console.log("Error")
      }
    );
  }

  private getDismissReason(reason: any): string {
    if (reason === ModalDismissReasons.ESC) {
      return 'by pressing ESC';
    } else if (reason === ModalDismissReasons.BACKDROP_CLICK) {
      return 'by clicking on a backdrop';
    } else {
      return  `with: ${reason}`;
    }
  }

}
