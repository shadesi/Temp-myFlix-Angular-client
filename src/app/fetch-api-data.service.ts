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
