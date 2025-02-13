import { ApplicationConfig } from '@angular/core';
import { provideRouter, Routes } from '@angular/router';
import { DashboardComponent } from './dashboard/dashboard.component';
import { ContactsComponent } from './pages/contacts/contacts.component';

const routes: Routes = [
  { path: '', component: DashboardComponent }, // Default route (Dashboard)
  { path: 'contacts', component: ContactsComponent }, // Contacts Page
];

export const appConfig: ApplicationConfig = {
  providers: [provideRouter(routes)],
};
