// puce.component.ts
import { Component, OnInit } from '@angular/core';
import { PuceService } from '../../services/puce.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { PuceModalComponent } from '../puce-modal/puce-modal.component';

@Component({
  selector: 'app-puce',
  standalone: true,
  imports: [CommonModule, FormsModule, PuceModalComponent],
  templateUrl: './puce.component.html',
  styleUrls: ['./puce.component.scss']
})
export class PuceComponent implements OnInit {
  puces: any[] = [];
  selectedPuce: any = null;
  showModal = false;

  constructor(private puceService: PuceService) {}

  ngOnInit() {
    this.loadPuces();
  }

  loadPuces() {
    this.puceService.getPuces().subscribe(
      (response: any) => {
        this.puces = response.data;
      },
      (error) => {
        console.error('Error loading puces', error);
      }
    );
  }

  modifierPuce(puce: any) {
    this.selectedPuce = { ...puce };
    this.showModal = true;
  }

  ajouterPuce() {
    this.selectedPuce = {};
    this.showModal = true;
  }

  supprimerPuce(id: number) {
    if (confirm('Voulez-vous vraiment supprimer cette puce ?')) {
      this.puceService.supprimerPuce(id).subscribe(
        () => {
          this.loadPuces();
        },
        (error) => {
          console.error('Error deleting puce', error);
        }
      );
    }
  }

  onSavePuce(puce: any) {
    if (puce.id) {
      this.puceService.updatePuce(puce.id, puce).subscribe(
        () => {
          this.loadPuces();
          this.closeModal();
        },
        (error) => {
          console.error('Error updating puce', error);
        }
      );
    } else {
      this.puceService.createPuce(puce).subscribe(
        () => {
          this.loadPuces();
          this.closeModal();
        },
        (error) => {
          console.error('Error creating puce', error);
        }
      );
    }
  }

  closeModal() {
    this.showModal = false;
    this.selectedPuce = null;
  }
}
