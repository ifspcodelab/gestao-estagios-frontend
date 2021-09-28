import { Role } from "./enums/role";

export class User {
  id: string;
  registration: string;
  name: string;
  password: string;
  email: string;
  roles: Role[]
}