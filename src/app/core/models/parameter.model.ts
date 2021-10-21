export class Parameter {
  id: string;
  internshipRequiredOrNotMessage: string;
  projectEquivalenceMessage: string;
  professionalValidationMessage: string;
  advisorRequestDeadline: number;
}

export class ParameterCreate {
  internshipRequiredOrNotMessage: string;
  projectEquivalenceMessage: string;
  professionalValidationMessage: string;
  advisorRequestDeadline: number;

  constructor(internshipRequiredOrNotMessage: string, projectEquivalenceMessage: string, professionalValidationMessage: string, advisorRequestDeadline: number) {
    this.internshipRequiredOrNotMessage = internshipRequiredOrNotMessage;
    this.projectEquivalenceMessage = projectEquivalenceMessage;
    this.professionalValidationMessage = professionalValidationMessage;
    this.advisorRequestDeadline = advisorRequestDeadline;
  }

}

