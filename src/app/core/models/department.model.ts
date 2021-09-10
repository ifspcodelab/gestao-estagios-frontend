import { Campus } from "./campus.model";
import { EntityStatus } from "./enums/status";

export class Department {
  id: string;
  name: string;
  abbreviation: string;
  status: EntityStatus;
  campus: Campus;
}