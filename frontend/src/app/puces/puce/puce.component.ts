import { Component, OnInit } from '@angular/core';
import { PuceService } from '../../services/puce.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog } from '@angular/material/dialog';
import { AddPuceDialogComponent } from '../add-puce-dialog/add-puce-dialog.component';
import { EditPuceDialogComponent } from '../edit-puce-dialog/edit-puce-dialog.component';

interface Puce {
  id?: number;
  numero: string;
  operateur: string;
  etat: string;
  quota: string;
  contact_id: number;
  mission_id: number;
  contact_name?: string;
  mission_name?: string;
}

@Component({
  selector: 'app-puce',
  standalone: true,
  imports: [
    CommonModule, 
    FormsModule, 
    MatIconModule,
    MatButtonModule
  ],
  templateUrl: './puce.component.html',
  styleUrls: ['./puce.component.scss']
})
export class PuceComponent implements OnInit {
  puces: Puce[] = [];
  contacts: any[] = [];
  missions: any[] = [];
  searchText: string = '';

  constructor(
    private puceService: PuceService,
    public dialog: MatDialog
  ) {}

  ngOnInit() {
    this.loadAll();
  }

  loadAll() {
    this.puceService.getContacts().subscribe((res) => {
      this.contacts = res.data;
      this.puceService.getMissions().subscribe((res2) => {
        this.missions = res2.data;
        this.puceService.getPuces().subscribe((res3) => {
          this.puces = res3.data.map((puce: any) => ({
            ...puce,
            contact_name: this.contacts.find(c => c.id === puce.contact_id)?.nom || '—',
            mission_name: this.missions.find(m => m.id === puce.mission_id)?.type_mission || '—'
          }));
        });
      });
    });
  }

  ajouterPuce() {
    const dialogRef = this.dialog.open(AddPuceDialogComponent, {
      width: '400px'
    });

    dialogRef.afterClosed().subscribe((newPuce: Puce | undefined) => {
      if (newPuce) {
        this.loadAll();
      }
    });
  }

  modifierPuce(puce: Puce) {
    const dialogRef = this.dialog.open(EditPuceDialogComponent, {
      width: '400px',
      data: { puce }
    });

    dialogRef.afterClosed().subscribe((updatedPuce: Puce | undefined) => {
      if (updatedPuce) {
        this.loadAll();
      }
    });
  }

  supprimerPuce(id: number) {
    if (confirm('Voulez-vous vraiment supprimer cette puce ?')) {
      this.puceService.supprimerPuce(id).subscribe(() => this.loadAll());
    }
  }

  getFilteredPuces(): Puce[] {
    if (!this.searchText.trim()) return this.puces;
    const lowerSearch = this.searchText.toLowerCase();
    return this.puces.filter(puce =>
      puce.numero.toLowerCase().includes(lowerSearch) ||
      puce.operateur.toLowerCase().includes(lowerSearch) ||
      puce.etat.toLowerCase().includes(lowerSearch) ||
      puce.contact_name?.toLowerCase().includes(lowerSearch) ||
      puce.mission_name?.toLowerCase().includes(lowerSearch)
    );
  }
}