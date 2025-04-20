import { Component, Input, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { SmsModelService } from '../../services/model.service';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-edit-model',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './edit-modal.component.html',
  styleUrls: ['./edit-modal.component.scss']
})
export class EditModelComponent implements OnInit {
  modelId!: number;
  model = { nom: '', contenu: '' };

  constructor(
    private smsModelService: SmsModelService,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.modelId = Number(this.route.snapshot.paramMap.get('id'));
    this.smsModelService.getById(this.modelId).subscribe({
      next: (res) => this.model = res,
      error: (err) => console.error('❌ Erreur chargement:', err)
    });
  }

  updateModel() {
    if (this.model.nom && this.model.contenu) {
      this.smsModelService.update(this.modelId, this.model).subscribe({
        next: (res) => console.log('✅ Modèle mis à jour', res),
        error: (err) => console.error('❌ Erreur update:', err)
      });
    }
  }
}
