import { randomUUID, UUID } from "crypto";

export class EntityDomain {
    constructor(
        private uuidHash: UUID = randomUUID(),
        private createdAt: Date = new Date(),
        private updatedAt: Date = new Date()
    ){}


	public getUUIDHash(): UUID  {
		return this.uuidHash;
	}


	public getCreatedAt(): Date  {
		return this.createdAt;
	}


	public getUpdatedAt(): Date  {
		return this.updatedAt;
	}


	public setUuidHash(value: UUID ) {
		this.uuidHash = value;
	}


	public setCreatedAt(value: Date ) {
		this.createdAt = value;
	}

	public setUpdatedAt(value: Date ) {
		this.updatedAt = value;
	}
}