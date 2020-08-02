import { Component, OnInit } from '@angular/core';
import {NgbModal, ModalDismissReasons} from '@ng-bootstrap/ng-bootstrap';
import { HttpParams, HttpClient, HttpHeaders } from '@angular/common/http';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: []
})

export class AppComponent{
  closeResult: string;
  private _loginUrl = 'https://bravosul-app.herokuapp.com/auth/local';
  loginError = false;

  constructor(private modalService: NgbModal, private _http: HttpClient) {}

  open(content) {
    this.modalService.open(content, {ariaLabelledBy: 'modal-basic-title'}).result.then((result) => {
      this.closeResult = `Closed with: ${result}`;
    }, (reason) => {
      this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
    });
  }

  Login(email, password) {
    const myheader = new HttpHeaders().set('Content-Type', 'application/x-www-form-urlencoded')
    let body = new HttpParams();
    body = body.set('identifier', email);
    body = body.set('password', password);
    this._http.post(this._loginUrl, body, {headers: myheader}).subscribe(
      data => {
        localStorage.setItem('user', JSON.stringify(data));
        this.loginError = false;
        this.modalService.dismissAll("#login");
      },
      error => {
        this.loginError = true;
      }
    );
  }

  IsLogged(){
    return localStorage.getItem('user') !== null
  }

  Logout(){
    localStorage.removeItem('user');
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