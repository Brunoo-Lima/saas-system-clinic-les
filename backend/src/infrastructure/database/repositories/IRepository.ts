import { EntityDomain } from "../../../domain/entities/EntityDomain";

export interface IRepository {
  create(entity: EntityDomain | Array<EntityDomain>, tx?: any, id?: any): Promise<any>;
  findEntity(entity: EntityDomain | Array<EntityDomain>, tx?: any): Promise<any>;
  updateEntity(entity: EntityDomain | Array<EntityDomain>, tx?: any): Promise<any>;
  deleteEntity(entity: EntityDomain | Array<EntityDomain>, tx?: any, id?: any): Promise<any>;
  findAllEntity(entity?: EntityDomain | Array<EntityDomain>, limit?: number, offset?: number): Promise<any>;
}
