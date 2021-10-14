import { Role } from "./enums/role";
import { EntityStatus } from "./enums/status";

export class User {
  id: string;
  registration: string;
  name: string;
  email: string;
  roles: Role[];
  isActivated: EntityStatus;
}

export class UserUpdate {
  name: string;

  constructor(name: string) {
    this.name = name;
  }
}
