import { Routes } from '@angular/router';
import { ContactsComponent } from './pages/contacts/contacts.component';
import { GroupsComponent } from './pages_G/groups/groups.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { LoginComponent } from './Login/login/login.component';
import { UsersComponent } from './Users/user/user.component';
import { ProfileComponent } from './Login/profile/profile.component';
import { NotFoundComponent } from './pages/not-found/not-found.component';
import {LoginHistoryComponent}from './parametre/login-history/login-history.component';
import {SmsModelsComponent} from './models/sms-models/sms-models.component';
import { ParametreBoardComponent } from './parametre/parametre-board/parametre-board.component';

export const appRoutes: Routes = [
  { path: 'login', component: LoginComponent },
  { path: '', redirectTo: '/login', pathMatch: 'full' },
  { path: 'dashboard', component: DashboardComponent },
  { path: 'contacts', component: ContactsComponent },
  { path: 'groups', component: GroupsComponent },
  { path: 'user', component: UsersComponent },
  { path: 'profile', component: ProfileComponent },
  { path: 'login-history', component: LoginHistoryComponent },
  {path: 'parametre', component: ParametreBoardComponent },
  {path : 'sms-models', component: SmsModelsComponent },
  { path: '**', component: NotFoundComponent }
];
