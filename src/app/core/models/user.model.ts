import { Role } from "./enums/role";
import { EntityStatus } from "./enums/status";

export class User {
  id: string;
  registration: string;
  name: string;
  password: string;
  email: string;
  roles: Role[];
  isActivated: EntityStatus;
}