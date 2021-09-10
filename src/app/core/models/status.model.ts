import { EntityStatus } from "./enums/status";

export class EntityUpdateStatus {
    status: EntityStatus;

    constructor(status: EntityStatus){
        this.status = status;
    }
}
