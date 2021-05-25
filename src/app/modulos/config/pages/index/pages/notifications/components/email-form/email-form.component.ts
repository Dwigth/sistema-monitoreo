import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Subscription } from 'rxjs';
import { ConfigService } from 'src/app/modulos/config/config-service.service';

@Component({
  selector: 'app-email-form',
  templateUrl: './email-form.component.html',
  styleUrls: ['./email-form.component.scss']
})
export class EmailFormComponent implements OnInit {

  sub:Subscription;

  EmailNotificationsForm = new FormGroup({
    emailAccount: new FormControl('',Validators.compose([Validators.maxLength(50),Validators.minLength(2), Validators.required])),
    enableNotifications: new FormControl(false,Validators.compose([Validators.maxLength(50),Validators.minLength(2), Validators.required])),
    host: new FormControl('',Validators.compose([Validators.maxLength(50),Validators.minLength(2), Validators.required])),
    maxConnections: new FormControl(0,Validators.compose([Validators.maxLength(50),Validators.minLength(2), Validators.required])),
    passwordAccount: new FormControl('',Validators.compose([Validators.maxLength(50),Validators.minLength(2), Validators.required])),
    port: new FormControl(0,Validators.compose([Validators.maxLength(50),Validators.minLength(2), Validators.required])),
    savePasswordOnDB: new FormControl(false,Validators.compose([Validators.maxLength(50),Validators.minLength(2), Validators.required]))
  });

  constructor(private configS:ConfigService) { 
    this.sub = configS.GetNotificationData().subscribe(config => {
      const data = config.data;
      this.EmailNotificationsForm.setValue({
        emailAccount:data.emailAccount,
        enableNotifications:data.enableNotifications,
        host:data.host,
        maxConnections:data.maxConnections,
        passwordAccount:data.passwordAccount,
        port:data.port,
        savePasswordOnDB:false,
      })
    });
  }

  onSubmit() {
    this.sub = this.configS.EditNotificationData(this.EmailNotificationsForm.value)
    .subscribe(r => {
      console.log(r);
      
    })
  }

  ngOnInit(): void {
  }

  ngOnDestroy() {
    this.sub.unsubscribe();
  }

}
