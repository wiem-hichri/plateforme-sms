import { Routes } from '@angular/router';
import { ContactsComponent } from './pages/contacts/contacts.component';
import { GroupsComponent } from './pages_G/groups/groups.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { LoginComponent } from './Login/login/login.component';
import { UsersComponent } from './Users/user/user.component';
import { AuthGuard } from './auth.guard';


export const appRoutes: Routes = [
  { path: 'dashboard', component: DashboardComponent, canActivate: [AuthGuard] },
  { path: '', redirectTo: '/dashboard', pathMatch: 'full' },
  { path: 'contacts', component: ContactsComponent },
  { path: 'groups', component: GroupsComponent },
  { path: 'login', component: LoginComponent },
  { path: 'user', component: UsersComponent }
];
