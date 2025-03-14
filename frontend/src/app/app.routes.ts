import { Routes } from '@angular/router';
import { ContactsComponent } from './pages/contacts/contacts.component';
import { GroupsComponent } from './pages_G/groups/groups.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { LoginComponent } from './Login/login/login.component';
import { UsersComponent } from './Users/user/user.component';
import { ProfileComponent } from './Login/profile/profile.component';
import { NotFoundComponent } from './pages/not-found/not-found.component'; // ✅ Import NotFoundComponent

export const appRoutes: Routes = [
  { path: 'login', component: LoginComponent },
  { path: '', redirectTo: '/login', pathMatch: 'full' },
  { path: 'dashboard', component: DashboardComponent },
  { path: 'contacts', component: ContactsComponent },
  { path: 'groups', component: GroupsComponent },
  { path: 'user', component: UsersComponent },
  { path: 'profile', component: ProfileComponent },

  // ✅ Catch all unknown routes and show 404 page
  { path: '**', component: NotFoundComponent }
];
