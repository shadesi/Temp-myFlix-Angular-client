import { Component } from '@angular/core';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatDialogRef } from '@angular/material/dialog';
import { FetchApiDataService } from '../fetch-api-data.service';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { FormsModule } from '@angular/forms';

interface User {
  Username: string;
  Password: string;
  Email: string;
  Birthday: Date;
}

@Component({
  selector: 'app-user-registration-form',
  templateUrl: './user-registration-form.component.html',
  styleUrls: ['./user-registration-form.component.scss'],
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
