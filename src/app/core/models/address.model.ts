import { City } from "./city.model";

export class Address {
  postalCode: string;
  street: string;
  neighborhood: string;
  city: City;
  number: string;
  complement: string | null;
}

export class AddressCreate{
  postalCode: string;
  street: string;
  neighborhood: string;
  cityId: string;
  number: string;
  complement: string | null;

  constructor(postalCode: string, street: string, neighborhood: string, id: string, number: string, complement: string | null) {
    this.postalCode = postalCode;
    this.street = street;
    this.neighborhood = neighborhood;
    this.cityId = id;
    this.number = number;
    this.complement = complement;
  }
}
