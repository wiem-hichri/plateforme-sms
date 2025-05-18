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
  contact_id: number | null;
  mission_id: number | null;
  date_acquisition?: Date;
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
  operateurs: string[] = ['Ooredoo', 'Orange', 'Telecom'];
  etats: string[] = ['Active', 'Suspendue', 'Expirée'];
  contacts: any[] = [];
  missions: any[] = [];
  assignmentType: 'none' | 'contact' | 'mission' = 'none';

  constructor(
    public dialogRef: MatDialogRef<EditPuceDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { puce: Puce },
    private puceService: PuceService
  ) {
    this.puce = { ...data.puce };
    
    // Determine the initial assignment type
    if (this.puce.contact_id) {
      this.assignmentType = 'contact';
    } else if (this.puce.mission_id) {
      this.assignmentType = 'mission';
    } else {
      this.assignmentType = 'none';
    }
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

  onAssignmentTypeChange() {
    // Reset both IDs when changing assignment type
    this.puce.contact_id = null;
    this.puce.mission_id = null;
  }

  updatePuce() {
    if (this.puce.numero.trim() && this.puce.operateur.trim() && this.puce.id) {
      // Ensure only the correct ID is sent based on the assignment type
      if (this.assignmentType === 'contact') {
        this.puce.mission_id = null;
      } else if (this.assignmentType === 'mission') {
        this.puce.contact_id = null;
      } else {
        // If "none" is selected, ensure both are null
        this.puce.contact_id = null;
        this.puce.mission_id = null;
      }

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