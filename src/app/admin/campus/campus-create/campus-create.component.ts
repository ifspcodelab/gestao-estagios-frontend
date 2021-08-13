import { Component, OnInit } from '@angular/core';
import { CampusService } from "../../../shared/service/campus.service";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";

@Component({
  selector: 'app-campus-create',
  templateUrl: './campus-create.component.html',
  styleUrls: ['./campus-create.component.scss']
})
export class CampusCreateComponent implements OnInit {
  campusForm: FormGroup;

  constructor(
    private campusService: CampusService,
    private fb: FormBuilder
  ) { }

  ngOnInit(): void {
    this.campusForm = this.fb.group({
      name: ['', [Validators.required]],
      abbreviation: ['', [Validators.required]],
      address: this.fb.group({
        postalCode: ['', [Validators.required]],
        street: ['', [Validators.required]],
        neighborhood: ['', [Validators.required]],
        city: ['', [Validators.required]],
        state: ['', [Validators.required]],
        number: ['', [Validators.required]],
        complement: ['', [Validators.required]]
      }),
      internshipSector: this.fb.group({
        telephone: ['', [Validators.required]],
        email: ['', [Validators.required]],
        website: ['', [Validators.required]]
      })
    });
  }

  cancel() {
    console.log("cancel")
  }

  create() {
    console.log("create")
    console.log(this.campusForm.value);
    this.campusService.postCampus(this.campusForm.value).subscribe(
      result => console.log(result)
    )

  }
}
