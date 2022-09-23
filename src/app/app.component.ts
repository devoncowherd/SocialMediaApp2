import { Component } from '@angular/core';
import { MatBottomSheet } from '@angular/material/bottom-sheet';
import { AuthenticatorComponent } from './tools/authenticator/authenticator.component';
import { FirebaseTSAuth } from 'firebasets/firebasetsAuth/firebaseTSAuth';
import { Router } from '@angular/router';
import { FirebaseTSFirestore } from 'firebasets/firebasetsFirestore/firebaseTSFirestore';
import { PostFeedComponent } from './pages/post-feed/post-feed.component';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'SocialMediaApp';
  auth = new FirebaseTSAuth();
  firestore = new FirebaseTSFirestore();
  userHasProfile = true;
  isLoggedIn = false;
  private static userDocument: UserDocument = <UserDocument><unknown>Object; 

  constructor(private loginSheet: MatBottomSheet,
    private router: Router) {
    this.auth.listenToSignInStateChanges(
      user => {
        this.auth.checkSignInState(
          {
            whenSignedIn: user => {
              this.isLoggedIn = true;
            },
            whenSignedOut: user => {
              this.isLoggedIn = false;
              AppComponent.userDocument = <UserDocument><unknown>"";
            },
            whenSignedInAndEmailNotVerified: user => {
              this.router.navigate(["emailVerification"]);
            },
            whenSignedInAndEmailVerified: user => {
              this.getUserProfile();
            }, 
            whenChanged: user => {

            }
          }
        );
      }
    );
  }

  public static getUserDocument(){
    return AppComponent.userDocument;
  }

  getUsername(){
    try{
      return AppComponent.userDocument.publicName;
    } catch (err) {
     return err; 
    }

  }

  getUserProfile(){
    this.firestore.listenToDocument(
      {
        name: "Getting Document",
        path: ["Users", this.auth.getAuth().currentUser!.uid],
        onUpdate: (result) => {
          AppComponent.userDocument = <UserDocument>result.data();        
          this.userHasProfile = result.exists;  
          AppComponent.userDocument.userId = this.auth.getAuth().currentUser?.uid;
          if(this.userHasProfile){
            this.router.navigate(["postfeed"]);
          }
        }
      }
    );
  }

  loggedIn(){
    return this.auth.isSignedIn();
  }

  onLoginClick(){
    this.loginSheet.open(AuthenticatorComponent);
  }

  onLogoutClick(){
    this.auth.signOut();
  }
}


export interface UserDocument {
  publicName: string;
  description: string;
  userId?: string;
}