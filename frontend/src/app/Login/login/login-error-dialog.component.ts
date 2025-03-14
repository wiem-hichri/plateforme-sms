import { Component } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-login-error-dialog',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="p-6 max-w-sm mx-auto bg-white rounded-lg shadow-md text-center">
      <h2 class="text-xl font-semibold text-red-600">Erreur de Connexion</h2>
      <p class="mt-2 text-gray-700">Identifiant ou mot de passe incorrect.</p>
      <button class="mt-4 px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
              (click)="closeDialog()">OK</button>
    </div>
  `,
})
export class LoginErrorDialogComponent {
  constructor(public dialogRef: MatDialogRef<LoginErrorDialogComponent>) {}

  closeDialog() {
    this.dialogRef.close();
  }
}
