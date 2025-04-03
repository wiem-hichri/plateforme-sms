import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-group-contacts-dialog',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './group-contacts-dialog.component.html',
  styleUrls: ['./group-contacts-dialog.component.scss']
})
export class GroupContactsDialogComponent {
  constructor(
    public dialogRef: MatDialogRef<GroupContactsDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { contacts: any[] }
  ) {}
}
