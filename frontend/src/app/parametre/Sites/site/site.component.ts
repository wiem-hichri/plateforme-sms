import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatDialog } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTableModule } from '@angular/material/table';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatSnackBar } from '@angular/material/snack-bar';

import { SiteService, Site } from '../../../services/site.service';
import { AddSiteDialogComponent } from '../add-site-dialog/add-site-dialog.component';
import { EditSiteDialogComponent } from '../edit-site-dialog/edit-site-dialog.component';

@Component({
  selector: 'app-site-list',
  standalone: true,
  imports: [
    CommonModule,
    MatButtonModule,
    MatIconModule,
    MatTableModule,
    MatTooltipModule
  ],
  templateUrl: './site.component.html',
  styleUrls: ['./site.component.scss']
})
export class SiteListComponent implements OnInit {
  sites: Site[] = [];
  displayedColumns: string[] = ['site_id', 'site_name', 'actions'];

  constructor(
    private siteService: SiteService,
    private dialog: MatDialog,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.loadSites();
  }

  loadSites(): void {
    this.siteService.getSites().subscribe({
      next: (response) => {
        this.sites = response.data || [];
      },
      error: (error) => {
        console.error('Erreur lors du chargement des sites:', error);
        this.showSnackBar('Erreur lors du chargement des sites');
      }
    });
  }

  openAddDialog(): void {
    const dialogRef = this.dialog.open(AddSiteDialogComponent, {
      width: '400px'
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.loadSites();
        this.showSnackBar('Site ajouté avec succès');
      }
    });
  }

  openEditDialog(site: Site): void {
    const dialogRef = this.dialog.open(EditSiteDialogComponent, {
      width: '400px',
      data: { ...site }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.loadSites();
        this.showSnackBar('Site mis à jour avec succès');
      }
    });
  }

  deleteSite(id: number): void {
    if (confirm('Êtes-vous sûr de vouloir supprimer ce site?')) {
      this.siteService.deleteSite(id).subscribe({
        next: () => {
          this.loadSites();
          this.showSnackBar('Site supprimé avec succès');
        },
        error: (error) => {
          console.error('Erreur lors de la suppression du site:', error);
          this.showSnackBar('Erreur lors de la suppression du site');
        }
      });
    }
  }

  private showSnackBar(message: string): void {
    this.snackBar.open(message, 'Fermer', {
      duration: 3000,
      horizontalPosition: 'center',
      verticalPosition: 'bottom'
    });
  }
}