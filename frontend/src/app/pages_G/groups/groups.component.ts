import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { GroupService, Group } from '../../services/group.service';
import { AddGroupsDialogComponent } from '../add-groups-dialog/add-groups-dialog.component';
import { EditGroupDialogComponent } from '../edit-groups-dialog/edit-groups-dialog.component';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { ContactService } from '../../services/contact.service';
import { AddContactDialogComponent } from '../../pages/contact-list-dialog/contact-list-dialog.component';
import { RemoveContactDialogComponent } from '../../pages/rm-contact-list-dialog/rm-contact-list-dialog.component';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-groups',
  standalone: true,
  imports: [CommonModule, MatButtonModule, MatIconModule, FormsModule],
  templateUrl: './groups.component.html',
  styleUrls: ['./groups.component.scss'],
})
export class GroupsComponent implements OnInit {
  groups: Group[] = [];
  selectedGroupContacts: any[] = [];
  selectedGroupId: number | null = null;
  loading = false;
  searchQuery: string = '';


  constructor(
    private groupService: GroupService,
    private contactService: ContactService,
    public dialog: MatDialog
  ) {}

  ngOnInit() {
    this.fetchGroups();
  }

  fetchGroups() {
    this.loading = true;
    this.groupService.getGroups().subscribe(
      (response) => {
        this.groups = response.data || [];
        this.loading = false;
      },
      (error) => {
        console.error('Error fetching groups:', error);
        this.loading = false;
      }
    );
  }

    filteredGroups(): Group[] {
    if (!this.searchQuery) return this.groups;
    const query = this.searchQuery.toLowerCase();
    return this.groups.filter(group =>
      group.nom.toLowerCase().includes(query)
    );
  }

  selectGroup(group: Group) {
    if (group.id !== undefined) {
      this.selectedGroupId = group.id;
      this.viewGroupContacts(group.id);
    }
  }

  getSelectedGroupName(): string {
    const selectedGroup = this.groups.find(group => group.id === this.selectedGroupId);
    return selectedGroup ? selectedGroup.nom : '';
  }

  openAddGroupModal() {
    const dialogRef = this.dialog.open(AddGroupsDialogComponent, {
      width: '400px',
    });

    dialogRef.afterClosed().subscribe((newGroup: Group | undefined) => {
      if (newGroup) {
        this.fetchGroups();
      }
    });
  }

  openEditGroupModal(group: Group) {
    const dialogRef = this.dialog.open(EditGroupDialogComponent, {
      width: '400px',
      data: { groupe: group },
    });
  
    dialogRef.afterClosed().subscribe((updatedGroup: Group | undefined) => {
      if (updatedGroup) {
        this.fetchGroups();
      }
    });
  }
  
  deleteGroup(id?: number) {
    if (id === undefined) {
      return;
    }

    if (confirm('Are you sure you want to delete this group?')) {
      this.groupService.deleteGroup(id).subscribe(
        () => {
          this.groups = this.groups.filter((group) => group.id !== id);
          if (this.selectedGroupId === id) {
            this.selectedGroupId = null;
            this.selectedGroupContacts = [];
          }
        },
        (error) => {
          console.error('Error deleting group:', error);
        }
      );
    }
  }

  openAddContactDialog(groupId: number) {
    this.contactService.getContacts().subscribe(
      (response) => {
        const allContacts = response.data;
        const contacts = allContacts.map((contact: any) => ({
          ...contact,
          selected: this.selectedGroupContacts.some((c) => c.id === contact.id),
        }));

        const dialogRef = this.dialog.open(AddContactDialogComponent, {
          width: '400px',
          data: { contacts, groupId },
        });

        dialogRef.afterClosed().subscribe((selectedContactIds: number[] | undefined) => {
          if (selectedContactIds && selectedContactIds.length > 0) {
            this.associateContactsToGroup(selectedContactIds, groupId);
          }
        });
      },
      (error) => {
        console.error('Error fetching contacts:', error);
      }
    );
  }

  openRemoveContactDialog(groupId: number) {
    const contacts = this.selectedGroupContacts.map((contact: any) => ({
      ...contact,
      selected: false,
    }));

    const dialogRef = this.dialog.open(RemoveContactDialogComponent, {
      width: '400px',
      data: { contacts, groupId },
    });

    dialogRef.afterClosed().subscribe((selectedContactIds: number[] | undefined) => {
      if (selectedContactIds && selectedContactIds.length > 0) {
        this.disassociateContactsFromGroup(selectedContactIds, groupId);
      }
    });
  }

  associateContactsToGroup(contactIds: number[], groupId: number) {
    this.contactService.associateContactsToGroup(contactIds, groupId).subscribe(
      () => {
        this.fetchGroupContacts(groupId);
      },
      (error) => {
        console.error('Erreur lors de l\'association des contacts au groupe :', error);
      }
    );
  }
  
  disassociateContactsFromGroup(contactIds: number[], groupId: number) {
    this.contactService.disassociateContactsFromGroup(contactIds, groupId).subscribe(
      () => {
        this.fetchGroupContacts(groupId);
      },
      (error) => {
        console.error('Erreur lors de la désassociation des contacts du groupe :', error);
      }
    );
  }
  
  fetchGroupContacts(groupId: number) {
    this.loading = true;
    this.contactService.getContactsByGroup(groupId).subscribe(
      (response) => {
        this.selectedGroupContacts = response.data;
        this.loading = false;
      },
      (error) => {
        console.error('Error fetching group contacts:', error);
        this.loading = false;
      }
    );
  }

  viewGroupContacts(groupId: number) {
    this.fetchGroupContacts(groupId);
  }
}