import { Component, OnInit } from '@angular/core';
import { PuceService } from '../../services/puce.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { PuceModalComponent } from '../puce-modal/puce-modal.component';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
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
  imports: [CommonModule, FormsModule, PuceModalComponent,MatIconModule,
    MatButtonModule,],
  templateUrl: './puce.component.html',
  styleUrls: ['./puce.component.scss']
})
export class PuceComponent implements OnInit {
  puces: Puce[] = [];
  contacts: any[] = [];
  missions: any[] = [];
  selectedPuce: Puce | null = null;
  showModal = false;

  constructor(private puceService: PuceService) {}

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
    this.selectedPuce = {
      numero: '',
      operateur: '',
      etat: '',
      quota: '',
      contact_id: 0,
      mission_id: 0
    };
    this.showModal = true;
  }

  modifierPuce(puce: Puce) {
    this.selectedPuce = { ...puce };
    this.showModal = true;
  }

  supprimerPuce(id: number) {
    if (confirm('Voulez-vous vraiment supprimer cette puce ?')) {
      this.puceService.supprimerPuce(id).subscribe(() => this.loadAll());
    }
  }

  onSavePuce(puce: Puce) {
    const request = puce.id
      ? this.puceService.updatePuce(puce.id, puce)
      : this.puceService.createPuce(puce);

    request.subscribe(() => {
      this.loadAll();
      this.closeModal();
    });
  }

  closeModal() {
    this.selectedPuce = null;
    this.showModal = false;
  }


  searchText: string = '';
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
