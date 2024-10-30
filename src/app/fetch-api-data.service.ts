// src/app/fetch-api-data.service.ts

import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

interface User {
  _id: string;
  Username: string;
  Password: string;
  Email: string;
  Birthday?: Date;
  FavoriteMovies: string[];
  Token?: string;
}

interface Movie {
  _id: string;
  Title: string;
  Description: string;
  Genre: string;
  Director: string;
  Actors: string[];
  ImagePath: string;
  Featured: boolean;
}

interface Director {
  Name: string;
  Bio: string;
  Birth: Date;
  Death?: Date;
}

const apiUrl = 'https://movie-api-c3t5.onrender.com/';

@Injectable({
  providedIn: 'root'
})
export class FetchApiDataService {
  constructor(private http: HttpClient) {}

  private getToken(): string {
    const userJson = localStorage.getItem('user');
    return userJson ? JSON.parse(userJson).token || '' : '';
  }

  private handleError(error: HttpErrorResponse): Observable<never> {
    console.error(`Backend returned code ${error.status}, body was:`, error.error);
    const errorMessage = typeof error.error === 'string' ? error.error : 'Something went wrong; please try again later.';
    return throwError(() => errorMessage);
  }

  private getAuthHeaders(): HttpHeaders {
    return new HttpHeaders({
      Authorization: `Bearer ${this.getToken()}`
    });
  }

  // User Registration
  userRegistration(userDetails: Partial<User>): Observable<User> {
    return this.http.post<User>(`${apiUrl}/users`, userDetails)
      .pipe(catchError(this.handleError));
  }

  // User Login
  userLogin(credentials: { Username: string; Password: string }): Observable<any> {
    return this.http.post<any>(`${apiUrl}/login`, credentials)
      .pipe(catchError(this.handleError));
  }

  // Get All Movies
  getAllMovies(): Observable<Movie[]> {
    return this.http.get<Movie[]>(`${apiUrl}/movies`, {
      headers: this.getAuthHeaders()
    }).pipe(catchError(this.handleError));
  }

  // Get Movie by ID
  getMovieById(id: string): Observable<Movie> {
    return this.http.get<Movie>(`${apiUrl}/movieid/${id}`, {
      headers: this.getAuthHeaders()
    }).pipe(catchError(this.handleError));
  }

  // Get Movie by Title
  getMovieByTitle(title: string): Observable<Movie> {
    return this.http.get<Movie>(`${apiUrl}/movie/${title}`, {
      headers: this.getAuthHeaders()
    }).pipe(catchError(this.handleError));
  }

  // Get Director by Name
  getDirector(directorName: string): Observable<Director> {
    return this.http.get<Director>(`${apiUrl}/director/${directorName}`, {
      headers: this.getAuthHeaders()
    }).pipe(catchError(this.handleError));
  }

  // Get User List
  getUserList(): Observable<User[]> {
    return this.http.get<User[]>(`${apiUrl}/users`, {
      headers: this.getAuthHeaders()
    }).pipe(catchError(this.handleError));
  }

  // Get User by ID
  getUserById(id: string): Observable<User> {
    return this.http.get<User>(`${apiUrl}/user/${id}`, {
      headers: this.getAuthHeaders()
    }).pipe(catchError(this.handleError));
  }

  // Add Favorite Movie
  addFavoriteMovie(userId: string, title: string): Observable<User> {
    return this.http.post<User>(`${apiUrl}/user/${userId}/${title}`, {}, {
      headers: this.getAuthHeaders()
    }).pipe(catchError(this.handleError));
  }

  // Delete Favorite Movie
  deleteFavoriteMovie(userId: string, title: string): Observable<User> {
    return this.http.delete<User>(`${apiUrl}/user/${userId}/${title}`, {
      headers: this.getAuthHeaders()
    }).pipe(catchError(this.handleError));
  }

  // Edit User
  editUser(userDetails: Partial<User>): Observable<User> {
    return this.http.put<User>(`${apiUrl}/user/${userDetails._id}`, userDetails, {
      headers: this.getAuthHeaders()
    }).pipe(catchError(this.handleError));
  }

  // Delete User
  deleteUser(userId: string): Observable<string> {
    return this.http.delete<string>(`${apiUrl}/user`, {
      headers: this.getAuthHeaders(),
      body: { id: userId }
    }).pipe(catchError(this.handleError));
  }
}

import { Component } from '@angular/core';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatDialogRef } from '@angular/material/dialog';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { FormsModule } from '@angular/forms';

interface User {
  Username: string;
  Password: string;
  Email: string;
  Birthday?: Date;
}

@Component({
  selector: 'app-user-registration-form',
  template: `
    <mat-card>
      <form (ngSubmit)="registerUser()">
        <mat-form-field>
          <input matInput placeholder="Username" [(ngModel)]="userData.Username" name="Username" required>
        </mat-form-field>
        <mat-form-field>
          <input matInput placeholder="Password" [(ngModel)]="userData.Password" name="Password" type="password" required>
        </mat-form-field>
        <mat-form-field>
          <input matInput placeholder="Email" [(ngModel)]="userData.Email" name="Email" type="email" required>
        </mat-form-field>
        <mat-form-field>
          <input matInput placeholder="Birthday" [(ngModel)]="userData.Birthday" name="Birthday" type="date" required>
        </mat-form-field>
        <button mat-raised-button color="primary" type="submit">Register</button>
      </form>
    </mat-card>
  `,
  // styleUrls: ['./user-registration-form.component.scss'],
  standalone: true,
  imports: [
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatSnackBarModule,
    FormsModule
  ]
})
export class UserRegistrationFormComponent {
  userData: Partial<User> = {
    Username: '',
    Password: '',
    Email: '',
    Birthday: undefined
  };

  constructor(
    public fetchApiData: FetchApiDataService,
    public snackBar: MatSnackBar,
    public dialogRef: MatDialogRef<UserRegistrationFormComponent>
  ) {}

  registerUser(): void {
    if (!this.userData.Username || !this.userData.Password || !this.userData.Email || !this.userData.Birthday) {
      this.snackBar.open('Please fill all fields', 'OK', { duration: 2000 });
      return;
    }

    // Convert Birthday string to Date object
    const userDataWithDate: Partial<User> = {
      ...this.userData,
      Birthday: new Date(this.userData.Birthday as unknown as string)
    };

    this.fetchApiData.userRegistration(userDataWithDate).subscribe(
      (result: any) => {
        this.dialogRef.close();
        this.snackBar.open('Registration successful', 'OK', { duration: 2000 });
      },
      (error: any) => {
        const errorMessage = error.error ? error.error.message : 'Registration failed';
        this.snackBar.open(`Registration failed: ${errorMessage}`, 'OK', { duration: 2000 });
      }
    );
  }
}
