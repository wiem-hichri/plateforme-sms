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
import { PuceComponent } from './puces/puce/puce.component';
import { SendMessageComponent } from './sendSMS/send-message/send-message.component';
import { ChooseSmsMethodComponent } from './sendSMS/choose-sms-method/choose-sms-method.component';
import { MgcComponent } from './sendSMS/mgc-sms/mgc-sms.component';
import { SmsGeneratorComponent } from './sendSMS/sms-generator/sms-generator.component';
import { MissionManagementComponent } from './parametre/mission/mission.component';
import { SiteListComponent } from './parametre/Sites/site/site.component';
import { HistoriqueComponent } from './parametre/historique/historique.component';
import { DeviceListComponent } from './Devices/device-list/device-list.component';
import { WelcomeComponent } from './Welcome/welcome/welcome.component';

import { ResetPasswordComponent } from './Login/reset-password/reset-password.component';
export const appRoutes: Routes = [
  {path:'welcome',component:WelcomeComponent},
  { path: 'login', component: LoginComponent },
  { path: '', redirectTo: '/login', pathMatch: 'full' },
  { path: 'dashboard', component: DashboardComponent },
  { path: 'contacts', component: ContactsComponent },
  { path: 'groups', component: GroupsComponent },
  { path: 'device', component: DeviceListComponent },
  { path: 'site', component: SiteListComponent },
  { path: 'user', component: UsersComponent },
  { path: 'profile', component: ProfileComponent },
  { path: 'send-message', component: SendMessageComponent },
  { path: 'send', component: ChooseSmsMethodComponent },
  { path: 'login-history', component: LoginHistoryComponent },
  { path: 'historique', component: HistoriqueComponent },
  { path: 'reset-password', component: ResetPasswordComponent },
  {path: 'parametre', component: ParametreBoardComponent },
  {path : 'sms-models', component: SmsModelsComponent },
  {path : 'mgc-sms', component: MgcComponent },
  {path : 'generate', component: SmsGeneratorComponent },
  {path : 'mission', component: MissionManagementComponent},
  {path : 'puce', component: PuceComponent },
  { path: '**', component: NotFoundComponent }
];
