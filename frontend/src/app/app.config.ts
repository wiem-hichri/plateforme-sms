import { ApplicationConfig } from '@angular/core';
import { provideRouter, Routes } from '@angular/router';
import { DashboardComponent } from './dashboard/dashboard.component';
import { ContactsComponent } from './pages/contacts/contacts.component';
import { GroupsComponent } from './pages_G/groups/groups.component';
import { LoginComponent } from './Login/login/login.component';
import { UserComponent } from './Users/user/user.component';
const routes: Routes = [
  { path: '', component: DashboardComponent }, // Default route (Dashboard)
  { path: 'contacts', component: ContactsComponent }, // Contacts Page
  {path:'groups',component: GroupsComponent},
  { path: 'login', component: LoginComponent },
    { path: 'user', component: UserComponent }
  

];

export const appConfig: ApplicationConfig = {
  providers: [provideRouter(routes)],
};
