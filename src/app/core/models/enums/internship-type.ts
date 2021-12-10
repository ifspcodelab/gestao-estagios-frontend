export enum InternshipType {
  REQUIRED_OR_NOT = ("REQUIRED_OR_NOT"),
  REQUIRED = ("REQUIRED"),
  NOT_REQUIRED =  ("NOT_REQUIRED"),
  PROFESSIONAL_VALIDATION = ("PROFESSIONAL_VALIDATION"),
  PROJECT_EQUIVALENCE = ("PROJECT_EQUIVALENCE")
}

export namespace InternshipType {
  export function toString(status: InternshipType): string {  
    const statusMap = new Map();
    statusMap.set(InternshipType.REQUIRED_OR_NOT, 'Estágio obrigatório ou não obrigatório');
    statusMap.set(InternshipType.REQUIRED, 'Estágio obrigatório');
    statusMap.set(InternshipType.NOT_REQUIRED, 'Estágio não obrigatório');
    statusMap.set(InternshipType.PROFESSIONAL_VALIDATION, 'Aproveitamento Profissional');
    statusMap.set(InternshipType.PROJECT_EQUIVALENCE, 'Equiparação de projeto institucional');

    return statusMap.get(status);
  }
}