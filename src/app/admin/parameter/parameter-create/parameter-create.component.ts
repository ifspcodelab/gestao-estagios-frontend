import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { AppValidators } from "../../../core/validators/app-validators";
import { Parameter } from "../../../core/models/parameter.model";
import {ParameterService} from "../../../core/services/parameter.service";
import {first} from "rxjs/operators";

@Component({
  selector: 'app-parameter-create',
  templateUrl: './parameter-create.component.html',
  styleUrls: ['./parameter-create.component.scss']
})
export class ParameterCreateComponent implements OnInit {
  form: FormGroup;
  submitted = false;
  parameter: Parameter;

  constructor(
    private fb: FormBuilder,
    private parameterService: ParameterService,
  ) { }

  ngOnInit(): void {
    this.form = this.buildForm();
    this.parameterService.getParameters()
      .pipe(first())
      .subscribe(
        parameter => {
          this.parameter = parameter;
          this.form.patchValue(parameter);
        }
      )
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

  public onSubmit() {
    this.submitted = true;

    if (this.form.invalid) {
      return;
    }
  }
}
