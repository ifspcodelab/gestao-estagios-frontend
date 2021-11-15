import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { DateAdapter } from '@angular/material/core';
import { AppValidators } from "../../../core/validators/app-validators";

@Component({
  selector: 'app-internship-show',
  templateUrl: './internship-show.component.html',
  styleUrls: ['./internship-show.component.scss']
})
export class InternshipShowComponent implements OnInit {
  form: FormGroup;
  submitted = false;
  minDate: Date;
  maxDate: Date;
  fileName: string = "Nenhum arquivo anexado.";

  constructor(
    private fb: FormBuilder,
    private adapter: DateAdapter<any>,
  ) { }

  ngOnInit(): void {
    this.adapter.setLocale('pt-br');
    const currentDate = new Date();
    this.minDate = new Date(currentDate.setDate(currentDate.getDate() + 1));
    this.form = this.buildForm();
  }

  public onSubmit() {
    this.submitted = true;

    if (this.form.invalid) {
      return;
    }
  }

  field(path: string) {
    return this.form.get(path)!;
  }

  fieldErrors(path: string) {
    return this.field(path)?.errors;
  }

  buildForm(): FormGroup {
    return this.fb.group({
      companyName: ['',
        [Validators.required, AppValidators.notBlank]
      ],
      internshipStartDate: ['',
        [Validators.required]
      ],
      internshipEndDate: [{value: '', disabled: true },
        [Validators.required]
      ],
      file: ['',
        [Validators.required]
      ],
    });
  }

  getLimitDate() {
    this.form.get('internshipEndDate')!.setValue('');
    const selectedDate = new Date(this.form.get('internshipStartDate')!.value);
    this.maxDate = new Date(selectedDate.setDate(selectedDate.getDate() + 365));
    this.form.get('internshipEndDate')!.enable();
  }

  onFileSelected(event: any) {
    const file = event.target.files[0];
    if (file) {
      this.fileName = file.name;
    }
  }
}
