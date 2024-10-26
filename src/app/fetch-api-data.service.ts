import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class FetchApiDataService {

  // Define API URL here
  apiUrl = 'https://movie-api-c3t5.onrender.com/';

  constructor(private http: HttpClient) { }

  // User Registration
  public userRegistration(userDetails: any): Observable<any> {
    return this.http.post(this.apiUrl + 'users', userDetails);
  }

  // User Login
  public userLogin(userDetails: any): Observable<any> {
    return this.http.post(this.apiUrl + 'login', userDetails);
  }

  // Get All Movies
  public getAllMovies(): Observable<any> {
    return this.http.get(this.apiUrl + 'movies');
  }

  // Get One Movie
  public getOneMovie(movieId: string): Observable<any> {
    return this.http.get(this.apiUrl + `movies/${movieId}`);
  }

  // Get Director
  public getDirector(directorName: string): Observable<any> {
    return this.http.get(this.apiUrl + `movies/director/${directorName}`);
  }

  // Get Genre
  public getGenre(genreName: string): Observable<any> {
    return this.http.get(this.apiUrl + `movies/genre/${genreName}`);
  }

  // Get User
  public getUser(): Observable<any> {
    const token = localStorage.getItem('token');
    return this.http.get(this.apiUrl + 'users', { headers: new HttpHeaders({ Authorization: `Bearer ${token}` }) });
  }

  // Get Favorite Movies for a User
  public getFavoriteMovies(): Observable<any> {
    const token = localStorage.getItem('token');
    return this.http.get(this.apiUrl + 'users/favorites', { headers: new HttpHeaders({ Authorization: `Bearer ${token}` }) });
  }

  // Add a Movie to Favorite Movies
  public addFavoriteMovie(movieId: string): Observable<any> {
    const token = localStorage.getItem('token');
    return this.http.post(this.apiUrl + `users/favorites/${movieId}`, {}, { headers: new HttpHeaders({ Authorization: `Bearer ${token}` }) });
  }

  // Edit User
  public editUser(userDetails: any): Observable<any> {
    const token = localStorage.getItem('token');
    return this.http.put(this.apiUrl + 'users', userDetails, { headers: new HttpHeaders({ Authorization: `Bearer ${token}` }) });
  }

  // Delete User
  public deleteUser(): Observable<any> {
    const token = localStorage.getItem('token');
    return this.http.delete(this.apiUrl + 'users', { headers: new HttpHeaders({ Authorization: `Bearer ${token}` }) });
  }

  // Delete a Movie from the Favorite Movies
  public deleteFavoriteMovie(movieId: string): Observable<any> {
    const token = localStorage.getItem('token');
    return this.http.delete(this.apiUrl + `users/favorites/${movieId}`, { headers: new HttpHeaders({ Authorization: `Bearer ${token}` }) });
  }
}
