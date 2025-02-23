import { Routes } from '@angular/router';
import { ContactsComponent } from './pages/contacts/contacts.component';
import { GroupsComponent } from './pages_G/groups/groups.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { LoginComponent } from './Login/login/login.component';
import { UsersComponent } from './Users/user/user.component';

export const appRoutes: Routes = [
  { path: '', component: DashboardComponent }, // ✅ Default Route (Dashboard)
  { path: 'contacts', component: ContactsComponent },
  { path: 'groups', component: GroupsComponent },
  { path: 'login', component: LoginComponent },
  { path: 'user', component: UsersComponent }
];
