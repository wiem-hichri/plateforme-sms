import { Routes } from '@angular/router';
import { ContactsComponent } from './pages/contacts/contacts.component';
import { GroupsComponent } from './pages_G/groups/groups.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { LoginComponent } from './Login/login/login.component';
import { UsersComponent } from './Users/user/user.component';
import { ProfileComponent } from './Login/profile/profile.component';
import { AuthGuard } from './auth.guard';

export const appRoutes: Routes = [
  { path: 'login', component: LoginComponent },
  { path: '', redirectTo: '/login', pathMatch: 'full' },  // Redirect to login by default
  { path: 'dashboard', component: DashboardComponent },
  { path: 'contacts', component: ContactsComponent},
  { path: 'groups', component: GroupsComponent},
  { path: 'user', component: UsersComponent },
  { path: 'profile', component: ProfileComponent}
];
