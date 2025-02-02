import { AllPurposeService } from './../allpurposervice.service';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent implements OnInit {
  studentId = '';
  password = '';
  isValid = false;
  errorValue = '';
  userType = '';


  constructor(private router: Router, private allPurpose: AllPurposeService) {}

  ngOnInit(): void {
    console.log(this.allPurpose.encrypt("Guru"));
    let m = this.allPurpose.encrypt("Guru");
    console.log(this.allPurpose.decrypt(m));


    if (localStorage.getItem('loginData')) {
      let r = JSON.parse(localStorage.getItem('loginData') ?? '');
      this.router.navigateByUrl(r.type);
    }
  }

  login() {
    this.allPurpose.login(this.studentId, this.password).subscribe(
      (resp) => {
        console.log(resp);
        this.allPurpose.userEmail = this.studentId;
        this.allPurpose.password = this.password;
      },
      (err) => {
        console.log(err);
        // console.log(err.error.error.message);
        this.errorValue = "Invalid Credentials";
        this.isValid = true;
      },
      () => {
        console.log('Completed 1st Api Call');
        this.checkUserType();
      }
    );
  }
  //for checking user type we are using this function
  checkUserType() {
    this.allPurpose.getUsers(this.studentId).subscribe(
      (res: any) => {
        Object.keys(res).forEach((k) => {
          if (res[k].email == this.studentId) {
            this.userType = res[k].user_type;
          }
        });
        console.log(this.userType);
      },
      (err) => {
        console.log('Error');
        console.log(err);
        console.log(err.error.error.message);
        this.errorValue = "Invalid User";
        this.isValid = true;
      },
      () => {
        console.log('Completed 2nd Api Call');
        console.log(this.userType);
        this.allPurpose.userType = this.userType;
        this.allPurpose.isAuth = true;
        // localStorage.setItem('loginData',JSON.stringify({name:this.studentId,type:this.userType}));
        localStorage.setItem("loginData",JSON.stringify({name:this.studentId,type:this.userType+'db'}));
        this.router.navigateByUrl(this.userType+'db')
      }
    );
  }
}
