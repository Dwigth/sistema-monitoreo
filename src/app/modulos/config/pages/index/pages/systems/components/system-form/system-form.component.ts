import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-system-form',
  templateUrl: './system-form.component.html',
  styleUrls: ['./system-form.component.scss']
})
export class SystemFormComponent implements OnInit {
  
  SystemForm = new FormGroup({
    systemName: new FormControl('',[Validators.maxLength(3),Validators.minLength(1), Validators.requiredTrue])
  });

  constructor() { }

  ngOnInit(): void {
  }

  OnSubmit() {
    console.log(this.SystemForm.errors)
    console.log(this.SystemForm.valid)
    console.log(this.SystemForm.value)
  }

}
