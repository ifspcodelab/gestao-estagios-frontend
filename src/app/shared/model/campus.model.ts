import { Address } from "./address.model";
import { InternshipSector } from "./internship-sector.model";

export class Campus {
  id: string;
  name: string;
  abbreviation: string;
  address: Address;
  internshipSector: InternshipSector;
}
