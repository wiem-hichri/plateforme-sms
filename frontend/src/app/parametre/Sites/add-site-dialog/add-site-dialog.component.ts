import { Component } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatDialogModule } from '@angular/material/dialog';

import { SiteService, Site } from '../../../services/site.service';

@Component({
  selector: 'app-add-site-dialog',
  standalone: true,
  imports: [
    FormsModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    MatDialogModule
  ],
  templateUrl: './add-site-dialog.component.html',
  styleUrls: ['./add-site-dialog.component.scss'],
})
export class AddSiteDialogComponent {
  newSite: Site = { site_name: '' };

  constructor(
    public dialogRef: MatDialogRef<AddSiteDialogComponent>,
    private siteService: SiteService
  ) {}

  closeDialog(): void {
    this.dialogRef.close();
  }

  addSite(): void {
    if (this.newSite.site_name.trim()) { // Ensure site_name is not empty
      this.siteService.createSite(this.newSite).subscribe({
        next: (response) => {
          console.log('Site added successfully:', response);
          this.dialogRef.close(response || this.newSite); // Return the created site
        },
        error: (error) => {
          console.error('Error adding site:', error);
        }
      });
    }
  }
}