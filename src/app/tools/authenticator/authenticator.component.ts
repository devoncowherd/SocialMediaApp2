import { Component, OnInit } from '@angular/core';
import { FirebaseTSAuth } from 'firebasets/firebasetsAuth/firebaseTSAuth';
import { MatBottomSheetRef } from '@angular/material/bottom-sheet';


@Component({
  selector: 'app-authenticator',
  templateUrl: './authenticator.component.html',
  styleUrls: ['./authenticator.component.css']
})
export class AuthenticatorComponent implements OnInit {

  state = AuthenticatorCompstate.REGISTER;
  firebasetsAuth: FirebaseTSAuth;
  
  constructor(private bottomSheetRef: MatBottomSheetRef) { 
    this.firebasetsAuth = new FirebaseTSAuth();
  }

  ngOnInit(): void {
  }

  onLoginClick(){
    this.state = AuthenticatorCompstate.LOGIN;
  }

  onResetClick(resetEmail: HTMLInputElement){
    let email = resetEmail.value;
    if(this.isNotEmpty(email)) {
      this.firebasetsAuth.sendPasswordResetEmail(
        {
          email: email,
          onComplete: (uc) => {
            alert(`Reset Email sent to ${email}`);
            this.bottomSheetRef.dismiss();
          }
        }
      )

    }

  }

  onRegisterClick(
    registerEmail : HTMLInputElement,
    registerPassword : HTMLInputElement,
    registerConfirmPassword : HTMLInputElement
  ){
    let email = registerEmail.value;
    let password = registerPassword.value;
    let confirmPassword = registerConfirmPassword.value;
    if(
      this.isNotEmpty(email) &&
      this.isNotEmpty(password) &&
      this.isNotEmpty(confirmPassword) &&
      this.isAMatch(password, confirmPassword)
    ){
        this.firebasetsAuth.createAccountWith(
          {
            email: email, 
            password: password,
            onComplete: (uc) => {
              alert("Account Created");
              this.bottomSheetRef.dismiss();
            },
            onFail: (err) => {
              alert("Failed to Create Account");
            }
          }
        )
    }
  }


  onLogin(    
    loginEmail: HTMLInputElement,
    loginPassword: HTMLInputElement) {
      
      let email = loginEmail.value;
      let password = loginPassword.value;
      
      if(this.isNotEmpty(email) && this.isNotEmpty(password)){
        this.firebasetsAuth.signInWith ({
          email: email,
          password: password,
          onComplete: (uc)=> {
            alert("Logged In");
            this.bottomSheetRef.dismiss();
          },
          onFail: (err)=> {
            alert(err);
          }
        })
      }
       

  }

  isNotEmpty(text: string){
    return text != null && text.length > 0;
  }

  isAMatch(text: string, comparedWith: string){
    return  text == comparedWith;
  }

  onCreateAccountClick(){
    this.state = AuthenticatorCompstate.REGISTER;
  }

  onForgotPasswordClick(){
    this.state = AuthenticatorCompstate.FORGOT_PASSWORD;
  }

  isLoginState(){
    return this.state == AuthenticatorCompstate.LOGIN;
  }

  isRegisterState(){
    return this.state == AuthenticatorCompstate.REGISTER;
  }

  isForgotPasswordState(){
    return this.state == AuthenticatorCompstate.FORGOT_PASSWORD;
  }

  getStateText(){
    switch(this.state){
      case AuthenticatorCompstate.LOGIN: 
        return "Login";
      case AuthenticatorCompstate.FORGOT_PASSWORD:
        return "Recover Password";
      case AuthenticatorCompstate.REGISTER:
        return "Register";
    }
  }
}


export enum AuthenticatorCompstate {
  LOGIN,
  REGISTER,
  FORGOT_PASSWORD
}