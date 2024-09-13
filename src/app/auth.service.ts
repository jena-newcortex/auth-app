import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { AngularFirestore, DocumentSnapshot } from '@angular/fire/compat/firestore';
import firebase from 'firebase/compat/app';

interface UserData {
  approved: boolean;
  email?: string;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  constructor(private afAuth: AngularFireAuth, private firestore: AngularFirestore) {}

  signUpWithEmail(email: string, password: string) {
    return this.afAuth.createUserWithEmailAndPassword(email, password)
      .then(userCredential => {
        if (userCredential.user) {
          const user = userCredential.user;
          return this.firestore.collection('users').doc(user.uid).set({
            email: user.email,
            approved: false,
          });
        } else {
          throw new Error('Failed to create user account.');
        }
      });
  }

  signInWithEmail(email: string, password: string) {
    return this.afAuth.signInWithEmailAndPassword(email, password)
      .then(userCredential => {
        if (userCredential.user) {
          const user = userCredential.user;
          return this.firestore.collection('users').doc(user.uid).get().toPromise()
            .then((doc) => {
              if (doc && doc.exists) {
                const userData = doc.data() as UserData;
                if (userData && userData.approved) {
                  return user;
                } else {
                  this.signOut();
                  throw new Error('Your account is pending approval.');
                }
              } else {
                throw new Error('No user data available after sign-in.');
              }
            });
        } else {
          throw new Error('No user data available after sign-in.');
        }
      });
  }

  signInWithGoogle() {
    return this.afAuth.signInWithPopup(new firebase.auth.GoogleAuthProvider())
      .then(userCredential => this.handleSocialSignIn(userCredential));
  }

  signInWithGithub() {
    return this.afAuth.signInWithPopup(new firebase.auth.GithubAuthProvider())
      .then(userCredential => this.handleSocialSignIn(userCredential));
  }

  private handleSocialSignIn(userCredential: firebase.auth.UserCredential) {
    if (userCredential.user) {
      const user = userCredential.user;
      const userRef = this.firestore.collection('users').doc(user.uid);
      return userRef.get().toPromise().then((doc) => {
        if (doc && doc.exists) {
          const userData = doc.data() as UserData;
          if (userData.approved) {
            return user;
          } else {
            throw new Error('Your account is pending approval.');
          }
        } else {
          return userRef.set({
            email: user.email,
            approved: false,
          }).then(() => {
            throw new Error('Your account is pending approval.');
          });
        }
      });
    } else {
      throw new Error('User data is missing after social sign-in.');
    }
  }

  signOut() {
    return this.afAuth.signOut();
  }
}
