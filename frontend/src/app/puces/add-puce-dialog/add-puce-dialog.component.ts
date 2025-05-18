import { Component } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
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
  contact_id: number | null;
  mission_id: number | null;
  date_acquisition?: Date;
}

@Component({
  selector: 'app-add-puce-dialog',
  standalone: true,
  imports: [
    FormsModule, 
    CommonModule, 
    MatFormFieldModule, 
    MatInputModule, 
    MatSelectModule
  ],
  templateUrl: './add-puce-dialog.component.html',
  styleUrls: ['./add-puce-dialog.component.scss'],
})
export class AddPuceDialogComponent {
  newPuce: Puce = {
    numero: '',
    operateur: '',
    etat: '',
    quota: '',
    contact_id: null,
    mission_id: null,
    date_acquisition: new Date()
  };
  
  operateurs: string[] = ['Ooredoo', 'Orange', 'Telecom'];
  etats: string[] = ['Active', 'Suspendue', 'Expirée'];
  contacts: any[] = [];
  missions: any[] = [];
  assignmentType: 'none' | 'contact' | 'mission' = 'none';

  constructor(
    public dialogRef: MatDialogRef<AddPuceDialogComponent>,
    private puceService: PuceService
  ) {
    // Load contacts and missions
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

  onAssignmentTypeChange() {
    // Reset both IDs
    this.newPuce.contact_id = null;
    this.newPuce.mission_id = null;
  }

  addPuce() {
    if (this.newPuce.numero.trim() && this.newPuce.operateur.trim()) {
      // Ensure only the correct ID is sent based on the assignment type
      if (this.assignmentType === 'contact') {
        this.newPuce.mission_id = null;
      } else if (this.assignmentType === 'mission') {
        this.newPuce.contact_id = null;
      } else {
        // If "none" is selected, ensure both are null
        this.newPuce.contact_id = null;
        this.newPuce.mission_id = null;
      }

      this.puceService.createPuce(this.newPuce).subscribe(
        (response) => {
          console.log('Puce added successfully:', response);
          this.dialogRef.close(response?.data || this.newPuce);
        },
        (error) => {
          console.error('Error adding puce:', error);
        }
      );
    }
  }
}