import { Injectable, inject } from "@angular/core";

import { User } from "../models/auth.models";
import { FirebaseAuthBackend } from "src/app/authUtils";

@Injectable({ providedIn: "root" })
export class AuthenticationService {
  user: User;
  private firebaseBackend: FirebaseAuthBackend = inject(FirebaseAuthBackend);

  constructor() {}

  /**
   * Returns the current user
   */
  public currentUser(): User {
    return this.firebaseBackend.getAuthenticatedUser();
  }

  /**
   * Performs the auth
   * @param email email of user
   * @param password password of user
   */
  login(email: string, password: string) {
    return this.firebaseBackend.loginUser(email, password);
    // .then((response: any) => {
    //   resolve(response);
    // })
    // .catch((error) => {
    //   throw error;
    // });
  }

  /**
   * Performs the register
   * @param email email
   * @param password password
   */
  register(email: string, password: string) {
    return this.firebaseBackend
      .registerUser(email, password)
      .then((response: any) => {
        const user = response;
        return user;
      });
  }

  /**
   * Reset password
   * @param email email
   */
  resetPassword(email: string) {
    return this.firebaseBackend.forgetPassword(email).then((response: any) => {
      const message = response.data;
      return message;
    });
  }

  /**
   * Logout the user
   */
  logout() {
    // logout the user
    this.firebaseBackend.logout();
  }
}
