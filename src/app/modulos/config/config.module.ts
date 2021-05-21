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



@NgModule({
  declarations: [MainComponent, IndexComponent, SystemsComponent, WebservicesComponent, DatabasesComponent, WebsitesComponent, ErrorhistoryComponent, NotificationsComponent, SystemFormComponent, SystemTableComponent],
  imports: [
    CommonModule,
    ConfigRoutingModule,
    FormsModule,
    ReactiveFormsModule,
  ]
})
export class ConfigModule { }
