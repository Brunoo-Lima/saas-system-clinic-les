import { IResponseHandler } from "../../helpers/ResponseHandler";
import { EntityDomain } from "../entities/EntityDomain";

export interface IProcessValidator {
    valid(Entity: EntityDomain | Array<EntityDomain>, ...args: any[]): IResponseHandler | Promise<IResponseHandler>;
}