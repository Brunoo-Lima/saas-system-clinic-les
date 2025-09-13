import { EntityDomain } from "../../../domain/entities/EntityDomain";
import { IRepository } from "./IRepository";

export const findOrCreate = async (
    repository: IRepository,
    entityDomain: EntityDomain,
    tx: any // conexão/transaction que vem do db.transaction
) => {
    const data = await repository.findEntity(entityDomain, tx);

    if (data && Array.isArray(data) && data.length > 0) return data;

    const dataInserted = await repository.create(entityDomain, tx);

    if (dataInserted && Array.isArray(dataInserted) && dataInserted.length) {
        entityDomain.setUuidHash(dataInserted[0].id);
        return dataInserted;
    }

    throw new Error("Cannot find or create the entity");
};
