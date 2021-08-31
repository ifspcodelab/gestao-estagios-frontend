import { Component, OnInit } from '@angular/core';
import { CampusService } from "../../../core/services/campus.service";
import { FormBuilder, FormGroup, Validators, FormControl, AbstractControl, ValidatorFn } from "@angular/forms";
import { ActivatedRoute, Router } from "@angular/router";
import { finalize, first, map, startWith } from "rxjs/operators";

import { CanBeSave } from "../../../core/interfaces/can-be-save.interface";
import { HttpErrorResponse } from "@angular/common/http";
import { NotificationService } from "../../../core/services/notification.service";
import { Campus } from "../../../core/models/campus.model";
import { LoaderService } from "../../../core/services/loader.service";
import { AppValidators } from "../../../core/validators/app-validators";

import { State } from 'src/app/core/models/state.model';
import { StateService } from 'src/app/core/services/state.service';
import { Observable } from 'rxjs';

import { CityService } from 'src/app/core/services/city.service';
import { City } from 'src/app/core/models/city.model';

function autocompleteStateValidator(validOptions: Array<string>): 
ValidatorFn {
  return (control: AbstractControl): { [key: string]: any } | null => {
    if (validOptions.indexOf(control.value) !== -1) {
      return null  /* valid option selected */
    }
    return { 'invalidAutocompleteString': { value: control.value } };
  }
}

function autocompleteCityValidator(validOptions: Array<string>): 
ValidatorFn {
  return (control: AbstractControl): { [key: string]: any } | null => {
    if (validOptions.indexOf(control.value) !== -1) {
      return null 
    }
    return { 'invalidAutocompleteString': { value: control.value } };
  }
}

@Component({
  selector: 'app-campus-create',
  templateUrl: './campus-create.component.html',
  styleUrls: ['./campus-create.component.scss']
})
export class CampusCreateComponent implements OnInit, CanBeSave {
  loading: boolean = true;
  form: FormGroup;
  submitted = false;
  createMode: boolean;
  id: string | null;
  campus: Campus;
  states$: Observable<State[]>;
  statesName$: string[] = [];
  filteredOptionsState: Observable<string[]> | undefined;
  cities$: Observable<City[]>;
  citiesName$: string[] = [];
  filteredOptionsCity: Observable<string[]> | undefined;

  constructor(
    private campusService: CampusService,
    private fb: FormBuilder,
    private router: Router,
    private route: ActivatedRoute,
    private notificationService: NotificationService,
    private loaderService: LoaderService,
    private stateService: StateService,
    private cityService: CityService
  ) { }

  public stateFormControl = new FormControl('', 
    { validators: [autocompleteStateValidator(this.statesName$), Validators.required] }
  )

  public cityFormControl = new FormControl('', 
    { validators: [autocompleteCityValidator(this.citiesName$), Validators.required] }
  )

  ngOnInit(): void {
    this.id = this.route.snapshot.paramMap.get('id');

    if(this.id) {
      this.createMode = false;
      this.loading = true;
      this.loaderService.show();
      this.getCampus(this.id);
    } else {
      this.createMode = true;
      this.loading = false;
    }

    this.form = this.buildForm();

    this.states$ = this.stateService.getStates()
    //this.states$.forEach(o => o.forEach(e => e.name))
    this.stateService.getStates()
      .subscribe(s => s.forEach(e => this.statesName$.push(e.name)));

    this.filteredOptionsState = this.stateFormControl.valueChanges.pipe(
      startWith(''),
      map(value => this._filterState(value))
    );

    this.filteredOptionsCity = this.cityFormControl.valueChanges.pipe(
      startWith(''),
      map(value => this._filterCity(value))
    );

    this.cityFormControl.disable()
  }

  stateSelected(stateSelected: string){
    this.citiesName$ = []

    this.cityFormControl.setValue('');

    this.states$.forEach(stateArray => stateArray.forEach(state => { 
        if(state.name === stateSelected){
          this.cityService.getCities(state.abbreviation)
            .subscribe(cityArray => cityArray.forEach(city => this.citiesName$.push(city.name)));
        }
    }));

    this.form.get('address.city')?.enable()
    this.cityFormControl.enable()
  }

  private _filterState(value: string): string[] {
    const filterValue = value.toLowerCase();

    return this.statesName$.filter(stateName => stateName.toLowerCase().includes(filterValue));
  }

  private _filterCity(value: string): string[] {
    const filterValue = value.toLowerCase();
    console.log(this.citiesName$)
    return this.citiesName$.filter(cityName => cityName.toLowerCase().includes(filterValue));
  }

  getCampus(id: String) {
    this.campusService.getCampusById(id)
      .pipe(
        first(),
        finalize(() => {
          this.loaderService.hide();
          this.loading = false;
        })
      )
    .subscribe(
      (campus: Campus) => {
        this.campus = campus;
        this.form.patchValue(campus)
      },
      error => {
        if(error.status === 404) {
          this.handleNotFoundError();
        }
      }
    )
  }

  handleNotFoundError() {
    this.notificationService.error(`Campus não encontrado com id ${this.id}`)
    this.navigateToList();
  }

  field(path: string) {
    return this.form.get(path);
  }

  fieldErrors(path: string) {
    return this.field(path)?.errors;
  }

  buildForm(): FormGroup {
    return this.fb.group({
      name: ['',
        [Validators.required, AppValidators.notBlank, AppValidators.alpha]
      ],
      abbreviation: ['',
        [Validators.required, AppValidators.notBlank, AppValidators.exactLength(3)]
      ],
      address: this.fb.group({
        postalCode: ['', [Validators.required, AppValidators.postalCode]],
        street: ['', [Validators.required, AppValidators.notBlank]],
        neighborhood: ['', [Validators.required, AppValidators.notBlank]],
        city: [{value: '', disabled: true}, [Validators.required]],
        state: ['', [Validators.required]],
        number: ['', [Validators.required, AppValidators.numeric]],
        complement: ['', []]
      }),
      internshipSector: this.fb.group({
        telephone: ['', [Validators.required, AppValidators.numeric]],
        email: ['', [Validators.required, Validators.email]],
        website: ['', [Validators.required, AppValidators.url]]
      })
    });
  }

  public onSubmit() {
    this.submitted = true;

    if(this.form.invalid) {
      return;
    }

    if(this.form.value.address.complement == '') {
      this.form.value.address.complement = null
    }

    if(this.createMode) {
      this.createCampus();
    } else {
      this.updateCampus();
    }
  }

  createCampus() {
    this.campusService.postCampus(this.form.value)
      .pipe(first())
      .subscribe(
        (campus: Campus) => {
          this.form.reset();
          this.id = campus.id;
          this.campus = campus;
          this.notificationService.success(`Campus ${this.campus.abbreviation} criado com sucesso!`);
          this.navigateToShow()
        },
        error => this.handleError(error)
      )
  }

  updateCampus() {
    if(!this.form.dirty) {
      this.navigateToShow();
      return;
    }
    this.campusService.updateCampus(this.id!, this.form.value)
      .pipe(first())
      .subscribe(
        (campus: Campus) => {
          this.form.reset();
          this.id = campus.id;
          this.campus = campus;
          this.notificationService.success(`Campus ${this.campus.abbreviation} editado com sucesso!`);
          this.navigateToShow();
        },
        error => this.handleError(error)
      )
  }

  handleError(error: any) {
    if (error instanceof HttpErrorResponse) {
      console.log(error);

      if(error.status === 400) {
        const violations: Array<{ name: string; reason: string }> = error.error.violations;
        violations.forEach(violation => {
          const formControl = this.form.get(violation.name);
          if (formControl) {
            formControl.setErrors({
              serverError: violation.reason
            });
          }
        })
      }

      if(error.status === 409) {
        const formControl = this.form.get("abbreviation")!;
        formControl?.setErrors({
          serverError: error.error.title
        });
      }
    }
  }

  navigateToList() {
    this.router.navigate(['admin/campus']);
  }

  navigateToShow() {
    this.router.navigate([`admin/campus/${this.id}`]);
  }

  isDataSaved(): boolean {
    return !this.form.dirty
  }

  getBackUrl(): string {
    return this.createMode ? '/admin/campus' : `/admin/campus/${this.campus.id}`;
  }
}
