import { Violation } from "./violation.interface";

export interface ProblemDetail {
  title: string;
  violations: Violation[];
}
