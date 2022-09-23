import { Component, Inject, OnInit } from '@angular/core';
import { FirebaseTSFirestore } from 'firebasets/firebasetsFirestore/firebaseTSFirestore';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FirebaseTSApp } from 'firebasets/firebasetsApp/firebaseTSApp';
import { AppComponent } from 'src/app/app.component';

@Component({
  selector: 'app-reply',
  templateUrl: './reply.component.html',
  styleUrls: ['./reply.component.css']
})
export class ReplyComponent implements OnInit {
  firestore = new FirebaseTSFirestore();
  constructor(@Inject(MAT_DIALOG_DATA) private postId: string) { }

  ngOnInit(): void {
  }

  onSendClick(commentInput: HTMLInputElement){
    if(commentInput.value.length <= 0){
      alert("Can't Submit Empty Comment"); 
      return
    };

    this.firestore.create(
      {
        path: ["Posts", this.postId, "PostComments"],
        data: {
          comment: commentInput.value,
          creatorId: AppComponent.getUserDocument()?.userId,
          creatorName: AppComponent.getUserDocument()?.publicName ,
          timestamp: FirebaseTSApp.getFirestoreTimestamp()
        },
        onComplete: (docId) => {
          commentInput.value = "";

        },
        onFail: (err) => {
          alert(err);
        }
      }
    )
  }
}
