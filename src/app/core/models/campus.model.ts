import { Address, AddressCreate } from "./address.model";
import { InternshipSector } from "./internship-sector.model";

export class Campus {
  id: string;
  name: string;
  abbreviation: string;
  address: Address;
  internshipSector: InternshipSector;
}

export class CampusCreate {
  name: string;
  abbreviation: string;
  address: Address | AddressCreate;
  internshipSector: InternshipSector;

  constructor(name: string, abbreviation: string, address: Address | AddressCreate, internshipSector: InternshipSector){
    this.name = name;
    this.abbreviation = abbreviation;
    this.address = address;
    this.internshipSector = internshipSector;
  }
}
