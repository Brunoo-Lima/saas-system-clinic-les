import { EntityDomain } from "../../../domain/entities/EntityDomain";

export interface IRepository {
  create(entity: EntityDomain | Array<EntityDomain>, tx?: any, id?: any): Promise<any>;
  findEntity(entity: EntityDomain | Array<EntityDomain>, limit?: number): Promise<any>;
  updateEntity(entity: EntityDomain): Promise<any>;
  deleteEntity(entity: EntityDomain | Array<EntityDomain>, id?: string): Promise<void>;
  findAllEntity(entity?: EntityDomain | Array<EntityDomain>): Promise<any>;
}
