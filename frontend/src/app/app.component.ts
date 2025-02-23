import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { SidebarComponent } from './sidebar/sidebar.component'; // Import SidebarComponent
import { DashboardComponent } from './dashboard/dashboard.component';// Import NavbarComponent
import { FooterComponent } from './footer/footer.component'; // Import FooterComponent
import { HeaderComponent } from './header/header.component';
import {ContactsComponent} from './pages/contacts/contacts.component'
import { GroupsComponent } from './pages_G/groups/groups.component';
import { UsersComponent } from './Users/user/user.component';
@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, SidebarComponent,DashboardComponent,FooterComponent,HeaderComponent,ContactsComponent,GroupsComponent,UsersComponent], // Add SidebarComponent here
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  title = 'lumidash';
}
