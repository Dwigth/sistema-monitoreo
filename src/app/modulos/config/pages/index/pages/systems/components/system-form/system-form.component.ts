import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ConfigService } from 'src/app/modulos/config/config-service.service';

@Component({
  selector: 'app-system-form',
  templateUrl: './system-form.component.html',
  styleUrls: ['./system-form.component.scss']
})
export class SystemFormComponent implements OnInit {
  Error:false;
  ErrorMSG = '';
  SystemForm = new FormGroup({
    systemName: new FormControl('',Validators.compose([Validators.maxLength(50),Validators.minLength(2), Validators.required]))
  });

  constructor(private configS:ConfigService) { }

  ngOnInit(): void {
  }

  OnSubmit() {
    if(this.SystemForm.get('systemName').valid) {
      this.configS.AddSystem(this.SystemForm.get('systemName').value)
      .subscribe(data => {
          this.Error = data.error;
          this.ErrorMSG = data.msg;
      })
    }
  }

}
