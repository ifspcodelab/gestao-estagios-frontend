import { Role } from "../models/enums/role";

export interface TokenData {
  sub: string;
  roles: Role[];
  exp: number;
  id: string;
}