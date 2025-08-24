import { IResponseHandler } from "../../helpers/ResponseHandler";
import { EntityDomain } from "../entities/EntityDomain";

export interface IProcessValidator {
    valid(Entity: EntityDomain, args: any): IResponseHandler;
}