import { Campus } from "./campus.model";

export class Department {
  id: string;
  name: string;
  abbreviation: string;
  status: string;
  campus: Campus;
}