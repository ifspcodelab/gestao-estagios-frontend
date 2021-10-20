import { Component, OnInit } from '@angular/core';
import {Parameter} from "@angular/compiler-cli/src/ngtsc/reflection";
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {AppValidators} from "../../../core/validators/app-validators";

@Component({
  selector: 'app-parameters-create',
  templateUrl: './parameters-create.component.html',
  styleUrls: ['./parameters-create.component.scss']
})
export class ParametersCreateComponent implements OnInit {
  form: FormGroup;
  submitted = false;

  constructor(
    private fb: FormBuilder,
  ) { }

  ngOnInit(): void {
    this.form = this.buildForm();
  }

  field(path: string) {
    return this.form.get(path)!;
  }

  fieldErrors(path: string) {
    return this.field(path)?.errors;
  }

  buildForm(): FormGroup {
    return this.fb.group({
      requiredOrNot: ['',
        [Validators.required, AppValidators.notBlank]
      ],
      projectEquivalence: ['',
        [Validators.required, AppValidators.notBlank]
      ],
      professionalEnjoyment: ['',
        [Validators.required, AppValidators.notBlank]
      ],
      advisorRequestDeadline: ['',
        [Validators.required, AppValidators.numeric, AppValidators.notBlank]
      ],
    });
  }

}
