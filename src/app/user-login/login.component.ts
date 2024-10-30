import { Component } from '@angular/core';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatDialogRef } from '@angular/material/dialog';
import { FetchApiDataService } from '../fetch-api-data.service';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-user-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
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
export class UserLoginComponent {
  userData = {
    Username: '',
    Password: ''
  };

  constructor(
    public fetchApiData: FetchApiDataService,
    public snackBar: MatSnackBar,
    public dialogRef: MatDialogRef<UserLoginComponent>
  ) {}

  loginUser(): void {
    this.fetchApiData.userLogin(this.userData).subscribe(
      (result: any) => {
        localStorage.setItem('user', JSON.stringify(result.user));
        localStorage.setItem('token', result.token);
        this.snackBar.open(`Login Successful, Hello ${result.user.Username}`, 'OK', { duration: 2000 });
        this.dialogRef.close('success');
      },
      (error: any) => {
        const errorMessage = error.error ? error.error.message : 'Login failed';
        this.snackBar.open(`Login failed: ${errorMessage}`, 'OK', { duration: 2000 });
      }
    );
  }
}
