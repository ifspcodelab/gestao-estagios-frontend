import { City } from "./city.model";

export class Address {
  postalCode: string;
  street: string;
  neighborhood: string;
  city: City;
  number: string;
  complement: string | null;
}
