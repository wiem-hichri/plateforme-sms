import { Component, Inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatDialogModule, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

import { SiteService, Site } from '../../../services/site.service';

@Component({
  selector: 'app-edit-site-dialog',
  standalone: true,
  imports: [
    FormsModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    MatDialogModule
  ],
  templateUrl: './edit-site-dialog.component.html',
  styleUrls: ['./edit-site-dialog.component.scss'],
})
export class EditSiteDialogComponent {
  constructor(
    public dialogRef: MatDialogRef<EditSiteDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public site: Site,
    private siteService: SiteService
  ) {}

  closeDialog(): void {
    this.dialogRef.close();
  }

  updateSite(): void {
    if (this.site.site_name.trim() && this.site.site_id) {
      this.siteService.updateSite(this.site.site_id, this.site).subscribe({
        next: (response) => {
          console.log('Site updated successfully:', response);
          this.dialogRef.close(this.site);
        },
        error: (error) => {
          console.error('Error updating site:', error);
        }
      });
    }
  }
}