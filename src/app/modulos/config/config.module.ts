import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MainComponent } from './pages/main/main.component';
import { ConfigRoutingModule } from './config-routing.module';
import { IndexComponent } from './pages/index/index.component';
import { SystemsComponent } from './pages/index/pages/systems/systems.component';
import { WebservicesComponent } from './pages/index/pages/webservices/webservices.component';
import { DatabasesComponent } from './pages/index/pages/databases/databases.component';
import { WebsitesComponent } from './pages/index/pages/websites/websites.component';
import { ErrorhistoryComponent } from './pages/index/pages/errorhistory/errorhistory.component';
import { NotificationsComponent } from './pages/index/pages/notifications/notifications.component';
import { SystemFormComponent } from './pages/index/pages/systems/components/system-form/system-form.component';
import { SystemTableComponent } from './pages/index/pages/systems/components/system-table/system-table.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { DbTableComponent } from './pages/index/pages/databases/components/db-table/db-table.component';
import { WTableComponent } from './pages/index/pages/websites/components/w-table/w-table.component';
import { WFormComponent } from './pages/index/pages/websites/components/w-form/w-form.component';
import { WsFormComponent } from './pages/index/pages/webservices/components/ws-form/ws-form.component';
import { WsTableComponent } from './pages/index/pages/webservices/components/ws-table/ws-table.component';
import { EmailFormComponent } from './pages/index/pages/notifications/components/email-form/email-form.component';
import { TimersFormComponent } from './pages/index/pages/notifications/components/timers-form/timers-form.component';
import { AssociatesFormComponent } from './pages/index/pages/notifications/components/associates-form/associates-form.component';
import { Pipes } from 'src/pipes';


@NgModule({
  declarations: [MainComponent, IndexComponent, SystemsComponent, WebservicesComponent, DatabasesComponent, WebsitesComponent, ErrorhistoryComponent, NotificationsComponent, SystemFormComponent, SystemTableComponent, DbTableComponent, WTableComponent, WFormComponent, WsFormComponent, WsTableComponent, EmailFormComponent, TimersFormComponent, AssociatesFormComponent,],
  imports: [
    CommonModule,
    ConfigRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    Pipes
  ]
})
export class ConfigModule { }
