export enum InternshipStatus {
  ACTIVITY_PLAN_PENDING = ("ACTIVITY_PLAN_PENDING"),
  ACTIVITY_PLAN_SENT = ("ACTIVITY_PLAN_SENT"),
  IN_PROGRESS = ("IN_PROGRESS"),
  REALIZATION_TERM_ACCEPTED = ("REALIZATION_TERM_ACCEPTED"),
  FINISHED = ("FINISHED")
}

export namespace InternshipStatus {
  export function toString(status: InternshipStatus): string {  
    const statusMap = new Map();
    statusMap.set(InternshipStatus.ACTIVITY_PLAN_PENDING, 'PLANO DE ATIVIDADES PENDENTE');
    statusMap.set(InternshipStatus.ACTIVITY_PLAN_SENT, 'PLANO DE ATIVIDADES ENVIADO');
    statusMap.set(InternshipStatus.IN_PROGRESS, 'EM ANDAMENTO');
    statusMap.set(InternshipStatus.REALIZATION_TERM_ACCEPTED, 'TERMO DE REALIZAÇÃO DEFERIDO');
    statusMap.set(InternshipStatus.FINISHED, 'FINALIZADO');

    return statusMap.get(status);
  }
}
