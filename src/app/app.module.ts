import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { MainComponent } from './pages/main/main.component';
import { DetailsComponent } from './pages/details/details.component';
import { SocketIoModule, SocketIoConfig } from 'ngx-socket-io';
import { SystemInfoComponent } from './pages/main/system-info/system-info.component';
import { ConfigComponent } from './pages/config/config.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { environment } from 'src/environments/environment';

const config: SocketIoConfig = { url: environment.url, options: {} };

@NgModule({
  declarations: [
    AppComponent,
    MainComponent,
    DetailsComponent,
    SystemInfoComponent,
    ConfigComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    SocketIoModule.forRoot(config)
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
