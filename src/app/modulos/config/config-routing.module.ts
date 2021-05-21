import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { IndexComponent } from './pages/index/index.component';
import { DatabasesComponent } from './pages/index/pages/databases/databases.component';
import { ErrorhistoryComponent } from './pages/index/pages/errorhistory/errorhistory.component';
import { NotificationsComponent } from './pages/index/pages/notifications/notifications.component';
import { SystemFormComponent } from './pages/index/pages/systems/components/system-form/system-form.component';
import { SystemTableComponent } from './pages/index/pages/systems/components/system-table/system-table.component';
import { SystemsComponent } from './pages/index/pages/systems/systems.component';
import { WebservicesComponent } from './pages/index/pages/webservices/webservices.component';
import { WebsitesComponent } from './pages/index/pages/websites/websites.component';
import { MainComponent } from './pages/main/main.component';


const routes: Routes = [
  {
    path: 'main',
    component: MainComponent
  },
  {
    path: 'index',
    component: IndexComponent,
    children:[
      {
        path:'systems',
        component:SystemsComponent,
        children:[
          {
            path:'add',
            component:SystemFormComponent
          },
          {
            path:'table',
            component:SystemTableComponent
          }
        ]
      },
      {
        path:'websites',
        component:WebsitesComponent
      },
      {
        path:'webservices',
        component:WebservicesComponent
      },
      {
        path:'databases',
        component:DatabasesComponent
      },
      {
        path:'error-history',
        component:ErrorhistoryComponent
      },
      {
        path:'notifications',
        component:NotificationsComponent
      },
      {
        path: '',
        redirectTo: '/config/index/systems',
        pathMatch: 'full'
      }
    ]
  },
  {
    path: '',
    redirectTo: '/config/main',
    pathMatch: 'full'
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ConfigRoutingModule { }
