import { Component, OnInit } from '@angular/core';
import { CampusService } from "../../../core/services/campus.service";
import { FormBuilder, FormGroup, Validators, FormControl, AbstractControl, ValidatorFn } from "@angular/forms";
import { ActivatedRoute, Router } from "@angular/router";
import { finalize, first, map, startWith } from "rxjs/operators";

import { CanBeSave } from "../../../core/interfaces/can-be-save.interface";
import { HttpErrorResponse } from "@angular/common/http";
import { NotificationService } from "../../../core/services/notification.service";
import { Campus, CampusCreate } from "../../../core/models/campus.model";
import { LoaderService } from "../../../core/services/loader.service";
import { AppValidators } from "../../../core/validators/app-validators";

import { State } from 'src/app/core/models/state.model';
import { StateService } from 'src/app/core/services/state.service';
import { Observable } from 'rxjs';

import { CityService } from 'src/app/core/services/city.service';
import { City } from 'src/app/core/models/city.model';
import { of } from 'rxjs';
import { Address, AddressCreate } from 'src/app/core/models/address.model';

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

  states: State[];
  stateFilteredOptions$: Observable<State[]>;

  cities: City[];
  cityFilteredOptions$: Observable<City[]>;
  citySelected?: City;

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

  ngOnInit(): void {
    this.id = this.route.snapshot.paramMap.get('id');

    this.form = this.buildForm();
    this.fetchStates();

    if(this.id) {
      this.createMode = false;
      this.loading = true;
      this.loaderService.show();
      this.getCampus(this.id);

    } else {
      this.createMode = true;
      this.loading = false;
    }
  }

  fetchStates(){
    this.stateService.getStates().subscribe(states => {
        this.states = states;
        this.field('address.state').setValidators(AppValidators.autocomplete(this.states.map(s => s.name)))
        this.stateFilteredOptions$ = this.field('address.state').valueChanges.pipe(
          startWith(''),
          map(value => this._filterState(value))
        );
    });
  }

  onStateSelected(stateSelected: string){
    this.cities = [];

    this.field('address.city').enable();
    this.field('address.city').setValue('');

    const state = this.states.find(s => s.name == stateSelected);

    if (state) {
      this.cityService.getCities(state.abbreviation)
        .subscribe(cities => {
          this.cities = cities;
          this.refreshCitiesValidator();
          this.cityFilteredOptions$ = this.field('address.city').valueChanges.pipe(
            startWith(''),
            map(value => this._filterCity(value))
          );
        });
    }
  }

  private refreshCitiesValidator() {
    this.field('address.city').setValidators(AppValidators.autocomplete(this.cities.map(c => c.name)));
  }

  private _filterState(value: string): State[] {
    const filteredValue = value.toLowerCase();
    return this.states.filter(state => state.name.toLowerCase().includes(filteredValue));
  }

  private _filterCity(value: string): City[] {
    const filterValues = value.toLowerCase();

    return this.cities.filter(city => city.name.toLowerCase().includes(filterValues));
  }

  getCampus(id: String) {
    this.campusService.getCampusById(id)
      .pipe(
        first()
      )
    .subscribe(
      (campus: Campus) => {
        this.campus = campus;
        this.form.patchValue(campus);
        this.citySelected = this.campus.address.city;
        this.cityService.getCities(this.campus.address.city.state.abbreviation)
          .pipe(
            finalize(() => {
              this.loaderService.hide();
              this.loading = false;
            })
          )
          .subscribe(cities => {
            this.cities = cities;
            this.cityFilteredOptions$ = of(this.cities);
            this.cityFilteredOptions$ = this.field('address.city').valueChanges.pipe(
              startWith(''),
              map(value => this._filterCity(value))
            );
            this.field('address.state').patchValue(this.campus.address.city.state.name);
            this.field('address.city').patchValue(this.campus.address.city.name);
            this.refreshCitiesValidator();
            this.field('address.city').enable();
          })
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
    return this.form.get(path)!;
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
      initialRegistrationPattern: ['',
        [Validators.required, AppValidators.notBlank, AppValidators.exactLength(2), AppValidators.startWithTwoAlphas]
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
    const addressCreate = new AddressCreate(
      this.field('address.postalCode')?.value,
      this.field('address.street')?.value,
      this.field('address.neighborhood')?.value,
      this.cities.find(c => c.name == this.field('address.city')?.value)?.id!,
      this.field('address.number')?.value,
      (this.field('address.complement')?.value == '' ? null : this.field('address.complement')?.value)
    );
    const campusCreate = new CampusCreate(
      this.field('name')?.value,
      this.field('abbreviation')?.value,
      this.field('initialRegistrationPattern')?.value,
      addressCreate,
      this.field('internshipSector')?.value
    );
    this.campusService.postCampus(campusCreate)
      .pipe(first())
      .subscribe(
        (campus: Campus) => {
          this.form.reset({}, {emitEvent: false});
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
    const addressCreate = new AddressCreate(
      this.field('address.postalCode')?.value,
      this.field('address.street')?.value,
      this.field('address.neighborhood')?.value,
      this.cities.find(c => c.name == this.field('address.city')?.value)?.id!,
      this.field('address.number')?.value,
      (this.field('address.complement')?.value == '' ? null : this.field('address.complement')?.value)
    );
    const campusCreate = new CampusCreate(
      this.field('name')?.value,
      this.field('abbreviation')?.value,
      this.field('initialRegistrationPattern')?.value,
      addressCreate,
      this.field('internshipSector')?.value
    );
    //this.campusService.updateCampus(this.id!, this.form.value)
    this.campusService.updateCampus(this.id!, campusCreate)
      .pipe(first())
      .subscribe(
        (campus: Campus) => {
          this.form.reset({}, {emitEvent: false});
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
        const abbreviationControl = this.field("abbreviation");
        const initialRegistrationPatternControl = this.field("initialRegistrationPattern");
        const emailControl = this.field("internshipSector.email");
        if (error.error.title.includes("Abbreviation")) {
          abbreviationControl?.setErrors({
            serverError: `Campus já existente com sigla ${abbreviationControl.value}`
          });
        }
        if (error.error.title.includes("Initial Registration Pattern")) {
          initialRegistrationPatternControl?.setErrors({
            serverError: `Campus já existente com registro inicial ${initialRegistrationPatternControl.value}`
          });
        }
        if (error.error.title.includes("Email")) {
            emailControl?.setErrors({
            serverError: `Campus já existente com e-mail ${emailControl.value}`
          });
        }
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
