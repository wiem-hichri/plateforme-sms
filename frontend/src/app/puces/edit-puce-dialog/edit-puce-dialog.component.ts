import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { PuceService } from '../../services/puce.service';

interface Puce {
  id?: number;
  numero: string;
  operateur: string;
  etat: string;
  quota: string;
  contact_id: number;
  mission_id: number;
}

@Component({
  selector: 'app-edit-puce-dialog',
  standalone: true,
  imports: [
    FormsModule, 
    CommonModule, 
    MatFormFieldModule, 
    MatInputModule, 
    MatSelectModule
  ],
  templateUrl: './edit-puce-dialog.component.html',
  styleUrls: ['./edit-puce-dialog.component.scss'],
})
export class EditPuceDialogComponent implements OnInit {
  puce: Puce;
  contacts: any[] = [];
  missions: any[] = [];

  constructor(
    public dialogRef: MatDialogRef<EditPuceDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { puce: Puce },
    private puceService: PuceService
  ) {
    this.puce = { ...data.puce };
  }

  ngOnInit() {
    this.loadData();
  }

  loadData() {
    this.puceService.getContacts().subscribe((res) => {
      this.contacts = res.data;
    });

    this.puceService.getMissions().subscribe((res) => {
      this.missions = res.data;
    });
  }

  closeDialog() {
    this.dialogRef.close();
  }

  updatePuce() {
    if (this.puce.numero.trim() && this.puce.operateur.trim() && this.puce.id) {
      this.puceService.updatePuce(this.puce.id, this.puce).subscribe(
        (response) => {
          console.log('Puce updated successfully:', response);
          this.dialogRef.close(response?.data || this.puce);
        },
        (error) => {
          console.error('Error updating puce:', error);
        }
      );
    }
  }
}