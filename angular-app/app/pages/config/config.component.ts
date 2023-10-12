import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { IMonitoredApplication } from 'src/app/interfaces/core';

type MonitoredSystemFormArray = 'websites' | 'webservices' | 'databases';

@Component({
  selector: 'app-config',
  templateUrl: './config.component.html',
  styleUrls: ['./config.component.scss']
})
export class ConfigComponent implements OnInit {
  MonitoredSystemForm: FormGroup;
  LocalMonitoredSystems: IMonitoredApplication[];

  constructor(private fb: FormBuilder) {
    this.LocalMonitoredSystems = Array.from(JSON.parse(localStorage.getItem('systems')));
    console.log(this.LocalMonitoredSystems[0].websites);

    this.MonitoredSystemForm = this.fb.group({
      systemName: '',
      websites: this.fb.array([]),
      webservices: this.fb.array([]),
      databases: this.fb.array([]),
    })
  }

  getFormArrays(arrName: MonitoredSystemFormArray): FormArray {
    return this.MonitoredSystemForm.get(arrName) as FormArray;
  }

  ngOnInit(): void { }

}
