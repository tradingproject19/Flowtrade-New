import { Injectable, inject } from "@angular/core";
import {
  Auth,
  createUserWithEmailAndPassword,
  onAuthStateChanged,
} from "@angular/fire/auth";
import { DatabaseInstances, ListenEvent, fromRef, ref } from "@angular/fire/database";
import {
  UserCredential,
  sendPasswordResetEmail,
  signInWithEmailAndPassword,
  signOut,
} from "firebase/auth";
import { EventService } from "./core/services/event.service";
import { User } from "./core/models/auth.models";

@Injectable({ providedIn: "root" })
export class FirebaseAuthBackend {
  private auth: Auth = inject(Auth);
  private event: EventService = inject(EventService);
  private firebaseUserDb: DatabaseInstances = inject(DatabaseInstances);
  constructor() {
    onAuthStateChanged(this.auth, (user) => {
      if (user) {
        localStorage.setItem("authUser", JSON.stringify(user));
        let query = ref(this.firebaseUserDb[0], "users/" + user.uid);
        fromRef(query, ListenEvent.value).subscribe((data) => {
          this.event.publish("UserData", { userProfile: data.snapshot.val() });
        });
      } else {
        localStorage.removeItem("authUser");
      }
    });
  }

  /**
   * Registers the user with given details
   */
  registerUser = (email, password) => {
    return new Promise((resolve, reject) => {
      createUserWithEmailAndPassword(this.auth, email, password).then(
        (user: UserCredential) => {
          resolve(user.user);
        },
        (error) => {
          reject(this._handleError(error));
        }
      );
    });
  };

  /**
   * Login user with given details
   */
  loginUser = (email, password) => {
    return new Promise((resolve, reject) => {
      signInWithEmailAndPassword(this.auth, email, password).then(
        (user: UserCredential) => {
          resolve(user.user);
        },
        (error) => {
          reject(this._handleError(error));
        }
      );
    });
  };

  /**
   * forget Password user with given details
   */
  forgetPassword = (email) => {
    return new Promise((resolve, reject) => {
      sendPasswordResetEmail(this.auth, email, {
        url: window.location.protocol + "//" + window.location.host + "/login",
      })
        .then(() => {
          resolve(true);
        })
        .catch((error) => {
          reject(this._handleError(error));
        });
    });
  };

  /**
   * Logout the user
   */
  logout = () => {
    return new Promise((resolve, reject) => {
      signOut(this.auth)
        .then(() => {
          resolve(true);
        })
        .catch((error) => {
          reject(this._handleError(error));
        });
    });
  };

  setLoggeedInUser = (user) => {
    localStorage.setItem("authUser", JSON.stringify(user));
  };

  /**
   * Returns the authenticated user
   */
  getAuthenticatedUser = () => {
    if (!localStorage.getItem("authUser")) {
      return null;
    }
    return JSON.parse(localStorage.getItem("authUser")) as User;
  };

  /**
   * Handle the error
   * @param {*} error
   */
  _handleError(error) {
    // tslint:disable-next-line: prefer-const
    var errorMessage = error.message;
    return errorMessage;
  }
}
