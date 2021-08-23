import { AbstractControl, ValidationErrors, ValidatorFn } from "@angular/forms";

export class AppValidators {
  static notBlank(control: AbstractControl): ValidationErrors | null {
    const isWhitespace = (control.value || '').trim().length === 0;
    const isValid = !isWhitespace;
    return isValid ? null : { 'notblank': true };
  }

  static exactLength(length: number): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      return  control.value.length != length ? { 'exactlength': true } : null;
    };
  }

  static alpha(control: AbstractControl): ValidationErrors | null {
    const pattern=/^[A-Za-z]*$/;
    return pattern.test(control.value) ? null : { 'alpha': true };
  }

  static numeric(control: AbstractControl): ValidationErrors | null {
    const pattern=/^\d+$/;
    return pattern.test(control.value) ? null : { 'numeric': true };
  }

  static postalCode(control: AbstractControl): ValidationErrors | null {
    const pattern=/^(([0-9]{2}\\.[0-9]{3}-[0-9]{3})|([0-9]{2}[0-9]{3}-[0-9]{3})|([0-9]{8}))$/;
    return pattern.test(control.value) ? null : { 'postalCode': true };
  }

  static url(control: AbstractControl): ValidationErrors | null {
    const validProtocols = ["http:", "https:"];
    try {
      const url = new URL(control.value);
      if(!validProtocols.includes(url.protocol)) {
        return { 'url': true };
      }
    } catch {
      return { 'url': true };
    }
    return null;
  }
}
