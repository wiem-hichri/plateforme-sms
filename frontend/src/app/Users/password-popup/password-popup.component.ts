import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-password-popup',
  standalone: true,
  imports: [CommonModule],
  template: `
  <div class="p-6 bg-white shadow-lg rounded-lg w-80">
    <h2 class="text-lg font-bold mb-2">Identifiants</h2>
    <p>Nom d'utilisateur :</p>
    <p class="text-xl font-mono bg-gray-100 p-2 rounded">{{ data.login }}</p>
    <p>Mot de passe :</p>
    <p class="text-xl font-mono bg-gray-100 p-2 rounded">{{ data.password }}</p>
    <button class="mt-4 w-full px-4 py-2 bg-blue-600 text-white rounded" (click)="close()">Fermer</button>
</div> `,
  styleUrls: ['./password-popup.component.scss']
})
export class PasswordPopupComponent {
  constructor(
    public dialogRef: MatDialogRef<PasswordPopupComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { login: string; matricule: string; password: string }
  ) {}

  close() {
    this.dialogRef.close();
  }
}
